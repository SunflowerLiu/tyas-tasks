# TYAS 任務監控 Web App

單檔前端應用，協助 Sun（桃園美國學校教師）追蹤與監控任務進度。支援四種視圖、GitHub Gist 雲端同步與跨裝置使用。

🔗 **線上版**：https://sunflowerliu.github.io/tyas-tasks/

---

## ✨ 功能

| 視圖 | 說明 |
|---|---|
| 📋 **清單** | 依截止日自動分組（逾期 / 今日 / 本週 / 之後 / 已完成），父子任務自動聚合 |
| 📅 **行事曆** | 月曆視圖，點日期可快速建立任務 |
| 📊 **儀表板** | 完成率環、分類佔比、優先級分布、7 天工作負載、關鍵人員工作量 |
| 📈 **甘特圖** | 可縮放的時間軸，橫向呈現任務週期 |

其他：
- 🔔 **瀏覽器通知**：逾期 / 今日到期自動提醒
- ☁ **跨裝置同步**：GitHub Gist 作為真實來源，任何裝置輸入相同 Gist ID 即可共享資料
- 📱 **PWA**：可加到手機主畫面，像 App 一樣用（支援離線）
- 🌙 **深淺色主題**
- ⌨ **鍵盤快捷鍵**：`/` 搜尋、`N` 新增、`Esc` 重置

---

## 🚀 快速開始

### 1. 準備 Gist

1. 到 [gist.github.com](https://gist.github.com/) 建一個 **secret gist**
2. 檔名必須是 `tasks.json`，內容：
   ```json
   { "meta": { "owner": "你的名字" }, "tasks": [] }
   ```
3. 複製 Gist ID（網址最後那串 hash）

### 2. 建立 Personal Access Token

1. 到 [github.com/settings/tokens](https://github.com/settings/tokens)
2. Generate new token (classic) → **只勾 `gist` scope**
3. 複製 Token（`ghp_xxxx...`）

### 3. 使用網頁

1. 打開 [線上版](https://sunflowerliu.github.io/tyas-tasks/)
2. 點右上角 **⚙ 同步** → GitHub Gist 分頁
3. 輸入 Gist ID 和 Token
4. 點 **🔍 測試連線** → 成功後按 **⬇ 從 Gist 拉下來**
5. ✅ 完成！資料會自動同步

---

## 🔒 隱私

- Token 僅儲存在**你自己的瀏覽器 localStorage**，不會上傳任何伺服器
- 實際任務資料儲存在**你自己的 private Gist**（這個 repo 不含真實資料）
- 網頁是純前端（無後端、無追蹤、無分析）

---

## 🤖 讓 Claude 在任何地方幫你編輯

- **桌機 / 筆電**（有裝 Claude Code）：直接跟我說「幫我加一個任務」，我會用 `gh gist edit` 寫到 Gist
- **手機 / 平板**：claude.ai App 設定 **GitHub Connector** 後，一樣能透過對話新增/編輯任務

---

## 🛠 技術

- 純 HTML/CSS/JavaScript 單檔（沒有 build step、沒有 npm）
- 可雙擊 `index.html` 直接用，或部署到任何靜態主機（GitHub Pages / Netlify / Vercel）
- 可選的 Service Worker 提供離線快取（僅在 HTTPS 下生效）

---

## 📄 檔案結構

```
├── index.html              # 主應用（含所有 CSS/JS）
├── manifest.webmanifest    # PWA 清單
├── sw.js                   # Service Worker（離線支援）
├── icon.svg                # App 圖示
└── README.md               # 本文件
```

真實任務資料（`tasks.json`、`TASKS.md`、`Tasks.xlsx`）不在此 repo——都透過 `.gitignore` 排除，避免誤傳到 public。
