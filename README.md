# FUNDMASTER AI — 项目进度追踪器

毕业设计团队进度管理工具，支持里程碑追踪、成员工作记录、导师评论日志，以及亮色/暗色主题切换。

**支持两种模式：**
- **本地模式**（默认）：数据存在各自浏览器，不需要任何配置
- **在线模式**：配置 Firebase 后，所有人数据实时同步——组员提交进度，导师立刻能看到

---

## 项目结构

```
├── index.html    ← 页面结构
├── styles.css    ← 所有样式（含亮/暗两套主题）
├── app.js        ← 所有逻辑 + 数据配置（改内容只需改这个文件最上面）
└── README.md     ← 你正在看的这个文件
```

纯 HTML/CSS/JS，**不需要安装任何东西**。

---

## 如何修改内容

所有需要改的数据都在 `app.js` 文件的**最上面**：

### 修改团队成员

找到 `TEAM` 数组：

```js
const TEAM = [
  { name: "Liu Zhaoxuan", role: "Team Member", initials: "M1", color: "linear-gradient(135deg,#7c5cfc,#5a3fe0)" },
  ...
];
```

- `name`：成员姓名
- `role`：角色（统一写 Team Member 就行）
- `initials`：头像上显示的缩写
- `color`：头像渐变色

### 修改里程碑

找到 `MILESTONES` 数组：

```js
const MILESTONES = [
  { title: "...", date: "...", revisedDate: null, status: "done", tag: "Milestone 01" },
  ...
];
```

- `status` 可选值：`"done"` / `"active"` / `"upcoming"` / `"overdue"`
- `revisedDate`：延期前的原始日期，没有就写 `null`

---

## ★ 开启在线同步（重要！配置后所有人数据互通）

默认网站是「本地模式」——每个人的数据只存在自己的浏览器里。要让团队数据实时同步（组员写的导师能看到），需要配置 Firebase，**完全免费，5 分钟搞定**。

### 第一步：创建 Firebase 项目

1. 打开 https://console.firebase.google.com
2. 点 **"创建项目"**（或 "Add project"）
3. 输入项目名（比如 `fundmaster-ai`）
4. Google Analytics 选 **关闭**（不需要），点创建
5. 等几秒创建完成，点 **"继续"**

### 第二步：创建数据库

1. 左边菜单点 **"构建" → "Realtime Database"**（或 Build → Realtime Database）
2. 点 **"创建数据库"**（Create Database）
3. 地区随便选（新加坡或美国都行），点下一步
4. 选 **"以测试模式启动"**（Start in test mode），点启用

> ⚠️ 测试模式 30 天后过期。到时候去 Database → Rules，把规则改成：
> ```json
> {
>   "rules": {
>     ".read": true,
>     ".write": true
>   }
> }
> ```
> 点 **"发布"** 即可永久使用。

### 第三步：获取配置信息

1. 点左上角 **⚙ 齿轮图标 → "项目设置"**（Project settings）
2. 往下滚到 **"您的应用"**（Your apps），点 **网页图标 `</>`**
3. 输入应用昵称（随便写），点 **"注册应用"**
4. 页面会显示一段配置代码，找到 `firebaseConfig` 对象，长这样：

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "fundmaster-ai.firebaseapp.com",
  databaseURL: "https://fundmaster-ai-default-rtdb.firebaseio.com",
  projectId: "fundmaster-ai",
  storageBucket: "fundmaster-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 第四步：填入代码

打开 `app.js`，在最上面找到 `FIREBASE_CONFIG`，把上面拿到的值填进去：

```js
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",          // ← 替换成你的
  authDomain:        "xxx.firebaseapp.com",
  databaseURL:       "https://xxx.firebaseio.com",  // ← 这个最重要
  projectId:         "xxx",
  storageBucket:     "xxx.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

保存文件，push 到 GitHub，网站自动更新。**导航栏会显示绿色的 "Synced" 表示在线同步已生效。**

---

## 如何部署

### 方法一：用当前仓库的 GitHub Pages（已开启）

当前仓库已开启 GitHub Pages，push 到 `main` 分支就会自动更新。

```bash
# 克隆仓库
git clone https://github.com/shilingzi/fundmaster-ai.git
cd fundmaster-ai

# 修改 app.js 中的数据或 Firebase 配置

# 提交并推送
git add .
git commit -m "更新了xxx内容"
git push
```

等 1-2 分钟网站就会更新。

### 方法二：Fork 到自己的 GitHub 账号

1. 打开 https://github.com/shilingzi/fundmaster-ai
2. 点右上角 **"Fork"**
3. 进入你 Fork 的仓库 → **Settings → Pages**
4. Source 选 **"Deploy from a branch"**，Branch 选 **main**，文件夹选 **/**，点 Save
5. 等 1-2 分钟，网站就在 `https://你的用户名.github.io/fundmaster-ai/`

### 方法三：Netlify 拖拽（不用 Git）

1. 打开 https://app.netlify.com/drop
2. 把项目文件夹拖进去
3. 秒得一个在线链接

---

## 常见问题

**Q: 导航栏显示 "Local" 不是 "Synced"？**
A: Firebase 配置还没填或者填错了。检查 `app.js` 里的 `FIREBASE_CONFIG`，特别是 `databaseURL` 不能为空。

**Q: 组员提交了但导师看不到？**
A: 确认导航栏显示的是绿色 "Synced"。如果是灰色 "Local"，说明 Firebase 没生效。

**Q: 测试模式过期了怎么办？**
A: Firebase 控制台 → Realtime Database → Rules，改成 `".read": true, ".write": true`，点发布。
