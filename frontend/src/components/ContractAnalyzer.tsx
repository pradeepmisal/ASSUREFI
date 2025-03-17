
import React, { useState } from 'react';
import { Search, CopyCheck, AlertTriangle, Shield } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const ContractAnalyzer: React.FC = () => {
  const [contractInput, setContractInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  
  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractInput.trim()) return;
    
    setIsLoading(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsLoading(false);
      setIsAnalyzed(true);
    }, 2000);
  };
  
  const handleClear = () => {
    setContractInput('');
    setIsAnalyzed(false);
  };
  
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-defi-blue/30 bg-defi-blue/5 text-defi-blue mb-4">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Smart Contract Analysis</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Analyze Smart Contract Risk</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Input a contract address or code to receive a comprehensive security assessment and risk score.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto scale-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="p-6 md:p-8">
              <form onSubmit={handleAnalyze}>
                <div className="relative">
                  <input
                    type="text"
                    value={contractInput}
                    onChange={(e) => setContractInput(e.target.value)}
                    placeholder="Enter contract address (0x...) or paste contract code"
                    className="w-full px-4 py-4 pr-36 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-brand focus:ring-brand dark:bg-gray-800 transition-colors"
                    disabled={isLoading}
                  />
                  <div className="absolute right-2 top-2">
                    {contractInput && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="px-3 py-2 mr-1 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        disabled={isLoading}
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!contractInput.trim() || isLoading}
                      className={`px-5 py-2 rounded-lg text-white font-medium transition-colors flex items-center 
                        ${!contractInput.trim() || isLoading ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-brand hover:bg-brand-dark'}
                      `}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size={16} color="#FFFFFF" className="mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Analyze
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            {isAnalyzed && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-6 md:p-8 fade-in">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Analysis Results</h3>
                    <p className="text-foreground/70 text-sm">
                      Contract: {contractInput.substring(0, 8)}...{contractInput.substring(contractInput.length - 8)}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center">
                    <span className="text-sm font-medium mr-2">Risk Score:</span>
                    <div className="px-3 py-1 rounded-full bg-risk-low/20 text-risk-low font-medium">
                      Low Risk (82/100)
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                        <CopyCheck className="h-5 w-5 text-risk-low" />
                      </div>
                      <div>
                        <h4 className="font-medium">Passed Checks</h4>
                        <p className="text-sm text-foreground/70">8 security validations passed</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-risk-low/20 flex items-center justify-center mr-2">
                          <CopyCheck className="h-3 w-3 text-risk-low" />
                        </div>
                        <span>No reentrancy vulnerabilities detected</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-risk-low/20 flex items-center justify-center mr-2">
                          <CopyCheck className="h-3 w-3 text-risk-low" />
                        </div>
                        <span>Integer overflow/underflow protection</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-risk-low/20 flex items-center justify-center mr-2">
                          <CopyCheck className="h-3 w-3 text-risk-low" />
                        </div>
                        <span>No timestamp dependency issues</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-risk-low/20 flex items-center justify-center mr-2">
                          <CopyCheck className="h-3 w-3 text-risk-low" />
                        </div>
                        <span>No front-running vulnerabilities</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                        <AlertTriangle className="h-5 w-5 text-risk-medium" />
                      </div>
                      <div>
                        <h4 className="font-medium">Issues Found</h4>
                        <p className="text-sm text-foreground/70">2 potential concerns identified</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="w-4 h-4 rounded-full bg-risk-medium/20 flex items-center justify-center mr-2 mt-0.5">
                          <AlertTriangle className="h-3 w-3 text-risk-medium" />
                        </div>
                        <span>External contract dependencies may introduce risk</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-4 h-4 rounded-full bg-risk-medium/20 flex items-center justify-center mr-2 mt-0.5">
                          <AlertTriangle className="h-3 w-3 text-risk-medium" />
                        </div>
                        <span>Centralized control: 2 privileged roles identified</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Detailed Analysis</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
                      {`// Analysis: Token contract appears safe overall with good security practices
// Warning: Owner can adjust trading fees (centralized control)
// Warning: External price oracle dependency may introduce risk
// Recommendation: Implement time-lock for owner functions
// Recommendation: Add additional validation for external calls`}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractAnalyzer;
