import React, { useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { motion } from "framer-motion";
import { 
  FileSearch, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Clipboard,
  Search,
  Upload,
  Code,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "@/components/SearchBar";

interface VulnerabilityItem {
  id: number;
  name: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  lineNumber?: number;
  code?: string;
  recommendation: string;
}

const Audit = () => {
  const [activeTab, setActiveTab] = useState("address");
  const [contractAddress, setContractAddress] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [auditScore, setAuditScore] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityItem[]>([]);
  const [summary, setSummary] = useState("");
  const { toast } = useToast();

  // Ref for file input (hidden)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".sol")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setSourceCode(fileContent);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a valid Solidity (.sol) file.",
        variant: "destructive",
      });
    }
  };

  const handleAudit = async () => {
    // Validate inputs
    if (activeTab === "address" && !contractAddress) {
      toast({
        title: "Input Required",
        description: "Please enter a contract address to audit.",
        variant: "destructive",
      });
      return;
    }
    if (activeTab === "source" && !sourceCode) {
      toast({
        title: "Input Required",
        description: "Please enter or upload source code to audit.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgressValue(0);
    setAuditComplete(false);
    setVulnerabilities([]);
    setSummary("");
    setAuditScore(0);

    try {
      // Simulate realtime progress
      const progressInterval = setInterval(() => {
        setProgressValue((prev) => {
          const newValue = prev + Math.random() * 10;
          if (newValue >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newValue;
        });
      }, 200);

      let response;
      if (activeTab === "address") {
        // GET request with contract address in header
        response = await fetch("https://assure-fi.onrender.com/analyze-contract", {
          method: "GET",
          headers: {
            "contract-address": contractAddress,
          },
        });
      } else if (activeTab === "source") {
        // POST request: send a JSON object with the source code
        response = await fetch("https://assure-fi.onrender.com/analyze-contract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: sourceCode }),
        });
      }

      if (!response || !response.ok) {
        throw new Error("Server responded with an error");
      }
      const data = await response.json();
      // Expected response structure:
      // { vulnerabilities: [...], overallScore: number, summary: string }
      setVulnerabilities(data.vulnerabilities || []);
      setAuditScore(data.overallScore || 0);
      setSummary(data.summary || "");

      setProgressValue(100);
      setAuditComplete(true);
    } catch (error: any) {
      console.error("Audit error:", error);
      toast({
        title: "Audit Failed",
        description: error.message || "Failed to analyze contract.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Low Risk";
    if (score >= 60) return "Medium Risk";
    return "High Risk";
  };

  return (
    <DashboardLayout title="Smart Contract Audit" description="Analyze smart contracts for vulnerabilities and security issues">
      <SearchBar />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left side - Input */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="premium-card h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Audit Smart Contract</CardTitle>
                <CardDescription>
                  Submit a contract address or source code for security analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="address" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="address">Contract Address</TabsTrigger>
                    <TabsTrigger value="source">Source Code</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="address" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contractAddress">Enter Contract Address</Label>
                      <div className="relative">
                        <Input
                          id="contractAddress"
                          placeholder="0x..."
                          value={contractAddress}
                          onChange={(e) => setContractAddress(e.target.value)}
                          className="pl-10"
                        />
                        <div className="absolute left-3 top-2.5 text-muted-foreground">
                          <Search className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enter the contract address deployed on Ethereum, BSC, or other EVM-compatible chains.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="source" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sourceCode">Enter Source Code</Label>
                      <Textarea
                        id="sourceCode"
                        placeholder="// Paste your smart contract code here..."
                        value={sourceCode}
                        onChange={(e) => setSourceCode(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Or upload a Solidity (.sol) file
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" /> Upload File
                        </Button>
                        {/* Hidden file input */}
                        <input 
                          type="file" 
                          accept=".sol" 
                          ref={fileInputRef} 
                          style={{ display: "none" }} 
                          onChange={handleFileChange} 
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <Button 
                    onClick={handleAudit} 
                    disabled={isLoading}
                    className="w-full gap-2"
                  >
                    {isLoading ? "Running Audit..." : <>
                        <Shield className="h-4 w-4" /> Start Audit
                      </>}
                  </Button>
                  
                  {isLoading && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Analyzing contract...</span>
                        <span>{Math.round(progressValue)}%</span>
                      </div>
                      <Progress value={progressValue} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Right side - Results */}
        <div className="lg:col-span-3">
          {!auditComplete && !isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="premium-card h-full flex flex-col justify-center items-center py-12">
                <div className="text-center p-6">
                  <FileSearch className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-xl font-medium mb-2">No Audit Results Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Submit a smart contract address or source code to run a security audit and detect vulnerabilities.
                  </p>
                </div>
              </Card>
            </motion.div>
          ) : auditComplete ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="premium-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">Audit Results</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${getScoreColor(auditScore)}`}>
                        {auditScore}
                      </span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                  </div>
                  <CardDescription>
                    Scan completed on {new Date().toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score Section */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Security Score</h3>
                      <div className={`px-2 py-1 text-sm font-medium rounded-full ${
                        auditScore >= 80 ? "bg-green-500/10 text-green-600" :
                        auditScore >= 60 ? "bg-yellow-500/10 text-yellow-600" :
                        "bg-red-500/10 text-red-600"
                      }`}>
                        {getScoreLabel(auditScore)}
                      </div>
                    </div>
                    <Progress 
                      value={auditScore} 
                      className={`h-2 mb-2 ${
                        auditScore >= 80 ? "bg-green-100 [&>div]:bg-green-500" :
                        auditScore >= 60 ? "bg-yellow-100 [&>div]:bg-yellow-500" :
                        "bg-red-100 [&>div]:bg-red-500"
                      }`}
                    />
                    <p className="text-sm text-muted-foreground">
                      {auditScore >= 80 
                        ? "This contract appears to be relatively secure with minor issues."
                        : auditScore >= 60
                        ? "This contract has security concerns that should be addressed."
                        : "This contract has critical vulnerabilities that must be fixed."}
                    </p>
                  </div>
                  
                  {/* Vulnerabilities Section */}
                  <div>
                    <h3 className="font-medium mb-4">Vulnerabilities Found ({vulnerabilities.length})</h3>
                    {vulnerabilities.length > 0 ? (
                      <div className="space-y-4">
                        {vulnerabilities.map((item) => (
                          <div 
                            key={item.id} 
                            className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  {item.severity === "critical" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                                  {item.severity === "high" && <AlertCircle className="h-5 w-5 text-orange-500" />}
                                  {item.severity === "medium" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                                  {item.severity === "low" && <HelpCircle className="h-5 w-5 text-blue-500" />}
                                  <h4 className="font-medium">{item.name}</h4>
                                </div>
                                <div className={`text-xs font-medium px-2 py-1 rounded-full uppercase ${
                                  item.severity === "critical" ? "bg-red-500/10 text-red-600" :
                                  item.severity === "high" ? "bg-orange-500/10 text-orange-600" :
                                  item.severity === "medium" ? "bg-yellow-500/10 text-yellow-600" :
                                  "bg-blue-500/10 text-blue-600"
                                }`}>
                                  {item.severity}
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">
                                {item.description}
                              </p>
                              
                              {item.code && (
                                <div className="relative mb-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="text-xs text-muted-foreground">
                                      {item.lineNumber && `Line ${item.lineNumber}`}
                                    </div>
                                    <button 
                                      onClick={() => copyToClipboard(item.code)}
                                      className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                      <Clipboard className="h-3 w-3" /> Copy
                                    </button>
                                  </div>
                                  <pre className="bg-slate-950 text-slate-50 p-3 rounded-md text-xs overflow-x-auto">
                                    <code>{item.code}</code>
                                  </pre>
                                </div>
                              )}
                              
                              <div className="mt-2">
                                <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4 text-green-500" /> Recommendation
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  {item.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 border border-slate-200 dark:border-slate-800 rounded-lg">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <h3 className="font-medium mb-1">No Vulnerabilities Found</h3>
                        <p className="text-sm text-muted-foreground">
                          Our audit did not detect any security issues with this contract.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Summary Section */}
                  {summary && (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Audit Summary</h3>
                      <p className="text-sm text-muted-foreground">{summary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
          
          {/* Display if audit is in progress */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="premium-card h-full flex flex-col justify-center items-center py-12">
                <div className="text-center p-6">
                  <div className="relative h-16 w-16 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Shield className="h-8 w-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Analyzing Smart Contract</h3>
                  <p className="text-muted-foreground max-w-md">
                    Our AI is scanning the contract for vulnerabilities, backdoors, and security issues...
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Audit;
