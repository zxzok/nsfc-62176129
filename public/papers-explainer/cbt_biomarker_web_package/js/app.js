(async function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  function escapeHtml(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#39;");
  }

  // Minimal markdown-to-HTML (good enough for our content)
  function mdToHtml(md){
    const lines = md.split("\n");
    let out = [];
    let inList = false;

    function closeList(){
      if(inList){ out.push("</ul>"); inList = false; }
    }

    for(let i=0;i<lines.length;i++){
      const line = lines[i].trimRight();
      if(!line.trim()){
        closeList();
        continue;
      }

      if(line.startsWith("### ")){
        closeList();
        out.push(`<h3>${escapeHtml(line.slice(4).trim())}</h3>`);
        continue;
      }

      if(/^[-*]\s+/.test(line)){
        if(!inList){ out.push("<ul>"); inList = true; }
        out.push(`<li>${escapeHtml(line.replace(/^[-*]\s+/, ""))}</li>`);
        continue;
      }

      closeList();
      // convert inline code markers
      let html = escapeHtml(line)
        .replace(/`([^`]+)`/g, "<code>$1</code>");
      out.push(`<p>${html}</p>`);
    }
    closeList();
    return out.join("\n");
  }

  async function loadJson(url){
    const res = await fetch(url, {cache: "no-store"});
    if(!res.ok) throw new Error("Failed to load "+url);
    return res.json();
  }

  function renderTOC(sections){
    const tocList = $("#tocList");
    tocList.innerHTML = "";
    sections.forEach(s => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#sec-${s.id}`;
      a.textContent = s.heading;
      li.appendChild(a);
      tocList.appendChild(li);
    });
  }

  function renderSections(sections){
    const root = $("#contentRoot");
    root.innerHTML = "";
    sections.forEach(s => {
      const card = document.createElement("article");
      card.className = "section-card";
      card.id = `sec-${s.id}`;

      const h = document.createElement("h2");
      h.textContent = s.heading;

      const body = document.createElement("div");
      body.className = "body";
      body.innerHTML = mdToHtml(s.body_markdown);

      const cites = document.createElement("div");
      cites.className = "cites";
      const citeText = (s.citations || []).map(c => `• ${c}`).join("\n");
      cites.innerHTML = `<div><span class="tag">证据锚点</span></div><div style="margin-top:8px"><code>${escapeHtml(citeText)}</code></div>`;

      card.appendChild(h);
      card.appendChild(body);
      card.appendChild(cites);
      root.appendChild(card);
    });
  }

  function renderGlossary(items){
    const root = $("#glossary");
    root.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "term";
      card.innerHTML = `
        <h3>${escapeHtml(item.term)}</h3>
        <p><strong>一句话：</strong>${escapeHtml(item.def)}</p>
        <p><strong>类比：</strong>${escapeHtml(item.analogy)}</p>
        <div class="src">证据：${escapeHtml(item.source)}</div>
      `;
      root.appendChild(card);
    });
  }

  function renderFAQ(items){
    const root = $("#faq");
    root.classList.add("faq");
    root.innerHTML = "";
    items.forEach(it => {
      const d = document.createElement("details");
      d.innerHTML = `
        <summary>${escapeHtml(it.q)}</summary>
        <div class="answer">${escapeHtml(it.a)}</div>
        <div class="src">证据：${escapeHtml(it.source)}</div>
      `;
      root.appendChild(d);
    });
  }

  function setupTOC(){
    const btn = $("#btnToggleTOC");
    const toc = $("#toc");
    btn.addEventListener("click", () => {
      const open = toc.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true":"false");
    });
  }

  function renderTimeline(mod){
    const root = $("#timeline");
    root.innerHTML = "";
    const steps = mod.data.steps;
    const risk = $("#timelineRisk");
    risk.textContent = mod.risk_tip || "";

    let activeId = steps[0]?.id;

    steps.forEach((s, idx) => {
      const el = document.createElement("div");
      el.className = "step" + (idx===0 ? " active":"");
      const wk = (s.week_start===null || s.week_start===undefined) ? "—" : `${s.week_start}–${s.week_end}周`;
      const k = (s.id === "analysis") ? "分析" : `时间：${wk}`;
      el.innerHTML = `
        <div class="k">${escapeHtml(k)}</div>
        <h4>${escapeHtml(s.title)}</h4>
        <p>${escapeHtml(s.what)}</p>
        <p style="margin-top:8px;font-family:var(--mono);font-size:11px;color:rgba(233,238,245,.85)">证据：${escapeHtml(s.source_ref)}</p>
      `;
      el.addEventListener("click", () => {
        activeId = s.id;
        $$(".step", root).forEach(x => x.classList.toggle("active", x===el));
      });
      root.appendChild(el);
    });
  }

  function renderFigureExplorer(mod){
    const hsRoot = $("#hotspots");
    hsRoot.innerHTML = "";
    const risk = $("#fig1Risk");
    risk.textContent = mod.risk_tip || "";

    const drawer = $(".drawer");
    const panelLabel = $("#panelLabel");
    const panelTitle = $("#panelTitle");
    const panelSummary = $("#panelSummary");
    const panelEvidence = $("#panelEvidence");
    const btnClose = $("#btnCloseDrawer");
    const btnCopy = $("#btnCopyEvidence");

    let lastEvidence = "";

    function openPanel(h){
      panelLabel.textContent = `子图 ${h.id}`;
      panelTitle.textContent = h.label;
      panelSummary.textContent = h.summary;
      panelEvidence.textContent = h.evidence;
      lastEvidence = h.evidence;
      drawer.scrollIntoView({behavior:"smooth", block:"nearest"});
    }

    mod.data.hotspots.forEach(h => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "hotspot";
      d.style.left = (h.x*100).toFixed(2) + "%";
      d.style.top = (h.y*100).toFixed(2) + "%";
      d.style.width = (h.w*100).toFixed(2) + "%";
      d.style.height = (h.h*100).toFixed(2) + "%";
      d.title = `${h.label}`;
      d.setAttribute("aria-label", `${h.label}：${h.summary}`);
      d.addEventListener("click", () => openPanel(h));
      hsRoot.appendChild(d);
    });

    btnClose.addEventListener("click", () => {
      panelLabel.textContent = "点击图中热区";
      panelTitle.textContent = "图1导览";
      panelSummary.textContent = "选择一个子图后，这里会显示一句话解释与证据锚点。";
      panelEvidence.textContent = "—";
      lastEvidence = "";
    });

    btnCopy.addEventListener("click", async () => {
      if(!lastEvidence) return;
      try{
        await navigator.clipboard.writeText(lastEvidence);
        btnCopy.textContent = "已复制 ✓";
        setTimeout(()=>btnCopy.textContent="复制证据锚点", 1200);
      }catch(e){
        btnCopy.textContent = "复制失败（浏览器限制）";
        setTimeout(()=>btnCopy.textContent="复制证据锚点", 1500);
      }
    });
  }

  function setupTranscriptomics(mod){
    const tabs = $$(".tab");
    const summary = $("#transcriptSummary");
    const bars = $("#cellBars");
    const risk = $("#transcriptRisk");
    risk.textContent = mod.risk_tip || "";

    const max = Math.max(...mod.data.cell_types.map(x=>x.overlap_n));

    function render(bucketId){
      tabs.forEach(t => t.setAttribute("aria-selected", t.dataset.bucket===bucketId ? "true":"false"));
      const bucket = mod.data.buckets.find(b=>b.id===bucketId);
      const t = mod.data.transcriptome;
      const geneSet = mod.data.gene_set;
      summary.innerHTML = `
        <div><strong>这一部分在做什么？</strong></div>
        <div style="margin-top:6px">
          作者用AHBA公共转录组图谱（${t.genes_total}个基因、左半球${t.roi_left}个ROI）把ReHo变化的空间模式与基因表达地图做匹配，得到与变化相关的基因集合（共${geneSet.n}个），再做通路与细胞类型富集。
          <span class="muted">（证据：${escapeHtml(t.source_ref)}；${escapeHtml(geneSet.source_ref)}）</span>
        </div>
        <div style="margin-top:10px"><span class="tag">当前视图</span> ${escapeHtml(bucket.label)} <span class="muted">（${escapeHtml(bucket.figure_ref)}，证据：${escapeHtml(bucket.source_ref)}）</span></div>
      `;

      const list = mod.data.cell_types.filter(x=>x.bucket===bucketId);
      bars.innerHTML = "";
      list.forEach(ct => {
        const row = document.createElement("div");
        row.className = "bar";
        const pct = Math.round((ct.overlap_n / max) * 100);
        row.innerHTML = `
          <div class="label">${escapeHtml(ct.label)} <span class="muted">(${escapeHtml(ct.p_fdr)})</span></div>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="track"><div class="fill" style="width:${pct}%"></div></div>
            <div class="val">${ct.overlap_n}</div>
          </div>
        `;
        const src = document.createElement("div");
        src.className = "small muted";
        src.style.marginTop = "-6px";
        src.textContent = `证据：${ct.source_ref}`;
        bars.appendChild(row);
        bars.appendChild(src);
      });

      const ex = mod.data.example_genes;
      const exBox = document.createElement("div");
      exBox.className = "callout";
      exBox.style.marginTop = "12px";
      exBox.innerHTML = `
        <strong>论文讨论举例提到的基因：</strong>
        <span style="font-family:var(--mono)">${escapeHtml(ex.list.join(", "))}</span>
        <div class="muted small" style="margin-top:6px">说明：${escapeHtml(ex.note)}（证据：${escapeHtml(ex.source_ref)}）</div>
      `;
      bars.appendChild(exBox);
    }

    tabs.forEach(t => t.addEventListener("click", ()=>render(t.dataset.bucket)));
    render(mod.default_view || "neuroplasticity");
  }

  try{
    const content = await loadJson("data/content.json");
    const inter = await loadJson("data/interactive.json");

    $("#pageSubtitle").textContent = content.meta.title_sub;
    $("#doi").textContent = content.meta.doi;

    renderTOC(content.sections);
    setupTOC();

    renderTimeline(inter.modules.find(m=>m.id==="timeline"));
    renderFigureExplorer(inter.modules.find(m=>m.id==="figure1_explorer"));
    setupTranscriptomics(inter.modules.find(m=>m.id==="transcriptomics"));

    renderSections(content.sections);
    renderGlossary(content.glossary);
    renderFAQ(content.faq);

  }catch(err){
    console.error(err);
    $("#pageSubtitle").textContent = "⚠️ 无法加载数据文件。若你是直接双击打开index.html，请用本地服务器运行（见README）。";
    const root = $("#contentRoot");
    root.innerHTML = `
      <div class="section-card">
        <h2>加载失败</h2>
        <p class="muted">浏览器可能阻止 file:// 方式读取JSON。请在此目录下运行：</p>
        <p><code style="font-family:var(--mono);background:rgba(255,255,255,.06);padding:6px 10px;border-radius:12px;display:inline-block">python -m http.server 8000</code></p>
        <p class="muted">然后打开 <code style="font-family:var(--mono)">http://localhost:8000</code>。</p>
      </div>
    `;
  }
})();
