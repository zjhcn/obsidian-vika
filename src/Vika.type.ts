import { Plugin } from "obsidian";
export interface VikaSettings {
  mySetting: string;
}

export interface IVika {
  settings: VikaSettings;

  loadSettings: () => any;
  saveSettings: () => any;
}

export type VikaPlugin = Plugin & IVika;
