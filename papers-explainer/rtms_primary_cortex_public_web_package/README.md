# 网页内容包（可直接上站）

本包将论文《Repetitive Transcranial Magnetic Stimulation Reversing Abnormal Brain Function in Mood Disorders with Early Life Stress: from preclinical models to clinical applications》转成“面向公众”的网页页面内容包，并提供可运行的静态网页 + 结构化数据（JSON） + 已裁切的论文图表。

## 1. 一键本地预览（推荐）
在本目录执行：

```bash
python -m http.server 8000
```

然后打开浏览器访问 `http://localhost:8000/index.html`。

> 说明：直接双击打开 HTML 可能会因为浏览器跨域限制导致 JSON 读不到，所以建议用本地服务器。

## 2. 目录结构
- `index.html / style.css / app.js`：可直接部署的静态网页
- `data/site.json`：页面文案与结构化信息（SEO、段落、图、交互模块配置）
- `data/interactive/`：交互模块数据（跨物种脑图切换、rTMS参数、CTQ数据、证据/推测过滤器）
- `assets/figures/`：从论文PDF裁切出的 Fig.1 / Fig.2 / Fig.3 / 表1
- `assets/illustrations/`：可替换的占位信息图（SVG）
- `content/`：便于编辑审校的 Markdown（与 site.json 内容相互参考）

## 3. 关于“证据锚点”
所有关键断言都在文案中用“（证据：第X页 图Y/表Z/段落）”标注来源。
你也可以查看 `content/citations_map.md` 做快速审校。

## 4. 注意
- 论文正文多处提示行为学与临床量表的具体结果细节在补充材料中，正文未给出具体数值变化；本包不补写未报告数值。（证据：第5页 第3.2节；第5页 第3.4节）
- 本包为科普用途，不构成医疗建议；rTMS等干预须由专业医生评估与实施。（证据：第7页 限制段落）
