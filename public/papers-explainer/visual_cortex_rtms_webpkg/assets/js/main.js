(function(){
  function byId(id){ return document.getElementById(id); }

  // --- Module 1: Cross-species brain map switcher ---
  const MAPS = [
    {
      id: "rat_baseline",
      species: "rat",
      contrast: "baseline_difference",
      title: "大鼠｜模型与对照的“前强后弱”失衡",
      img: "assets/img/fig2A.jpg",
      caption: "MAM-sham 相比 vehicle-sham：前额ReHo升高、后部ReHo降低；散点图同时显示MAM-rTMS组在前额ReHo更低。（证据：第6页 结果3.2；第7页 图2A）"
    },
    {
      id: "rat_rtms",
      species: "rat",
      contrast: "pre_post_rtms",
      title: "大鼠｜视觉皮层 rTMS 后：前额异常活动回落",
      img: "assets/img/fig2A.jpg",
      caption: "与MAM-sham相比，MAM-rTMS在前额区域ReHo降低，而后部未见显著改变。（证据：第6页 结果3.2；第7页 图2A）"
    },
    {
      id: "human_rtms",
      species: "human",
      contrast: "pre_post_rtms",
      title: "青少年｜治疗后：前额下降、后部上升",
      img: "assets/img/fig3A.png",
      caption: "rTMS后前额与边缘系统ReHo下降，枕叶/舌回等后部区域ReHo上升。（证据：第6页 结果3.4；第8页 图3A）"
    }
  ];

  function updateMap(){
    const species = byId("mapSpecies").value;
    const contrast = byId("mapContrast").value;

    let pick = MAPS.find(m => m.species === species && m.contrast === contrast);
    // 如果没有匹配（例如人类baseline），就退回到最接近的选项
    if(!pick){
      pick = MAPS.find(m => m.species === species) || MAPS[0];
    }

    const img = byId("mapImg");
    const title = byId("mapTitle");
    const cap = byId("mapCaption");
    img.src = pick.img;
    img.alt = pick.title;
    title.textContent = pick.title;
    cap.textContent = pick.caption;
  }

  // --- Module 2: Symptom dashboard ---
  const SCALES = {
    BPRS: { label: "BPRS（总体精神症状）", p: "<0.0001", citation: "第6页 结果3.4；第8页 图3B" },
    HAMD: { label: "HAMD（抑郁）", p: "<0.0001", citation: "第6页 结果3.4；第8页 图3B" },
    HAMA: { label: "HAMA（焦虑）", p: "<0.0001", citation: "第6页 结果3.4；第8页 图3B" }
  };

  function updateScale(){
    const key = byId("scaleSelect").value;
    const info = SCALES[key] || SCALES.BPRS;
    byId("scaleLabel").textContent = info.label;
    byId("scaleP").textContent = info.p;
    byId("scaleCite").textContent = `（证据：${info.citation}）`;
  }

  function toggleCorr(){
    const checked = byId("showCorr").checked;
    byId("corrBlock").style.display = checked ? "block" : "none";
  }

  // --- Module 3: Proteomics explorer ---
  const PROTEOMICS = {
    total_identified: 3382,
    rule: "FC > 1.2 或 < 0.83 且未校正p < 0.05",
    frontal: {
      diff_model_vs_control: 510,
      diff_rtms_vs_model: 159,
      overlap: 81,
      go_terms: ["intracellular transport", "presynapse", "vesicle", "membrane protein complex"]
    },
    posterior: {
      diff_model_vs_control: 105,
      diff_rtms_vs_model: 53,
      overlap: 8,
      go_terms: []
    },
    citation: "第6页 结果3.3；第7页 图2B–C；第5页 统计阈值"
  };

  function updateRegion(){
    const region = byId("regionSelect").value;
    const r = PROTEOMICS[region];
    byId("protTotal").textContent = PROTEOMICS.total_identified;
    byId("protRule").textContent = PROTEOMICS.rule;
    byId("protDiff1").textContent = r.diff_model_vs_control;
    byId("protDiff2").textContent = r.diff_rtms_vs_model;
    byId("protOverlap").textContent = r.overlap;

    const list = byId("protGO");
    list.innerHTML = "";
    if(r.go_terms.length === 0){
      const li = document.createElement("li");
      li.textContent = "后部ROI：论文报告“无显著GO条目富集”。";
      list.appendChild(li);
    }else{
      r.go_terms.forEach(t=>{
        const li = document.createElement("li");
        li.textContent = t;
        list.appendChild(li);
      });
    }
    byId("protCite").textContent = `（证据：${PROTEOMICS.citation}）`;
  }

  document.addEventListener("DOMContentLoaded", function(){
    if(byId("mapSpecies")){
      byId("mapSpecies").addEventListener("change", updateMap);
      byId("mapContrast").addEventListener("change", updateMap);
      updateMap();
    }
    if(byId("scaleSelect")){
      byId("scaleSelect").addEventListener("change", updateScale);
      byId("showCorr").addEventListener("change", toggleCorr);
      updateScale();
      toggleCorr();
    }
    if(byId("regionSelect")){
      byId("regionSelect").addEventListener("change", updateRegion);
      updateRegion();
    }
  });
})();