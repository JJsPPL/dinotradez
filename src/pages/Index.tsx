
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Watchlist from '@/components/Watchlist';
import LottoWatchlist from '@/components/LottoWatchlist';
import StockSearch from '@/components/StockSearch';
import Analysis from '@/components/Analysis';
import About from '@/components/About';
import Footer from '@/components/Footer';
import Advertisement from '@/components/Advertisement';
import { toast } from 'sonner';

const Index = () => {
  useEffect(() => {
    console.log("Index component mounted");
    
    // Show a welcome toast
    toast.success("Welcome to DinoTradez!", {
      description: "Your modern stock trading dashboard",
    });
    
    // Log that the app has loaded successfully
    console.log("DinoTradez app loaded successfully!");
    console.log("Version: " + (import.meta.env.VITE_APP_VERSION || "1.0.0"));
    console.log("Build date: " + new Date().toISOString());
  }, []);

  console.log("Rendering Index component");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* First Advertisement - Small size after Hero */}
        <div className="container mx-auto px-4 md:px-6">
          <Advertisement 
            size="small"
            title="Premium Trading Course"
            content="Master the markets with our comprehensive trading strategy. Limited time offer!"
            linkUrl="#trading-course"
          />
        </div>
        
        <Watchlist />
        <LottoWatchlist />
        <StockSearch />
        
        {/* Second Advertisement - Medium size before Analysis */}
        <div className="container mx-auto px-4 md:px-6 flex justify-end">
          <Advertisement 
            size="medium"
            title="Trading Summit 2023"
            content="Join top traders and market analysts for our annual virtual conference. Early bird registration now open!"
            imageUrl="/lovable-uploads/6afa6207-d988-4735-9513-7565f06b88d9.png"
            linkUrl="#trading-summit"
          />
        </div>
        
        <Analysis />
        
        {/* Third Advertisement - Large size before About */}
        <div className="container mx-auto px-4 md:px-6">
          <Advertisement 
            size="large"
            title="DinoTradez Pro Subscription"
            content="Get access to our premium features including real-time dark pool data, options flow analysis, and institutional-grade charting tools."
            linkUrl="#subscription"
          />
        </div>
        
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
