
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  LayoutDashboard, 
  FileSearch, 
  Activity, 
  BarChart3, 
  AlertTriangle, 
  User, 
  Settings, 
  Menu, 
  X,
  Bell,
  MessageSquare,
  TrendingDown,
  Wallet,
  BellRing
} from "lucide-react";
import SearchBar from "./SearchBar";
import { AIAnalysisDropdown } from "./AIAnalysisDropdown";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  description 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const navigationItems = [
    // { 
    //   name: "Dashboard", 
    //   href: "/dashboard", 
    //   icon: <LayoutDashboard className="h-5 w-5" /> 
    // },
    { 
      name: "Smart Contract Audit", 
      href: "/audit", 
      icon: <FileSearch className="h-5 w-5" /> 
    },
    { 
      name: "Liquidity Monitor", 
      href: "/monitor", 
      icon: <Activity className="h-5 w-5" /> 
    },
    // { 
    //   name: "Trust Score", 
    //   href: "/trust-score", 
    //   icon: <BarChart3 className="h-5 w-5" /> 
    // },
    { 
      name: "Sentiment Analysis", 
      href: "/sentiment-analysis", 
      icon: <MessageSquare className="h-5 w-5" /> 
    },
    { 
      name: "Risk Analysis", 
      href: "/risk-analysis", 
      icon: <TrendingDown className="h-5 w-5" /> 
    },
    {
      name: "Wallet Analysis",
      href: "/wallet-analysis",
      icon: <Wallet className="h-5 w-5" />
    }
  ];

  const bottomNavItems = [
    { 
      name: "Settings", 
      href: "/settings", 
      icon: <Settings className="h-5 w-5" /> 
    },
    { 
      name: "Profile", 
      href: "/profile", 
      icon: <User className="h-5 w-5" /> 
    },
  ];

  const connectWallet = () => {
    // In a real implementation, this would connect to MetaMask or other wallet providers
    setTimeout(() => {
      setIsWalletConnected(true);
      toast({
        title: "Wallet Connected",
        description: "0xDe34...8b24",
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="h-10 w-10 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 overflow-y-auto">
              {/* Render sidebar content */}
              {renderSidebarContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto fixed h-full">
        {renderSidebarContent()}
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 md:h-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
          <div>
            <h1 className="font-display text-xl md:text-2xl font-medium">{title}</h1>
            {description && <p className="text-muted-foreground text-sm md:text-base hidden md:block">{description}</p>}
          </div>
          <div className="flex items-center gap-3">
            <a href="https://web.telegram.org/k/#@Asuurfi_Tech_Avinya_bot" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                <span>Live Alerts</span>
              </Button>
            </a>
            <AIAnalysisDropdown />
            <Button 
              variant={isWalletConnected ? "default" : "outline"}
              size="sm"
              className="hidden md:flex items-center gap-2"
              onClick={connectWallet}
            >
              <Wallet className="h-4 w-4" />
              <span>{isWalletConnected ? "0xDe34...8b24" : "Connect Wallet"}</span>
            </Button>
            <button className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary"></span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/wallet-analysis">
                  <DropdownMenuItem>
                    <Wallet className="h-4 w-4 mr-2" />
                    <span>Wallet Analysis</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/settings">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Search Bar */}
        {/* <SearchBar /> */}

        {/* Mobile Quick Actions */}
        <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800">
          <Button 
            variant={isWalletConnected ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
            onClick={connectWallet}
          >
            <Wallet className="h-4 w-4" />
            <span>{isWalletConnected ? "0xDe3...8b24" : "Connect"}</span>
          </Button>
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              <span>Alerts</span>
            </Button>
          </a>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );

  function renderSidebarContent() {
    return (
      <>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-medium text-xl">AssureFi</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="space-y-1">
            {bottomNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  }
};

export default DashboardLayout;
