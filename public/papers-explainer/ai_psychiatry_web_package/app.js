/* Simple renderer for the content package (no build tools). */
async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return await res.json();
}

function el(tag, attrs={}, children=[]){
  const n = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k === 'class') n.className = v;
    else if(k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  }
  for(const c of children){
    if(typeof c === 'string') n.appendChild(document.createTextNode(c));
    else if(c) n.appendChild(c);
  }
  return n;
}

function mdToHTML(md){
  // Minimal markdown-ish: paragraphs + line breaks + bold.
  const safe = md
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
  const div = document.createElement('div');
  div.innerHTML = safe;
  return div;
}

function buildTOC(sections){
  const toc = document.getElementById('toc');
  toc.innerHTML = '';
  const targets = [
    {id:'sec-30s', label:'30秒读懂'},
    ...sections.map(s => ({id:`section-${s.id}`, label:s.heading})),
    {id:'sec-visuals', label:'配图清单'},
    {id:'sec-interactives', label:'交互模块'},
    {id:'sec-glossary', label:'术语'},
    {id:'sec-faq', label:'FAQ'}
  ];
  for(const t of targets){
    toc.appendChild(el('li', {}, [
      el('a', {href:`#${t.id}`}, [t.label])
    ]));
  }
}

function renderSections(sections){
  const root = document.getElementById('sections');
  root.innerHTML = '';
  for(const s of sections){
    const sec = el('section', {id:`section-${s.id}`}, [
      el('h3', {}, [s.heading]),
      mdToHTML(s.body_markdown),
      el('p', {class:'muted'}, [`证据：${(s.citations||[]).join('；')}`])
    ]);
    root.appendChild(sec);
  }
}

function renderVisuals(visuals){
  const grid = document.getElementById('visual-grid');
  grid.innerHTML = '';
  for(const v of visuals){
    grid.appendChild(el('article', {class:'asset'}, [
      el('div', {class:'title'}, [v.title]),
      el('div', {class:'type'}, [v.type]),
      el('p', {class:'core'}, [v.core_message]),
      el('p', {class:'src'}, [`证据：${v.source_ref}`]),
      el('details', {}, [
        el('summary', {}, ['制作说明与无障碍']),
        el('p', {}, [v.production_notes]),
        el('p', {class:'muted'}, ['alt：' + v.alt_text])
      ])
    ]));
  }
}

function unique(arr){ return [...new Set(arr)]; }

function initMaturityFilter(data){
  const domainSel = document.getElementById('mf-domain');
  const maturitySel = document.getElementById('mf-maturity');
  const qInput = document.getElementById('mf-q');
  const list = document.getElementById('mf-list');
  const note = document.getElementById('mf-note');

  const domains = [''].concat(unique(data.map(d => d.clinical_domain_en)));
  domainSel.innerHTML = domains.map(d => `<option value="${d}">${d || '全部'}</option>`).join('');

  note.textContent = '提示：部署阶段也需要持续有效性与安全性监测。（证据：第7页 表1注释）';

  function render(){
    const domain = domainSel.value;
    const maturity = maturitySel.value;
    const q = qInput.value.trim().toLowerCase();
    const filtered = data.filter(d => {
      const okDomain = !domain || d.clinical_domain_en === domain;
      const okMat = !maturity || d.evidence_maturity_en === maturity;
      const blob = `${d.clinical_domain_en} ${d.ai_application_en} ${d.key_research_examples}`.toLowerCase();
      const okQ = !q || blob.includes(q);
      return okDomain && okMat && okQ;
    });
    list.innerHTML = '';
    for(const item of filtered){
      const title = `${item.clinical_domain_en} · ${item.ai_application_en}`;
      list.appendChild(el('li', {}, [
        el('strong', {}, [title]),
        el('div', {class:'muted'}, [`成熟度：${item.evidence_maturity_en} ｜ 证据：${item.source_ref}`]),
        item.notes_for_public ? el('div', {}, [item.notes_for_public]) : null
      ]));
    }
    if(filtered.length === 0){
      list.appendChild(el('li', {class:'muted'}, ['没有匹配条目。试试清空筛选条件。']));
    }
  }

  domainSel.addEventListener('change', render);
  maturitySel.addEventListener('change', render);
  qInput.addEventListener('input', render);
  render();
}

function initDigitalPhenotypingLab(items){
  const checks = document.getElementById('dp-checks');
  const features = document.getElementById('dp-features');
  const tasks = document.getElementById('dp-tasks');
  const boundary = document.getElementById('dp-boundary');

  // Default selected channels
  const defaultSet = new Set(['accelerometer','GPS','microphone']);
  const selected = new Set(defaultSet);

  function render(){
    // features
    const feats = [];
    const tset = new Set();
    let boundaryText = '';
    for(const it of items){
      if(selected.has(it.raw_channel)){
        feats.push(...it.feature_examples);
        for(const t of it.possible_clinical_tasks) tset.add(t);
        boundaryText = it.evidence_boundary; // last selected dominates; OK for demo
      }
    }
    features.innerHTML = '';
    for(const f of unique(feats)){
      features.appendChild(el('span', {class:'chip'}, [f]));
    }
    tasks.innerHTML = '';
    for(const t of [...tset]){
      tasks.appendChild(el('li', {}, [t.replace(/_/g,' ')]));
    }
    boundary.textContent = boundaryText || '相关线索≠确诊；需标准化与外部验证。';
  }

  checks.innerHTML = '';
  for(const it of items){
    const id = `dp-${it.raw_channel}`;
    const isChecked = defaultSet.has(it.raw_channel);
    const label = el('label', {for:id}, [
      el('input', {type:'checkbox', id, checked:isChecked ? '' : null}),
      `${it.raw_channel}`
    ]);
    // fix checked attribute: DOM sets by property
    label.querySelector('input').checked = isChecked;

    label.querySelector('input').addEventListener('change', (e) => {
      if(e.target.checked) selected.add(it.raw_channel);
      else selected.delete(it.raw_channel);
      render();
    });
    checks.appendChild(label);
  }
  render();
}

function initGovernanceCompass(items){
  const sel = document.getElementById('gov-select');
  const flags = document.getElementById('gov-flags');
  const guards = document.getElementById('gov-guards');
  const explain = document.getElementById('gov-explain');

  sel.innerHTML = items.map((it, idx) => `<option value="${idx}">${it.use_case_title}</option>`).join('');

  const labels = {
    privacy_security:'隐私与安全',
    fairness_bias:'偏见与公平',
    transparency_explainability:'透明与可解释',
    human_oversight:'人类监督',
    accountability:'责任与问责',
    equity_access:'可及性与公平获得'
  };
  const guardLabels = {
    "informed_consent":"知情同意",
    "de_identification_and_encryption":"去标识化与加密",
    "fairness_audit_(What-If_Tool/AIF360)":"公平性审计（What-If Tool / AI Fairness 360）",
    "XAI_or_interpretable_model_preference":"可解释AI/优先可解释模型",
    "human_in_the_loop_confirmation":"人类确认（human-in-the-loop）",
    "post_market_monitoring":"上市后持续监测",
    "change_control_plan_for_adaptive_models":"自适应模型变更控制计划"
  };

  function render(idx){
    const it = items[idx];
    flags.innerHTML = '';
    for(const [k,v] of Object.entries(it.governance_flags)){
      if(v) flags.appendChild(el('li', {}, [labels[k] || k]));
    }
    guards.innerHTML = '';
    for(const g of it.recommended_guardrails){
      guards.appendChild(el('li', {}, [guardLabels[g] || g]));
    }
    explain.textContent = it.public_explanation + `（证据：${it.source_ref}）`;
  }
  sel.addEventListener('change', () => render(sel.value));
  render(0);
}

function initConflictSimulator(tree){
  const box = document.getElementById('sim-box');
  const sc = tree.scenarios[0];
  const nodes = new Map(sc.nodes.map(n => [n.node_id, n]));

  function renderNode(nodeId){
    const n = nodes.get(nodeId);
    box.innerHTML = '';
    if(!n){
      box.appendChild(el('p', {class:'muted'}, ['模拟结束。']));
      box.appendChild(el('button', {onClick: () => renderNode(sc.start_node)}, ['重新开始']));
      return;
    }
    box.appendChild(el('p', {class:'prompt'}, [n.prompt]));
    const btns = el('div', {class:'btns'});
    for(const opt of n.options){
      const b = el('button', {type:'button', onClick: () => showTeach(opt)}, [opt.label]);
      btns.appendChild(b);
    }
    box.appendChild(btns);
  }

  function showTeach(opt){
    box.innerHTML = '';
    box.appendChild(el('p', {class:'prompt'}, [opt.label]));
    box.appendChild(el('div', {class:'teach'}, [
      el('strong', {}, ['教学点：']),
      el('div', {}, [opt.teaching_point]),
      el('div', {class:'muted'}, [`风险提示：${opt.risk_note}`]),
      el('div', {class:'muted'}, [`证据：${opt.source_ref}`])
    ]));
    box.appendChild(el('button', {type:'button', onClick: () => renderNode(opt.next_node)}, ['继续']));
    box.appendChild(el('button', {type:'button', onClick: () => renderNode(sc.start_node)}, ['重新开始']));
  }

  renderNode(sc.start_node);
}

function renderGlossary(items){
  const root = document.getElementById('glossary');
  root.innerHTML = '';
  for(const it of items){
    root.appendChild(el('details', {}, [
      el('summary', {}, [it.term]),
      el('p', {}, [it.explain]),
      el('p', {class:'muted'}, ['类比：' + it.analogy])
    ]));
  }
}

function renderFAQ(items){
  const root = document.getElementById('faq');
  root.innerHTML = '';
  for(const it of items){
    root.appendChild(el('details', {}, [
      el('summary', {}, [it.q]),
      el('p', {}, [it.a])
    ]));
  }
}

async function main(){
  const site = await loadJSON('../data/site.json');
  document.getElementById('page-subtitle').textContent = site.sections?.[0]?.body_markdown?.replace(/^副标题：/,'') || '';
  document.getElementById('paper-meta').textContent =
    `${site.paper?.authors || ''} · ${site.paper?.journal || ''} · ${site.paper?.year || ''} · DOI: ${site.paper?.doi || ''}（${site.paper?.license || ''}）`;

  const sections = site.sections.filter(s => !['hero'].includes(s.id));
  buildTOC(sections);
  document.getElementById('sec-30s-body').appendChild(mdToHTML(site.sections.find(s => s.id === 'read_in_30s')?.body_markdown || ''));

  // Render content sections except 30s block to avoid duplication
  renderSections(site.sections.filter(s => !['hero','read_in_30s'].includes(s.id)));
  renderVisuals(site.visual_assets || []);
  document.getElementById('disclaimer').textContent = site.disclaimer || '';

  // Load interactive sample data
  const maturity = await loadJSON('../interactives/maturity_filter/sample_data.json');
  initMaturityFilter(maturity);

  const dp = await loadJSON('../interactives/digital_phenotyping_lab/sample_data.json');
  initDigitalPhenotypingLab(dp);

  const gov = await loadJSON('../interactives/governance_compass/sample_data.json');
  initGovernanceCompass(gov);

  const sim = await loadJSON('../interactives/ai_conflict_simulator/sample_data.json');
  initConflictSimulator(sim);

  // glossary & faq
  const glossary = await loadJSON('../data/glossary.json');
  renderGlossary(glossary);

  const faq = await loadJSON('../data/faq.json');
  renderFAQ(faq);
}

main().catch(err => {
  console.error(err);
  const mainEl = document.getElementById('main');
  mainEl.prepend(el('div', {class:'card'}, [
    el('h2', {}, ['加载失败']),
    el('p', {}, ['无法加载内容包数据文件。请在本地用静态服务器打开 web_template 目录（例如 VSCode Live Server），或检查路径。']),
    el('pre', {class:'muted'}, [String(err)])
  ]));
});
