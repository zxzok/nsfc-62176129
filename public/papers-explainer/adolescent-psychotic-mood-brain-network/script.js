(function(){
  "use strict";

  function getJSONFromScript(id){
    const el = document.getElementById(id);
    if(!el){ throw new Error("Missing script tag: " + id); }
    return JSON.parse(el.textContent);
  }

  function escapeHTML(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#39;");
  }

  // Very small markdown renderer: paragraphs + line breaks + **bold**
  function renderMarkdownBasic(md){
    if(md === null || md === undefined) return "";
    const safe = escapeHTML(String(md));
    // bold
    const withBold = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    const parts = withBold.split(/\n\s*\n/);
    const html = parts.map(p => "<p>" + p.replace(/\n/g, "<br>") + "</p>").join("");
    return html;
  }

  // Load embedded data
  const page = getJSONFromScript("pageContent");
  const citations = getJSONFromScript("citationsData");
  const baseline = getJSONFromScript("baselineData");
  const symptomChange = getJSONFromScript("symptomChangeData");
  const corrData = getJSONFromScript("correlationData");
  const txChange = getJSONFromScript("treatmentChangeData");
  const txCorr = getJSONFromScript("treatmentCorrData");
  const methodParams = getJSONFromScript("methodParamsData");

  // --- Fill hero ---
  const heroSec = page.sections.find(s => s.id === "hero");
  document.getElementById("hero-title").textContent = heroSec ? heroSec.heading : page.seo.seo_title;
  const heroSubEl = document.getElementById("hero-subtitle");
  heroSubEl.innerHTML = heroSec ? renderMarkdownBasic(heroSec.body_markdown) : "";

  // Paper meta
  const meta = page.paper;
  const metaHTML = `
    <div class="meta-row"><strong>论文：</strong>${escapeHTML(meta.title)}（证据：${escapeHTML(meta.source_ref)}）</div>
    <div class="meta-row"><strong>期刊：</strong>${escapeHTML(meta.journal)} · ${escapeHTML(String(meta.year))} · ${escapeHTML(meta.volume_pages)}（证据：第1页）</div>
    <div class="meta-row"><strong>DOI：</strong><a href="https://doi.org/${escapeHTML(meta.doi)}" target="_blank" rel="noopener">${escapeHTML(meta.doi)}</a>（证据：第1页）</div>
  `;
  document.getElementById("paper-meta").innerHTML = metaHTML;

  // KPI
  const mdpBase = baseline.groups.find(g => g.group === "MDP");
  const mdnpBase = baseline.groups.find(g => g.group === "MDNP");
  document.getElementById("kpi-sample").textContent = `${mdpBase.n + mdnpBase.n}（MDP ${mdpBase.n} / MDNP ${mdnpBase.n}）`;

  const mdpFU = symptomChange.groups.find(g => g.group === "MDP");
  const mdnpFU = symptomChange.groups.find(g => g.group === "MDNP");
  document.getElementById("kpi-followup").textContent = `MDP ${mdpFU.n} / MDNP ${mdnpFU.n}`;

  // Scan: from paper methods (hard-coded from page 3)
  document.getElementById("kpi-scan").textContent = "8分07秒（静息态）";

  // Atlas & threshold
  document.getElementById("kpi-atlas").textContent = `AAL-90；S=0.10–0.34；AUC`;

  // Key r
  document.getElementById("kpi-r").textContent = `r=${txCorr.entry.r}（阳性症状改善×STG_L DC变化）`;

  // --- Fill main narrative sections ---
  function setSectionBody(sectionIdInJSON, targetId){
    const sec = page.sections.find(s => s.id === sectionIdInJSON);
    const el = document.getElementById(targetId);
    if(!el) return;
    el.innerHTML = sec ? renderMarkdownBasic(sec.body_markdown) : "<p>（内容缺失）</p>";
  }

  setSectionBody("read_30s", "read-30s-body");
  setSectionBody("why_it_matters", "why-body");
  setSectionBody("what_they_did", "how-body");
  setSectionBody("findings", "findings-body");
  setSectionBody("so_what", "use-body");
  setSectionBody("limitations_next", "limits-body");
  setSectionBody("take_home", "take-home-body");

  // Disclaimer
  document.getElementById("disclaimer-body").innerHTML = renderMarkdownBasic(page.disclaimer);

  // References list
  const refEl = document.getElementById("references-body");
  refEl.innerHTML = citations.map(c => `<p><span class="badge">${escapeHTML(c.id)}</span> <strong>${escapeHTML(c.label)}</strong>：${escapeHTML(c.ref)}</p>`).join("");

  // --- Visual assets list ---
  const visualsEl = document.getElementById("visuals-body");
  visualsEl.innerHTML = page.visual_assets.map(v => {
    const fields = (v.data_fields_needed && v.data_fields_needed.length)
      ? `<p><strong>需要的数据字段：</strong><code>${escapeHTML(v.data_fields_needed.join(", "))}</code></p>`
      : `<p><strong>需要的数据字段：</strong>仅概念示意（论文未提供可重绘数据）。</p>`;
    return `
      <details>
        <summary>${escapeHTML(v.title)} <span class="badge">${escapeHTML(v.type)}</span></summary>
        <div class="card" style="margin-top:10px;">
          <p><strong>唯一核心信息：</strong>${escapeHTML(v.core_message)}</p>
          <p><strong>制作说明：</strong>${escapeHTML(v.type)}；来源：${escapeHTML(v.source_ref)}</p>
          ${fields}
          <p><strong>无障碍alt文本：</strong>${escapeHTML(v.alt_text)}</p>
        </div>
      </details>
    `;
  }).join("");

  // --- Glossary ---
  const glossaryEl = document.getElementById("glossary-body");
  glossaryEl.innerHTML = page.glossary.map(item => `
    <details>
      <summary><strong>${escapeHTML(item.term)}</strong></summary>
      <div class="card" style="margin-top:10px;">
        <p><strong>一句话解释：</strong>${escapeHTML(item.definition)}</p>
        <p><strong>类比：</strong>${escapeHTML(item.analogy)}</p>
        <p class="small-note">来源：${escapeHTML(item.source_ref)}</p>
      </div>
    </details>
  `).join("");

  // --- FAQ ---
  const faqEl = document.getElementById("faq-body");
  faqEl.innerHTML = page.faq.map(item => `
    <details>
      <summary>${escapeHTML(item.q)}</summary>
      <div class="card" style="margin-top:10px;">
        <p>${escapeHTML(item.a)}</p>
        <p class="small-note">证据锚点：${escapeHTML(item.source_ref.join("；"))}</p>
      </div>
    </details>
  `).join("");

  // ---------- Interactive Module 1: symptom change ----------
  const scaleSelect = document.getElementById("m1-scale");
  const showTableCheckbox = document.getElementById("m1-show-table");
  const chartEl = document.getElementById("m1-chart");
  const tableEl = document.getElementById("m1-table");

  const scaleLabelMap = {
    "HAMD-17":"抑郁严重度（HAMD-17）",
    "HAMA":"焦虑严重度（HAMA）",
    "YMRS":"躁狂症状（YMRS）",
    "BPRS":"总体精神症状（BPRS）",
    "PositiveSymptoms_BPRS6":"阳性症状（BPRS 6条目）"
  };
  const scaleExplainMap = {
    "HAMD-17":"分数越高通常表示抑郁症状越重。",
    "HAMA":"分数越高通常表示焦虑症状越重。",
    "YMRS":"分数越高通常表示躁狂相关症状越明显。",
    "BPRS":"分数越高通常表示总体精神症状负担更重（含多维条目）。",
    "PositiveSymptoms_BPRS6":"作者用BPRS的6个条目汇总为‘阳性症状’，用于表征幻觉/妄想等精神病性症状强度。"
  };

  symptomChange.measures.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.scale;
    opt.textContent = scaleLabelMap[m.scale] || m.scale;
    scaleSelect.appendChild(opt);
  });

  function formatNum(x){
    if(x === null || x === undefined) return "—";
    if(typeof x === "string") return x;
    if(Number.isFinite(x)) return x.toFixed(2);
    return String(x);
  }

  function renderSymptomChart(measure){
    // horizontal bar chart for baseline and post means
    const maxVal = Math.max(
      measure.MDP.baseline_mean, measure.MDP.post_mean,
      measure.MDNP.baseline_mean, measure.MDNP.post_mean
    );

    const rows = [
      {label:`MDP 基线`, value:measure.MDP.baseline_mean, cls:"", group:"MDP"},
      {label:`MDP 两周`, value:measure.MDP.post_mean, cls:"post", group:"MDP"},
      {label:`MDNP 基线`, value:measure.MDNP.baseline_mean, cls:"alt", group:"MDNP"},
      {label:`MDNP 两周`, value:measure.MDNP.post_mean, cls:"alt post", group:"MDNP"},
    ];

    const htmlRows = rows.map(r => {
      const pct = maxVal > 0 ? (r.value / maxVal) * 100 : 0;
      const fillClass = (r.group === "MDNP") ? "bar-fill alt" : "bar-fill";
      const postClass = r.cls.includes("post") ? " post" : "";
      return `
        <div class="bar-row">
          <div class="bar-label">${escapeHTML(r.label)}</div>
          <div class="bar-track" aria-hidden="true">
            <div class="${fillClass}${postClass}" style="width:${pct.toFixed(1)}%"></div>
          </div>
          <div class="bar-value">${formatNum(r.value)} ${escapeHTML(measure.unit || "")}</div>
        </div>
      `;
    }).join("");

    const explain = `
      <div class="small-note">
        <span class="badge">怎么读</span> ${escapeHTML(scaleExplainMap[measure.scale] || "")}<br>
        <strong>组内变化（配对t）：</strong>MDP P=${escapeHTML(String(measure.MDP.p_within))}；MDNP P=${escapeHTML(String(measure.MDNP.p_within))}（证据：第7页 表2）<br>
        <strong>两周后组间差异：</strong>P=${escapeHTML(String(measure.between_group_post.p))}（证据：第7页 表2）
      </div>
    `;

    chartEl.innerHTML = `<div class="bar-chart">${htmlRows}</div>${explain}`;
  }

  function renderSymptomTable(measure){
    const label = scaleLabelMap[measure.scale] || measure.scale;
    const pPost = measure.between_group_post.p;
    tableEl.innerHTML = `
      <table aria-label="量表数值表">
        <thead>
          <tr>
            <th>量表</th>
            <th>组别</th>
            <th>基线（均值±SD）</th>
            <th>两周后（均值±SD）</th>
            <th>组内P（配对t）</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="2">${escapeHTML(label)}</td>
            <td>MDP (n=${mdpFU.n})</td>
            <td>${formatNum(measure.MDP.baseline_mean)} ± ${formatNum(measure.MDP.baseline_sd)}</td>
            <td>${formatNum(measure.MDP.post_mean)} ± ${formatNum(measure.MDP.post_sd)}</td>
            <td>${escapeHTML(String(measure.MDP.p_within))}</td>
          </tr>
          <tr>
            <td>MDNP (n=${mdnpFU.n})</td>
            <td>${formatNum(measure.MDNP.baseline_mean)} ± ${formatNum(measure.MDNP.baseline_sd)}</td>
            <td>${formatNum(measure.MDNP.post_mean)} ± ${formatNum(measure.MDNP.post_sd)}</td>
            <td>${escapeHTML(String(measure.MDNP.p_within))}</td>
          </tr>
        </tbody>
      </table>
      <p class="small-note"><strong>两周后组间比较：</strong>P=${escapeHTML(String(pPost))}（证据：第7页 表2）</p>
    `;
  }

  function updateModule1(){
    const scale = scaleSelect.value || symptomChange.measures[0].scale;
    const measure = symptomChange.measures.find(m => m.scale === scale);
    if(!measure) return;
    renderSymptomChart(measure);
    const showTable = showTableCheckbox.checked;
    tableEl.hidden = !showTable;
    if(showTable){ renderSymptomTable(measure); }
  }

  scaleSelect.addEventListener("change", updateModule1);
  showTableCheckbox.addEventListener("change", updateModule1);

  // default scale: BPRS if exists
  scaleSelect.value = symptomChange.measures.find(m => m.scale === "BPRS") ? "BPRS" : symptomChange.measures[0].scale;
  updateModule1();

  // ---------- Interactive Module 2: correlation explorer ----------
  const m2Sym = document.getElementById("m2-symptom");
  const m2Met = document.getElementById("m2-metric");
  const m2Bar = document.getElementById("m2-bar");
  const m2Stats = document.getElementById("m2-stats");

  const symptomOptions = [
    {id:"BPRS_total", label:"BPRS总分"},
    {id:"PositiveSymptoms_BPRS6", label:"阳性症状（BPRS 6条目）"}
  ];
  symptomOptions.forEach(o=>{
    const opt = document.createElement("option");
    opt.value=o.id; opt.textContent=o.label;
    m2Sym.appendChild(opt);
  });

  const metricOptions = [
    {id:"gamma", label:"γ（聚类系数）"},
    {id:"sigma", label:"σ（小世界性）"},
    {id:"DC_STG_L", label:"左上颞回 DC"},
    {id:"NE_STG_L", label:"左上颞回 NE"},
    {id:"NE_HG_L", label:"左赫氏回 NE"},
    {id:"NE_MCG_L", label:"左内侧扣带回 NE"},
  ];
  metricOptions.forEach(o=>{
    const opt = document.createElement("option");
    opt.value=o.id; opt.textContent=o.label;
    m2Met.appendChild(opt);
  });

  function renderCorr(){
    const s = m2Sym.value;
    const m = m2Met.value;
    const entry = corrData.entries.find(e=>e.symptom_measure===s && e.metric_id===m);
    if(!entry){
      m2Bar.innerHTML = "<p>该组合在论文中未报告。（证据：第5–7页）</p>";
      m2Stats.innerHTML = "<p>论文未报告该项相关。</p>";
      return;
    }
    const r = entry.r_partial;
    const abs = Math.min(Math.abs(r), 1);
    const widthPct = abs * 50; // -1..1 mapped to half width
    const left = r >= 0 ? 50 : (50 - widthPct);
    const cls = r >= 0 ? "corr-fill" : "corr-fill neg";
    m2Bar.innerHTML = `
      <div class="corr-wrap">
        <div class="corr-labels"><span>-1</span><span>0</span><span>+1</span></div>
        <div class="corr-bar" aria-hidden="true">
          <div class="corr-mid"></div>
          <div class="${cls}" style="left:${left}%; width:${widthPct}%;"></div>
        </div>
      </div>
      <p class="small-note"><span class="badge">怎么读</span> r在-1到+1之间；越接近±1相关越强。负号表示“指标越高，症状越轻/越重”的相反方向。（证据：第5页 相关段落；第6页 图3；第7页 图4）</p>
    `;

    const p = entry.p_value;
    const q = entry.fdr_q;
    m2Stats.innerHTML = `
      <p><strong>结论（相关，不是因果）：</strong>${escapeHTML(entry.metric_label_cn)} 与 ${escapeHTML(symptomOptions.find(x=>x.id===s).label)} 的偏相关 r=${formatNum(r)}。</p>
      <p><strong>P值：</strong>${escapeHTML(String(p))}（证据：图3/图4）<br>
         <strong>FDR q值：</strong>${escapeHTML(String(q))}（证据：第5页 段落）</p>
      <p><strong>控制变量：</strong>${escapeHTML(corrData.covariates_controlled.join("、"))}（证据：第5页 段落）</p>
    `;
  }

  m2Sym.addEventListener("change", renderCorr);
  m2Met.addEventListener("change", renderCorr);

  // default view: Positive symptoms × DC_STG_L
  m2Sym.value = "PositiveSymptoms_BPRS6";
  m2Met.value = "DC_STG_L";
  renderCorr();

  // ---------- Interactive Module 3: treatment change dashboard ----------
  const tabMDP = document.getElementById("m3-tab-mdp");
  const tabMDNP = document.getElementById("m3-tab-mdnp");
  const includeTrend = document.getElementById("m3-include-trend");
  const listEl = document.getElementById("m3-list");
  const extraEl = document.getElementById("m3-extra");
  let currentGroup = "MDP";

  function setTab(group){
    currentGroup = group;
    tabMDP.setAttribute("aria-selected", group==="MDP" ? "true":"false");
    tabMDNP.setAttribute("aria-selected", group==="MDNP" ? "true":"false");
    renderTx();
  }
  tabMDP.addEventListener("click", ()=>setTab("MDP"));
  tabMDNP.addEventListener("click", ()=>setTab("MDNP"));
  includeTrend.addEventListener("change", renderTx);

  function directionLabel(d){
    if(d==="increase") return "↑ 上升";
    if(d==="decrease") return "↓ 下降";
    if(d==="trend_decrease") return "↘ 下降趋势";
    if(d==="trend_increase") return "↗ 上升趋势";
    return d;
  }

  function renderTx(){
    const pCut = includeTrend.checked ? 0.10 : 0.05;
    const items = txChange.entries
      .filter(e=>e.group===currentGroup)
      .filter(e=>{
        const p = e.p_value_uncorrected;
        return typeof p === "number" && p < pCut;
      });

    const header = `<p><span class="badge warn">重要</span> 下列P值均为<strong>未校正</strong>（uncorrected），仅作为线索。（证据：第7页；第8页 图5）</p>`;

    if(items.length === 0){
      listEl.innerHTML = header + "<p>在当前过滤条件下没有条目（可能因为P≥阈值）。</p>";
    }else{
      const lis = items.map(it => `<li><strong>${escapeHTML(it.metric_label_cn)}</strong>：${escapeHTML(directionLabel(it.direction))}（P=${formatNum(it.p_value_uncorrected)}，未校正）（证据：第7页；第8页 图5）</li>`).join("");
      listEl.innerHTML = header + `<ul class="metric-list">${lis}</ul>`;
    }

    if(currentGroup === "MDP"){
      extraEl.innerHTML = `
        <p><strong>同一篇论文中的“症状—网络变化”关联：</strong></p>
        <p>阳性症状下降幅度与STG_L度中心性上升幅度正相关：r=${formatNum(txCorr.entry.r)}，P=${formatNum(txCorr.entry.p)}。（证据：第7页 Alteration…段落）</p>
        <p class="small-note">解读提示：这提示“枢纽度回升”可能与症状缓解同步，但仍不能推出因果或用于个体预测。（证据：第9页 limitations）</p>
      `;
    }else{
      extraEl.innerHTML = `
        <p><strong>组别提示：</strong>论文写到MDNP组“全局指标无显著变化”，但部分节点效率在两周后下降；同样属于未校正结果。（证据：第7页；第8页 图5）</p>
      `;
    }
  }

  setTab("MDP");

  // ---------- Interactive Module 4: method slider ----------
  const sSlider = document.getElementById("m4-s");
  const sVal = document.getElementById("m4-s-val");
  const detail = document.getElementById("m4-detail");
  const canvas = document.getElementById("m4-canvas");
  const ctx = canvas.getContext("2d");
  const textEl = document.getElementById("m4-text");

  const N = 22;
  const nodes = [];
  // fixed seed for reproducibility
  let seed = 42;
  function rand(){
    // simple LCG
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }
  for(let i=0;i<N;i++){
    nodes.push({
      x: 60 + rand() * (canvas.width - 120),
      y: 40 + rand() * (canvas.height - 80)
    });
  }
  // create random weights for all pairs
  const pairs = [];
  for(let i=0;i<N;i++){
    for(let j=i+1;j<N;j++){
      pairs.push({i,j,w:rand()});
    }
  }
  pairs.sort((a,b)=>b.w - a.w);

  function drawNetwork(s){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // number of edges by sparsity
    const maxEdges = pairs.length;
    const k = Math.max(1, Math.round(s * maxEdges));
    const edges = pairs.slice(0,k);

    // edges
    ctx.strokeStyle = "rgba(37, 99, 235, 0.22)";
    ctx.lineWidth = 2;
    edges.forEach(e=>{
      const a = nodes[e.i], b = nodes[e.j];
      ctx.beginPath();
      ctx.moveTo(a.x,a.y);
      ctx.lineTo(b.x,b.y);
      ctx.stroke();
    });

    // nodes
    ctx.fillStyle = "rgba(15,23,42,0.9)";
    nodes.forEach(n=>{
      ctx.beginPath();
      ctx.arc(n.x,n.y,4.2,0,Math.PI*2);
      ctx.fill();
    });

    // annotation
    ctx.fillStyle = "rgba(71,85,105,1)";
    ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(`节点数：${N}（概念演示）`, 16, 22);
    ctx.fillText(`S=${s.toFixed(2)} → 保留边数≈${k} / ${maxEdges}`, 16, 42);
  }

  function renderMethodText(){
    const s = parseFloat(sSlider.value);
    const min = methodParams.sparsity_min;
    const max = methodParams.sparsity_max;
    const step = methodParams.sparsity_step;

    const brief = `
      <p><span class="badge">为什么要滑动S？</span> 稀疏度S决定“保留多少连接”。S越大，网络越稠；S越小，网络越稀。</p>
      <p><span class="badge">作者怎么做？</span> 论文不只选一个S，而是在 ${min}–${max}（步长${step}）范围内计算指标，再用AUC把整段曲线汇总。（证据：第4页 Network analysis）</p>
      <p class="small-note">提示：这里的网络是教学用随机图，不代表真实大脑网络形状或指标数值。（证据：第4页 方法只描述计算流程）</p>
    `;

    const detailed = `
      <p><span class="badge">类比</span> 如果把网络当“路网地图”，S太大=把很多小巷也画进去，会很难看清结构；S太小=只留几条大路，可能把关键连接删掉。</p>
      <p><span class="badge">AUC的直觉</span> 想像你测一周气温：不想只看周三某一个点，就把一周曲线整体“算个面积”作为概括。AUC就是类似的稳健汇总。（证据：第4页 Network analysis）</p>
      <p><span class="badge warn">别误解</span> 论文里AUC的具体数值分布（小提琴图）没有给出均值±SD，因此我们不在此模块展示“真实数值”。（证据：第5页 图1；第6页 图2）</p>
    `;

    textEl.innerHTML = (detail.checked ? (brief + detailed) : brief);
  }

  function updateMethod(){
    const s = parseFloat(sSlider.value);
    sVal.textContent = s.toFixed(2);
    drawNetwork(s);
    renderMethodText();
  }
  sSlider.addEventListener("input", updateMethod);
  detail.addEventListener("change", updateMethod);
  updateMethod();

})();
