
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiService } from "@/services/api";
import { Camera, Preset, TextOverlay, HotButton } from "@/types";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const CameraControl = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [hotButtons, setHotButtons] = useState<HotButton[]>([]);
  const [activeCamera, setActiveCamera] = useState<number | null>(null);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [loading, setLoading] = useState({
    cameras: true,
    presets: true,
    textOverlays: true,
    hotButtons: true,
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load cameras
        const camerasData = await ApiService.getCameras();
        setCameras(camerasData);
        setLoading(prev => ({ ...prev, cameras: false }));
        
        // If we have cameras, set the first one as active
        if (camerasData.length > 0) {
          setActiveCamera(camerasData[0].id);
        }

        // Load presets
        const presetsData = await ApiService.getPresets();
        setPresets(presetsData);
        setLoading(prev => ({ ...prev, presets: false }));

        // Load text overlays
        const textData = await ApiService.getTextOverlays();
        setTextOverlays(textData);
        setLoading(prev => ({ ...prev, textOverlays: false }));

        // Load hot buttons
        const hotButtonsData = await ApiService.getHotButtons();
        setHotButtons(hotButtonsData);
        setLoading(prev => ({ ...prev, hotButtons: false }));
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados iniciais",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, []);

  const handleCameraSelect = async (cameraId: number) => {
    try {
      // Find the camera to get its name
      const camera = cameras.find(c => c.id === cameraId);
      if (!camera) return;

      // Get the settings to find the hotkey
      const settings = await ApiService.getAppSettings();
      const hotkey = settings.default_hotkeys[camera.name];
      
      if (hotkey) {
        // Send the hotkey to Xsplit
        await ApiService.sendHotkey(`Ctrl+Shift+${hotkey}`);
        setActiveCamera(cameraId);
        toast({
          title: `Câmera ${camera.name} selecionada`,
          description: `Hotkey enviada: Ctrl+Shift+${hotkey}`,
        });
      }
    } catch (error) {
      console.error("Error selecting camera:", error);
      toast({
        title: "Erro",
        description: "Não foi possível selecionar a câmera",
        variant: "destructive",
      });
    }
  };

  const handlePresetSelect = async (presetId: number) => {
    try {
      // Find the preset
      const preset = presets.find(p => p.id === presetId);
      if (!preset || !activeCamera) return;

      // Move the camera to the preset
      await ApiService.moveCameraToPreset(preset.camera_id, presetId);
      setActivePreset(presetId);
      toast({
        title: "Preset ativado",
        description: `Câmera movida para ${preset.name}`,
      });
    } catch (error) {
      console.error("Error selecting preset:", error);
      toast({
        title: "Erro",
        description: "Não foi possível mover a câmera para o preset",
        variant: "destructive",
      });
    }
  };

  const handleTextOverlay = async (textId: number) => {
    try {
      // Find the text overlay
      const textOverlay = textOverlays.find(t => t.id === textId);
      if (!textOverlay) return;

      // Get the settings to find the hotkey
      const settings = await ApiService.getAppSettings();
      // This is simplified - in a real implementation you'd have a mapping between text IDs and hotkey names
      const hotkey = Object.values(settings.text_hotkeys)[textId - 1]; // Simple mapping for demo
      
      if (hotkey) {
        // Send the hotkey to Xsplit
        await ApiService.sendHotkey(`Ctrl+Shift+${hotkey}`);
        toast({
          title: "Texto exibido",
          description: textOverlay.text,
        });
      }
    } catch (error) {
      console.error("Error showing text overlay:", error);
      toast({
        title: "Erro",
        description: "Não foi possível exibir o texto",
        variant: "destructive",
      });
    }
  };

  const handleHotButton = async (button: HotButton) => {
    try {
      if (button.action_type === 'hotkey') {
        // Send the hotkey
        await ApiService.sendHotkey(button.action_value);
        toast({
          title: "Hotkey enviada",
          description: button.label,
        });
      } else if (button.action_type === 'preset') {
        // Activate the preset
        const presetId = parseInt(button.action_value);
        await handlePresetSelect(presetId);
      }
    } catch (error) {
      console.error("Error handling hot button:", error);
      toast({
        title: "Erro",
        description: `Não foi possível executar a ação ${button.label}`,
        variant: "destructive",
      });
    }
  };

  const handleGlobalTransition = async () => {
    try {
      await ApiService.triggerGlobalTransition();
      toast({
        title: "Transição global iniciada",
      });
    } catch (error) {
      console.error("Error triggering global transition:", error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a transição global",
        variant: "destructive",
      });
    }
  };

  // Camera selection buttons
  const renderCameraButtons = () => {
    if (loading.cameras) {
      return (
        <div className="flex justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3 mb-4">
        {cameras.map(camera => (
          <Button
            key={camera.id}
            variant={activeCamera === camera.id ? "default" : "outline"}
            className="h-16 text-lg"
            onClick={() => handleCameraSelect(camera.id)}
          >
            {camera.name}
          </Button>
        ))}
        <Button 
          variant="destructive" 
          className="col-span-2 h-12"
          onClick={handleGlobalTransition}
        >
          Transição Global
        </Button>
      </div>
    );
  };

  // Preset buttons for the active camera
  const renderPresetButtons = () => {
    if (loading.presets) {
      return (
        <div className="flex justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    // Filter presets for the active camera
    const cameraPresets = presets.filter(preset => 
      activeCamera !== null && preset.camera_id === activeCamera
    );

    if (cameraPresets.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          {activeCamera === null 
            ? "Selecione uma câmera para ver os presets disponíveis"
            : "Nenhum preset disponível para esta câmera"}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {cameraPresets.map(preset => (
          <Button
            key={preset.id}
            variant={activePreset === preset.id ? "default" : "secondary"}
            size="sm"
            onClick={() => handlePresetSelect(preset.id)}
          >
            {preset.name}
          </Button>
        ))}
      </div>
    );
  };

  // Text overlay buttons
  const renderTextButtons = () => {
    if (loading.textOverlays) {
      return (
        <div className="flex justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (textOverlays.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          Nenhum texto configurado
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-2">
        {textOverlays.map(text => (
          <Button
            key={text.id}
            variant="secondary"
            size="sm"
            onClick={() => handleTextOverlay(text.id)}
          >
            {text.text}
          </Button>
        ))}
      </div>
    );
  };

  // Hot buttons
  const renderHotButtons = () => {
    if (loading.hotButtons) {
      return (
        <div className="flex justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (hotButtons.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          Nenhum botão personalizado configurado
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {hotButtons.map(button => (
          <Button
            key={button.id}
            variant="outline"
            size="sm"
            onClick={() => handleHotButton(button)}
          >
            {button.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full bg-card text-card-foreground">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Controle de Câmeras</h2>
        
        {/* Camera Selection */}
        <div className="control-section">
          <h3 className="control-section-title">Câmeras</h3>
          {renderCameraButtons()}
        </div>
        
        {/* Tabs for different controls */}
        <Tabs defaultValue="presets">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="texts">Textos</TabsTrigger>
            <TabsTrigger value="hotbuttons">Ações Rápidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="control-section">
            <h3 className="control-section-title">Presets da Câmera</h3>
            {renderPresetButtons()}
          </TabsContent>
          
          <TabsContent value="texts" className="control-section">
            <h3 className="control-section-title">Textos</h3>
            {renderTextButtons()}
          </TabsContent>
          
          <TabsContent value="hotbuttons" className="control-section">
            <h3 className="control-section-title">Ações Rápidas</h3>
            {renderHotButtons()}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
