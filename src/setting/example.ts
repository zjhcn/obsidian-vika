import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { VikaPlugin } from "src/Vika.type";

export function exampleSetting(plugin: VikaPlugin) {
  plugin.addSettingTab(new SampleSettingTab(plugin.app, plugin));
}

class SampleSettingTab extends PluginSettingTab {
  plugin: VikaPlugin;

  constructor(app: App, plugin: VikaPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for Vika plugin." });

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            console.log("Secret: " + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
