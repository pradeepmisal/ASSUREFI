
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, Shield, BarChart2, MessageSquare } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-4
        ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-2xl font-bold text-brand hover:text-brand-light transition-colors"
        >
          <Shield className="h-8 w-8" />
          <span className="font-display">AssureFi</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground/80 hover:text-brand transition-colors font-medium">Home</Link>
          <div className="relative group">
            <button className="text-foreground/80 hover:text-brand transition-colors font-medium flex items-center">
              Features <ChevronRight className="h-4 w-4 ml-1 group-hover:rotate-90 transition-transform" />
            </button>
            <div className="absolute z-10 left-0 mt-2 w-64 origin-top-left rounded-md shadow-lg overflow-hidden scale-95 opacity-0 invisible group-hover:scale-100 group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="p-2 space-y-1">
                <Link to="/audit" className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Shield className="h-5 w-5 mr-3 text-defi-blue" />
                  <div>
                    <p className="font-medium">Contract Analysis</p>
                    <p className="text-sm text-foreground/60">Detect vulnerabilities in smart contracts</p>
                  </div>
                </Link>
                <Link to="/monitor" className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <BarChart2 className="h-5 w-5 mr-3 text-defi-teal" />
                  <div>
                    <p className="font-medium">Liquidity Monitoring</p>
                    <p className="text-sm text-foreground/60">Track liquidity changes in real-time</p>
                  </div>
                </Link>
                <Link to="/sentiment-analysis" className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <MessageSquare className="h-5 w-5 mr-3 text-defi-purple" />
                  <div>
                    <p className="font-medium">Sentiment Analysis</p>
                    <p className="text-sm text-foreground/60">Gauge social sentiment around tokens</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <Link to="/about" className="text-foreground/80 hover:text-brand transition-colors font-medium">About</Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            to="/audit" 
            className="px-5 py-2 rounded-full bg-brand hover:bg-brand-dark text-white font-medium transition-colors"
          >
            Launch App
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-[72px] bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 fade-in">
          <div className="p-4 space-y-3">
            <Link 
              to="/" 
              className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
            <div className="p-3">
              <p className="font-medium text-foreground/60 text-sm mb-2">Features</p>
              <div className="space-y-2 ml-2">
                <Link 
                  to="/audit" 
                  className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contract Analysis
                </Link>
                <Link 
                  to="/liquidity-monitor" 
                  className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Liquidity Monitoring
                </Link>
                <Link 
                  to="/sentiment-analysis" 
                  className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sentiment Analysis
                </Link>
              </div>
            </div>
            <Link 
              to="/about" 
              className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
            <Link 
              to="/dashboard" 
              className="block text-center p-3 rounded-lg bg-brand hover:bg-brand-dark text-white font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
