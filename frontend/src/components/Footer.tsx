
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Heart, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-brand mb-4">
              <Shield className="h-7 w-7" />
              <span className="font-display">AssureFi</span>
            </Link>
            <p className="text-foreground/70 mb-6 max-w-md">
              AssureFi combines smart contract analysis, liquidity monitoring, and social media sentiment to provide the most comprehensive risk assessment tool in DeFi.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-foreground/70 hover:bg-brand hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-foreground/70 hover:bg-brand hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contract-analyzer" className="text-foreground/70 hover:text-brand transition-colors">
                  Contract Analysis
                </Link>
              </li>
              <li>
                <Link to="/monitor" className="text-foreground/70 hover:text-brand transition-colors">
                  Liquidity Monitoring
                </Link>
              </li>
              <li>
                <Link to="/sentiment-analysis" className="text-foreground/70 hover:text-brand transition-colors">
                  Sentiment Analysis
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-foreground/70 hover:text-brand transition-colors">
                  Risk Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-foreground/70 hover:text-brand transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-foreground/70 hover:text-brand transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-foreground/70 hover:text-brand transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-foreground/70 hover:text-brand transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-foreground/70 hover:text-brand transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-foreground/70 hover:text-brand transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-foreground/70 hover:text-brand transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AssureFi. All rights reserved.
          </p>
          <p className="text-foreground/60 text-sm flex items-center">
            Made with <Heart className="h-4 w-4 text-risk-high mx-1" /> for the DeFi community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
