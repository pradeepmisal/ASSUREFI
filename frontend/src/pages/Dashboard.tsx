
import React from "react";
import { 
  BarChart, 
  BellRing, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  TrendingDown,
  Shield,
  FileSearch,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBar from "@/components/SearchBar";

const Dashboard = () => {
  // Stats data
  const stats = [
    {
      title: "Audits Completed",
      value: "1,284",
      change: "+12.5%",
      increasing: true,
      icon: <FileSearch className="h-5 w-5" />,
    },
    {
      title: "Average Trust Score",
      value: "76.3",
      change: "+2.1%",
      increasing: true,
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "Alerts Today",
      value: "28",
      change: "-3.6%",
      increasing: false,
      icon: <BellRing className="h-5 w-5" />,
    },
    {
      title: "Fraud Reports",
      value: "114",
      change: "+5.8%",
      increasing: true,
      icon: <AlertTriangle className="h-5 w-5" />,
    },
  ];

  // Recent alerts data
  const recentAlerts = [
    {
      id: 1,
      project: "SafeMoon Fork",
      type: "Liquidity Change",
      severity: "high",
      message: "Large liquidity withdrawal detected (45% of pool)",
      time: "10 minutes ago",
    },
    {
      id: 2,
      project: "ElonDogeMars",
      type: "Contract Vulnerability",
      severity: "critical",
      message: "Backdoor detected in contract allowing arbitrary token minting",
      time: "25 minutes ago",
    },
    {
      id: 3,
      project: "YieldFarm Finance",
      type: "Trading Pattern",
      severity: "medium",
      message: "Unusual trading volume spike detected",
      time: "42 minutes ago",
    },
    {
      id: 4,
      project: "Moon Finance",
      type: "Developer Activity",
      severity: "low",
      message: "Contract ownership transferred to new address",
      time: "1 hour ago",
    },
    {
      id: 5,
      project: "SafeStake Protocol",
      type: "Community Report",
      severity: "medium",
      message: "Multiple user reports of website downtime",
      time: "2 hours ago",
    },
  ];

  // Trust score projects data
  const trustScoreProjects = [
    {
      project: "UniswapV3",
      score: 98,
      trend: "stable",
      auditLevel: "high",
    },
    {
      project: "PancakeSwap",
      score: 92,
      trend: "up",
      auditLevel: "high",
    },
    {
      project: "Aave",
      score: 95,
      trend: "up",
      auditLevel: "high",
    },
    {
      project: "SushiSwap",
      score: 87,
      trend: "down",
      auditLevel: "medium",
    },
    {
      project: "BabyDoge Finance",
      score: 26,
      trend: "down",
      auditLevel: "low",
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <DashboardLayout title="Dashboard" description="Overview of your DeFi security status">
      <SearchBar />
      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.title} variants={item} className="col-span-1">
            <Card className="premium-card h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {stat.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.increasing ? (
                    <>
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">{stat.change}</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">{stat.change}</span>
                    </>
                  )}
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Recent Alerts */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="premium-card h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Recent Alerts</CardTitle>
                <Link to="/alerts" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getSeverityColor(alert.severity)}`} />
                          <span className="font-medium">{alert.project}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <div className="text-sm font-medium">{alert.type}</div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="premium-card h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Trust Score Rankings</CardTitle>
                <Link to="/trust-score" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trustScoreProjects.map((project, index) => (
                  <div key={project.project}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{project.project}</span>
                        {project.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                        {project.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            project.score >= 80 ? "bg-green-500/10 text-green-600" :
                            project.score >= 50 ? "bg-yellow-500/10 text-yellow-600" :
                            "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {project.score}
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={project.score}
                      className={`h-1.5 ${
                        project.score >= 80 ? "bg-green-100 [&>div]:bg-green-500" :
                        project.score >= 50 ? "bg-yellow-100 [&>div]:bg-yellow-500" :
                        "bg-red-100 [&>div]:bg-red-500"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Access */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link to="/audit" className="premium-card p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FileSearch className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Audit Contract</h3>
            <p className="text-sm text-muted-foreground">Analyze smart contracts</p>
          </div>
        </Link>
        
        <Link to="/monitor" className="premium-card p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Monitor Liquidity</h3>
            <p className="text-sm text-muted-foreground">Track real-time changes</p>
          </div>
        </Link>
        
        <Link to="/fraud-report" className="premium-card p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Report Fraud</h3>
            <p className="text-sm text-muted-foreground">Submit suspicious activity</p>
          </div>
        </Link>
        
        <Link to="/insurance" className="premium-card p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Get Insurance</h3>
            <p className="text-sm text-muted-foreground">Protect your investments</p>
          </div>
        </Link>
      </motion.div>
    </DashboardLayout>
  );
};

// Helper function to get color based on severity
function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical':
      return 'bg-red-600';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-blue-500';
    default:
      return 'bg-slate-500';
  }
}

export default Dashboard;
