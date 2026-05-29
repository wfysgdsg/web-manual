# __APP__ 产品介绍 & 使用手册网页

## 基本信息

- **小程序名称**：__APP__ 个人借销货系统
- **小程序 AppID**：wx6b4979a2bd3e0c24
- **小程序项目路径**：`C:\Users\59107\Desktop\微信小程序\__APP__`
- **网页项目路径**：`C:\Users\59107\Desktop\微信小程序\web-manual`

## 线上地址

🔗 **https://wfysgdsg.github.io/web-manual/**

## 文件结构

```
web-manual/
├── index.html          ← 产品介绍 & 使用手册主页面
├── images/             ← 截图存放目录（21张页面截图 + 小程序码）
├── screenshots.js      ← 批量截图脚本
├── package.json        ← npm 配置
├── .gitignore          ← git 忽略规则
└── README.md           ← 本文件
```

## 如何更新网页

### 改内容
直接编辑 `index.html`，然后：

```powershell
cd "C:\Users\59107\Desktop\微信小程序\web-manual"
git add . && git commit -m "更新内容" && git push
```

需要开 VPN 才能 push。

### 重新截图
如果小程序界面有变动，需要重新截图：

```powershell
cd "C:\Users\59107\Desktop\微信小程序\web-manual"
node screenshots.js --auto
```

> 运行前关闭微信开发者工具。截图会自动覆盖 `images/` 目录下的旧文件。

### 替换小程序码
把新的小程序码图片保存为 `images/qrcode.png` 覆盖旧文件即可。

## 部署信息

| 项目 | 详情 |
|------|------|
| 平台 | GitHub Pages |
| 仓库 | https://github.com/wfysgdsg/web-manual |
| 分支 | main |
| Pages 设置 | https://github.com/wfysgdsg/web-manual/settings/pages |
| Git 用户 | wfysgdsg |
| Git 邮箱 | 1048335116@qq.com |
| 推送需 VPN | 是 |

## 微信开发者工具

- 安装路径：`C:\Program Files (x86)\Tencent\微信web开发者工具\`
- 服务端口（手动连接用）：**55811**（每次可能变化，在 设置→安全设置 里查看）
- CLI 路径：`C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat`
