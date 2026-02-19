(function(){
  const content = window.PAGE_CONTENT;
  const tables = window.DATA_TABLES;

  function el(tag, attrs={}, children=[]){
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>{
      if(k === "class") n.className = v;
      else if(k === "html") n.innerHTML = v;
      else if(k.startsWith("on") && typeof v === "function") n.addEventListener(k.substring(2), v);
      else n.setAttribute(k, v);
    });
    children.forEach(c=>{
      if(typeof c === "string") n.appendChild(document.createTextNode(c));
      else if(c) n.appendChild(c);
    });
    return n;
  }

  function formatPM(mean, sd, showSd=true){
    if(mean === null || mean === undefined) return "NA";
    const m = Number(mean).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
    if(!showSd || sd === null || sd === undefined) return m;
    const s = Number(sd).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
    return `${m} ± ${s}`;
  }

  function renderTOC(){
    const toc = document.getElementById("toc");
    const anchors = [
      {id:"hero", label:"概览"},
      ...content.sections.map(s=>({id:s.id, label:s.heading})),
      {id:"visuals", label:"图文并茂"},
      {id:"interactives", label:"交互模块"},
      {id:"downloads", label:"数据文件"}
    ];
    anchors.forEach(a=>{
      toc.appendChild(el("a", {href:"#"+a.id}, [a.label]));
    });
  }

  function renderHero(){
    document.getElementById("page-title").textContent = content.sections.find(s=>s.id==="hero")?.heading || "论文科普";
    const sub = content.sections.find(s=>s.id==="hero")?.body_markdown || "";
    document.getElementById("page-subtitle").textContent = sub.replace(/\*\*/g,"").replace(/（证据：.*?）/g,"").trim();
    document.getElementById("page-meta").textContent = "数据与证据均标注在正文（页码/图表号）。";
  }

  function renderSections(){
    const host = document.getElementById("sections");
    content.sections.filter(s=>s.id!=="hero").forEach(s=>{
      const sec = el("section", {id:s.id});
      sec.appendChild(el("h2", {}, [s.heading]));
      const body = el("div", {class:"card"});
      // very small markdown-to-html (paragraphs + line breaks)
      const html = s.body_markdown
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br/>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      body.innerHTML = "<p>" + html + "</p>";
      sec.appendChild(body);

      if(s.citations && s.citations.length){
        const cite = el("p", {class:"small"}, ["证据锚点：", s.citations.join("；")]);
        sec.appendChild(cite);
      }
      host.appendChild(sec);
    });
  }

  function renderVisuals(){
    const grid = document.getElementById("visual-grid");
    content.visual_assets.forEach(v=>{
      const card = el("div", {class:"visual"});
      card.appendChild(el("img", {
        src: v.file,
        alt: v.alt_text,
        loading:"lazy"
      }));
      card.appendChild(el("div", {class:"v-title"}, [v.title]));
      card.appendChild(el("div", {class:"v-meta"}, [`类型：${v.type}`]));
      card.appendChild(el("div", {class:"v-meta"}, [`来源：${v.source_ref}`]));
      grid.appendChild(card);
    });
  }

  function hbarChart(container, items, opts){
    const {showSd=true, valueKey="value_mean", sdKey="value_sd", labelKey="label"} = opts || {};
    container.innerHTML = "";
    items.forEach(it=>{
      const value = it[valueKey];
      const sd = it[sdKey];
      const row = el("div", {class:"row"});
      row.appendChild(el("div", {class:"label"}, [it[labelKey]]));
      const wrap = el("div", {class:"bar-wrap"});
      const bar = el("div", {class:"bar"});
      bar.style.width = Math.max(0, Math.min(1, Number(value))) * 100 + "%";
      wrap.appendChild(bar);
      row.appendChild(wrap);
      row.appendChild(el("div", {class:"value"}, [formatPM(value, sd, showSd)]));
      container.appendChild(row);
    });
  }

  function modulePerfExplorer(mod){
    const host = el("div", {class:"module"});
    host.appendChild(el("h3", {}, [mod.title]));
    host.appendChild(el("p", {class:"hint"}, [mod.purpose]));

    const controls = el("div", {class:"controls"});
    const metricSel = el("select");
    ["AUC","ACC","Precision","Recall","F1"].forEach(m=>{
      metricSel.appendChild(el("option", {value:m}, [m]));
    });
    metricSel.value = "AUC";

    const showSdToggle = el("input", {type:"checkbox"});
    showSdToggle.checked = true;

    controls.appendChild(el("div", {class:"control"}, [
      el("label", {}, ["选择指标"]),
      metricSel
    ]));

    controls.appendChild(el("div", {class:"toggle"}, [
      showSdToggle,
      el("label", {}, ["显示±标准差"])
    ]));
    host.appendChild(controls);

    const chart = el("div", {class:"chart", role:"img", "aria-label":"横向柱状图对比不同模型指标"});
    host.appendChild(chart);

    function update(){
      const metric = metricSel.value;
      const showSd = showSdToggle.checked;
      const data = tables.table5_cnrac_metrics.map(r=>({
        label: r.Models,
        value_mean: r[metric + "_mean"],
        value_sd: r[metric + "_sd"]
      }));
      // Sort descending
      data.sort((a,b)=>b.value_mean - a.value_mean);
      hbarChart(chart, data, {showSd});
    }

    metricSel.addEventListener("change", update);
    showSdToggle.addEventListener("change", update);
    update();

    host.appendChild(el("p", {class:"small"}, ["数据来源：", mod.source_ref]));
    host.appendChild(el("p", {class:"small"}, ["风险提示：模型指标来自特定数据与录音流程，不等同于现实自测或诊断。"]));
    return host;
  }

  function moduleSubtypeMatrix(mod){
    const host = el("div", {class:"module"});
    host.appendChild(el("h3", {}, [mod.title]));
    host.appendChild(el("p", {class:"hint"}, [mod.purpose]));

    const controls = el("div", {class:"controls"});
    const groupSel = el("select");
    ["NC-Subtype","Inter-Subtype"].forEach(g=>{
      groupSel.appendChild(el("option", {value:g}, [g]));
    });
    groupSel.value = "NC-Subtype";

    const metricSel = el("select");
    ["AUC","ACC","Precision","Recall","F1"].forEach(m=>{
      metricSel.appendChild(el("option", {value:m}, [m]));
    });
    metricSel.value = "AUC";

    const showSdToggle = el("input", {type:"checkbox"});
    showSdToggle.checked = true;

    controls.appendChild(el("div", {class:"control"}, [
      el("label", {}, ["任务组"]),
      groupSel
    ]));
    controls.appendChild(el("div", {class:"control"}, [
      el("label", {}, ["指标"]),
      metricSel
    ]));
    controls.appendChild(el("div", {class:"toggle"}, [
      showSdToggle,
      el("label", {}, ["显示±标准差"])
    ]));
    host.appendChild(controls);

    const chart = el("div", {class:"chart", role:"img", "aria-label":"横向柱状图对比亚型任务指标"});
    host.appendChild(chart);

    function update(){
      const g = groupSel.value;
      const metric = metricSel.value;
      const showSd = showSdToggle.checked;
      const rows = tables.table7_cnrac_subtype.filter(r=>r.Task_Group === g).map(r=>({
        label: r.Task,
        value_mean: r[metric + "_mean"],
        value_sd: r[metric + "_sd"]
      }));
      rows.sort((a,b)=>b.value_mean - a.value_mean);
      hbarChart(chart, rows, {showSd});
    }
    groupSel.addEventListener("change", update);
    metricSel.addEventListener("change", update);
    showSdToggle.addEventListener("change", update);
    update();

    host.appendChild(el("p", {class:"small"}, ["数据来源：", mod.source_ref]));
    host.appendChild(el("p", {class:"small"}, ["风险提示：不同任务难度与样本分布会影响指标，不能把结果解释为“轻度/中度/重度”之间绝对可分。"]));
    return host;
  }

  function moduleThresholdSandbox(mod){
    const host = el("div", {class:"module"});
    host.appendChild(el("h3", {}, [mod.title]));
    host.appendChild(el("p", {class:"hint"}, [mod.purpose]));

    const controls = el("div", {class:"controls"});
    const endpointSel = el("select");
    ["Mild Left","Mild Right"].forEach(e=>{
      endpointSel.appendChild(el("option", {value:e}, [e]));
    });
    endpointSel.value = "Mild Left";

    const slider = el("input", {type:"range", min:"3", max:"10", step:"1", value:"4"});
    const sliderVal = el("div", {class:"small"}, ["阈值：4"]);

    controls.appendChild(el("div", {class:"control"}, [
      el("label", {}, ["阈值区间"]),
      endpointSel
    ]));
    controls.appendChild(el("div", {class:"control"}, [
      el("label", {}, ["阈值"]),
      slider,
      sliderVal
    ]));

    host.appendChild(controls);

    const out = el("div", {class:"chart"});
    host.appendChild(out);

    function availableThresholds(endpoints){
      const rows = tables.table12_csnrac_thresholds.filter(r=>r.Endpoints === endpoints);
      return rows.map(r=>r.Threshold).sort((a,b)=>a-b);
    }

    function updateSliderBounds(){
      const t = availableThresholds(endpointSel.value);
      slider.min = Math.min.apply(null, t);
      slider.max = Math.max.apply(null, t);
      slider.value = t[Math.floor(t.length/2)];
    }

    function update(){
      const endpoints = endpointSel.value;
      sliderVal.textContent = "阈值：" + slider.value;
      const threshold = Number(slider.value);
      const row = tables.table12_csnrac_thresholds.find(r=>r.Endpoints === endpoints && Number(r.Threshold) === threshold);
      out.innerHTML = "";
      if(!row){
        out.appendChild(el("p", {}, ["该阈值在论文表12中未报告。"]));
        return;
      }
      const lines = [
        ["Accuracy", row.ACC],
        ["Precision", row.Precision],
        ["Recall", row.Recall],
        ["F1", row.F1],
        ["PR_AUC", row.PR_AUC],
      ];
      lines.forEach(([k,v])=>{
        out.appendChild(el("div", {class:"row"}, [
          el("div", {class:"label"}, [k]),
          el("div", {class:"bar-wrap"}, [el("div", {class:"bar", style:`width:${Math.max(0, Math.min(1, Number(v)))*100}%`})]),
          el("div", {class:"value"}, [Number(v).toFixed(3).replace(/0+$/,'').replace(/\.$/,'')])
        ]));
      });
      out.appendChild(el("p", {class:"small"}, [mod.default_view_copy || ""]));
      out.appendChild(el("p", {class:"small"}, ["数据来源：", mod.source_ref]));
      out.appendChild(el("p", {class:"small"}, ["风险提示：", mod.risk_note || "请勿外推。"]));
    }

    endpointSel.addEventListener("change", ()=>{
      updateSliderBounds();
      update();
    });
    slider.addEventListener("input", update);

    updateSliderBounds();
    update();

    return host;
  }

  function moduleAblationBuilder(mod){
    const host = el("div", {class:"module"});
    host.appendChild(el("h3", {}, [mod.title]));
    host.appendChild(el("p", {class:"hint"}, [mod.purpose]));

    const controls = el("div", {class:"controls"});
    const metricSel = el("select");
    ["F1","ACC","Precision","Recall"].forEach(m=>{
      metricSel.appendChild(el("option", {value:m}, [m]));
    });
    metricSel.value = "F1";

    const includeFullToggle = el("input", {type:"checkbox"});
    includeFullToggle.checked = true;

    controls.appendChild(el("div", {class:"control"}, [
      el("label", {}, ["指标"]),
      metricSel
    ]));
    controls.appendChild(el("div", {class:"toggle"}, [
      includeFullToggle,
      el("label", {}, ["包含完整模型基线（Fusion）"])
    ]));
    host.appendChild(controls);

    const chart = el("div", {class:"chart"});
    host.appendChild(chart);

    function update(){
      const metric = metricSel.value;
      const includeFull = includeFullToggle.checked;
      const rows = [];
      if(includeFull){
        const full = tables.table5_cnrac_metrics.find(r=>r.Models === "Fusion");
        rows.push({label:"Full (Fusion)", value_mean: full[metric + "_mean"], value_sd: full[metric + "_sd"]});
      }
      tables.table9_ablation.forEach(r=>{
        rows.push({
          label: r.Ablated_Module + " removed",
          value_mean: r[metric + "_mean"],
          value_sd: r[metric + "_sd"]
        });
      });
      rows.sort((a,b)=>b.value_mean - a.value_mean);
      hbarChart(chart, rows, {showSd:true});
    }

    metricSel.addEventListener("change", update);
    includeFullToggle.addEventListener("change", update);
    update();

    host.appendChild(el("p", {class:"small"}, ["数据来源：", mod.source_ref]));
    host.appendChild(el("p", {class:"small"}, ["风险提示：消融只在论文设置下比较，不能把“重要性”解读为可直接指导个人治疗或诊断。"]));
    return host;
  }

  function renderModules(){
    const host = document.getElementById("modules");
    // Render in a stable order
    const lookup = {};
    content.interactive_modules.forEach(m=>lookup[m.id]=m);

    host.appendChild(modulePerfExplorer(lookup["mod_perf_explorer"]));
    host.appendChild(moduleSubtypeMatrix(lookup["mod_subtype_matrix"]));
    host.appendChild(moduleThresholdSandbox(lookup["mod_threshold_sandbox"]));
    host.appendChild(moduleAblationBuilder(lookup["mod_ablation_builder"]));
  }

  function renderDisclaimer(){
    document.getElementById("disclaimer").textContent = content.disclaimer || "免责声明：仅科普用途。";
  }

  // boot
  renderTOC();
  renderHero();
  renderSections();
  renderVisuals();
  renderModules();
  renderDisclaimer();
})();