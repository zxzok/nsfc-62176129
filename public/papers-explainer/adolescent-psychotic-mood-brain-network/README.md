# 青少年精神病性情绪障碍：脑功能网络科普网页内容包（可上线）

本文件夹是一个**静态网页内容包**：包含可直接上站的页面（HTML/CSS/JS）、交互模块、结构化数据与内容JSON，面向公众解释论文：

> Zhou J, Duan J, et al. *Functional network characteristics in adolescent psychotic mood disorder: associations with symptom severity and treatment effects*. European Child & Adolescent Psychiatry (2024). DOI: 10.1007/s00787-023-02314-5  
（证据：论文第1页 题头与摘要）

---

## 1. 快速预览与上线方式

### 本地预览（推荐）
由于浏览器对本地 `file://` 读取JSON有限制，建议用一个本地静态服务器预览：

```bash
cd adolescent-psychotic-mood-brain-network
python -m http.server 8000
```

然后在浏览器打开：

- http://localhost:8000

### 直接上线
把整个文件夹部署到任意静态托管（Nginx、GitHub Pages、Netlify、Vercel 静态站点等）即可。

---

## 2. 目录结构

- `index.html`：主页面（已排版、含交互模块）
- `styles.css`：样式
- `script.js`：交互逻辑（纯原生JS，无外部依赖）
- `content/page_content.json`：页面结构化文案（含证据锚点）
- `content/citations.json`：引用清单（页码/图号/表号）
- `data/`：交互模块使用的数据（全部来自论文可追溯信息）
- `assets/images/`：示意图与社交分享图（不包含论文原图）

---

## 3. 数据来源说明（严谨可追溯）

本包中所有数值均来自论文**可定位**的页码/图表：

- 基线特征：`data/baseline_characteristics.json`（证据：第3页 表1）
- 两周症状变化：`data/symptom_change_summary.json`（证据：第7页 表2；第6页 段落）
- 指标与症状相关：`data/topology_symptom_correlations.json`（证据：第5页 段落；第6页 图3；第7页 图4）
- 两周后网络指标变化：`data/treatment_related_topology_changes.json`（证据：第7页 段落；第8页 图5；并注明P未校正）
- 方法教学参数：`data/method_explainer_parameters.json`（证据：第4页 Network analysis）

> 重要：论文的图1/图2/图5为小提琴图等分布图，正文未提供均值±SD，因此本包**不重绘分布**，只呈现“方向+显著性/阈值信息”，避免编造数据。（证据：第4页；第5–6页 图1/图2）

---

## 4. 版权与合规提示（上站前请确认）

- 本包默认**不包含论文原图**（Fig.1–Fig.5 的图片文件未打包），以避免在未确认版权授权的情况下直接发布。
- 如果你拥有出版社/作者授权或符合期刊的图表复用条款，可以在 `assets/images/` 中替换或新增原图，并在页面中按需引用，同时保留图号与出处标注。

---

## 5. 可编辑入口（改文案/改数据）

- 改页面文案：编辑 `content/page_content.json`
- 改交互数据：编辑 `data/*.json`
- 改页面样式：编辑 `styles.css`
- 改交互逻辑：编辑 `script.js`

---

## 6. 免责声明（页面已内置）

本页面用于科研科普解读，不能替代医生诊断与治疗建议；网络指标为研究层面的群体发现，个体差异很大。（证据：第7页 P未校正说明；第9页 limitations）
