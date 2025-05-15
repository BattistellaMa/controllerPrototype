
export interface Camera {
  id: number;
  name: string;
  ip: string;
  port: number;
  username: string;
  password: string;
}

export interface Preset {
  id: number;
  camera_id: number;
  name: string;
  position: string;
}

export interface TextOverlay {
  id: number;
  camera_id: number;
  text: string;
}

export interface HotButton {
  id: number;
  label: string;
  action_type: 'hotkey' | 'preset';
  action_value: string;
}

export interface AppSettings {
  layout: {
    width_percentage: number;
  };
  default_hotkeys: Record<string, string>;
  text_hotkeys: Record<string, string>;
  delays: {
    global_transition: number;
  };
  global_transition_hotkey: string;
}
