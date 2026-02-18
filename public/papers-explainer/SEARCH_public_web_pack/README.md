# SEARCH 论文科普网页内容包（可上线）

本压缩包基于论文：
- Zhang R, et al. *BMJ Mental Health* 2023;26:1–7. doi:10.1136/bmjment-2023-300861
- Open access：CC BY-NC 4.0（见论文第6页）

## 目录结构

- `index.html`：静态演示页面（可直接部署到任意静态站点）
- `style.css` / `script.js`：页面样式与交互脚本
- `content/`
  - `page.json`：页面结构化内容（标题、段落、配图清单、交互模块配置、免责声明）
  - `page.md`：同一份内容的 Markdown 版本（便于编辑/审校）
  - `glossary.json`：术语小词典
  - `faq.json`：FAQ
- `data/`
  - `table1_counts.json` / `table1_counts.csv`：从论文表1（第5页）提取的聚合计数
  - `task_completion.json`：从论文结果（第5页）提取的任务完成率
  - `flow_steps.json`：从图2（第4页）与方法段落整理的流程步骤
  - `followup_plan.json`：随访计划要点（第1–3页）
- `interactive/`：交互模块 JSON Schema（字段/类型/单位/缺失处理）
- `assets/`
  - `paper_figures_web/`：从论文中提取并压缩的 Figure 1/2（用于网页展示）
  - `paper_figures/`：原始提取版本（分辨率更高）
  - `generated/`：从论文表格重绘的基础图表（默认配色）
  - `generated_svg/`：可编辑的概念示意 SVG（用于“方法/局限”解释）

## 如何本地预览

由于页面使用 `fetch()` 读取本地 JSON，建议在目录根部启一个本地静态服务器：
- Python：`python -m http.server 8000`
然后浏览器访问 `http://localhost:8000/`

## 重要说明（严谨与边界）

1. 本内容包严格只使用论文中**明确报告**的信息与数字。对论文未报告的内容（如诊断结果、发生率、模型准确率、隐私技术细节）均不会推断或补齐。
2. 页面中的“应用价值/合理推测”均明确标注为需要后续验证，不等同于已被证明的结论。
3. 复用论文图1/图2时，请保留图注来源与许可信息（CC BY-NC 4.0）。

## 变更与二次开发建议

- 如需更精美的信息图，请以 `data/` 中的 JSON/CSV 为数据源重绘（避免手抄数值）。
- 如要加入“量表清单（补充表S1）”，需要额外获取论文在线补充材料；本压缩包未包含该补充材料数据。

