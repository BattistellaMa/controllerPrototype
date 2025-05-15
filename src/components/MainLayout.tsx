
import React, { useEffect, useState } from "react";
import { ApiService } from "@/services/api";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Get the settings to determine the window width
        const settings = await ApiService.getAppSettings();
        const widthPercentage = settings.layout.width_percentage;
        
        // Calculate width based on screen size
        const calculatedWidth = (window.innerWidth * widthPercentage) / 100;
        setWindowWidth(calculatedWidth);
      } catch (error) {
        console.error("Error loading layout settings:", error);
        // Default to 30% if settings can't be loaded
        setWindowWidth((window.innerWidth * 30) / 100);
      }
    };
    
    loadSettings();
  }, []);

  return (
    <div 
      className="min-h-screen flex justify-end"
      style={{ 
        width: "100vw", 
        height: "100vh", 
        overflow: "hidden",
      }}
    >
      <div 
        style={{ 
          width: windowWidth > 0 ? `${windowWidth}px` : "30%",
          height: "100%",
          overflowY: "auto"
        }}
        className="bg-background border-l border-border"
      >
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
