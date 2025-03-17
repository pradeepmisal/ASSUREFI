
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Wallet, 
  CreditCard, 
  ArrowRightLeft, 
  ClipboardCheck, 
  Check, 
  ExternalLink, 
  AlertTriangle,
  Coins,
  Banknote,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const WalletAnalysis = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<null | any>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Wallet Analysis - AssureFi Guardian";
  }, []);

  const analyzeWallet = () => {
    if (!walletAddress.trim() || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // In a real app, this would be an API call to fetch wallet data
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysis(generateMockWalletData());
      toast({
        title: "Analysis Complete",
        description: "Wallet data has been analyzed successfully",
      });
    }, 1500);
  };

  const generateMockWalletData = () => {
    // This generates fake data for demo purposes
    return {
      address: walletAddress,
      balance: {
        eth: 3.45,
        usd: 8245.67,
        tokens: [
          { symbol: "USDT", balance: 1250.45, value: 1250.45 },
          { symbol: "LINK", balance: 120, value: 840.12 },
          { symbol: "UNI", balance: 50, value: 425.75 },
          { symbol: "AAVE", balance: 3.5, value: 301.28 },
          { symbol: "COMP", balance: 2.2, value: 156.42 },
        ]
      },
      transactions: {
        count: 128,
        recent: [
          { hash: "0x1a2b...3c4d", type: "Swap", value: "0.5 ETH", timestamp: Date.now() - 300000, status: "success" },
          { hash: "0x5e6f...7g8h", type: "Send", value: "250 USDT", timestamp: Date.now() - 86400000, status: "success" },
          { hash: "0x9i10...11j12", type: "Receive", value: "0.2 ETH", timestamp: Date.now() - 172800000, status: "success" },
          { hash: "0x13k14...15l16", type: "Swap", value: "100 UNI → 0.3 ETH", timestamp: Date.now() - 259200000, status: "success" },
          { hash: "0x17m18...19n20", type: "Approve", value: "LINK", timestamp: Date.now() - 345600000, status: "success" }
        ]
      },
      assets: {
        change: {
          day: -2.4,
          week: 5.8,
          month: 12.3
        },
        history: [
          { date: "Mar 1", value: 7500 },
          { date: "Mar 8", value: 7800 },
          { date: "Mar 15", value: 7200 },
          { date: "Mar 22", value: 7900 },
          { date: "Mar 29", value: 8100 },
          { date: "Apr 5", value: 8300 },
          { date: "Apr 12", value: 8245 }
        ]
      },
      risk: {
        score: 78,
        factors: [
          { name: "Suspicious Transactions", value: 15 },
          { name: "Concentration Risk", value: 25 },
          { name: "Contract Interaction", value: 30 },
          { name: "Unverified Tokens", value: 30 }
        ]
      }
    };
  };

  const copyAddress = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis.address);
      toast({
        title: "Copied to Clipboard",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <DashboardLayout title="Wallet Analysis" description="Analyze the contents, transactions, and risk profile of any wallet">
      <div className="grid gap-6">
        {!analysis ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Wallet Address Analysis</CardTitle>
              <CardDescription>
                Analyze any Ethereum wallet to view balances, transactions, and risk profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Enter Wallet Address</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="walletAddress"
                      placeholder="0x..."
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                    />
                    <Button 
                      onClick={analyzeWallet} 
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter any Ethereum wallet address to analyze its contents and transaction history
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Wallet Overview Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-500" />
                    <CardTitle>Wallet Overview</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={analysis.risk.score > 70 ? "success" : "destructive"}>
                      {analysis.risk.score > 70 ? "Low Risk" : "High Risk"}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={copyAddress}>
                      <ClipboardCheck className="h-4 w-4 mr-2" />
                      Copy Address
                    </Button>
                    <a href={`https://etherscan.io/address/${analysis.address}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Etherscan
                      </Button>
                    </a>
                  </div>
                </div>
                <CardDescription>
                  {analysis.address.slice(0, 6)}...{analysis.address.slice(-4)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">ETH Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysis.balance.eth} ETH</div>
                      <div className="text-xs text-muted-foreground mt-1">${analysis.balance.usd.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysis.transactions.count}</div>
                      <div className="text-xs text-muted-foreground mt-1">All-time transactions</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Token Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysis.balance.tokens.length}</div>
                      <div className="text-xs text-muted-foreground mt-1">Unique tokens held</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Portfolio Change</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${analysis.assets.change.day > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {analysis.assets.change.day > 0 ? '+' : ''}{analysis.assets.change.day}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">24-hour change</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Tabs defaultValue="tokens">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="tokens">Tokens</TabsTrigger>
                      <TabsTrigger value="transactions">Transactions</TabsTrigger>
                      <TabsTrigger value="risk">Risk Profile</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tokens">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2">
                          <CardHeader>
                            <CardTitle className="text-lg">Token Holdings</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[250px] pr-4">
                              <div className="space-y-4">
                                {analysis.balance.tokens.map((token: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Coins className="h-5 w-5 text-blue-500" />
                                      </div>
                                      <div>
                                        <div className="font-medium">{token.symbol}</div>
                                        <div className="text-sm text-muted-foreground">{token.balance} tokens</div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium">${token.value.toFixed(2)}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {((token.value / analysis.balance.usd) * 100).toFixed(1)}% of portfolio
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[250px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: "ETH", value: analysis.balance.eth * 2400 }, // Assuming $2400 per ETH for this example
                                      ...analysis.balance.tokens.map((token: any) => ({
                                        name: token.symbol,
                                        value: token.value
                                      }))
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {[
                                      { name: "ETH", value: analysis.balance.eth * 2400 },
                                      ...analysis.balance.tokens.map((token: any) => ({
                                        name: token.symbol,
                                        value: token.value
                                      }))
                                    ].map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="transactions">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {analysis.transactions.recent.map((tx: any, index: number) => (
                              <div key={index} className="flex items-start justify-between pb-4 border-b border-border last:border-none last:pb-0">
                                <div className="flex items-start gap-3">
                                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    {tx.type === "Swap" && <ArrowRightLeft className="h-5 w-5 text-purple-500" />}
                                    {tx.type === "Send" && <ArrowRightLeft className="h-5 w-5 text-red-500" />}
                                    {tx.type === "Receive" && <ArrowRightLeft className="h-5 w-5 text-green-500" />}
                                    {tx.type === "Approve" && <Check className="h-5 w-5 text-blue-500" />}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <div className="font-medium">{tx.type}</div>
                                      <Badge variant="outline" className="text-xs">
                                        {tx.status}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">{tx.value}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm">
                                    {new Date(tx.timestamp).toLocaleDateString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {new Date(tx.timestamp).toLocaleTimeString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="justify-center border-t pt-4">
                          <a 
                            href={`https://etherscan.io/address/${analysis.address}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            View all transactions <ExternalLink className="h-3 w-3" />
                          </a>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="risk">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-amber-500" />
                              <CardTitle className="text-lg">Risk Analysis</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center mb-6">
                              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-slate-100 mb-4">
                                <span className={`text-3xl font-bold ${
                                  analysis.risk.score > 70 ? 'text-green-500' : 
                                  analysis.risk.score > 50 ? 'text-amber-500' : 
                                  'text-red-500'
                                }`}>
                                  {analysis.risk.score}
                                </span>
                              </div>
                              <div className="font-medium text-lg">
                                {analysis.risk.score > 70 ? 'Low Risk' : 
                                analysis.risk.score > 50 ? 'Medium Risk' : 
                                'High Risk'}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Risk score based on transaction patterns and token holdings
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              {analysis.risk.factors.map((factor: any, index: number) => (
                                <div key={index}>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">{factor.name}</span>
                                    <span className="text-sm font-medium">{factor.value}/100</span>
                                  </div>
                                  <Progress value={factor.value} className="h-2" />
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <Banknote className="h-5 w-5 text-green-500" />
                              <CardTitle className="text-lg">Portfolio Performance</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-4 space-y-2">
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <div className="text-xs text-muted-foreground">24h</div>
                                  <div className={`text-sm font-medium ${analysis.assets.change.day > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {analysis.assets.change.day > 0 ? '+' : ''}{analysis.assets.change.day}%
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">7d</div>
                                  <div className={`text-sm font-medium ${analysis.assets.change.week > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {analysis.assets.change.week > 0 ? '+' : ''}{analysis.assets.change.week}%
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">30d</div>
                                  <div className={`text-sm font-medium ${analysis.assets.change.month > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {analysis.assets.change.month > 0 ? '+' : ''}{analysis.assets.change.month}%
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="h-[200px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                  data={analysis.assets.history}
                                  margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                  }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" />
                                  <YAxis />
                                  <Tooltip formatter={(value) => [`$${value}`, 'Portfolio Value']} />
                                  <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#0ea5e9" 
                                    fill="#0ea5e9" 
                                    fillOpacity={0.1} 
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WalletAnalysis;
