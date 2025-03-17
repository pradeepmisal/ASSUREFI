
import React from 'react';
import { Shield, BarChart2, MessageSquare, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';

interface RiskCardProps {
  title: string;
  type: 'contract' | 'liquidity' | 'sentiment';
  score: number; // 0-100
  insights: string[];
  className?: string;
}

const RiskCard: React.FC<RiskCardProps> = ({ title, type, score, insights, className = '' }) => {
  // Determine risk level based on score
  const getRiskLevel = (score: number): RiskLevel => {
    if (score >= 75) return 'low';
    if (score >= 40) return 'medium';
    if (score > 0) return 'high';
    return 'unknown';
  };
  
  const riskLevel = getRiskLevel(score);
  
  // Get appropriate icon based on type
  const getIcon = () => {
    switch (type) {
      case 'contract':
        return <Shield className="h-5 w-5 text-defi-blue" />;
      case 'liquidity':
        return <BarChart2 className="h-5 w-5 text-defi-teal" />;
      case 'sentiment':
        return <MessageSquare className="h-5 w-5 text-defi-purple" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };
  
  // Get background color and text color based on risk level
  const getRiskColors = () => {
    switch (riskLevel) {
      case 'low':
        return {
          bg: 'bg-risk-low/10',
          text: 'text-risk-low',
          iconBg: 'bg-risk-low/20',
          icon: <CheckCircle className="h-4 w-4 text-risk-low" />
        };
      case 'medium':
        return {
          bg: 'bg-risk-medium/10',
          text: 'text-risk-medium',
          iconBg: 'bg-risk-medium/20',
          icon: <AlertTriangle className="h-4 w-4 text-risk-medium" />
        };
      case 'high':
        return {
          bg: 'bg-risk-high/10',
          text: 'text-risk-high',
          iconBg: 'bg-risk-high/20',
          icon: <AlertCircle className="h-4 w-4 text-risk-high" />
        };
      default:
        return {
          bg: 'bg-risk-unknown/10',
          text: 'text-risk-unknown',
          iconBg: 'bg-risk-unknown/20',
          icon: <AlertCircle className="h-4 w-4 text-risk-unknown" />
        };
    }
  };
  
  const riskColors = getRiskColors();
  
  // Get risk label
  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'low': return 'Low Risk';
      case 'medium': return 'Medium Risk';
      case 'high': return 'High Risk';
      default: return 'Unknown Risk';
    }
  };
  
  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover-lift ${className}`}>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            type === 'contract' ? 'bg-defi-blue/10' :
            type === 'liquidity' ? 'bg-defi-teal/10' :
            'bg-defi-purple/10'
          }`}>
            {getIcon()}
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className={`px-3 py-1 rounded-full ${riskColors.bg} ${riskColors.text} text-sm font-medium flex items-center`}>
            <div className={`w-4 h-4 rounded-full ${riskColors.iconBg} flex items-center justify-center mr-1.5`}>
              {riskColors.icon}
            </div>
            {getRiskLabel()}
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">{score}</span>
            <span className="text-foreground/60 text-sm">/100</span>
          </div>
        </div>
        
        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full relative overflow-hidden mb-6">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full ${
              riskLevel === 'low' ? 'bg-risk-low' :
              riskLevel === 'medium' ? 'bg-risk-medium' :
              riskLevel === 'high' ? 'bg-risk-high' :
              'bg-risk-unknown'
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground/80 mb-2">Key Insights:</h4>
          <ul className="space-y-1.5">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <div className={`w-4 h-4 rounded-full ${riskColors.iconBg} flex items-center justify-center mr-2 mt-0.5 shrink-0`}>
                  {riskColors.icon}
                </div>
                <span className="text-sm">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiskCard;
