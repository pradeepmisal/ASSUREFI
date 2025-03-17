import os
import json
import time
import requests
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, TypedDict
from anthropic import Anthropic
from dotenv import load_dotenv
from flask import Flask, request, jsonify
# Import your get_token_data function from your module if needed
# from agent import get_token_data
from flask_cors import CORS 
app = Flask(__name__)
CORS(app)
load_dotenv()

# Initialize Anthropic client
anthropic = Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

# ---------- Data Structures ----------
class TokenData(TypedDict):
    chain_id: str
    dex_id: str
    url: str
    pair_address: str
    labels: List[str]
    base_token: Dict[str, str]
    quote_token: Dict[str, str]
    price_native: str
    price_usd: str
    txns: Dict[str, Dict[str, int]]
    volume: Dict[str, float]
    price_change: Dict[str, float]
    liquidity: Dict[str, float]
    fdv: float
    market_cap: float
    pair_created_at: int
    info: Optional[Dict]
    boosts: Optional[Dict]

class RiskAnalysis(TypedDict):
    risk_score: int
    vulnerabilities: List[str]
    recommendations: List[str]

class MarketSentiment(TypedDict):
    score: float
    breakdown: Dict[str, float]
    trends: List[str]

class AnalyticsReport(TypedDict):
    token_name: str
    token_symbol: str
    timestamp: float
    metrics: Dict
    risk: RiskAnalysis
    ai_insights: List[str]

# ---------- Configuration ----------
THRESHOLDS = {
    "liquidity_min": 100000,
    "volatility_threshold": 20,
    "abnormal_tx_ratio": 10,
    "impermanent_loss_risk": 30,
    "quick_dump_risk": 15,
    "new_token_risk_days": 7,
    "healthy_buy_sell_ratio": 1.2,
    "pump_warning_threshold": 50
}

ALERT_CONFIG = {
    "price_change_threshold": 10,
    "volume_change_threshold": 50,
    "liquidity_change_threshold": 20,
    "sentiment_change_threshold": 0.3
}

# ---------- Data Stores ----------
data_cache: Dict[str, TokenData] = {}
price_history: Dict[str, List[Dict]] = {}
weekly_data_store: Dict[str, Dict] = {}
sentiment_history: Dict[str, List[MarketSentiment]] = {}

# ---------- Core Functions ----------
def save_weekly_data(token_key: str, data: Dict) -> None:
    try:
        data_dir = Path("data")
        data_dir.mkdir(exist_ok=True)
        filename = data_dir / f"{token_key.replace('/', '_')}.json"
        with open(filename, "w") as f:
            json.dump(data, f, indent=2)
        print(f"Saved weekly data for {token_key}")
    except Exception as e:
        print(f"Error saving weekly data: {e}")

def load_weekly_data(token_key: str) -> Optional[Dict]:
    try:
        filename = Path("data") / f"{token_key.replace('/', '_')}.json"
        with open(filename, "r") as f:
            return json.load(f)
    except Exception:
        return None

def detect_alerts(current: TokenData, previous: TokenData) -> List[str]:
    alerts = []
    
    # Price alert
    current_price = float(current["price_usd"])
    previous_price = float(previous["price_usd"])
    if previous_price > 0:
        price_change = abs((current_price - previous_price) / previous_price * 100)
        if price_change > ALERT_CONFIG["price_change_threshold"]:
            direction = "increased" if current_price > previous_price else "decreased"
            alerts.append(f"PRICE ALERT: {current['base_token']['symbol']} {direction} by {price_change:.2f}%")
    
    # Volume alert
    current_vol = current["volume"]["h1"]
    previous_vol = previous["volume"]["h1"]
    if previous_vol > 0:
        vol_change = abs((current_vol - previous_vol) / previous_vol * 100)
        if vol_change > ALERT_CONFIG["volume_change_threshold"]:
            direction = "increased" if current_vol > previous_vol else "decreased"
            alerts.append(f"VOLUME ALERT: Volume {direction} by {vol_change:.2f}%")
    
    # Liquidity alert
    current_liq = current["liquidity"]["usd"]
    previous_liq = previous["liquidity"]["usd"]
    if previous_liq > 0:
        liq_change = abs((current_liq - previous_liq) / previous_liq * 100)
        if liq_change > ALERT_CONFIG["liquidity_change_threshold"]:
            direction = "increased" if current_liq > previous_liq else "decreased"
            alerts.append(f"LIQUIDITY ALERT: Liquidity {direction} by {liq_change:.2f}%")
    
    return alerts

def get_token_data(chain_id: str, token_address: str) -> Optional[TokenData]:
    try:
        url = f"https://api.dexscreener.com/latest/dex/tokens/{token_address}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data.get("pairs"):
            pair = next((p for p in data["pairs"] if p["chainId"] == chain_id), None)
            return transform_dex_response(pair) if pair else None
        return None
    except Exception as e:
        print(f"Error fetching token data: {e}")
        return None

def transform_dex_response(pair: Dict) -> TokenData:
    return {
        "chain_id": pair.get("chainId", ""),
        "dex_id": pair.get("dexId", ""),
        "url": pair.get("url", ""),
        "pair_address": pair.get("pairAddress", ""),
        "labels": pair.get("labels", []),
        "base_token": {
            "address": pair["baseToken"]["address"],
            "name": pair["baseToken"]["name"],
            "symbol": pair["baseToken"]["symbol"]
        },
        "quote_token": {
            "address": pair["quoteToken"]["address"],
            "name": pair["quoteToken"]["name"],
            "symbol": pair["quoteToken"]["symbol"]
        },
        "price_native": pair.get("priceNative", "0"),
        "price_usd": pair.get("priceUsd", "0"),
        "txns": {
            "m5": pair.get("txns", {}).get("m5", {"buys": 0, "sells": 0}),
            "h1": pair.get("txns", {}).get("h1", {"buys": 0, "sells": 0}),
            "h6": pair.get("txns", {}).get("h6", {"buys": 0, "sells": 0}),
            "h24": pair.get("txns", {}).get("h24", {"buys": 0, "sells": 0})
        },
        "volume": {
            "h24": float(pair.get("volume", {}).get("h24", 0)),
            "h6": float(pair.get("volume", {}).get("h6", 0)),
            "h1": float(pair.get("volume", {}).get("h1", 0)),
            "m5": float(pair.get("volume", {}).get("m5", 0))
        },
        "price_change": {
            "m5": float(pair.get("priceChange", {}).get("m5", 0)),
            "h1": float(pair.get("priceChange", {}).get("h1", 0)),
            "h6": float(pair.get("priceChange", {}).get("h6", 0)),
            "h24": float(pair.get("priceChange", {}).get("h24", 0))
        },
        "liquidity": {
            "usd": float(pair.get("liquidity", {}).get("usd", 0)),
            "base": float(pair.get("liquidity", {}).get("base", 0)),
            "quote": float(pair.get("liquidity", {}).get("quote", 0))
        },
        "fdv": float(pair.get("fdv", 0)),
        "market_cap": float(pair.get("marketCap", 0)),
        "pair_created_at": pair.get("pairCreatedAt", 0),
        "info": pair.get("info"),
        "boosts": pair.get("boosts")
    }

def analyze_token_risk(token_data: TokenData, previous_data: Optional[TokenData] = None) -> RiskAnalysis:
    vulnerabilities = []
    recommendations = []
    risk_score = 0

    # Liquidity check
    if token_data["liquidity"]["usd"] < THRESHOLDS["liquidity_min"]:
        vulnerabilities.append("Low liquidity")
        risk_score += 30
        recommendations.append("Increase liquidity or wait for higher liquidity levels")

    # Price volatility
    volatility = abs(token_data["price_change"]["h6"])
    if volatility > THRESHOLDS["volatility_threshold"]:
        vulnerabilities.append(f"High volatility: {volatility:.2f}% over 6h")
        risk_score += 20
        recommendations.append("Exercise caution due to high fluctuations")
        
        if volatility > THRESHOLDS["impermanent_loss_risk"]:
            vulnerabilities.append("High impermanent loss risk")
            risk_score += 10
            recommendations.append("Consider impermanent loss risks")

    # Transaction patterns
    tx_h6 = (token_data["txns"]["h6"].get("buys", 0) + 
            token_data["txns"]["h6"].get("sells", 0))
    tx_h1 = (token_data["txns"]["h1"].get("buys", 0) + 
            token_data["txns"]["h1"].get("sells", 0))
    
    if tx_h1 > 0 and tx_h6 / tx_h1 > THRESHOLDS["abnormal_tx_ratio"]:
        vulnerabilities.append("Unusual transaction pattern")
        risk_score += 20
        recommendations.append("Monitor for market manipulation")

    # Market cap vs liquidity
    if token_data["market_cap"] > 0 and token_data["market_cap"] < token_data["liquidity"]["usd"]:
        vulnerabilities.append("Market cap < liquidity")
        risk_score += 20
        recommendations.append("Review valuation")

    # Token age
    token_age = (time.time() - token_data["pair_created_at"]) / 86400
    if token_age < THRESHOLDS["new_token_risk_days"]:
        vulnerabilities.append(f"New token ({token_age:.1f} days old)")
        risk_score += 15
        recommendations.append("Consider smaller position size")

    # Sell pressure
    h24_buys = token_data["txns"]["h24"].get("buys", 0)
    h24_sells = token_data["txns"]["h24"].get("sells", 0)
    total_tx = h24_buys + h24_sells
    
    if total_tx > 10:
        sell_pct = (h24_sells / total_tx) * 100
        if sell_pct > THRESHOLDS["quick_dump_risk"]:
            vulnerabilities.append(f"High selling pressure: {sell_pct:.1f}%")
            risk_score += 25
            recommendations.append("Watch for potential sell-off")

    # Pump detection
    if token_data["price_change"]["h24"] > THRESHOLDS["pump_warning_threshold"]:
        vulnerabilities.append(f"Possible pump: {token_data['price_change']['h24']:.2f}%")
        risk_score += 5
        recommendations.append("Extreme caution advised")

    # Sudden price changes
    if previous_data:
        previous_price = float(previous_data["price_usd"])
        current_price = float(token_data["price_usd"])
        if previous_price > 0:
            price_diff = abs(current_price - previous_price) / previous_price * 100
            if price_diff > ALERT_CONFIG["price_change_threshold"]:
                vulnerabilities.append(f"Sudden price change: {price_diff:.2f}%")
                risk_score += 10
                recommendations.append("Investigate price movement")

    return {
        "risk_score": min(risk_score, 70),
        "vulnerabilities": vulnerabilities,
        "recommendations": recommendations
    }

def analyze_market_sentiment(token_data: TokenData, previous_sentiment: Optional[MarketSentiment] = None) -> MarketSentiment:
    h24_buys = token_data["txns"]["h24"].get("buys", 0)
    h24_sells = token_data["txns"]["h24"].get("sells", 0)
    total_tx = h24_buys + h24_sells
    
    tx_sentiment = 0.0
    if total_tx > 0:
        tx_sentiment = (h24_buys - h24_sells) / total_tx
    
    price_1h = token_data["price_change"]["h1"] / 100
    price_24h = token_data["price_change"]["h24"] / 100
    price_sentiment = (price_1h * 0.6) + (price_24h * 0.4)
    price_sentiment = max(-1.0, min(1.0, price_sentiment))
    
    social_sentiment = (price_1h * 0.3) + (price_24h * 0.7)
    overall_sentiment = (tx_sentiment * 0.4) + (price_sentiment * 0.4) + (social_sentiment * 0.2)
    
    trends = []
    if overall_sentiment > 0.7:
        trends.append("Strong bullish sentiment")
    elif overall_sentiment > 0.3:
        trends.append("Moderate bullish")
    elif overall_sentiment < -0.7:
        trends.append("Strong bearish")
    elif overall_sentiment < -0.3:
        trends.append("Moderate bearish")
    else:
        trends.append("Neutral")
    
    if price_1h > 0 and price_24h < 0:
        trends.append("Positive momentum vs negative trend")
    elif price_1h < 0 and price_24h > 0:
        trends.append("Negative momentum vs positive trend")
    
    if h24_buys > h24_sells * 2:
        trends.append("Strong buying pressure")
    elif h24_sells > h24_buys * 2:
        trends.append("Strong selling pressure")
    
    if previous_sentiment and abs(overall_sentiment - previous_sentiment["score"]) > 0.3:
        direction = "positive" if overall_sentiment > previous_sentiment["score"] else "negative"
        trends.append(f"Significant {direction} shift")
    
    return {
        "score": overall_sentiment,
        "breakdown": {
            "social": social_sentiment,
            "transactions": tx_sentiment,
            "price_action": price_sentiment
        },
        "trends": trends
    }

def generate_ai_insights(token_data: TokenData, weekly_data: Optional[Dict] = None, sentiment: Optional[MarketSentiment] = None) -> List[str]:
    try:
        if not os.getenv("CLAUDE_API_KEY"):
            return ["AI insights unavailable - API key missing"]
        
        data = {
            "token": {
                "name": token_data["base_token"]["name"],
                "symbol": token_data["base_token"]["symbol"],
                "price": float(token_data["price_usd"]),
                "price_changes": token_data["price_change"],
                "liquidity": token_data["liquidity"]["usd"],
                "market_cap": token_data["market_cap"],
                "age": (time.time() - token_data["pair_created_at"]) / 86400
            },
            "transactions": {
                "h1": token_data["txns"]["h1"],
                "h24": token_data["txns"]["h24"]
            },
            "sentiment": sentiment.get("score") if sentiment else None,
            "weekly_data": weekly_data
        }
        
        response = anthropic.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=300,
        temperature=0.4,
        system="You are a crypto market analysis AI. Provide 3-5 specific, actionable insights...",
        messages=[{"role": "user", "content": json.dumps(data)}]
)
        
        ai_text = response.content[0].text
        insights = [line.strip() for line in ai_text.split('\n') if line.strip()]
        return insights[:5]
    
    except Exception as e:
        print(f"AI insight error: {e}")
        return ["Failed to generate insights"]

def generate_analytics_report(token_data: TokenData, risk_analysis: RiskAnalysis, 
                             weekly_data: Optional[Dict] = None, 
                             sentiment: Optional[MarketSentiment] = None) -> AnalyticsReport:
    return {
        "token_name": token_data["base_token"]["name"],
        "token_symbol": token_data["base_token"]["symbol"],
        "timestamp": time.time(),
        "metrics": {
            "price": {
                "current": float(token_data["price_usd"]),
                "change": {
                    "h1": token_data["price_change"]["h1"],
                    "h6": token_data["price_change"]["h6"],
                    "h24": token_data["price_change"]["h24"]
                }
            },
            "volume": {
                "h1": token_data["volume"]["h1"],
                "h6": token_data["volume"]["h6"],
                "h24": token_data["volume"]["h24"]
            },
            "liquidity": token_data["liquidity"]["usd"],
            "market_cap": token_data["market_cap"],
            "fdv": token_data["fdv"],
            "transactions": {
                "h1": {
                    "buys": token_data["txns"]["h1"].get("buys", 0),
                    "sells": token_data["txns"]["h1"].get("sells", 0),
                    "ratio": (token_data["txns"]["h1"].get("buys", 0) 
                            / max(1, token_data["txns"]["h1"].get("sells", 0)))
                }
            }
        },
        "risk": risk_analysis,
        "ai_insights": generate_ai_insights(token_data, weekly_data, sentiment)
    }

def start_token_monitoring(chain_id: str, token_address: str, interval: int = 20):
    print(f"Starting monitoring for {chain_id}:{token_address}")
    token_key = f"{chain_id}-{token_address}"
    
    while True:
        try:
            token_data = get_token_data(chain_id, token_address)
            if not token_data:
                time.sleep(interval)
                continue
            
            # Process alerts
            previous_data = data_cache.get(token_key)
            if previous_data:
                alerts = detect_alerts(token_data, previous_data)
                if alerts:
                    print("\n=== ALERTS ===")
                    for alert in alerts:
                        print(alert)
                    print("==============\n")
            
            # Update caches
            data_cache[token_key] = token_data
            price_point = {
                "timestamp": time.time(),
                "price": float(token_data["price_usd"]),
                "volume": token_data["volume"]["h1"]
            }
            price_history.setdefault(token_key, []).append(price_point)
            
            # Trim history
            if len(price_history[token_key]) > 1000:
                price_history[token_key] = price_history[token_key][-1000:]
            
            # Generate report
            weekly_data = load_weekly_data(token_key)
            sentiment = analyze_market_sentiment(token_data)
            risk_analysis = analyze_token_risk(token_data, previous_data)
            report = generate_analytics_report(token_data, risk_analysis, weekly_data, sentiment)
            
            # Save weekly data (placeholder implementation)
            save_weekly_data(token_key, report)
            
            time.sleep(interval)
            
        except Exception as e:
            print(f"Monitoring error: {e}")
            time.sleep(interval)

@app.route('/get_token', methods=['GET'])
def get_token():
    # Extract token address from the query parameters
    token_address = request.args.get('token_address')
    # Optionally, get the chain_id from the query, defaulting to 'solana'
    chain_id = request.args.get('chain_id', 'solana')
    
    if not token_address:
        return jsonify({"error": "Token address is required"}), 400
    
    # Get token data using the existing function
    token_data = get_token_data(chain_id, token_address)
    if token_data is None:
        return jsonify({"error": "Token data not found"}), 404
    
    # Build a unique token key to retrieve weekly data if it exists
    token_key = f"{chain_id}-{token_address}"
    weekly_data = load_weekly_data(token_key)
    
    # Generate sentiment and risk analysis
    sentiment = analyze_market_sentiment(token_data)
    # Here, we pass no previous data for a one-time report
    risk_analysis = analyze_token_risk(token_data)
    
    # Generate a comprehensive analytics report with metrics, risk, and AI insights
    report = generate_analytics_report(token_data, risk_analysis, weekly_data, sentiment)
    
    return jsonify(report)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
