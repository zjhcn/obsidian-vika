import { Plugin } from "obsidian";

export interface TapMap {
  ob: string;
  vika: string;
}

export interface VikaSettings {
  sheetId: string;
  viewId: string;
  apiKey: string;

  /** 需要批量同步的目录 */
  mutilUploadPaths: string[];
  // 是否在Frontmatter区下方添加一个Vika访问链接
  showDbLink: boolean;
  // 是否显示确实删除或更新的窗口，如果为fasle则只进行更新
  showDeleteModal: boolean;
  // 是否在同步的笔记内容中放入开头的Vika点击链接
  syncDbLink: boolean;
  // 正文内容同步多少行到Vika，-1 表示全部同步，0 表示不同步，其他整数表示对应行数
  howManyLinesSynced: number;
  // 在线数据库的笔记内容同步到OB的方式, -1 不更新内容(默认) 1 表示用在线内容覆盖OB里的内容，2 表示把在线内容放到OB内容的前面，3表示把在线内容放到OB内容的后面
  dbToObMood: "-1" | "1" | "2" | "3";
  // 是否在FrontMatter区显示Vika链接
  showVikaLinkInFrontMatter: boolean;
  // 同步提醒的显示方式，0 表示在console中显示，1 表示用Obsidian的提醒，2 表示用系统提醒
  noticeType: "0" | "1" | "2";
  // 二级标签同步到Vika的列。 key 父标签; value Vika Field
  subTagMap: TapMap[];
}

export interface IVika {
  settings: VikaSettings;

  loadSettings: () => any;
  saveSettings: () => any;
}

export type VikaPlugin = Plugin & IVika;
