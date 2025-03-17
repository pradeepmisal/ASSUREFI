import React, { useState, useEffect } from "react";
import {
  TrendingDown,
  AlertTriangle,
  Shield,
  BarChart3,
  FileSearch,
  Activity
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Token data for dropdown selection
const tokenData = [
  {
    token_name: "orchest",
    token_address: "hMpvoZTcApksJyJAXuX1HDDCCE4tEvMd2325vLfpump",
    smart_contract_address: "0x4575f41308ec1483f3d399aa9a2826d74da13deb"
  },
  {
    token_name: "yeye",
    token_address: "9CMi4UyHbhhmoqcf6thKUWSZ6rAuwafQJd7u2CB8pump",
    smart_contract_address: "0x36A500F731e2FFA29207499EFb29326b671000AC"
  },
  {
    token_name: "HoodGold",
    token_address: "AkfgYS26wK9xBmh9gtAGZ2umtVecJYa4co5NayqWpump",
    smart_contract_address: "akfgys26wk9xbmh9gtagz2umtvecjya4co5nayqwpump"
  },
  {
    token_name: "SwastiCoin",
    token_address: "9d1HfhQztyZszDCFS5p2zX6FzNkAPQogvuR3oerXpump",
    smart_contract_address: "9gyfbPVwwZx4y1hotNSLcqXCQNpNqqz6ZRvo8yTLpump"
  },
  {
    token_name: "Ron",
    token_address: "ALbCJ7r81tPuFYpG2hEwsrk6WXBz73xVyWty992Fpump",
    smart_contract_address: "0x23f043426b2336e723b32fb3bf4a1ca410f7c49a"
  },
  {
    token_name: "jupyter",
    token_address: "",
    smart_contract_address: "0x4B1E80cAC91e2216EEb63e29B957eB91Ae9C2Be8"
  },
  {
    token_name: "Token OFFICIAL TRUMP",
    token_address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
    smart_contract_address: "0x576e2BeD8F7b46D34016198911Cdf9886f78bea7"
  },
  {
    token_name: "Jito",
    token_address: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
    smart_contract_address: "0x7fB1ee12Ca098aF9bE5313401d7fCC5c8d7968D8"
  },
  {
    token_name: "Grass",
    token_address: "Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs",
    smart_contract_address: "0x42f0d280e1f4fb064650653445a3c904e61f64b1"
  }
];

// Default fallback values in case the API response is missing any fields
const defaultData = {
  riskData: [
    { category: "Contract Risk", risk: 0 },
    { category: "Liquidity Risk", risk: 0 },
    { category: "Market Sentiment", risk: 0 },
    { category: "Developer Activity", risk: 0 },
    { category: "Community Trust", risk: 0 }
  ],
  insightsList: [],
  chartData: [],
  riskConfig: {
    Risk: { label: "Project Risk", color: "#ef4444" },
    Average: { label: "Industry Average", color: "#3b82f6" }
  },
  ai_recommendations: []
};

const RiskAnalysis = () => {
  // State for the selected token index, risk analysis data, loading, and error.
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Risk Analysis - AssureFi Guardian";
  }, []);

  // Function to fetch risk analysis data from the backend
  const fetchRiskAnalysis = async (token) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://risk-analysis-nzrq.onrender.com/risk-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(token)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const riskAnalysisData = await response.json();
      console.log(riskAnalysisData);
      
      setData({
        riskData: riskAnalysisData.riskData || defaultData.riskData,
        insightsList: riskAnalysisData.insightsList || defaultData.insightsList,
        chartData: riskAnalysisData.chartData || defaultData.chartData,
        riskConfig: riskAnalysisData.riskConfig || defaultData.riskConfig,
        ai_recommendations: riskAnalysisData.ai_recommendations || defaultData.ai_recommendations
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler for dropdown selection change
  const handleTokenChange = (e) => {
    setSelectedTokenIndex(Number(e.target.value));
  };

  // Handler for analyze button click
  const handleAnalyzeClick = () => {
    const token = tokenData[selectedTokenIndex];
    fetchRiskAnalysis(token);
  };

  // Calculate overall risk based on riskData values
  const overallRisk =
    typeof data.riskData[0].risk === "number"
      ? data.riskData.reduce((sum, item) => sum + item.risk, 0) / data.riskData.length
      : 0;
  const overallRiskText =
    overallRisk > 60 ? "High Risk" : overallRisk > 40 ? "Medium-High Risk" : "Low Risk";

  return (
    <DashboardLayout 
      title="Risk Analysis" 
      description="Comprehensive risk assessment based on multiple data sources"
    >
      {/* Dropdown and Analyze Button */}
      <div className="mb-8" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 className="text-xl font-bold mb-2">Select a Token to Analyze</h2>
        <select
          className="border rounded p-2 w-full mb-4"
          value={selectedTokenIndex}
          onChange={handleTokenChange}
        >
          {tokenData.map((token, index) => (
            <option key={index} value={index}>
              {token.token_name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAnalyzeClick}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
        {error && <div className="text-red-500 mt-2">Error: {error}</div>}
      </div>

      {/* Risk Analysis Display */}
      <div className="grid gap-6">
        {/* Overall Risk Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle>Overall Risk Assessment</CardTitle>
            </div>
            <CardDescription>
              Combined risk level based on contract audit, liquidity monitoring, sentiment analysis, and trust score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center p-6 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                <div className="text-3xl font-bold text-amber-600 mb-2">{overallRiskText}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  This project has several risk factors that require attention before investing.
                </div>
              </div>
              <div className="grid gap-4">
                {data.riskData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm font-medium">{item.risk}%</span>
                    </div>
                    <Progress 
                      value={item.risk} 
                      max={100} 
                      fill={item.risk > 60 ? "#ef4444" : item.risk > 40 ? "#f59e0b" : "#22c55e"} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Risk Insights</CardTitle>
            </div>
            <CardDescription>
              Key findings from all analysis tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.insightsList.map((insight, index) => (
                <div key={index}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {/* If your API provides icon details, you can render them here. */}
                      {insight.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{insight.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{insight.description}</p>
                      <div className="mt-1">
                        <span className="text-xs inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                          Source: {insight.action}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < data.insightsList.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Trend Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <CardTitle>Risk Analysis Trend</CardTitle>
            </div>
            <CardDescription>
              Historical risk metrics compared to industry average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ChartContainer 
                config={data.riskConfig}
                className="h-full w-full"
              >
                <BarChart
                  data={data.chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Legend />
                  <Bar dataKey="Risk" fill="#ef4444" name="Project Risk" />
                  <Bar dataKey="Average" fill="#3b82f6" name="Industry Average" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Risk Recommendations</CardTitle>
            <CardDescription>
              Personalized suggestions based on AI analysis of all data sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              {data.ai_recommendations && data.ai_recommendations.length > 0 ? (
                data.ai_recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border border-slate-200 dark:border-slate-800 rounded-md">
                    <h3 className="font-medium mb-2">{rec.title}</h3>
                    <p>{rec.description}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-md">
                    <h3 className="font-medium mb-2">Contract Security</h3>
                    <p>
                      Consider waiting for a full audit resolution before investing. The identified access control issues could potentially allow unauthorized control over token functions.
                    </p>
                  </div>
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-md">
                    <h3 className="font-medium mb-2">Liquidity Management</h3>
                    <p>
                      Set up monitoring alerts for large liquidity movements. The concentrated ownership structure increases the risk of sudden price drops due to large sells.
                    </p>
                  </div>
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-md">
                    <h3 className="font-medium mb-2">Market Sentiment</h3>
                    <p>
                      Monitor social channels for upcoming announcements or community events that might improve sentiment. The recent negative trend could indicate undisclosed issues.
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RiskAnalysis;
