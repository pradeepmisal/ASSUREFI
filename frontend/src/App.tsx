
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Audit from "./pages/Audit";
import Monitor from "./pages/Monitor";
import TrustScore from "./pages/TrustScore";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import RiskAnalysis from "./pages/RiskAnalysis";
import WalletAnalysis from "./pages/WalletAnalysis";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/audit" element={<Audit />} />
          <Route path="/monitor" element={<Monitor />} />
          {/* <Route path="/trust-score" element={<TrustScore />} /> */}
          <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
          <Route path="/risk-analysis" element={<RiskAnalysis />} />
          <Route path="/wallet-analysis" element={<WalletAnalysis />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Profile />} /> {/* Using Profile as a placeholder for Settings */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
