from flask import Flask, request, jsonify
import pandas as pd
import re
import nltk
import json
import random
from datetime import datetime, timedelta
from nltk.sentiment.vader import SentimentIntensityAnalyzer

from flask_cors import CORS 
app = Flask(__name__)
CORS(app)

# Download NLTK resources
nltk.download('vader_lexicon')

# Supported cryptocurrencies and their tickers
CRYPTO_MAPPING = {
    'bitcoin': ['btc'],
    'ethereum': ['eth'],
    'binancecoin': ['bnb'],
    'ripple': ['xrp'],
    'cardano': ['ada'],
    'solana': ['sol'],
    'dogecoin': ['doge'],
    'polkadot': ['dot'],
    'litecoin': ['ltc'],
    'chainlink': ['link'],
    'bitcoincash': ['bch'],
    'stellar': ['xlm'],
    'uniswap': ['uni'],
    'avalanche': ['avax'],
    'cosmos': ['atom'],
    'monero': ['xmr'],
    'algorand': ['algo'],
    'tezos': ['xtz'],
    'tron': ['trx'],
    'toncoin': ['ton'],
    'shibainu': ['shib'],
    'nearprotocol': ['near'],
    'orchest': ['orc'],
    'yeye': ['yey'],
    'hoodgold': ['hg'],
    'swasticoin': ['swc'],
    'ron': ['ron'],
    'jupyter': ['jup'],
    'tokenofficialtrump': ['tot'],
    'jito': ['jto'],
    'grass': ['grs']
    
}

class CryptoAnalyzer:
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        self.sia.lexicon.update({
            'bullrun': 3.0, 'ATH': 2.5, 'long': 2.0, 'breakout': 2.5,
            'dip': -1.5, 'crash': -3.0, 'short': -2.0, 'delist': -3.0,
            'whale alert': -2.5, 'FOMO': 1.5, 'pump': 2.0, 'dump': -2.5,
            'hard fork': 1.0, 'mainnet launch': 2.0, 'burn': 1.5,
            'halving': 2.0, 'airdrop': 1.5, 'CEX listing': 2.5
        })

    def analyze(self, text):  # ✅ Ensure this method exists
        return self.sia.polarity_scores(text)

def clean_tweet(tweet):
    return ' '.join(re.sub(r"(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(r\w+:\/\/\S+)", " ", tweet).split())

def get_sentiment(score):
    if score > 0.05: return 'Positive'
    if score < -0.05: return 'Negative'
    return 'Neutral'

def generate_mock_data(coin, count=50):
    templates = [
        f"Breaking: {{coin}} {random.choice(['partnership', 'hack', 'listing'])} news!",
        f"{{coin}} price {random.choice(['surges', 'drops'])} {random.randint(5, 95)}%",
        f"Major development in {{coin}} ecosystem",
        f"{{coin}} {random.choice(['wallet', 'exchange', 'network'])} update",
        f"Regulatory news affecting {{coin}}"
    ]
    
    return [{
        'content': t.format(coin=coin),
        'date': (datetime.now() - timedelta(hours=random.randint(0, 48))).isoformat(),
        'sentiment': random.choice(['Positive', 'Negative', 'Neutral'])
    } for t in random.choices(templates, k=count)]

def analyze_tweets(coin, tweets):
    analyzer = CryptoAnalyzer()  # ✅ Create an instance here
    results = []
    
    for tweet in tweets:
        cleaned = clean_tweet(tweet['content'])
        analysis = analyzer.analyze(cleaned)  # ✅ Now it correctly calls analyze()
        results.append({
            'content': tweet['content'],
            'sentiment': get_sentiment(analysis['compound']),
            'score': analysis['compound'],
            'date': tweet['date']
        })
    
    return pd.DataFrame(results)

@app.route('/analyze', methods=['POST'])
def analyze_coin():
    # Get coin name from request
    coin = request.headers.get('X-Coin-Name') or request.json.get('coin')
    if not coin:
        return jsonify({'error': 'Coin name required'}), 400
    
    # Normalize coin name
    coin = coin.lower().replace(' ', '')
    
    # Generate or fetch tweets (mock implementation)
    mock_tweets = generate_mock_data(coin)
    df = analyze_tweets(coin, mock_tweets)
    
    # Generate insights
    sentiment_dist = df['sentiment'].value_counts().to_dict()
    avg_score = df['score'].mean()
    latest_news = df.sort_values('date', ascending=False).head(3).to_dict('records')
    
    response = {
        'coin': coin,
        'sentiment_distribution': sentiment_dist,
        'average_sentiment': round(avg_score, 2),
        'latest_news': latest_news,
        'analysis_time': datetime.now().isoformat()
    }
    
    return jsonify(response)

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)

import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
