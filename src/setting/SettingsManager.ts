import update, { Spec } from "immutability-helper";
import { App, Setting, ToggleComponent } from "obsidian";
import { createApp } from "vue";
import { DEFAULT_SETTINGS } from "src/default-settings";
import { intRegEx } from "src/utils/reg";
import { VikaPlugin, VikaSettings } from "src/Vika.type";
import PairList from "src/components/PairList.vue";
import { SettingsManagerConfig } from "./Setting";
import { registerDirectives } from "src/directives";

export class SettingsManager {
  app: App;
  plugin: VikaPlugin;
  config: SettingsManagerConfig;
  settings: VikaSettings;
  applyDebounceTimer: number = 0;

  constructor(
    plugin: VikaPlugin,
    config: SettingsManagerConfig,
    settings: VikaSettings
  ) {
    this.app = plugin.app;
    this.plugin = plugin;
    this.config = config;
    this.settings = settings;
  }

  applySettingsUpdate(spec: Spec<VikaSettings>) {
    clearTimeout(this.applyDebounceTimer);

    this.applyDebounceTimer = window.setTimeout(() => {
      this.settings = update(this.settings, spec);
      this.config.onSettingsChange(this.settings);
    }, 200);
  }

  getSetting(key: keyof VikaSettings) {
    return this.settings[key];
  }

  getDefaultSetting(key: keyof VikaSettings) {
    return DEFAULT_SETTINGS[key];
  }

  constructUI(containerEl: HTMLElement): void {
    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for Vika plugin." });

    this.uiVikaSettings(containerEl);

    this.uiUserSyncSettings(containerEl);

    this.uiMapSettings(containerEl);
  }

  uiVikaSettings(containerEl: HTMLElement) {
    containerEl.createEl("h3", { text: "维格表 API" });
    containerEl
      .createEl("p", { text: "配置维格表API使用的相关参数。" })
      .appendChild(
        createEl("a", {
          text: "相关文档",
          href: "https://vika.cn/developers/docs/quick-start",
          attr: {
            target: "_blank",
          },
        })
      );
    new Setting(containerEl)
      .setName("你的 API Token")
      .setDesc(
        createFragment((frag) => {
          frag.appendText("API Token 即用户认证令牌。");
          frag.createEl(
            "a",
            {
              text: "获取方法",
              href: "https://vika.cn/developers/docs/quick-start#%E7%AC%AC%E4%B8%80%E6%AD%A5%EF%BC%9A%E8%8E%B7%E5%8F%96-api-token",
            },
            (a) => {
              a.setAttr("target", "_blank");
            }
          );
        })
      )
      .addText((text) => {
        const value = this.getSetting("apiKey");

        if (value) {
          text.setValue(value as string);
        }

        text.setPlaceholder("apiKey");

        text.onChange((newValue) => {
          if (newValue) {
            this.applySettingsUpdate({
              apiKey: {
                $set: newValue,
              },
            });
          } else {
            this.applySettingsUpdate({
              $unset: ["apiKey"],
            });
          }
        });
      });

    new Setting(containerEl)
      .setName("同步数据的维格表ID")
      .setDesc(
        createFragment((frag) => {
          frag.appendText("对应API文档的datasheetsId。");
          frag.createEl(
            "a",
            {
              text: "获取方法",
              href: "https://vika.cn/developers/docs/introduction#datasheetid",
            },
            (a) => {
              a.setAttr("target", "_blank");
            }
          );
        })
      )
      .addText((text) => {
        const value = this.getSetting("sheetId");

        if (value) {
          text.setValue(value as string);
        }

        text.setPlaceholder("sheetId");

        text.onChange((newValue) => {
          if (newValue) {
            this.applySettingsUpdate({
              sheetId: {
                $set: newValue,
              },
            });
          } else {
            this.applySettingsUpdate({
              $unset: ["sheetId"],
            });
          }
        });
      });

    new Setting(containerEl)
      .setName("同步数据的维格视图ID")
      .setDesc(
        createFragment((frag) => {
          frag.appendText("对应API文档的viewId。");
          frag.createEl(
            "a",
            {
              text: "获取方法",
              href: "https://vika.cn/developers/docs/introduction#viewid",
            },
            (a) => {
              a.setAttr("target", "_blank");
            }
          );
        })
      )
      .addText((text) => {
        const key = "viewId";
        const defaultValue = this.getDefaultSetting(key);
        const value = this.getSetting(key);

        if (value) {
          text.setValue((value as string) || (defaultValue as string));
        }

        text.setPlaceholder(key);

        text.onChange((newValue) => {
          if (newValue) {
            this.applySettingsUpdate({
              [key]: {
                $set: newValue,
              },
            });
          } else {
            this.applySettingsUpdate({
              $unset: [key],
            });
          }
        });
      });
  }

  uiUserSyncSettings(containerEl: HTMLElement) {
    containerEl.createEl("h3", { text: "个人同步设置" });

    new Setting(containerEl)
      .setName("是否在Frontmatter区下方添加一个Vika访问链接")
      .then((setting) => {
        let toggleComponent: ToggleComponent;

        setting
          .addToggle((toggle) => {
            toggleComponent = toggle;

            const value = this.getSetting("showDbLink");

            if (value !== undefined) {
              toggle.setValue(value as boolean);
            }

            toggle.onChange((newValue) => {
              this.applySettingsUpdate({
                showDbLink: {
                  $set: newValue,
                },
              });
            });
          })
          .addExtraButton((b) => {
            b.setIcon("reset")
              .setTooltip("Reset to default")
              .onClick(() => {
                const defaultSetting = this.getDefaultSetting("showDbLink");
                toggleComponent.setValue(!!defaultSetting);

                this.applySettingsUpdate({
                  $unset: ["showDbLink"],
                });
              });
          });
      });

    new Setting(containerEl)
      .setName("操作确认")
      .setDesc("是否显示确实删除或更新的窗口。")
      .then((setting) => {
        let toggleComponent: ToggleComponent;

        setting
          .addToggle((toggle) => {
            toggleComponent = toggle;

            const value = this.getSetting("showDeleteModal");

            if (value !== undefined) {
              toggle.setValue(value as boolean);
            }

            toggle.onChange((newValue) => {
              this.applySettingsUpdate({
                showDeleteModal: {
                  $set: newValue,
                },
              });
            });
          })
          .addExtraButton((b) => {
            b.setIcon("reset")
              .setTooltip("Reset to default")
              .onClick(() => {
                const defaultSetting =
                  this.getDefaultSetting("showDeleteModal");
                toggleComponent.setValue(!!defaultSetting);

                this.applySettingsUpdate({
                  $unset: ["showDeleteModal"],
                });
              });
          });
      });

    new Setting(containerEl)
      .setName("是否在同步的笔记内容中放入开头的Vika点击链接。")
      .then((setting) => {
        const key = "syncDbLink";
        let toggleComponent: ToggleComponent;

        setting
          .addToggle((toggle) => {
            toggleComponent = toggle;

            const value = this.getSetting(key);

            if (value !== undefined) {
              toggle.setValue(value as boolean);
            }

            toggle.onChange((newValue) => {
              this.applySettingsUpdate({
                [key]: {
                  $set: newValue,
                },
              });
            });
          })
          .addExtraButton((b) => {
            b.setIcon("reset")
              .setTooltip("Reset to default")
              .onClick(() => {
                const defaultSetting = this.getDefaultSetting(key);
                toggleComponent.setValue(!!defaultSetting);

                this.applySettingsUpdate({
                  $unset: [key],
                });
              });
          });
      });

    new Setting(containerEl)
      .setName("同步行数")
      .setDesc(
        "正文内容同步多少行到Vika，-1 表示全部同步，0 表示不同步，其他整数表示对应行数"
      )
      .addText((text) => {
        const key = "howManyLinesSynced";
        const value = this.getSetting(key);

        text.inputEl.setAttr("type", "number");
        text.inputEl.placeholder = `-1 (default)`;
        text.inputEl.value = value ? value.toString() : "";

        text.onChange((val) => {
          if (val && (intRegEx.test(val) || val === "-1")) {
            text.inputEl.removeClass("error");

            this.applySettingsUpdate({
              [key]: {
                $set: parseInt(val),
              },
            });

            return;
          }

          if (val) {
            text.inputEl.addClass("error");
            text.setValue("");
          }

          this.applySettingsUpdate({
            $unset: [key],
          });
        });

        text.inputEl.addEventListener("blur", (e) => {
          if (text.getValue() !== "-1" || !intRegEx.test(text.getValue())) {
            return;
          }
          text.setValue("");
          this.applySettingsUpdate({
            $unset: [key],
          });
        });
      });

    new Setting(containerEl)
      .setName("同步方式")
      .setDesc(
        "在线数据库的笔记内容同步到OB的方式, 表示把在线内容放到OB内容的后面"
      )
      .addDropdown((dropdown) => {
        const key = "dbToObMood";
        dropdown.addOption("-1", "不更新内容(默认)");
        dropdown.addOption("1", "在线内容覆盖OB里的内容");
        dropdown.addOption("2", "在线内容放到OB内容的前面");
        dropdown.addOption("3", "在线内容放到OB内容的后面");

        const defaultValue = this.getDefaultSetting(key);
        const value = this.getSetting(key);

        dropdown.setValue((value as string) || (defaultValue as string));
        dropdown.onChange((value) => {
          this.applySettingsUpdate({
            [key]: {
              $set: value as any,
            },
          });
        });
      });

    new Setting(containerEl)
      .setName("是否在FrontMatter区显示Vika链接")
      .then((setting) => {
        let toggleComponent: ToggleComponent;

        setting
          .addToggle((toggle) => {
            toggleComponent = toggle;

            const value = this.getSetting("showVikaLinkInFrontMatter");

            if (value !== undefined) {
              toggle.setValue(value as boolean);
            }

            toggle.onChange((newValue) => {
              this.applySettingsUpdate({
                showVikaLinkInFrontMatter: {
                  $set: newValue,
                },
              });
            });
          })
          .addExtraButton((b) => {
            b.setIcon("reset")
              .setTooltip("Reset to default")
              .onClick(() => {
                const defaultSetting = this.getDefaultSetting(
                  "showVikaLinkInFrontMatter"
                );
                toggleComponent.setValue(!!defaultSetting);

                this.applySettingsUpdate({
                  $unset: ["showVikaLinkInFrontMatter"],
                });
              });
          });
      });

    new Setting(containerEl)
      .setName("提醒方式")
      .setDesc("操作完成时提醒的显示方式")
      .addDropdown((dropdown) => {
        const key = "noticeType";
        dropdown.addOption("1", "用Obsidian的提醒");
        dropdown.addOption("2", "系统提醒");

        const defaultValue = this.getDefaultSetting(key);
        const value = this.getSetting(key);

        dropdown.setValue((value as string) || (defaultValue as string));
        dropdown.onChange((value) => {
          this.applySettingsUpdate({
            [key]: {
              $set: value as any,
            },
          });
        });
      });
  }

  uiMapSettings(containerEl: HTMLElement) {
    containerEl.createEl("h3", { text: "映射关系" });
    const key = "vikaMap";
    const div = containerEl.createEl("div");
    const list = this.getSetting(key);

    const app = createApp(PairList, {
      //   list: _.isEmpty(list) ? this.getDefaultSetting(key) : list,
      list: this.getDefaultSetting(key),
      onChange: (value: any) => {
        console.log("pair", value);
        this.applySettingsUpdate({
          [key]: {
            $set: value as any,
          },
        });
      },
    });

    registerDirectives(app);

    app.mount(div);
  }
}
