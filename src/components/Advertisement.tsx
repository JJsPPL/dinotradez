
import React from 'react';
import { Info, ExternalLink } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

type AdSize = 'small' | 'medium' | 'large';

interface AdvertisementProps {
  size: AdSize;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  logoUrl?: string;
  companyName?: string;
  gradient?: string;
}

const Advertisement = ({ 
  size, 
  title, 
  content, 
  imageUrl, 
  linkUrl, 
  logoUrl, 
  companyName,
  gradient = "from-gray-900 to-black" 
}: AdvertisementProps) => {
  // Map the size to tailwind classes to maintain the same dimensions
  const sizeClasses = {
    small: 'max-w-[300px] min-h-[100px]',
    medium: 'max-w-[500px] min-h-[150px]',
    large: 'max-w-[800px] min-h-[200px]',
  };
  
  return (
    <Card className={`relative backdrop-blur-md bg-gradient-to-br ${gradient} border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 ${sizeClasses[size]}`}>
      <div className="absolute top-2 right-2 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-black/60 text-gray-400 text-xs px-1.5 py-0.5 rounded flex items-center">
              <span className="mr-1">Advertisement</span>
              <Info className="h-3 w-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-black/95 border border-gray-800 text-white">
            <p className="text-xs">Sponsored content</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <CardHeader className="pb-2 pt-4">
        {logoUrl && companyName && (
          <div className="flex items-center mb-2">
            <img 
              src={logoUrl} 
              alt={companyName} 
              className="h-6 w-6 mr-2 rounded-sm object-contain" 
            />
            <span className="text-sm font-medium text-gray-300">{companyName}</span>
          </div>
        )}
        <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-gray-300">{content}</p>
        
        {imageUrl && (
          <div className="mt-3 mb-2 overflow-hidden rounded-md">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" 
            />
          </div>
        )}
      </CardContent>
      
      {linkUrl && (
        <CardFooter className="pt-0">
          <Button 
            variant="outline" 
            className="px-4 py-2 text-primary border border-primary/40 hover:bg-primary/10 hover:text-primary/90 text-sm flex items-center gap-1 w-full justify-center"
            asChild
          >
            <a 
              href={linkUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              Learn More <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Advertisement;
