
import { Camera, Preset, TextOverlay, HotButton, AppSettings } from '../types';

// Mock API data until we connect to a real backend
const mockCameras: Camera[] = [
  { id: 1, name: "Camera Principal", ip: "192.168.1.100", port: 80, username: "admin", password: "password" },
  { id: 2, name: "Camera Lateral", ip: "192.168.1.101", port: 80, username: "admin", password: "password" },
  { id: 3, name: "Camera Coro", ip: "192.168.1.102", port: 80, username: "admin", password: "password" },
];

const mockPresets: Preset[] = [
  { id: 1, camera_id: 1, name: "Plano Geral", position: "position_data_1" },
  { id: 2, camera_id: 1, name: "Altar", position: "position_data_2" },
  { id: 3, camera_id: 2, name: "Ambão", position: "position_data_3" },
  { id: 4, camera_id: 2, name: "Celebrante", position: "position_data_4" },
  { id: 5, camera_id: 3, name: "Coro Completo", position: "position_data_5" },
  { id: 6, camera_id: 3, name: "Organista", position: "position_data_6" },
];

const mockTextOverlays: TextOverlay[] = [
  { id: 1, camera_id: 1, text: "Anúncio Importante" },
  { id: 2, camera_id: 2, text: "Próximos Eventos" },
];

const mockHotButtons: HotButton[] = [
  { id: 1, label: "Transição Global", action_type: "hotkey", action_value: "Ctrl+Shift+G" },
  { id: 2, label: "Plano Geral", action_type: "preset", action_value: "1" },
  { id: 3, label: "Altar", action_type: "preset", action_value: "2" },
];

const mockSettings: AppSettings = {
  layout: {
    width_percentage: 30
  },
  default_hotkeys: {
    "Camera Principal": "A",
    "Camera Lateral": "B",
    "Camera Coro": "C"
  },
  text_hotkeys: {
    "texto_padrao_camera_principal": "T",
    "anuncio_camera_lateral": "U"
  },
  delays: {
    global_transition: 2000
  },
  global_transition_hotkey: "Ctrl+Shift+G"
};

// API Service class
export class ApiService {
  // Camera functions
  static async getCameras(): Promise<Camera[]> {
    // In a real implementation, this would be a fetch to your backend
    return new Promise(resolve => {
      setTimeout(() => resolve(mockCameras), 300);
    });
  }

  static async getCamera(id: number): Promise<Camera | undefined> {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockCameras.find(camera => camera.id === id)), 200);
    });
  }

  static async moveCameraToPreset(cameraId: number, presetId: number): Promise<boolean> {
    console.log(`Moving camera ${cameraId} to preset ${presetId}`);
    // This would normally send an ONVIF command to the camera
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 500);
    });
  }

  // Preset functions
  static async getPresets(cameraId?: number): Promise<Preset[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (cameraId) {
          resolve(mockPresets.filter(preset => preset.camera_id === cameraId));
        } else {
          resolve(mockPresets);
        }
      }, 300);
    });
  }

  // Text overlay functions
  static async getTextOverlays(): Promise<TextOverlay[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockTextOverlays), 300);
    });
  }

  // Hot button functions
  static async getHotButtons(): Promise<HotButton[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockHotButtons), 300);
    });
  }

  // Settings functions
  static async getAppSettings(): Promise<AppSettings> {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockSettings), 200);
    });
  }

  // Xsplit integration functions
  static async sendHotkey(hotkey: string): Promise<boolean> {
    console.log(`Sending hotkey: ${hotkey}`);
    // This would normally use a backend function to simulate keypresses
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 200);
    });
  }

  static async triggerGlobalTransition(): Promise<boolean> {
    console.log("Triggering global transition");
    // This would normally send the global transition hotkey and handle timing
    return new Promise(resolve => {
      setTimeout(() => resolve(true), mockSettings.delays.global_transition);
    });
  }

  // Authentication
  static async checkPassword(password: string): Promise<boolean> {
    return password === "clic3369";
  }
}
