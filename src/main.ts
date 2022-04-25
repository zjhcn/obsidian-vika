import {
  App,
  Editor,
  MarkdownView,
  Modal,
  Notice,
  Plugin,
  PluginManifest,
  PluginSettingTab,
  Setting,
} from "obsidian";
import { exampleCommand } from "./command/example";
import { exampleComplexCommand } from "./command/example-complex";
import { exampleEditorCommand } from "./command/example-editor";
import { exampleRibbon } from "./ribbon/example";
import { exampleSetting } from "./setting/example";
import { exampleStatusBar } from "./status-bar/example";
import { VikaSettings, IVika } from "./Vika.type";

// Remember to rename these classes and interfaces!

const DEFAULT_SETTINGS: VikaSettings = {
  mySetting: "default",
};

export default class Vika extends Plugin implements IVika {
  settings!: VikaSettings;

  async onload() {
    await this.loadSettings();

    exampleRibbon(this);
    exampleStatusBar(this);

    exampleCommand(this);
    exampleComplexCommand(this);
    exampleEditorCommand(this);

    // This adds a settings tab so the user can configure various aspects of the plugin
    exampleSetting(this);

    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    this.registerInterval(
      window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
    );
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
