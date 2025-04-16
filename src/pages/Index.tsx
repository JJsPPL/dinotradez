
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import StockTicker from '@/components/StockTicker';
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
      <StockTicker />
      <main className="flex-grow">
        <Hero />
        
        {/* First Advertisement - Small size after Hero */}
        <div className="container mx-auto px-4 md:px-6">
          <Advertisement 
            size="small"
            title="Premium Trading Course"
            content="Master the markets with our comprehensive trading strategy. Limited time offer!"
            linkUrl="#trading-course"
            logoUrl="https://cdn.pixabay.com/photo/2018/05/19/00/53/online-3412473_1280.png"
            companyName="Trading Academy"
            gradient="from-blue-900 to-black"
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
            logoUrl="https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg"
            companyName="Market Insights"
            gradient="from-purple-900 to-black"
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
            logoUrl="/lovable-uploads/9bd8009a-db40-4207-a830-4f76a1843661.png"
            companyName="DinoTradez"
            gradient="from-green-900 to-black"
          />
        </div>
        
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
