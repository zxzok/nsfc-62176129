# 网页内容包：情绪障碍的脑成熟亚型（可上线）

本压缩包把论文《Characterizing the distinct imaging phenotypes, clinical behavior, and genetic vulnerability of brain maturational subtypes in mood disorders》（Psychological Medicine, 2024）转成一个“面向公众的网页内容包”，包含可直接上站的HTML/文案、可复用的论文图（裁剪版）、信息图重绘方案、交互模块设计与JSON数据结构。

## 1）快速预览
- 直接打开 `index.html` 即可查看静态页面（推荐用浏览器打开）。
- 如果你想让页面内的 JSON 自动加载（浏览器可能限制 file:// 的 fetch），建议用本地服务器预览，例如：
  - `python -m http.server 8000`（在包根目录运行）
  - 然后访问 `http://localhost:8000/`

## 2）文件结构
- `index.html`：可直接上站的单页HTML（含SEO meta、无障碍alt文本、FAQ折叠等）。
- `content/`
  - `page.md`：页面文案（Markdown版，可用于CMS）。
  - `visual_assets_plan.md`：6–10个视觉元素的可执行清单（每张图的“一个核心信息”、数据来源、alt）。
  - `interactive_modules_plan.md`：至少3个交互模块的策划稿（目的、交互方式、默认文案、风险提示）。
- `assets/`
  - `css/styles.css`：页面样式（轻量）。
  - `js/main.js`：占位JS（未来可接入真实交互）。
  - `figures/`：
    - `fig1_workflow.png` ~ `fig5_prs.png`：论文图1–5的裁剪版（便于网页展示）。
    - `p3.png`、`p5.png`…：对应PDF页截图（保留原上下文，方便核对）。
    - `*.svg`：信息图/示意图占位图（请按 visual_assets_plan.md 重绘）。
- `data/`
  - `site_content.json`：面向网站实现的结构化输出（sections、visual_assets、interactive_modules、SEO等）。
  - `glossary_faq.json`：术语与FAQ的结构化版本。
  - `interactive_schemas/`：3个交互模块的 JSON schema（字段、类型、单位、范围、缺失值、来源）。

## 3）证据标注规则
页面内所有关键结论、数字与方法都以“（证据：PDF第X页 图Y/段落）”形式标注。若信息不在正文，文案会明确写“论文未报告/见补充材料/需从作者仓库导出”。


补充说明：本包提供的 `fig1_*.png` ~ `fig5_*.png` 为“截图裁剪版”便于网页展示；在 NoDerivatives（禁止演绎）条款下，裁剪/重绘可能被视为改编。若你需要严格合规，建议改用 `p3.png`、`p5.png` 等整页截图或直接链接/嵌入原PDF图页，并在页面中清晰署名与引用。
## 4）版权与授权提醒（非常重要）
论文为开放获取，但采用 **CC BY-NC-ND 4.0（署名-非商业-禁止演绎）**：
- 可用于**非商业**传播，且**不得改编**原文/原图（包括重绘可能被视为改编）。
- 如用于商业发布或改编/再创作，请先评估并取得必要授权。（证据：PDF第1页 版权声明）

## 5）落地建议（给开发/编辑/设计）
- 编辑：直接把 `content/page.md` 拆成CMS段落；或用 `data/site_content.json` 驱动页面渲染。
- 设计：先按 `content/visual_assets_plan.md` 把5张建议信息图重绘；保留每张图“一个核心信息”。
- 前端：以 `data/interactive_schemas/` 为契约，接入作者仓库导出的ROI级数据（如z50与脑区比例），即可实现交互。

——
生成时间：2026-02-15
