# 网页内容包（可上线）｜视觉皮层 rTMS × 青少年重性精神障碍（跨物种研究）

本文件夹为“可直接上站”的静态网页 + 结构化 JSON + 视觉资产整理包，内容基于论文：  
Liu J, Guo H, Yang J, et al. *CNS Neurosci Ther.* 2024;30:e14427. doi:10.1111/cns.14427（证据：PDF第1页）。

## 如何预览
1. **推荐方式（本地起服务）**  
   在本目录运行：  
   ```bash
   python -m http.server 8000
   ```  
   然后用浏览器打开 `http://localhost:8000`。

2. **直接双击打开**  
   部分浏览器对本地文件的脚本/字体策略不同；如遇到图片或脚本不加载，请用第1种方式。

## 目录结构
- `index.html`：完整网页（含3个可用的交互模块）
- `assets/`：网页资源
  - `css/styles.css`：样式
  - `js/main.js`：交互脚本
  - `img/`：图片（含论文Figure裁切 + 机制示意SVG）
- `content/`：文案与策划稿（Markdown，可直接复制到CMS）
- `data/`：给开发使用的结构化输出（JSON）

## 版权与署名
论文为开放获取，PDF第1页注明采用 Creative Commons Attribution License（CC BY），允许在注明出处前提下再利用。  
本包中的 `fig1/fig2/fig3` 图片来源于论文 Figure 1–3（见 `CREDITS.md`）。

> 提醒：本网页包仅用于科普与网页展示，不构成医疗建议。详见网页页脚免责声明。