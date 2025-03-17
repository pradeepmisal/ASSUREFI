
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  BarChart3, 
  ChevronDown,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface AnalysisItem {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

export function AIAnalysisDropdown() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Create context-specific analyses based on current route
  const getPageSpecificData = (): Record<string, AnalysisItem> => {
    const path = location.pathname;
    
    // Default analysis data (used for dashboard and other pages)
    const defaultData: Record<string, AnalysisItem> = {
      "market-analysis": {
        title: "Market Analysis",
        icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
        items: [
          "Market sentiment has shifted bearish in the last 24 hours",
          "BTC correlation with altcoins decreasing, suggesting potential rotation",
          "Trading volume decreased by 15% across major exchanges",
          "Liquidity concentration in mid-cap tokens has increased",
          "Market volatility index is 5% higher than 30-day average"
        ]
      },
      "risk-analysis": {
        title: "Risk Analysis",
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        items: [
          "Smart contract audit revealed 2 medium-severity issues",
          "65% of liquidity controlled by top 10 wallets - high concentration risk",
          "Token shows signs of wash trading in lower time frames",
          "Recent whale movements indicate potential sell pressure",
          "Regulatory developments may impact token utility"
        ]
      },
      "prediction": {
        title: "Prediction",
        icon: <Lightbulb className="h-5 w-5 text-purple-500" />,
        items: [
          "Technical indicators suggest support at current levels",
          "Short-term price action likely range-bound between $0.00045-$0.00052",
          "Expected volatility increase around upcoming protocol upgrade",
          "Trading volumes projected to recover within 48-72 hours",
          "Token may see increased adoption due to new partnerships"
        ]
      },
      "opportunities": {
        title: "Opportunities",
        icon: <BarChart3 className="h-5 w-5 text-green-500" />,
        items: [
          "High yield farming available in new liquidity pools",
          "Price divergence creating arbitrage opportunities across DEXs",
          "Governance proposal voting offers token holder incentives",
          "Recent dip provides potential entry point with favorable risk/reward",
          "New NFT collection launch may drive ecosystem activity"
        ]
      },
      "key-metrics": {
        title: "Key Metrics",
        icon: <Activity className="h-5 w-5 text-pink-500" />,
        items: [
          "Market cap: $42.5M (↓3.2% 24h)",
          "24h Trading volume: $8.7M (↓15.4%)",
          "Liquidity: $12.3M across 4 major pools",
          "Holders: 15,742 (↑1.2% week)",
          "Development activity: 37 commits past week"
        ]
      }
    };

    // Audit page specific data
    if (path.includes('audit')) {
      return {
        "market-analysis": {
          title: "Market Analysis",
          icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
          items: [
            "Contract code quality correlates with token performance (+25%)",
            "Audited contracts see 3x higher investor confidence",
            "Recent audit-related market trends show preference for transparency",
            "Projects with security audits outperform non-audited ones by 40%",
            "Market responding positively to security-focused governance proposals"
          ]
        },
        "risk-analysis": {
          title: "Risk Analysis",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          items: [
            "Critical vulnerabilities found in 12% of recently audited contracts",
            "Reentrancy remains the most common high-severity issue",
            "Mathematical precision errors affect 35% of DeFi protocols",
            "Access control vulnerabilities increasing in frequency",
            "Centralization risks identified in 68% of governance tokens"
          ]
        },
        "prediction": {
          title: "Prediction",
          icon: <Lightbulb className="h-5 w-5 text-purple-500" />,
          items: [
            "Market will continue to value audited protocols at premium",
            "Next wave of vulnerabilities likely in cross-chain bridges",
            "Audit standards expected to formalize within 6-12 months",
            "Increasing demand for continuous monitoring vs. one-time audits",
            "Automated audit tools to complement but not replace manual review"
          ]
        },
        "opportunities": {
          title: "Opportunities",
          icon: <BarChart3 className="h-5 w-5 text-green-500" />,
          items: [
            "Implement formal verification for critical contract functions",
            "Consider multi-phase audit approach for complex systems",
            "Bug bounty programs amplify audit effectiveness by 60%",
            "Community-driven code reviews gaining traction and effectiveness",
            "New audit certification standards create competitive advantage"
          ]
        },
        "key-metrics": {
          title: "Key Metrics",
          icon: <Activity className="h-5 w-5 text-pink-500" />,
          items: [
            "Average audit cost: $45,000 for standard protocol",
            "Audit timeframe: 2-4 weeks for comprehensive review",
            "Bug severity distribution: 8% critical, 22% high, 70% medium/low",
            "ROI on audits: 300-500% when accounting for prevented losses",
            "Market performance: audited +65% vs non-audited +15% YTD"
          ]
        }
      };
    }
    
    // Monitor (Liquidity) page specific data
    if (path.includes('monitor')) {
      return {
        "market-analysis": {
          title: "Market Analysis",
          icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
          items: [
            "Liquidity pools showing 12% decrease across major DEXs",
            "Price impact for $100k sells increased from 2.1% to 3.8%",
            "Centralized exchange liquidity outpacing DEX growth this quarter",
            "Stablecoin pairs maintaining strongest depth metrics",
            "Long-tail assets experiencing significant liquidity fragmentation"
          ]
        },
        "risk-analysis": {
          title: "Risk Analysis",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          items: [
            "67% of token liquidity concentrated in a single pool - vulnerability risk",
            "Liquidity provider concentration: top 5 wallets control 58%",
            "Time-weighted liquidity volatility above market average",
            "Impermanent loss risk heightened during current market conditions",
            "Protocol-owned liquidity represents only 12% of total depth"
          ]
        },
        "prediction": {
          title: "Prediction",
          icon: <Lightbulb className="h-5 w-5 text-purple-500" />,
          items: [
            "Expected LP withdrawal of 5-10% if market volatility continues",
            "Rebalancing likely as yields equilibrate across ecosystem",
            "Projected slippage increase of 15-25% for large trades",
            "Volume/liquidity ratio expected to normalize within 2 weeks",
            "Potential for liquidity mining incentives to boost pools by 30-40%"
          ]
        },
        "opportunities": {
          title: "Opportunities",
          icon: <BarChart3 className="h-5 w-5 text-green-500" />,
          items: [
            "Concentrated liquidity positions offer 4x higher capital efficiency",
            "Cross-chain bridged liquidity creating arbitrage opportunities",
            "New incentive mechanisms launching on competing protocols",
            "Strategic LP positioning in narrow ranges yields premium returns",
            "Protocol-owned liquidity acquisition at favorable valuations"
          ]
        },
        "key-metrics": {
          title: "Key Metrics",
          icon: <Activity className="h-5 w-5 text-pink-500" />,
          items: [
            "Total Value Locked: $34.2M (↓8.5% 7d)",
            "Liquidity Provider Count: 1,842 (↑3.2% 30d)",
            "Average LP Position: $18,600",
            "Pool Concentration: 72% in top 3 pairs",
            "24h Volume/TVL Ratio: 0.12 (healthy = >0.10)"
          ]
        }
      };
    }

    // Trust Score page specific data
    if (path.includes('trust-score')) {
      return {
        "market-analysis": {
          title: "Market Analysis",
          icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
          items: [
            "Trust score correlates with TVL growth rate (r=0.72)",
            "Projects with trust scores >80 outperform market by 28%",
            "Investor confidence metrics show 15% premium for trusted protocols",
            "Market capitalization to trust score ratio improving quarter-over-quarter",
            "New capital flowing predominantly to high-trust score projects"
          ]
        },
        "risk-analysis": {
          title: "Risk Analysis",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          items: [
            "Low trust score projects 5x more likely to experience exploits",
            "Governance participation 300% higher in trusted protocols",
            "Trust volatility increased in projects with fluctuating fundamentals",
            "External dependencies creating trust vulnerabilities in 38% of protocols",
            "Trust recovery after incidents takes average of 110 days"
          ]
        },
        "prediction": {
          title: "Prediction",
          icon: <Lightbulb className="h-5 w-5 text-purple-500" />,
          items: [
            "Trust scores expected to become standard investment metric by EOY",
            "Standardization of trust frameworks across the industry imminent",
            "Growing premium for transparent, verifiable on-chain reputation",
            "Trust factors likely to be incorporated into risk-management models",
            "Decentralized identity solutions to boost trust verification methods"
          ]
        },
        "opportunities": {
          title: "Opportunities",
          icon: <BarChart3 className="h-5 w-5 text-green-500" />,
          items: [
            "Formalize trust-building roadmap for emerging protocols",
            "Leverage independent attestations to accelerate trust development",
            "On-chain reputation systems creating new verification paradigms",
            "Trust bridging across ecosystems unlocking cross-chain opportunities",
            "Composable trust creating exponential value in integrated systems"
          ]
        },
        "key-metrics": {
          title: "Key Metrics",
          icon: <Activity className="h-5 w-5 text-pink-500" />,
          items: [
            "Average Trust Score: 72/100 across top 100 protocols",
            "Trust Growth Rate: +5.2 points average quarterly improvement",
            "Trust Components: Security (40%), Transparency (25%), Governance (20%), Track Record (15%)",
            "Market Correlation: 0.83 between trust score and long-term ROI",
            "Trust Volatility Index: 12.5 (lower than historical average of 18.2)"
          ]
        }
      };
    }

    // Risk Analysis page specific data
    if (path.includes('risk-analysis')) {
      return {
        "market-analysis": {
          title: "Market Analysis",
          icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
          items: [
            "Risk-adjusted returns show 30% spread between high/low risk protocols",
            "Market pricing in risk premiums more efficiently this quarter",
            "Correlation between technical risks and token performance strengthening",
            "DeFi blue chips maintaining lower risk profiles despite market conditions",
            "Risk factor sensitivity increased across all major token categories"
          ]
        },
        "risk-analysis": {
          title: "Risk Analysis",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          items: [
            "Smart contract risks account for 42% of total identified vulnerabilities",
            "Economic attack vectors increasing in sophistication and occurrence",
            "Centralization risks present in 78% of governance structures",
            "Slippage and MEV risks affecting trade execution by avg. 3.2%",
            "Systemic contagion paths identified across 15 major protocols"
          ]
        },
        "prediction": {
          title: "Prediction",
          icon: <Lightbulb className="h-5 w-5 text-purple-500" />,
          items: [
            "Risk model sophistication expected to improve by 40% over 6 months",
            "Insurance product expansion to cover 70% more risk categories",
            "Institutional risk frameworks being adapted for DeFi integration",
            "Proactive risk monitoring to become industry standard by Q4",
            "Risk specialization creating new expert niches in protocol security"
          ]
        },
        "opportunities": {
          title: "Opportunities",
          icon: <BarChart3 className="h-5 w-5 text-green-500" />,
          items: [
            "Implement comprehensive risk scoring across portfolio holdings",
            "Leverage risk/reward optimization tools for capital allocation",
            "Formal verification services seeing 3x growth in adoption",
            "Risk-transfer mechanisms (insurance, options) creating new markets",
            "Risk transparency becoming competitive differentiator for protocols"
          ]
        },
        "key-metrics": {
          title: "Key Metrics",
          icon: <Activity className="h-5 w-5 text-pink-500" />,
          items: [
            "Average Risk Score: 65/100 (higher = more risk)",
            "Risk Categories: Technical (40%), Economic (30%), Governance (20%), Market (10%)",
            "Risk-adjusted ROI spread: 28.5% between top and bottom quartiles",
            "Vulnerability discovery rate: 2.8 per 1000 lines of code (industry avg)",
            "Risk hedging cost: 3-8% annualized for comprehensive coverage"
          ]
        }
      };
    }

    // Sentiment Analysis page specific data
    if (path.includes('sentiment')) {
      return {
        "market-analysis": {
          title: "Market Analysis",
          icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
          items: [
            "Sentiment leading price action by average of 12-24 hours",
            "Social volume correlation with market moves at 0.68 (strong)",
            "Positive sentiment rallies showing 40% stronger price impact than negative",
            "News-driven sentiment shifts lasting average of 36 hours before normalization",
            "Social consensus reaching 83% agreement on current market direction"
          ]
        },
        "risk-analysis": {
          title: "Risk Analysis",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          items: [
            "Sentiment manipulation attempts detected on 15+ token communities",
            "Coordinated FUD campaigns identified targeting 3 major protocols",
            "Bot activity generating 28% of all sentiment signals (up from 22%)",
            "Sentiment volatility exceeding price volatility - potential signal distortion",
            "Echo chamber effect strengthening in 65% of token communities"
          ]
        },
        "prediction": {
          title: "Prediction",
          icon: <Lightbulb className="h-5 w-5 text-purple-500" />,
          items: [
            "Sentiment expected to turn bullish within 7-10 days based on patterns",
            "NLP models project 30% upswing in positive mentions for DeFi sector",
            "Social consensus forming around accumulation strategy vs trading",
            "Developer sentiment indicators suggest product announcement surge in Q3",
            "Cross-platform sentiment divergence likely to normalize within 2 weeks"
          ]
        },
        "opportunities": {
          title: "Opportunities",
          icon: <BarChart3 className="h-5 w-5 text-green-500" />,
          items: [
            "Leverage sentiment-based trade signals for 15-25% enhanced returns",
            "Social arbitrage opportunities in sentiment vs price disconnects",
            "Community sentiment nurturing strategies seeing 3x engagement uplift",
            "Contrarian positions against extreme sentiment showing 40% win rate",
            "Sentiment lead indicators identify emerging narratives 5-10 days early"
          ]
        },
        "key-metrics": {
          title: "Key Metrics",
          icon: <Activity className="h-5 w-5 text-pink-500" />,
          items: [
            "Social Volume: 25,842 mentions (↑18% 7d)",
            "Sentiment Score: +0.42 on scale of -1 to +1",
            "Engagement Ratio: 3.8 (interactions per mention)",
            "Narrative Strength: 72/100 (how strongly community believes current narrative)",
            "Influencer Consensus: 65% bullish, 20% bearish, 15% neutral"
          ]
        }
      };
    }

    // Return default for other pages
    return defaultData;
  };

  const analysisData = getPageSpecificData();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BrainCircuit className="h-4 w-4" />
          Analyze with AI
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[350px] p-0" align="end">
        <div className="p-3 border-b">
          <h4 className="font-medium">AI Analysis</h4>
          <p className="text-xs text-muted-foreground">
            Get AI-powered insights on the current token
          </p>
        </div>
        <div className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(analysisData).map(([key, analysis]) => (
              <AccordionItem value={key} key={key} className="border-b-0 px-4">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center gap-2 text-sm">
                    {analysis.icon}
                    <span>{analysis.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="space-y-2">
                    {analysis.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="p-2 border-t bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Last updated: 3 min ago</span>
            <Badge variant="secondary" className="text-xs">AI Generated</Badge>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
