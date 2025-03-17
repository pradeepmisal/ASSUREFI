
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ContractAnalyzer from '../components/ContractAnalyzer.tsx';
import DashboardPreview from '../components/DashboardPreview.tsx';
import Footer from '../components/Footer';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ContractAnalyzer />
        <DashboardPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
