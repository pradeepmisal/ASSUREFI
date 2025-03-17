
import React from 'react';
import RiskCard from './RiskCard.tsx';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const DashboardPreview: React.FC = () => {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Risk Analysis Dashboard</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Monitor all aspects of token risk in one unified interface with real-time updates and actionable insights.
          </p>
        </div>
        
        <div className="relative mb-8 scale-in">
          <div className="absolute -z-10 inset-0 bg-gradient-mesh opacity-30 blur-3xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RiskCard 
              title="Smart Contract Security"
              type="contract"
              score={82}
              insights={[
                "No reentrancy vulnerabilities detected",
                "Integer overflow/underflow protection",
                "Two privileged roles identified (owner, admin)"
              ]}
            />
            
            <RiskCard 
              title="Liquidity Health"
              type="liquidity"
              score={68}
              insights={[
                "Liquidity decreased 5% in last 24 hours",
                "LP tokens partially locked for 6 months",
                "Trading volume consistent with market trends"
              ]}
            />
            
            <RiskCard 
              title="Social Sentiment"
              type="sentiment"
              score={45}
              insights={[
                "Mixed sentiment on Twitter (60% positive)",
                "Recent concerns about team transparency",
                "Active community with growing engagement"
              ]}
            />
          </div>
        </div>
        
        <div className="flex justify-center fade-in">
          <Link 
            to="/dashboard" 
            className="group inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-brand hover:bg-brand hover:text-white font-medium transition-colors"
          >
            View Full Dashboard 
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
