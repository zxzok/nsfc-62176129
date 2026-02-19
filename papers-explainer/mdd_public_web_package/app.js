/* eslint-disable no-alert */
(function(){
  "use strict";

  // -----------------------
  // Embedded data (offline-friendly)
  // -----------------------
  const TABLE1_METRICS = [{"metric_id": "hamd_total", "metric_label_cn": "HAMD抑郁严重度总分", "group_id": "S1", "mean": 21.1, "sd": 10.1, "n_metric": 93, "unit": "分", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "hamd_total", "metric_label_cn": "HAMD抑郁严重度总分", "group_id": "S2", "mean": 18.1, "sd": 10.0, "n_metric": 93, "unit": "分", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "hamd_total", "metric_label_cn": "HAMD抑郁严重度总分", "group_id": "S3", "mean": 17.4, "sd": 9.6, "n_metric": 141, "unit": "分", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "hamd_total", "metric_label_cn": "HAMD抑郁严重度总分", "group_id": "HC", "mean": 1.3, "sd": 2.3, "n_metric": 480, "unit": "分", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "hama_total", "metric_label_cn": "HAMA焦虑严重度总分", "group_id": "S1", "mean": 17.4, "sd": 10.3, "n_metric": 93, "unit": "分", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "hama_total", "metric_label_cn": "HAMA焦虑严重度总分", "group_id": "S2", "mean": 17.8, "sd": 10.2, "n_metric": 93, "unit": "分", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "hama_total", "metric_label_cn": "HAMA焦虑严重度总分", "group_id": "S3", "mean": 16.0, "sd": 11.1, "n_metric": 141, "unit": "分", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "hama_total", "metric_label_cn": "HAMA焦虑严重度总分", "group_id": "HC", "mean": 1.2, "sd": 2.5, "n_metric": 480, "unit": "分", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_cr", "metric_label_cn": "WCST正确反应（CR）", "group_id": "S1", "mean": 24.9, "sd": 10.8, "n_metric": 62, "unit": "次", "higher_is_worse": false, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_cr", "metric_label_cn": "WCST正确反应（CR）", "group_id": "S2", "mean": 30.0, "sd": 10.1, "n_metric": 76, "unit": "次", "higher_is_worse": false, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_cr", "metric_label_cn": "WCST正确反应（CR）", "group_id": "S3", "mean": 29.4, "sd": 11.2, "n_metric": 115, "unit": "次", "higher_is_worse": false, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_cr", "metric_label_cn": "WCST正确反应（CR）", "group_id": "HC", "mean": 30.2, "sd": 12.3, "n_metric": 383, "unit": "次", "higher_is_worse": false, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_te", "metric_label_cn": "WCST总错误（TE）", "group_id": "S1", "mean": 23.1, "sd": 10.8, "n_metric": 62, "unit": "次", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_te", "metric_label_cn": "WCST总错误（TE）", "group_id": "S2", "mean": 17.9, "sd": 10.1, "n_metric": 76, "unit": "次", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_te", "metric_label_cn": "WCST总错误（TE）", "group_id": "S3", "mean": 18.6, "sd": 10.8, "n_metric": 115, "unit": "次", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_te", "metric_label_cn": "WCST总错误（TE）", "group_id": "HC", "mean": 17.8, "sd": 12.4, "n_metric": 383, "unit": "次", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_pe", "metric_label_cn": "WCST持续性错误（PE）", "group_id": "S1", "mean": 9.4, "sd": 8.2, "n_metric": 62, "unit": "次", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_pe", "metric_label_cn": "WCST持续性错误（PE）", "group_id": "S2", "mean": 6.5, "sd": 6.7, "n_metric": 76, "unit": "次", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_pe", "metric_label_cn": "WCST持续性错误（PE）", "group_id": "S3", "mean": 6.3, "sd": 5.9, "n_metric": 115, "unit": "次", "higher_is_worse": true, "source_ref": "表1（第4页）"}, {"metric_id": "wcst_pe", "metric_label_cn": "WCST持续性错误（PE）", "group_id": "HC", "mean": 6.4, "sd": 7.0, "n_metric": 383, "unit": "次", "higher_is_worse": true, "source_ref": "表1（第4页）"}];
  const PUZZLE_DATA = {"subtypes": [{"subtype_id": "S1", "label_cn": "亚型1", "share_in_mdd": 28, "n": 93, "tagline": "更像“遗传/突触调控 + 边缘系统—初级皮层失衡”", "key_sources": ["第3页RESULTS；图1A（第5页）", "第6页RESULTS；图5A/5D（第8页）", "表1（第4页）"]}, {"subtype_id": "S2", "label_cn": "亚型2", "share_in_mdd": 28, "n": 93, "tagline": "更像“免疫炎症‑代谢异常 + 前额叶—初级感觉皮层失衡”", "key_sources": ["第3页RESULTS；图1B（第5页）", "第5–6页RESULTS；图2/图3（第5–6页）", "第6页RESULTS；图4（第7页）"]}, {"subtype_id": "S3", "label_cn": "亚型3", "share_in_mdd": 44, "n": 141, "tagline": "影像模式清晰，但分子线索尚不明确", "key_sources": ["第3页RESULTS；图1C（第5页）", "第1页摘要；第6页RESULTS", "第9页DISCUSSION/CONCLUSION"]}], "evidence_tiles": [{"tile_id": "alff_s1", "label": "边缘系统更活跃、初级皮层更“低调”", "hint": "海马/扣带/杏仁核等升高，初级皮层降低", "correct_subtypes": ["S1"], "source_ref": "第3页RESULTS；图1A（第5页）"}, {"tile_id": "alff_s2", "label": "前额叶更活跃、初级感觉皮层更“低调”", "hint": "前额叶升高，初级感觉皮层降低", "correct_subtypes": ["S2"], "source_ref": "第3页RESULTS；图1B（第5页）"}, {"tile_id": "alff_s3", "label": "前额叶更“低调”、初级感觉皮层更活跃", "hint": "前额叶降低，初级感觉皮层升高", "correct_subtypes": ["S3"], "source_ref": "第3页RESULTS；图1C（第5页）"}, {"tile_id": "prs_s1", "label": "遗传风险更突出（PRS显著）", "hint": "PT=0.001与0.01显著；解释方差约5.9%与8.1%", "correct_subtypes": ["S1"], "source_ref": "第6页RESULTS；图5A（第8页）"}, {"tile_id": "hamd_s1", "label": "抑郁症状更重（HAMD更高）", "hint": "均值21.1±10.1，高于另外两型", "correct_subtypes": ["S1"], "source_ref": "表1（第4页）；第3页RESULTS临床比较"}, {"tile_id": "cog_s1", "label": "认知表现更受影响（WCST更差）", "hint": "CR更低、TE更高等差异在子样本中更明显", "correct_subtypes": ["S1"], "source_ref": "第3页RESULTS；表1（第4页）"}, {"tile_id": "il1b_s2", "label": "IL‑1β显著升高", "hint": "三种炎症因子里，只有IL‑1β在该亚型显著", "correct_subtypes": ["S2"], "source_ref": "第5页RESULTS；图2B（第5页）"}, {"tile_id": "eis_s2", "label": "EIS更低（代表慢性炎症更高）", "hint": "权重为负：EIS越低代表炎症状态越高", "correct_subtypes": ["S2"], "source_ref": "第3页EIS定义；第5页RESULTS；图3A（第6页）"}, {"tile_id": "neu_s2", "label": "中性粒细胞比例更高", "hint": "甲基化估计的免疫细胞比例里该项显著", "correct_subtypes": ["S2"], "source_ref": "第5页RESULTS；图3G（第6页）"}, {"tile_id": "dm_s2", "label": "代谢物变化更集中（36个差异代谢物）", "hint": "另外两型未检出差异代谢物", "correct_subtypes": ["S2"], "source_ref": "第6页RESULTS；图4A–C（第7页）"}, {"tile_id": "no_marker_s3", "label": "暂未见清晰分子标志", "hint": "炎症/遗传/代谢层面未出现显著差异", "correct_subtypes": ["S3"], "source_ref": "第1页摘要；第6页RESULTS（无DMs/无PRS信号）；第9页DISCUSSION"}], "source_note": "以上均为论文原文与图表结论的结构化整理（证据锚点见各tile的source_ref）。"};
  const GLOSSARY = [{"term": "重性抑郁障碍（MDD）", "definition": "一种以持续情绪低落、兴趣减退等为核心表现的临床诊断类别；论文讨论其内部差异很大。", "analogy": "像“发烧”这个症状名，背后可能对应多种不同原因。", "source_ref": "第1页摘要；第1页INTRODUCTION"}, {"term": "异质性（heterogeneity）", "definition": "同一诊断名下，症状与生物原因不一定一一对应。", "analogy": "同样“咳嗽”，可能是感冒、过敏或哮喘。", "source_ref": "第1页INTRODUCTION第1段"}, {"term": "静息态fMRI", "definition": "人在不做任务、安静休息时测量大脑活动的成像方式。", "analogy": "不让人“做题”，只看大脑“待机时的波动”。", "source_ref": "第2页Neuroimaging data acquisition（keep eyes closed等）"}, {"term": "ALFF（低频振幅）", "definition": "衡量静息状态下局部自发神经活动强弱的指标，并具有较好的重复测量可靠性。", "analogy": "每个脑区在安静状态下的“自然音量”。", "source_ref": "第2页ALFF定义与可靠性描述"}, {"term": "SVD（奇异值分解）降维", "definition": "把高维数据压缩成更少的维度，便于聚类分析；论文把ALFF数据降到30维。", "analogy": "把一首歌的复杂波形压缩成30个“关键特征”。", "source_ref": "第2页Identification of neuroimaging subtypes"}, {"term": "K-means聚类", "definition": "一种把相似样本自动分到同一组的算法；论文据此把MDD分成3个亚型。", "analogy": "按“相似口味”自动分出三份歌单/菜单。", "source_ref": "第2页Identification of neuroimaging subtypes；第3页RESULTS"}, {"term": "多组学（multi-omics）", "definition": "同时从遗传、表观遗传、代谢物、炎症因子等多个层面观察生物差异。", "analogy": "不仅看“说明书”（基因），也看“便签”（甲基化）、“库存”（代谢物）与“报警器”（炎症因子）。", "source_ref": "第1页摘要；第2–3页Multi-omics data acquisition"}, {"term": "IL‑1β", "definition": "一种促炎细胞因子；论文发现它在亚型2显著升高。", "analogy": "免疫系统“报警声”的一种。", "source_ref": "第5页RESULTS；图2B（第5页）"}, {"term": "DNA甲基化", "definition": "一种表观遗传标记，可影响基因表达；论文用它计算EIS并估计免疫细胞比例。", "analogy": "基因像书，甲基化像贴在书页上的“可读/不可读”标签。", "source_ref": "第2页EPIC芯片；第3页EIS与免疫细胞估计"}, {"term": "EIS（表观遗传炎症评分）", "definition": "由多个甲基化位点加权得到的慢性炎症指标；论文强调权重为负，EIS更低代表炎症更高。", "analogy": "比一次抽血更像“长期健康记录”的炎症倾向。", "source_ref": "第3页EIS定义；第5页RESULTS；图3A（第6页）"}, {"term": "PRS（多基因风险评分）", "definition": "把许多遗传位点的小效应累加成总体遗传风险；论文发现只有亚型1在部分阈值下显著。", "analogy": "不是一个开关，而是一堆小旋钮一起把风险推高一点点。", "source_ref": "第3页PRS方法；第6页RESULTS；图5A（第8页）"}];
  const FAQ = [{"q": "这是不是说明抑郁症就只有三种？", "a": "不能这么下结论。这项研究在一个队列中用ALFF聚类得到3个亚型（28%/28%/44%），是否普遍适用于其他人群需要独立样本复现与验证。", "source_ref": "第3页RESULTS；第9页LIMITATION"}, {"q": "我怎么知道自己属于哪一型？能用来做自测吗？", "a": "目前不能。分型依赖研究级别的静息态fMRI处理与机器学习流程，论文也未给出可用于个人判别的阈值或临床流程。", "source_ref": "第2页方法；第9页LIMITATION"}, {"q": "这项研究能直接改变医生给我的治疗方案吗？", "a": "不能直接改变。本研究没有做“按亚型分配治疗”的干预验证，它提供的是机制分层的证据与研究路线。", "source_ref": "第1页摘要（proof of concept）；第9页CONCLUSION"}, {"q": "亚型2炎症更高，是不是就该用抗炎药？", "a": "论文讨论认为抗炎治疗对具有免疫炎症特征的子群体可能是有前景的辅助治疗方向，但这不是本研究验证的疗效结论。", "source_ref": "第9页DISCUSSION；第9页LIMITATION"}, {"q": "亚型1遗传风险更高，是不是家族里有人抑郁我就一定会得？", "a": "不是。PRS只解释部分方差（论文在亚型1报告约5.9%与8.1%），遗传不是决定因素。", "source_ref": "第6页PRS结果；图5A（第8页）"}, {"q": "为什么亚型3没有找到分子标志？是不是测错了？", "a": "论文的结论是目前未在炎症、遗传、代谢层面检出显著差异，并推测其机制更复杂、更异质；是否因样本量与指标覆盖导致信号不足，需要后续研究。", "source_ref": "第1页摘要；第6页RESULTS；第9页DISCUSSION"}, {"q": "药物会不会影响炎症或代谢结果？", "a": "论文承认并非所有患者未用药，并在表观遗传与代谢分析中把用药状态作为协变量控制，但仍可能影响外周分子指标解释。", "source_ref": "第3页DMs方法；第9页LIMITATION"}, {"q": "这项研究能否用血检替代脑影像？", "a": "论文的分型核心基于脑影像ALFF；血液指标用于“核验差异”，论文未提出用血检独立完成分型的临床方案。", "source_ref": "第1页摘要；第2页方法；第9页CONCLUSION"}, {"q": "相关性热图（图6）能说明‘谁导致谁’吗？", "a": "不能。论文明确研究为横断面设计，相关性不等于因果，需要纵向研究检验因果关系。", "source_ref": "第6页相关性分析；第9页LIMITATION"}, {"q": "下一步最关键的验证是什么？", "a": "更大样本复现分型、纵向随访检验因果，并进一步解释亚型3机制。", "source_ref": "第9页LIMITATION；第9页DISCUSSION"}];

  const GROUP_LABEL = {
    "HC": "健康对照（HC）",
    "S1": "亚型1",
    "S2": "亚型2",
    "S3": "亚型3"
  };

  // -----------------------
  // Interaction 1: Brainmap switcher (Fig.1 as a sprite)
  // -----------------------
  const bmCanvas = document.querySelector(".bm-canvas");
  const bmCaption = document.getElementById("bm_caption");
  const bmButtons = Array.from(document.querySelectorAll(".bm-controls .btn"));

  const BM_SUMMARY = {
    "S1": "亚型1：边缘系统（海马、扣带、杏仁核、丘脑等）ALFF升高，初级皮层降低。（证据：第3页；图1A第5页）",
    "S2": "亚型2：前额叶ALFF升高，初级感觉皮层降低。（证据：第3页；图1B第5页）",
    "S3": "亚型3：前额叶ALFF降低，初级感觉皮层升高。（证据：第3页；图1C第5页）"
  };

  function setSubtype(subtypeId){
    // background-position X: 0% / 50% / 100% for 3 columns
    const pos = subtypeId === "S1" ? "0%" : (subtypeId === "S2" ? "50%" : "100%");
    bmCanvas.style.backgroundPosition = `${pos} 50%`;
    bmCaption.textContent = BM_SUMMARY[subtypeId] || "";
    bmButtons.forEach(btn => {
      const active = btn.dataset.subtype === subtypeId;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  bmButtons.forEach(btn => {
    btn.addEventListener("click", () => setSubtype(btn.dataset.subtype));
  });
  if (bmCanvas) setSubtype("S1");

  // -----------------------
  // Interaction 2: Metric dashboard (Table 1)
  // -----------------------
  const metricSelect = document.getElementById("metricSelect");
  const showErrorBars = document.getElementById("showErrorBars");
  const mdSvg = document.getElementById("mdSvg");
  const mdNote = document.getElementById("md_note");

  function clearSvg(svg){
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  function el(name, attrs){
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    if (attrs) {
      Object.entries(attrs).forEach(([k,v]) => node.setAttribute(k, String(v)));
    }
    return node;
  }

  function drawText(svg, text, x, y, opts={}){
    const t = el("text", {
      x, y,
      "font-size": opts.size || 14,
      "fill": opts.fill || "rgba(255,255,255,.92)",
      "font-weight": opts.weight || 500
    });
    t.textContent = text;
    svg.appendChild(t);
  }

  function renderMetric(metricId, withSd){
    if (!mdSvg) return;

    const items = TABLE1_METRICS.filter(r => r.metric_id === metricId);
    if (!items.length) return;

    // Order: S1, S2, S3, HC (so users see subtypes first)
    const order = ["S1","S2","S3","HC"];
    const data = order
      .map(g => items.find(r => r.group_id === g))
      .filter(Boolean);

    const label = data[0].metric_label_cn || metricId;
    const unit = data[0].unit || "";
    const maxVal = Math.max(...data.map(d => {
      const base = (d.mean ?? 0);
      const sd = (withSd ? (d.sd ?? 0) : 0);
      return base + sd;
    }));

    // SVG layout
    const W = 900, H = 340;
    const pad = { l: 60, r: 16, t: 36, b: 62 };
    const plotW = W - pad.l - pad.r;
    const plotH = H - pad.t - pad.b;

    clearSvg(mdSvg);

    // Title
    drawText(mdSvg, `${label}（单位：${unit}）`, pad.l, 24, {size: 16, weight: 700});

    // Axes
    const axis = el("line", { x1: pad.l, y1: pad.t + plotH, x2: pad.l + plotW, y2: pad.t + plotH, stroke: "rgba(255,255,255,.22)" });
    mdSvg.appendChild(axis);

    // Y ticks
    const ticks = 4;
    for (let i=0; i<=ticks; i++) {
      const v = (maxVal * i) / ticks;
      const y = pad.t + plotH - (v / maxVal) * plotH;
      const tick = el("line", { x1: pad.l, y1: y, x2: pad.l + plotW, y2: y, stroke: "rgba(255,255,255,.08)" });
      mdSvg.appendChild(tick);
      drawText(mdSvg, v.toFixed(1), pad.l - 10, y + 4, {size: 12, fill: "rgba(255,255,255,.65)"});
      tick.setAttribute("shape-rendering", "crispEdges");
    }

    // Bars
    const gap = 18;
    const barW = (plotW - gap * (data.length - 1)) / data.length;
    const colors = {
      "S1": "rgba(126,240,201,.70)",
      "S2": "rgba(122,162,255,.70)",
      "S3": "rgba(255,215,106,.70)",
      "HC": "rgba(255,255,255,.35)"
    };

    data.forEach((d, idx) => {
      const x = pad.l + idx * (barW + gap);
      const val = d.mean ?? 0;
      const h = (val / maxVal) * plotH;
      const y = pad.t + plotH - h;

      const rect = el("rect", {
        x, y, width: barW, height: h,
        rx: 10, ry: 10,
        fill: colors[d.group_id] || "rgba(255,255,255,.45)",
        stroke: "rgba(255,255,255,.18)"
      });
      mdSvg.appendChild(rect);

      // Error bars (SD)
      if (withSd) {
        const sd = d.sd ?? 0;
        const topVal = val + sd;
        const botVal = Math.max(0, val - sd);
        const yTop = pad.t + plotH - (topVal / maxVal) * plotH;
        const yBot = pad.t + plotH - (botVal / maxVal) * plotH;
        const cx = x + barW/2;

        const line = el("line", { x1: cx, y1: yTop, x2: cx, y2: yBot, stroke: "rgba(255,255,255,.65)", "stroke-width": 2 });
        const cap1 = el("line", { x1: cx-10, y1: yTop, x2: cx+10, y2: yTop, stroke: "rgba(255,255,255,.65)", "stroke-width": 2 });
        const cap2 = el("line", { x1: cx-10, y1: yBot, x2: cx+10, y2: yBot, stroke: "rgba(255,255,255,.65)", "stroke-width": 2 });
        mdSvg.appendChild(line); mdSvg.appendChild(cap1); mdSvg.appendChild(cap2);
      }

      // Labels
      drawText(mdSvg, GROUP_LABEL[d.group_id] || d.group_id, x + barW/2, pad.t + plotH + 26, {size: 12, fill:"rgba(255,255,255,.78)"});
      mdSvg.lastChild.setAttribute("text-anchor","middle");

      // Value text
      drawText(mdSvg, val.toFixed(1), x + barW/2, y - 8, {size: 12, fill:"rgba(255,255,255,.85)", weight: 700});
      mdSvg.lastChild.setAttribute("text-anchor","middle");
    });

    // Footnote
    const anyWcst = metricId.startsWith("wcst_");
    if (anyWcst) {
      const ns = data.map(d => `${GROUP_LABEL[d.group_id]} n=${d.n_metric ?? "?"}`).join("；");
      mdNote.textContent = `提示：WCST为子样本（${ns}）。数据来自表1（第4页）。`;
    } else {
      mdNote.textContent = `数据来自表1（第4页）。`;
    }
  }

  function refreshDashboard(){
    const metricId = metricSelect?.value || "hamd_total";
    const withSd = !!showErrorBars?.checked;
    renderMetric(metricId, withSd);
  }

  metricSelect?.addEventListener("change", refreshDashboard);
  showErrorBars?.addEventListener("change", refreshDashboard);
  refreshDashboard();

  // -----------------------
  // Interaction 3: Mechanism evidence puzzle (drag & drop)
  // -----------------------
  const tileBin = document.getElementById("tileBin");
  const dropzones = Array.from(document.querySelectorAll(".dropzone"));
  const pzCheck = document.getElementById("pzCheck");
  const pzReset = document.getElementById("pzReset");
  const pzHint = document.getElementById("pzHint");
  const pzStatus = document.getElementById("pzStatus");

  function createTile(tile){
    const div = document.createElement("div");
    div.className = "tile";
    div.draggable = true;
    div.id = `tile_${tile.tile_id}`;
    div.dataset.tileId = tile.tile_id;
    div.dataset.correct = JSON.stringify(tile.correct_subtypes);
    div.dataset.source = tile.source_ref;
    div.dataset.hint = tile.hint || "";
    div.innerHTML = `<strong>${tile.label}</strong><small class="tile-meta" aria-label="证据锚点（检查后显示）"></small>`;
    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", div.id);
      e.dataTransfer.effectAllowed = "move";
    });
    return div;
  }

  function populateTiles(){
    if (!tileBin) return;
    tileBin.innerHTML = "";
    PUZZLE_DATA.evidence_tiles.forEach(t => tileBin.appendChild(createTile(t)));
  }

  function allowDrop(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e){
    e.preventDefault();
    const tileId = e.dataTransfer.getData("text/plain");
    const tile = document.getElementById(tileId);
    if (!tile) return;

    const zoneList = e.currentTarget.querySelector(".zone-list");
    if (!zoneList) return;

    // Move tile to zone list
    zoneList.appendChild(tile);
    tile.classList.remove("correct","wrong");
    tile.querySelector(".tile-meta").textContent = "";
    if (pzStatus) pzStatus.textContent = "已放置一张卡片。";
  }

  dropzones.forEach(z => {
    z.addEventListener("dragover", allowDrop);
    z.addEventListener("drop", handleDrop);
  });

  function allTiles(){
    return Array.from(document.querySelectorAll(".tile"));
  }

  function resetPuzzle(){
    populateTiles();
    dropzones.forEach(z => z.querySelector(".zone-list").innerHTML = "");
    if (pzStatus) pzStatus.textContent = "已重置。";
  }

  function checkPuzzle(){
    const tiles = allTiles();
    let correct = 0, total = tiles.length;

    tiles.forEach(tile => {
      const parentZone = tile.closest(".dropzone");
      const placedSubtype = parentZone ? parentZone.dataset.subtype : null;
      const correctSubs = JSON.parse(tile.dataset.correct || "[]");

      const meta = tile.querySelector(".tile-meta");
      if (meta) meta.textContent = `证据：${tile.dataset.source}`;

      if (placedSubtype && correctSubs.includes(placedSubtype)) {
        tile.classList.add("correct");
        tile.classList.remove("wrong");
        correct += 1;
      } else {
        tile.classList.add("wrong");
        tile.classList.remove("correct");
      }
    });

    const unplaced = tiles.filter(t => !t.closest(".dropzone")).length;
    const msg = `得分：${correct} / ${total}。未放置：${unplaced}。提示：完成后每张卡会显示证据锚点。`;
    if (pzStatus) pzStatus.textContent = msg;
  }

  function hintPuzzle(){
    const tiles = allTiles();
    // Pick a tile that is either unplaced or wrongly placed
    const candidates = tiles.filter(t => {
      const parentZone = t.closest(".dropzone");
      if (!parentZone) return true;
      const placedSubtype = parentZone.dataset.subtype;
      const correctSubs = JSON.parse(t.dataset.correct || "[]");
      return !correctSubs.includes(placedSubtype);
    });
    if (!candidates.length) {
      if (pzStatus) pzStatus.textContent = "看起来都放对了！可以点击“检查答案”确认。";
      return;
    }
    const t = candidates[Math.floor(Math.random() * candidates.length)];
    const hint = t.dataset.hint || "这张卡片在论文中有明确证据锚点。";
    if (pzStatus) pzStatus.textContent = `提示卡片：${t.querySelector("strong")?.textContent || ""} —— ${hint}（证据：${t.dataset.source}）`;
    // Briefly flash
    t.style.outline = "3px solid rgba(122,162,255,.7)";
    setTimeout(() => t.style.outline = "", 900);
  }

  pzReset?.addEventListener("click", resetPuzzle);
  pzCheck?.addEventListener("click", checkPuzzle);
  pzHint?.addEventListener("click", hintPuzzle);
  resetPuzzle();

  // -----------------------
  // Glossary & FAQ (render excerpts)
  // -----------------------
  const glossaryList = document.getElementById("glossaryList");
  const faqList = document.getElementById("faqList");

  if (glossaryList) {
    GLOSSARY.slice(0, 6).forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${item.term}</strong>：${item.definition}<br/><span class="cite">类比：${item.analogy}（证据：${item.source_ref}）</span>`;
      glossaryList.appendChild(li);
    });
  }

  if (faqList) {
    FAQ.slice(0, 4).forEach(item => {
      const div = document.createElement("div");
      div.className = "faq-item";
      div.innerHTML = `<p class="faq-q">Q：${item.q}</p><p class="faq-a">A：${item.a}<span class="cite">（证据：${item.source_ref}）</span></p>`;
      faqList.appendChild(div);
    });
  }
})();
