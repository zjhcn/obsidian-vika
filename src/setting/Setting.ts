import { PluginSettingTab } from "obsidian";
import { VikaPlugin, VikaSettings } from "src/Vika.type";
import { SettingsManager } from "./SettingsManager";

export interface SettingsManagerConfig {
  onSettingsChange: (newSettings: VikaSettings) => void;
}

export class VikaSettingsTab extends PluginSettingTab {
  plugin: VikaPlugin;
  settingsManager: SettingsManager;

  constructor(plugin: VikaPlugin, config: SettingsManagerConfig) {
    super(plugin.app, plugin);
    this.plugin = plugin;
    this.settingsManager = new SettingsManager(plugin, config, plugin.settings);
  }

  display() {
    const { containerEl } = this;

    containerEl.empty();

    this.settingsManager.constructUI(containerEl);
  }
}
