/* Interactive modules (no external libraries). */

async function loadJSON(path){
  const res = await fetch(path, {cache: "no-store"});
  if(!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return await res.json();
}

function el(tag, attrs={}, children=[]){
  const node = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k === "class") node.className = v;
    else if(k === "text") node.textContent = v;
    else if(k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for(const c of children){
    if(typeof c === "string") node.appendChild(document.createTextNode(c));
    else if(c) node.appendChild(c);
  }
  return node;
}

function formatTP(t, p, pText){
  if(pText && pText.includes("未报告")) return "论文未报告";
  const tStr = (t===null || t===undefined) ? "—" : t.toFixed(3);
  let pStr = "—";
  if(pText){
    pStr = pText;
  } else if(p!==null && p!==undefined){
    pStr = `P=${p.toFixed(3)}`;
  }
  return `T=${tStr}；${pStr}`;
}

function directionLabel(direction){
  if(direction === "increase") return "↑ 增强";
  if(direction === "decrease") return "↓ 降低";
  return "未报告";
}

function rInterpretation(r){
  const ar = Math.abs(r);
  if(ar >= 0.7) return "相关很强（在本研究场景下）";
  if(ar >= 0.4) return "中等相关";
  if(ar >= 0.2) return "弱相关但可能有意义";
  return "很弱相关";
}

/* Module 1: Balance explorer */
async function initBalanceExplorer(container){
  const data = await loadJSON("../data/balance_explorer_data.json");
  const entities = [
    {id:"p11_ko", label:"P11敲除小鼠"},
    {id:"cums", label:"CUMS应激大鼠"},
    {id:"subtype1", label:"人类亚型1"},
    {id:"subtype2", label:"人类亚型2"},
  ];

  let current = "subtype1";
  let showStats = true;

  const buttonRow = el("div", {class:"btn-row"});
  const statsToggle = el("label", {class:"badge", style:"display:inline-flex; gap:8px; align-items:center; margin-left:auto;"}, [
    el("input", {type:"checkbox", checked:"checked", onchange: (e)=>{ showStats = e.target.checked; render(); }}),
    el("span", {text:"显示T/P"})
  ]);

  function setPressed(){
    for(const btn of buttonRow.querySelectorAll("button")){
      btn.setAttribute("aria-pressed", btn.dataset.id === current ? "true" : "false");
    }
  }

  for(const ent of entities){
    const btn = el("button", {
      type:"button",
      "data-id": ent.id,
      "aria-pressed": ent.id === current ? "true" : "false",
      onclick: ()=>{ current = ent.id; setPressed(); render(); }
    }, [ent.label]);
    buttonRow.appendChild(btn);
  }
  buttonRow.appendChild(statsToggle);

  const out = el("div", {class:"metric"});
  const source = el("p", {class:"note"});
  container.appendChild(buttonRow);
  container.appendChild(out);
  container.appendChild(source);

  function render(){
    out.innerHTML = "";
    const records = data.records.filter(r => r.entity_id === current);

    const roiOrder = [
      {roi:"subcortical", label:"皮层下ROI"},
      {roi:"sensorimotor", label:"感觉运动ROI"},
      {roi:"temporal_olfactory", label:"颞‑嗅觉ROI（仅部分场景）"},
    ];

    for(const item of roiOrder){
      const rec = records.find(r => r.roi === item.roi);
      const dir = rec ? directionLabel(rec.direction) : "未报告";
      const tp = rec ? formatTP(rec.t_value, rec.p_value, rec.p_value_text) : "论文未报告";

      const box = el("div", {class:"box"}, [
        el("div", {class:"label", text: item.label}),
        el("div", {class:"value", text: dir}),
        showStats ? el("div", {class:"note", text: tp}) : null
      ]);
      out.appendChild(box);
    }

    source.textContent = `数据来源：${data.meta.source_ref}。提示：${data.meta.notes}`;
  }

  render();
}

/* Module 2: Evidence cards */
async function initEvidenceCards(container){
  const data = await loadJSON("../data/subtype_evidence_cards.json");
  const tabs = el("div", {class:"btn-row"});
  const out = el("div", {class:"metric"});
  const source = el("p", {class:"note"});

  let current = "subtype1";

  function render(){
    out.innerHTML = "";
    const st = data.subtypes.find(s => s.subtype_id === current);
    if(!st){
      out.appendChild(el("p", {text:"未找到该亚型数据。"}));
      return;
    }

    const imgBox = el("div", {class:"box"}, [
      el("div", {class:"label", text:"脑影像模式（方向）"}),
      el("div", {class:"value", text:`额叶‑皮层下：${st.neuroimaging_pattern.frontal_subcortical === "increase" ? "增强" : "降低"}；感觉运动：${st.neuroimaging_pattern.sensorimotor === "increase" ? "增强" : "降低"}`}),
      el("div", {class:"note", text:"（证据：第6–7页 图2）"})
    ]);

    // PRS summary
    let prsText = "相对健康对照：";
    prsText += st.prs.is_significant_vs_hc ? "显著更高" : "不显著";
    if(st.prs.best_points && st.prs.best_points.length){
      const pts = st.prs.best_points.map(p => `PT=${p.pt_threshold}（NSNPs=${p.n_snps}；R2=${(p.nagelkerke_r2*100).toFixed(1)}%）`).join("；");
      prsText += `；关键点：${pts}`;
    } else {
      prsText += "。";
    }

    const prsBox = el("div", {class:"box"}, [
      el("div", {class:"label", text:"遗传易感（PRS‑MDD）"}),
      el("div", {class:"value", text: prsText}),
      el("div", {class:"note", text:"（证据：第7–8页 图3）"})
    ]);

    const geneBox = el("div", {class:"box"}, [
      el("div", {class:"label", text:"风险基因表达富集（组织层面）"}),
      el("div", {class:"value", text:`风险基因数量：${st.risk_gene_expression.n_genes}；${st.risk_gene_expression.brain_tissue_enrichment_summary}`}),
      el("div", {class:"note", text:`例：${st.risk_gene_expression.example_tissues.join("、")}（证据：第9页 图4）`})
    ]);

    const metBox = el("div", {class:"box"}, [
      el("div", {class:"label", text:"代谢差异（代谢组/通路）"}),
      el("div", {class:"value", text:`差异代谢物：${st.metabolites.n_differential_metabolites}；代表：${st.metabolites.key_metabolites.join("、")}；通路关键词：${st.metabolites.key_pathways.join("；")}`}),
      el("div", {class:"note", text:"（证据：第7页结果；第10页 图5；部分解释见第12页 Discussion）"})
    ]);

    out.appendChild(imgBox);
    out.appendChild(prsBox);
    out.appendChild(geneBox);
    out.appendChild(metBox);

    source.textContent = `数据来源：${data.meta.source_ref}。边界：${data.meta.limits}`;
  }

  function setPressed(){
    for(const btn of tabs.querySelectorAll("button")){
      btn.setAttribute("aria-pressed", btn.dataset.id === current ? "true" : "false");
    }
  }

  const tabItems = [
    {id:"subtype1", label:"亚型1"},
    {id:"subtype2", label:"亚型2"},
  ];
  for(const t of tabItems){
    tabs.appendChild(el("button", {
      type:"button",
      "data-id": t.id,
      "aria-pressed": t.id === current ? "true" : "false",
      onclick: ()=>{ current = t.id; setPressed(); render(); }
    }, [t.label]));
  }

  container.appendChild(tabs);
  container.appendChild(out);
  container.appendChild(source);

  render();
}

/* Module 3: Prediction dashboard */
async function initPredictionDashboard(container){
  const data = await loadJSON("../data/anhedonia_prediction_summary.json");

  const row = el("div", {class:"btn-row"});
  const select = el("select", {ariaLabel:"选择场景"});
  const out = el("div", {class:"metric"});
  const source = el("p", {class:"note"});

  const options = [
    {id:"p11_ko_spt", label:"P11 KO（SPT）"},
    {id:"subtype1_shaps", label:"亚型1（SHAPS）"},
    {id:"cums_spt", label:"CUMS（SPT）"},
    {id:"subtype2_shaps", label:"亚型2（SHAPS）"},
  ];
  for(const opt of options){
    select.appendChild(el("option", {value: opt.id, text: opt.label}));
  }

  function render(){
    out.innerHTML = "";
    const id = select.value;
    const m = data.models.find(x => x.context_id === id);
    if(!m){
      out.appendChild(el("p", {text:"未找到该场景。"}));
      return;
    }
    const rBox = el("div", {class:"box"}, [
      el("div", {class:"label", text:"相关系数 R（预测 vs 真实）"}),
      el("div", {class:"value", text: m.r_value.toFixed(2)}),
      el("div", {class:"note", text: `解读：${rInterpretation(m.r_value)}（R范围-1到1，无单位）`})
    ]);
    const pBox = el("div", {class:"box"}, [
      el("div", {class:"label", text:"显著性 P"}),
      el("div", {class:"value", text: m.p_value.toFixed(3)}),
      el("div", {class:"note", text:"P越小，越不容易是偶然波动；但仍不代表因果。"})
    ]);
    const regionBox = el("div", {class:"box"}, [
      el("div", {class:"label", text:"使用的脑区（论文点名）"}),
      el("div", {class:"value", text: m.predictor_regions.join(" + ")}),
      el("div", {class:"note", text:"（证据：第10页正文；第11页 Fig.6e–f）"})
    ]);
    out.appendChild(rBox);
    out.appendChild(pBox);
    out.appendChild(regionBox);

    source.textContent = `数据来源：${data.meta.source_ref}。${data.meta.definition}`;
  }

  select.addEventListener("change", render);

  row.appendChild(el("label", {class:"badge", text:"选择场景"}));
  row.appendChild(select);

  container.appendChild(row);
  container.appendChild(out);
  container.appendChild(source);

  render();
}

async function init(){
  const balance = document.getElementById("balance-explorer");
  const cards = document.getElementById("evidence-cards");
  const pred = document.getElementById("prediction-dashboard");

  try{
    if(balance) await initBalanceExplorer(balance);
  }catch(e){
    console.error(e);
    if(balance) balance.textContent = "加载模块1数据失败。请确认以本地服务器方式打开页面。";
  }
  try{
    if(cards) await initEvidenceCards(cards);
  }catch(e){
    console.error(e);
    if(cards) cards.textContent = "加载模块2数据失败。请确认以本地服务器方式打开页面。";
  }
  try{
    if(pred) await initPredictionDashboard(pred);
  }catch(e){
    console.error(e);
    if(pred) pred.textContent = "加载模块3数据失败。请确认以本地服务器方式打开页面。";
  }
}

document.addEventListener("DOMContentLoaded", init);
