# FUNDMASTER AI — 项目进度追踪器

毕业设计团队进度管理工具，支持里程碑追踪、成员工作记录、导师对齐日志，以及亮色/暗色主题切换。

---

## 快速预览

在线地址：**https://shilingzi.github.io/fundmaster-ai/**

---

## 项目结构

```
├── index.html    ← 页面结构
├── styles.css    ← 所有样式（含亮/暗两套主题）
├── app.js        ← 所有逻辑（团队数据、里程碑、主题切换等）
└── README.md     ← 你正在看的这个文件
```

只有 3 个代码文件，纯 HTML/CSS/JS，**不需要安装任何东西**。

---

## 如何修改内容

所有需要改的数据都在 `app.js` 文件的**最上面**，非常好找：

### 修改团队成员

打开 `app.js`，找到最上面的 `TEAM` 数组：

```js
const TEAM = [
  { name: "Liu Zhaoxuan",  role: "Team Member", initials: "M1", color: "linear-gradient(135deg,#7c5cfc,#5a3fe0)" },
  { name: "Wen Yuxuan",    role: "Team Member", initials: "M2", color: "linear-gradient(135deg,#38bdf8,#0ea5e9)" },
  // ...
];
```

- `name`：成员姓名
- `role`：角色描述
- `initials`：头像上显示的缩写
- `color`：头像颜色（渐变色）

### 修改里程碑

同样在 `app.js` 上面，找到 `MILESTONES` 数组：

```js
const MILESTONES = [
  { title: "Detailed Project Proposal", date: "March 27, 2026", revisedDate: "Mar 10", status: "done", tag: "Milestone 01" },
  // ...
];
```

- `title`：里程碑名称
- `date`：截止日期
- `revisedDate`：原始日期（如果延期了的话），没有就写 `null`
- `status`：状态，可选 `"done"` / `"active"` / `"upcoming"` / `"overdue"`
- `tag`：显示的标签（如 "Milestone 01"）

---

## 如何部署（给组长看）

### 方法一：直接用当前仓库的 GitHub Pages（已开启）

当前仓库已经开启了 GitHub Pages，每次 push 代码到 `main` 分支会自动更新网站。

**更新步骤：**

```bash
# 1. 克隆仓库到本地
git clone https://github.com/shilingzi/fundmaster-ai.git
cd fundmaster-ai

# 2. 修改 app.js 中的数据（用任意文本编辑器打开即可）

# 3. 提交并推送
git add .
git commit -m "更新了xxx内容"
git push
```

推送后等 1-2 分钟，网站就会自动更新。

### 方法二：部署到组长自己的 GitHub 账号

如果组长想把网站放到自己的账号下：

```bash
# 1. 先 Fork 这个仓库
#    打开 https://github.com/shilingzi/fundmaster-ai
#    点右上角的 "Fork" 按钮

# 2. 克隆 Fork 后的仓库
git clone https://github.com/你的用户名/fundmaster-ai.git
cd fundmaster-ai

# 3. 开启 GitHub Pages
#    进入仓库页面 → Settings → Pages
#    Source 选择 "Deploy from a branch"
#    Branch 选择 "main"，文件夹选 "/ (root)"
#    点 Save

# 4. 等 1-2 分钟，网站就上线了
#    地址是：https://你的用户名.github.io/fundmaster-ai/
```

### 方法三：最简单 —— Netlify 拖拽部署

不想用 Git 也行：

1. 打开 https://app.netlify.com/drop
2. 把整个项目文件夹拖进去
3. 秒得一个在线链接

---

## 注意事项

- 当前数据存储在每个用户的**浏览器本地**（localStorage），不同设备之间数据不互通
- 如果需要团队数据实时同步，后续可以接入 Firebase 等在线数据库
