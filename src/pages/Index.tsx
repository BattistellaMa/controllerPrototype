
import React from "react";
import { CameraControl } from "@/components/CameraControl";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">PTZ Control System</h1>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/settings")}
          title="Configurações"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>
      <CameraControl />
    </MainLayout>
  );
};

export default Index;
