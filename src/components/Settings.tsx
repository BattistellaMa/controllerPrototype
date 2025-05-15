
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ApiService } from "@/services/api";
import { Camera, Preset, TextOverlay, HotButton, AppSettings } from "@/types";

export const Settings = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [hotButtons, setHotButtons] = useState<HotButton[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  
  // New item states
  const [newCamera, setNewCamera] = useState<Partial<Camera>>({
    name: "",
    ip: "",
    port: 80,
    username: "admin",
    password: "",
  });
  
  const [newPreset, setNewPreset] = useState<Partial<Preset>>({
    name: "",
    camera_id: null,
  });
  
  const [newText, setNewText] = useState<Partial<TextOverlay>>({
    text: "",
    camera_id: null,
  });
  
  const [newHotButton, setNewHotButton] = useState<Partial<HotButton>>({
    label: "",
    action_type: "hotkey",
    action_value: "",
  });

  const handleLogin = async () => {
    setLoading(true);
    try {
      const isValid = await ApiService.checkPassword(password);
      if (isValid) {
        setIsAuthenticated(true);
        loadData();
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Senha incorreta",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Erro",
        description: "Não foi possível autenticar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all the necessary data
      const [camerasData, presetsData, textData, hotButtonsData, settingsData] = await Promise.all([
        ApiService.getCameras(),
        ApiService.getPresets(),
        ApiService.getTextOverlays(),
        ApiService.getHotButtons(),
        ApiService.getAppSettings(),
      ]);

      setCameras(camerasData);
      setPresets(presetsData);
      setTextOverlays(textData);
      setHotButtons(hotButtonsData);
      setSettings(settingsData);

      // Set default selected camera if available
      if (camerasData.length > 0) {
        setSelectedCamera(camerasData[0].id);
        setNewPreset(prev => ({ ...prev, camera_id: camerasData[0].id }));
        setNewText(prev => ({ ...prev, camera_id: camerasData[0].id }));
      }
    } catch (error) {
      console.error("Error loading settings data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados das configurações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock save functions (in a real app these would call the API)
  const handleSaveCamera = () => {
    // Validate form
    if (!newCamera.name || !newCamera.ip) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    const mockId = cameras.length + 1;
    const camera = { ...newCamera, id: mockId } as Camera;
    setCameras([...cameras, camera]);
    
    setNewCamera({
      name: "",
      ip: "",
      port: 80,
      username: "admin",
      password: "",
    });
    
    toast({
      title: "Câmera adicionada",
      description: `${camera.name} foi adicionada com sucesso`,
    });
  };

  const handleSavePreset = () => {
    // Validate form
    if (!newPreset.name || !newPreset.camera_id) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    const mockId = presets.length + 1;
    const preset = { 
      ...newPreset, 
      id: mockId,
      position: `mock_position_${mockId}`
    } as Preset;
    setPresets([...presets, preset]);
    
    setNewPreset({
      name: "",
      camera_id: selectedCamera,
    });
    
    toast({
      title: "Preset adicionado",
      description: `${preset.name} foi adicionado com sucesso`,
    });
  };

  const handleSaveText = () => {
    // Validate form
    if (!newText.text || !newText.camera_id) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    const mockId = textOverlays.length + 1;
    const text = { ...newText, id: mockId } as TextOverlay;
    setTextOverlays([...textOverlays, text]);
    
    setNewText({
      text: "",
      camera_id: selectedCamera,
    });
    
    toast({
      title: "Texto adicionado",
      description: `Texto foi adicionado com sucesso`,
    });
  };

  const handleSaveHotButton = () => {
    // Validate form
    if (!newHotButton.label || !newHotButton.action_value) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    const mockId = hotButtons.length + 1;
    const hotButton = { ...newHotButton, id: mockId } as HotButton;
    setHotButtons([...hotButtons, hotButton]);
    
    setNewHotButton({
      label: "",
      action_type: "hotkey",
      action_value: "",
    });
    
    toast({
      title: "Botão adicionado",
      description: `${hotButton.label} foi adicionado com sucesso`,
    });
  };

  const renderAuthentication = () => (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Autenticação</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha de administração"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate("/")}
            >
              Voltar ao Painel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
      <Card className="w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Voltar ao Painel
          </Button>
        </div>

        <Tabs defaultValue="cameras">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="cameras">Câmeras</TabsTrigger>
            <TabsTrigger value="presets">Cenas</TabsTrigger>
            <TabsTrigger value="texts">Textos</TabsTrigger>
            <TabsTrigger value="hotbuttons">Hot Botões</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Configurações Gerais</h3>
            
            {settings && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width_percentage">Largura da Janela (%)</Label>
                    <Input
                      id="width_percentage"
                      type="number"
                      min="10"
                      max="50"
                      defaultValue={settings.layout.width_percentage}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="global_transition">Atraso da Transição Global (ms)</Label>
                    <Input
                      id="global_transition"
                      type="number"
                      min="500"
                      max="5000"
                      step="100"
                      defaultValue={settings.delays.global_transition}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="global_transition_hotkey">Hotkey da Transição Global</Label>
                  <Input
                    id="global_transition_hotkey"
                    type="text"
                    defaultValue={settings.global_transition_hotkey}
                    readOnly
                  />
                </div>

                <Button className="mt-4">
                  Salvar Configurações
                </Button>
              </>
            )}
          </TabsContent>

          {/* Cameras Tab */}
          <TabsContent value="cameras" className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Configuração de Câmeras</h3>
            
            {/* Add Camera Form */}
            <div className="bg-muted/50 p-4 rounded-md space-y-4">
              <h4 className="font-medium">Adicionar Nova Câmera</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="camera_name">Nome da Câmera</Label>
                  <Input
                    id="camera_name"
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                    placeholder="ex: Câmera Principal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camera_ip">Endereço IP</Label>
                  <Input
                    id="camera_ip"
                    value={newCamera.ip}
                    onChange={(e) => setNewCamera({...newCamera, ip: e.target.value})}
                    placeholder="ex: 192.168.1.100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="camera_port">Porta</Label>
                  <Input
                    id="camera_port"
                    type="number"
                    value={newCamera.port}
                    onChange={(e) => setNewCamera({...newCamera, port: parseInt(e.target.value)})}
                    placeholder="ex: 80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camera_username">Usuário</Label>
                  <Input
                    id="camera_username"
                    value={newCamera.username}
                    onChange={(e) => setNewCamera({...newCamera, username: e.target.value})}
                    placeholder="ex: admin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camera_password">Senha</Label>
                  <Input
                    id="camera_password"
                    type="password"
                    value={newCamera.password}
                    onChange={(e) => setNewCamera({...newCamera, password: e.target.value})}
                    placeholder="Digite a senha"
                  />
                </div>
              </div>
              <Button onClick={handleSaveCamera}>
                Adicionar Câmera
              </Button>
            </div>

            {/* Camera List */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Câmeras Configuradas</h4>
              <div className="border rounded-md">
                {cameras.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhuma câmera configurada
                  </div>
                ) : (
                  <div className="divide-y">
                    {cameras.map((camera) => (
                      <div key={camera.id} className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{camera.name}</p>
                          <p className="text-sm text-muted-foreground">{camera.ip}:{camera.port}</p>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="destructive" size="sm">Remover</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Presets Tab */}
          <TabsContent value="presets" className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Configuração de Cenas</h3>
            
            {/* Camera Selector */}
            <div className="space-y-2">
              <Label htmlFor="preset_camera">Selecione uma Câmera</Label>
              <Select 
                value={selectedCamera?.toString() || ""} 
                onValueChange={(value) => {
                  const camId = parseInt(value);
                  setSelectedCamera(camId);
                  setNewPreset({...newPreset, camera_id: camId});
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma câmera" />
                </SelectTrigger>
                <SelectContent>
                  {cameras.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id.toString()}>
                      {camera.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Add Preset Form */}
            {selectedCamera && (
              <div className="bg-muted/50 p-4 rounded-md space-y-4 mt-4">
                <h4 className="font-medium">Adicionar Novo Preset</h4>
                <div className="space-y-2">
                  <Label htmlFor="preset_name">Nome do Preset</Label>
                  <Input
                    id="preset_name"
                    value={newPreset.name}
                    onChange={(e) => setNewPreset({...newPreset, name: e.target.value})}
                    placeholder="ex: Plano Geral"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    Posicionar Câmera
                  </Button>
                  <Button onClick={handleSavePreset}>
                    Salvar Preset
                  </Button>
                </div>
              </div>
            )}

            {/* Preset List */}
            {selectedCamera && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Presets Configurados</h4>
                <div className="border rounded-md">
                  {presets.filter(p => p.camera_id === selectedCamera).length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Nenhum preset configurado para esta câmera
                    </div>
                  ) : (
                    <div className="divide-y">
                      {presets
                        .filter(preset => preset.camera_id === selectedCamera)
                        .map((preset) => (
                          <div key={preset.id} className="p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{preset.name}</p>
                            </div>
                            <div className="space-x-2">
                              <Button variant="outline" size="sm">Editar</Button>
                              <Button variant="destructive" size="sm">Remover</Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Texts Tab */}
          <TabsContent value="texts" className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Configuração de Textos</h3>
            
            {/* Add Text Form */}
            <div className="bg-muted/50 p-4 rounded-md space-y-4">
              <h4 className="font-medium">Adicionar Novo Texto</h4>
              <div className="space-y-2">
                <Label htmlFor="text_content">Conteúdo do Texto</Label>
                <Input
                  id="text_content"
                  value={newText.text}
                  onChange={(e) => setNewText({...newText, text: e.target.value})}
                  placeholder="Digite o texto a ser exibido"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text_camera">Câmera Associada</Label>
                <Select 
                  value={newText.camera_id?.toString() || ""} 
                  onValueChange={(value) => setNewText({...newText, camera_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma câmera" />
                  </SelectTrigger>
                  <SelectContent>
                    {cameras.map((camera) => (
                      <SelectItem key={camera.id} value={camera.id.toString()}>
                        {camera.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveText}>
                Adicionar Texto
              </Button>
            </div>

            {/* Text List */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Textos Configurados</h4>
              <div className="border rounded-md">
                {textOverlays.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhum texto configurado
                  </div>
                ) : (
                  <div className="divide-y">
                    {textOverlays.map((text) => {
                      const camera = cameras.find(c => c.id === text.camera_id);
                      return (
                        <div key={text.id} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{text.text}</p>
                            <p className="text-sm text-muted-foreground">
                              Câmera: {camera?.name || "Desconhecida"}
                            </p>
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">Editar</Button>
                            <Button variant="destructive" size="sm">Remover</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Hot Buttons Tab */}
          <TabsContent value="hotbuttons" className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Configuração de Hot Botões</h3>
            
            {/* Add Button Form */}
            <div className="bg-muted/50 p-4 rounded-md space-y-4">
              <h4 className="font-medium">Adicionar Novo Botão</h4>
              <div className="space-y-2">
                <Label htmlFor="hotbutton_label">Rótulo do Botão</Label>
                <Input
                  id="hotbutton_label"
                  value={newHotButton.label}
                  onChange={(e) => setNewHotButton({...newHotButton, label: e.target.value})}
                  placeholder="ex: Câmera Principal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotbutton_type">Tipo de Ação</Label>
                <Select 
                  value={newHotButton.action_type} 
                  onValueChange={(value: 'hotkey' | 'preset') => setNewHotButton({...newHotButton, action_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotkey">Hotkey</SelectItem>
                    <SelectItem value="preset">Preset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotbutton_value">
                  {newHotButton.action_type === "hotkey" ? "Hotkey" : "ID do Preset"}
                </Label>
                {newHotButton.action_type === "preset" ? (
                  <Select 
                    value={newHotButton.action_value || ""} 
                    onValueChange={(value) => setNewHotButton({...newHotButton, action_value: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {presets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id.toString()}>
                          {preset.name} ({cameras.find(c => c.id === preset.camera_id)?.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="hotbutton_value"
                    value={newHotButton.action_value}
                    onChange={(e) => setNewHotButton({...newHotButton, action_value: e.target.value})}
                    placeholder="ex: Ctrl+Shift+A"
                  />
                )}
              </div>
              <Button onClick={handleSaveHotButton}>
                Adicionar Botão
              </Button>
            </div>

            {/* Hot Button List */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Botões Configurados</h4>
              <div className="border rounded-md">
                {hotButtons.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhum botão configurado
                  </div>
                ) : (
                  <div className="divide-y">
                    {hotButtons.map((button) => {
                      let actionDisplay = button.action_value;
                      if (button.action_type === "preset") {
                        const preset = presets.find(p => p.id === parseInt(button.action_value));
                        if (preset) {
                          actionDisplay = preset.name;
                        }
                      }
                      
                      return (
                        <div key={button.id} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{button.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {button.action_type === "hotkey" ? "Hotkey: " : "Preset: "}
                              {actionDisplay}
                            </p>
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">Editar</Button>
                            <Button variant="destructive" size="sm">Remover</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    );
  };

  return isAuthenticated ? renderSettings() : renderAuthentication();
};
