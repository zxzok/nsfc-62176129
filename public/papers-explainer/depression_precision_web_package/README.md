# 论文科普网页内容包（可直接打开预览）

本目录是基于论文《A neuroimaging-based precision medicine framework for depression》（Asian Journal of Psychiatry, 2024）制作的“面向公众的网页页面内容包”。

## 1）快速预览
- 直接双击打开 `index.html` 即可离线预览（无需服务器）。
- 若你希望在本地调试（例如使用 fetch 加载 JSON），可用任意静态服务器启动（可选）。

## 2）目录结构
- `index.html`：单页网页（已内嵌全部文案与数据，打开即可看）
- `assets/`
  - `css/styles.css`：样式
  - `js/app.js`：交互逻辑（亚型切换、时间轴、术语搜索、FAQ折叠）
  - `data/content.json`：面向网站实现的结构化 JSON（给开发用）
  - `images/`：配图与信息图（含论文原图复用与科普重绘 SVG）
- `paper/paper.pdf`：论文原文（用于追溯证据锚点）

## 3）证据与引用方式
网页所有关键断言均在页面中以“证据：第X页/图Y/表Z”的形式标注。
如需集中查看，可读 `CITATIONS.md`。

## 4）重要声明（请务必阅读）
- 本网页为科普解读，不构成医疗建议或诊断依据。
- 论文中的临床应用为探索性研究，缺少假刺激对照且未完全盲法，不能据此得出严格因果疗效结论。（证据：论文第7页 Discussion）

## 5）生成信息
- 生成时间：2026-02-15
