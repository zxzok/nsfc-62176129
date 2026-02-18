/* ABAFnet public page interactions - vanilla JS, no external deps */

async function fetchJson(url){
  const res = await fetch(url, {cache: "no-store"});
  if(!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return await res.json();
}

function fmt(x, digits=3){
  if(x === null || x === undefined || Number.isNaN(x)) return "NA";
  return Number(x).toFixed(digits);
}

function clearEl(el){
  while(el.firstChild) el.removeChild(el.firstChild);
}

function renderBarChart(container, labels, values, options={}){
  const w = options.width || 760;
  const h = options.height || 260;
  const pad = {l: 50, r: 16, t: 12, b: 46};
  const maxV = options.maxV ?? Math.max(...values, 1);
  const minV = options.minV ?? 0;
  const title = options.title || "";
  const aria = options.ariaLabel || title || "bar chart";
  const errors = options.errors || null;

  clearEl(container);

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", h);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", aria);

  // Title
  if(title){
    const t = document.createElementNS(svgNS, "text");
    t.setAttribute("x", pad.l);
    t.setAttribute("y", pad.t + 12);
    t.setAttribute("font-size", "14");
    t.setAttribute("font-weight", "600");
    t.textContent = title;
    svg.appendChild(t);
  }

  const plotTop = pad.t + (title ? 18 : 0);
  const plotH = h - plotTop - pad.b;
  const plotW = w - pad.l - pad.r;

  const xStep = plotW / labels.length;
  const barW = Math.max(10, xStep * 0.6);

  function yScale(v){
    const clamped = Math.max(minV, Math.min(maxV, v));
    const frac = (clamped - minV) / (maxV - minV || 1);
    return plotTop + (1 - frac) * plotH;
  }

  // Axis line
  const axis = document.createElementNS(svgNS, "line");
  axis.setAttribute("x1", pad.l);
  axis.setAttribute("x2", w - pad.r);
  axis.setAttribute("y1", plotTop + plotH);
  axis.setAttribute("y2", plotTop + plotH);
  axis.setAttribute("stroke", "#333");
  axis.setAttribute("stroke-width", "1");
  svg.appendChild(axis);

  // y ticks
  const ticks = options.ticks || [0, 0.25, 0.5, 0.75, 1.0];
  ticks.forEach(tv => {
    const y = yScale(tv);
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", pad.l);
    line.setAttribute("x2", w - pad.r);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "#ddd");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);

    const tx = document.createElementNS(svgNS, "text");
    tx.setAttribute("x", pad.l - 8);
    tx.setAttribute("y", y + 4);
    tx.setAttribute("text-anchor", "end");
    tx.setAttribute("font-size", "11");
    tx.setAttribute("fill", "#555");
    tx.textContent = tv.toFixed(2);
    svg.appendChild(tx);
  });

  // Bars
  labels.forEach((lab, i) => {
    const v = values[i];
    const x = pad.l + i * xStep + (xStep - barW) / 2;
    const y = yScale(v);
    const bh = plotTop + plotH - y;

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", barW);
    rect.setAttribute("height", bh);
    rect.setAttribute("rx", "4");
    rect.setAttribute("ry", "4");
    rect.setAttribute("fill", "#4c78a8"); // single default-ish color (ok)
    rect.setAttribute("opacity", "0.85");
    svg.appendChild(rect);

    // Error bars (optional)
    if(errors && errors[i] !== null && errors[i] !== undefined){
      const e = errors[i];
      const yTop = yScale(v + e);
      const yBot = yScale(v - e);
      const cx = x + barW / 2;

      const eline = document.createElementNS(svgNS, "line");
      eline.setAttribute("x1", cx);
      eline.setAttribute("x2", cx);
      eline.setAttribute("y1", yTop);
      eline.setAttribute("y2", yBot);
      eline.setAttribute("stroke", "#111");
      eline.setAttribute("stroke-width", "1");
      svg.appendChild(eline);

      const cap1 = document.createElementNS(svgNS, "line");
      cap1.setAttribute("x1", cx - 6);
      cap1.setAttribute("x2", cx + 6);
      cap1.setAttribute("y1", yTop);
      cap1.setAttribute("y2", yTop);
      cap1.setAttribute("stroke", "#111");
      cap1.setAttribute("stroke-width", "1");
      svg.appendChild(cap1);

      const cap2 = document.createElementNS(svgNS, "line");
      cap2.setAttribute("x1", cx - 6);
      cap2.setAttribute("x2", cx + 6);
      cap2.setAttribute("y1", yBot);
      cap2.setAttribute("y2", yBot);
      cap2.setAttribute("stroke", "#111");
      cap2.setAttribute("stroke-width", "1");
      svg.appendChild(cap2);
    }

    // X label
    const lx = document.createElementNS(svgNS, "text");
    lx.setAttribute("x", x + barW / 2);
    lx.setAttribute("y", plotTop + plotH + 18);
    lx.setAttribute("text-anchor", "middle");
    lx.setAttribute("font-size", "11");
    lx.setAttribute("fill", "#333");
    // shorten long labels
    const short = lab.length > 14 ? (lab.slice(0, 13) + "…") : lab;
    lx.textContent = short;
    svg.appendChild(lx);

    // Value label
    const vx = document.createElementNS(svgNS, "text");
    vx.setAttribute("x", x + barW / 2);
    vx.setAttribute("y", y - 6);
    vx.setAttribute("text-anchor", "middle");
    vx.setAttribute("font-size", "11");
    vx.setAttribute("fill", "#111");
    vx.textContent = (typeof v === "number") ? v.toFixed(3) : "NA";
    svg.appendChild(vx);
  });

  container.appendChild(svg);
}

function renderTable(container, columns, rows){
  clearEl(container);
  const wrap = document.createElement("div");
  wrap.className = "table-wrap";
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  columns.forEach(c => {
    const th = document.createElement("th");
    th.textContent = c.label;
    trh.appendChild(th);
  });
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rows.forEach(r => {
    const tr = document.createElement("tr");
    columns.forEach(c => {
      const td = document.createElement("td");
      const v = r[c.key];
      td.textContent = v === undefined ? "" : String(v);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  container.appendChild(wrap);
}

/* Module 1: Dataset distribution */
async function initDatasetModule(){
  const root = document.getElementById("module-dataset");
  if(!root) return;

  const select = root.querySelector("#ds-select");
  const chart = root.querySelector("#ds-chart");
  const tableEl = root.querySelector("#ds-table");
  const note = root.querySelector("#ds-note");

  try{
    const cn = await fetchJson("assets/data/table3_cnrac_distribution.json");
    const cs = await fetchJson("assets/data/table4_csnrac_distribution.json");
    const all = [
      ...cn.data.map(d => ({...d, source_ref: cn.source_ref})),
      ...cs.data.map(d => ({...d, source_ref: cs.source_ref}))
    ];

    function update(){
      const ds = select.value;
      const subset = all.filter(d => d.dataset === ds);
      const labels = subset.map(d => d.group);
      const values = subset.map(d => d.n);
      const maxV = Math.max(...values, 1);
      renderBarChart(chart, labels, values, {
        title: `${ds} 组别样本数（人）`,
        ariaLabel: `${ds} dataset distribution`,
        maxV: maxV,
        minV: 0,
        ticks: [0, Math.round(maxV*0.25), Math.round(maxV*0.5), Math.round(maxV*0.75), maxV]
      });
      // table
      renderTable(tableEl,
        [
          {key:"group", label:"分组"},
          {key:"score_range", label:"量表分数范围"},
          {key:"n", label:"人数"}
        ],
        subset.map(d => ({group: d.group, score_range: d.score_range, n: d.n}))
      );
      note.textContent = `数据来源：${subset[0]?.source_ref || ""}`;
    }

    select.addEventListener("change", update);
    update();
  }catch(err){
    note.textContent = "交互数据加载失败：请使用本地静态服务器打开页面（见README）。";
    console.error(err);
  }
}

/* Module 2: Feature fusion comparator */
async function initFusionModule(){
  const root = document.getElementById("module-fusion");
  if(!root) return;

  const metricSel = root.querySelector("#ff-metric");
  const showErr = root.querySelector("#ff-error");
  const chart = root.querySelector("#ff-chart");
  const tableEl = root.querySelector("#ff-table");
  const note = root.querySelector("#ff-note");

  const metricMap = {
    "acc": {mean:"acc_mean", sd:"acc_sd", label:"ACC"},
    "roc_auc": {mean:"roc_auc_mean", sd:"roc_auc_sd", label:"ROC-AUC"},
    "precision": {mean:"precision_mean", sd:"precision_sd", label:"Precision"},
    "recall": {mean:"recall_mean", sd:"recall_sd", label:"Recall"},
    "f1": {mean:"f1_mean", sd:"f1_sd", label:"F1"}
  };

  try{
    const data = await fetchJson("assets/data/table5_single_vs_fusion.json");
    const rows = data.data;

    function update(){
      const m = metricSel.value;
      const meta = metricMap[m];
      const labels = rows.map(r => r.model_label);
      const values = rows.map(r => r[meta.mean]);
      const errors = showErr.checked ? rows.map(r => r[meta.sd]) : null;

      renderBarChart(chart, labels, values, {
        title: `CNRAC：${meta.label}（表5）`,
        ariaLabel: `CNRAC ${meta.label} across models`,
        maxV: 1,
        minV: 0,
        errors: errors
      });

      renderTable(tableEl,
        [
          {key:"model_label", label:"模型/特征"},
          {key:"mean", label:`${meta.label} 均值`},
          {key:"sd", label:"±SD"}
        ],
        rows.map(r => ({
          model_label: r.model_label,
          mean: fmt(r[meta.mean], 3),
          sd: fmt(r[meta.sd], 3)
        }))
      );

      note.textContent = `数据来源：${data.source_ref}`;
    }

    metricSel.addEventListener("change", update);
    showErr.addEventListener("change", update);
    update();
  }catch(err){
    note.textContent = "交互数据加载失败：请使用本地静态服务器打开页面（见README）。";
    console.error(err);
  }
}

/* Module 3: Severity scorecard */
async function initSeverityModule(){
  const root = document.getElementById("module-severity");
  if(!root) return;

  const groupSel = root.querySelector("#sv-group");
  const sortSel = root.querySelector("#sv-sort");
  const tableEl = root.querySelector("#sv-table");
  const note = root.querySelector("#sv-note");

  try{
    const data = await fetchJson("assets/data/table6_severity_tasks.json");
    const rows = data.data;

    function update(){
      const group = groupSel.value;
      const sortKey = sortSel.value;

      let subset = rows.filter(r => group === "all" ? true : r.task_group === group);
      subset = subset.slice().sort((a,b) => (b[sortKey] - a[sortKey]));

      renderTable(tableEl,
        [
          {key:"task_group", label:"任务组"},
          {key:"task", label:"任务"},
          {key:"acc", label:"ACC"},
          {key:"auc", label:"AUC"}
        ],
        subset.map(r => ({
          task_group: r.task_group,
          task: `${r.class_a} vs ${r.class_b}`,
          acc: `${fmt(r.acc_mean,3)} ± ${fmt(r.acc_sd,3)}`,
          auc: `${fmt(r.auc_mean,3)} ± ${fmt(r.auc_sd,3)}`
        }))
      );

      note.textContent = `数据来源：${data.source_ref}`;
    }

    groupSel.addEventListener("change", update);
    sortSel.addEventListener("change", update);
    update();
  }catch(err){
    note.textContent = "交互数据加载失败：请使用本地静态服务器打开页面（见README）。";
    console.error(err);
  }
}

/* Module 4: Ablation what-if */
async function initAblationModule(){
  const root = document.getElementById("module-ablation");
  if(!root) return;

  const sel = root.querySelector("#ab-select");
  const kpi = root.querySelector("#ab-kpi");
  const chart = root.querySelector("#ab-chart");
  const note = root.querySelector("#ab-note");

  try{
    const abl = await fetchJson("assets/data/table7_ablation.json");
    const fusion = await fetchJson("assets/data/table5_single_vs_fusion.json");

    const fusionRow = fusion.data.find(r => r.model_id === "fusion");
    const rows = abl.data;

    // populate
    rows.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r.excluded_feature;
      opt.textContent = r.excluded_label;
      sel.appendChild(opt);
    });

    function update(){
      const id = sel.value;
      const r = rows.find(x => x.excluded_feature === id);
      if(!r) return;

      const deltas = {
        "ΔACC": r.acc_mean - fusionRow.acc_mean,
        "ΔAUC": r.auc_mean - fusionRow.roc_auc_mean,
        "ΔRecall": r.recall_mean - fusionRow.recall_mean
      };

      // kpi
      clearEl(kpi);
      const boxes = [
        {label:"消融后ACC", value:`${fmt(r.acc_mean,3)} ± ${fmt(r.acc_sd,3)}`},
        {label:"消融后AUC", value:`${fmt(r.auc_mean,3)} ± ${fmt(r.auc_sd,3)}`},
        {label:"相对完整融合 ΔACC", value: fmt(deltas["ΔACC"],3)},
        {label:"相对完整融合 ΔAUC", value: fmt(deltas["ΔAUC"],3)}
      ];
      boxes.forEach(b => {
        const div = document.createElement("div");
        div.className = "box";
        const l = document.createElement("div");
        l.className = "label";
        l.textContent = b.label;
        const v = document.createElement("div");
        v.className = "value";
        v.textContent = b.value;
        div.appendChild(l);
        div.appendChild(v);
        kpi.appendChild(div);
      });

      // chart: show ACC and AUC, and full fusion as reference
      const labels = ["ACC", "AUC"];
      const values = [r.acc_mean, r.auc_mean];
      const errors = [r.acc_sd, r.auc_sd];
      renderBarChart(chart, labels, values, {
        title: `消融后表现（去掉：${r.excluded_label}）`,
        ariaLabel: `ablation results`,
        maxV: 1,
        minV: 0,
        errors: errors
      });

      note.textContent = `数据来源：${abl.source_ref}；参考完整融合：${fusion.source_ref}`;
    }

    sel.addEventListener("change", update);
    // default select first
    if(rows.length) sel.value = rows[0].excluded_feature;
    update();
  }catch(err){
    note.textContent = "交互数据加载失败：请使用本地静态服务器打开页面（见README）。";
    console.error(err);
  }
}

/* Module 5: PHQ-9 threshold slider */
async function initPHQModule(){
  const root = document.getElementById("module-phq");
  if(!root) return;

  const groupSel = root.querySelector("#phq-group");
  const slider = root.querySelector("#phq-slider");
  const sliderVal = root.querySelector("#phq-val");
  const kpi = root.querySelector("#phq-kpi");
  const chart = root.querySelector("#phq-chart");
  const note = root.querySelector("#phq-note");

  try{
    const data = await fetchJson("assets/data/csnrac_threshold_validation.json");
    const rows = data.data;

    function availableThresholds(group){
      return rows.filter(r => r.endpoint_group === group).map(r => r.threshold).sort((a,b)=>a-b);
    }

    function updateSlider(group){
      const ts = availableThresholds(group);
      slider.min = Math.min(...ts);
      slider.max = Math.max(...ts);
      slider.step = 1;
      // If current value not in set, snap to first
      if(!ts.includes(Number(slider.value))){
        slider.value = ts[0];
      }
    }

    function update(){
      const group = groupSel.value;
      updateSlider(group);

      const t = Number(slider.value);
      sliderVal.textContent = String(t);

      const r = rows.find(x => x.endpoint_group === group && x.threshold === t);
      if(!r) return;

      // KPI boxes
      clearEl(kpi);
      const boxes = [
        {label:"ACC", value: fmt(r.acc,3)},
        {label:"Precision", value: fmt(r.precision,3)},
        {label:"Recall", value: fmt(r.recall,3)},
        {label:"F1", value: fmt(r.f1,3)},
        {label:"PR_AUC", value: fmt(r.pr_auc,3)}
      ];
      boxes.forEach(b => {
        const div = document.createElement("div");
        div.className = "box";
        const l = document.createElement("div");
        l.className = "label";
        l.textContent = b.label;
        const v = document.createElement("div");
        v.className = "value";
        v.textContent = b.value;
        div.appendChild(l);
        div.appendChild(v);
        kpi.appendChild(div);
      });

      // line chart: show recall across thresholds for group
      const subset = rows.filter(x => x.endpoint_group === group).sort((a,b)=>a.threshold-b.threshold);
      const labels = subset.map(x => String(x.threshold));
      const values = subset.map(x => x.recall);
      renderBarChart(chart, labels, values, {
        title: `${group}：Recall随阈值变化（表7，p.19）`,
        ariaLabel: "recall vs threshold",
        maxV: 1,
        minV: 0
      });

      note.textContent = `数据来源：${data.source_ref}。提示：阈值选择会影响漏检（Recall）与PR_AUC。`;
    }

    groupSel.addEventListener("change", () => {
      updateSlider(groupSel.value);
      update();
    });
    slider.addEventListener("input", update);

    update();
  }catch(err){
    note.textContent = "交互数据加载失败：请使用本地静态服务器打开页面（见README）。";
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initDatasetModule();
  initFusionModule();
  initSeverityModule();
  initAblationModule();
  initPHQModule();
});
