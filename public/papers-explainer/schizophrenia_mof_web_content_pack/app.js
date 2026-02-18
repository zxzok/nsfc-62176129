async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return await res.json();
}

function el(tag, attrs={}, children=[]){
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class') node.className = v;
    else if(k==='html') node.innerHTML = v;
    else node.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(typeof c === 'string') node.appendChild(document.createTextNode(c));
    else if(c) node.appendChild(c);
  });
  return node;
}

function renderSections(manifest){
  const root = document.getElementById('content');
  root.innerHTML = '';
  manifest.sections.forEach(sec=>{
    const section = el('section',{class:'section',id:sec.id});
    section.appendChild(el('h2',{},sec.heading));
    const body = el('div',{class:'card'});
    body.appendChild(el('div',{class:'small',html: (sec.body_markdown || '').replace(/\n/g,'<br/>')}));
    if(sec.citations?.length){
      body.appendChild(el('div',{class:'small'},`证据锚点：${sec.citations.join('；')}`));
    }
    section.appendChild(body);
    root.appendChild(section);
  });

  // figures
  const figSec = el('section',{class:'section'});
  figSec.appendChild(el('h2',{},'配图资产'));
  manifest.visual_assets.forEach(v=>{
    const wrap = el('div',{class:'figure'});
    wrap.appendChild(el('h3',{},v.title));
    wrap.appendChild(el('div',{class:'small'},`来源：${v.source_ref}`));
    wrap.appendChild(el('img',{src:`../${v.file}`,alt:v.alt_text}));
    wrap.appendChild(el('p',{class:'small'},v.alt_text));
    figSec.appendChild(wrap);
  });
  root.appendChild(figSec);
}

async function renderModules(manifest){
  const container = document.getElementById('modules');
  container.innerHTML = '';

  // Module 1: MOF trajectory
  const m1 = manifest.interactive_modules.find(m=>m.id==='im1_mof_trajectory');
  const m1Data = await loadJSON(`../${m1.data_file}`);
  const m1Card = el('div',{class:'card'});
  m1Card.appendChild(el('h3',{},m1.title));
  m1Card.appendChild(el('p',{class:'small'},m1.purpose));
  const tpSelect = el('select');
  ['baseline','follow_up'].forEach(tp=>{
    tpSelect.appendChild(el('option',{value:tp},tp));
  });
  const table = el('table');
  const thead = el('thead');
  thead.appendChild(el('tr',{},[
    el('th',{},'组别'),
    el('th',{},'相对HC'),
    el('th',{},'证据')
  ]));
  table.appendChild(thead);
  const tbody = el('tbody');
  table.appendChild(tbody);

  function updateM1(){
    tbody.innerHTML='';
    const tp = tpSelect.value;
    m1Data.group_timepoint_comparisons
      .filter(r=>r.timepoint===tp)
      .forEach(r=>{
        tbody.appendChild(el('tr',{},[
          el('td',{},r.group),
          el('td',{},r.direction + ` (${r.p_value_text})`),
          el('td',{},r.evidence)
        ]));
      });
  }
  tpSelect.addEventListener('change',updateM1);
  updateM1();

  m1Card.appendChild(el('div',{class:'controls'},[
    el('span',{},'时间点：'),
    tpSelect
  ]));
  m1Card.appendChild(table);

  // add within-group change summary
  const changeList = el('div',{class:'small'});
  changeList.innerHTML = '<b>组内随时间变化：</b><br/>' + m1Data.within_group_change.map(x=>`${x.group}: ${x.change_direction} (${x.p_value_text})`).join('<br/>');
  m1Card.appendChild(changeList);
  m1Card.appendChild(el('p',{class:'small'},`风险提示：${m1.risk_tip}`));
  container.appendChild(m1Card);

  // Module 2: PRS thresholds
  const m2 = manifest.interactive_modules.find(m=>m.id==='im2_prs_threshold');
  const m2Data = await loadJSON(`../${m2.data_file}`);
  const m2Card = el('div',{class:'card'});
  m2Card.appendChild(el('h3',{},m2.title));
  m2Card.appendChild(el('p',{class:'small'},m2.purpose));

  const groupSel = el('select');
  ['SZ','GHR'].forEach(g=>groupSel.appendChild(el('option',{value:g},g)));
  const ptSel = el('select');
  m2Data.meta.thresholds.forEach(pt=>ptSel.appendChild(el('option',{value:pt},pt)));

  const metricsBox = el('div',{class:'small'});
  function updateM2(){
    const g = groupSel.value;
    const pt = parseFloat(ptSel.value);
    const rec = m2Data.models.find(x=>x.group===g && x.pT_threshold===pt);
    const corr = m2Data.correlations_with_ALFF.find(x=>x.group===g && x.pT_threshold===pt);
    metricsBox.innerHTML = `
      <b>模型表现</b>：MAE=${rec.model_MAE ?? 'null'}；预测r=${rec.model_pred_r ?? 'null'}；P=${rec.model_performance_p_text} <span class="badge">${rec.performance_status}</span><br/>
      <b>PRS–ALFF相关</b>：r=${corr?.partial_corr_r ?? 'null'}；P=${corr?.partial_corr_p_text ?? 'not_reported'}<br/>
      <span class="small">证据：${rec.evidence}</span>
    `;
  }
  groupSel.addEventListener('change',updateM2);
  ptSel.addEventListener('change',updateM2);
  updateM2();

  m2Card.appendChild(el('div',{class:'controls'},[
    el('span',{},'组别：'),
    groupSel,
    el('span',{},'pT：'),
    ptSel
  ]));
  m2Card.appendChild(metricsBox);
  m2Card.appendChild(el('p',{class:'small'},`风险提示：${m2.risk_tip}`));
  container.appendChild(m2Card);

  // Module 3: Lipid rank
  const m3 = manifest.interactive_modules.find(m=>m.id==='im3_lipid_rank');
  const m3Data = await loadJSON(`../${m3.data_file}`);
  const m3Card = el('div',{class:'card'});
  m3Card.appendChild(el('h3',{},m3.title));
  m3Card.appendChild(el('p',{class:'small'},m3.purpose));

  const gTabs = el('select');
  ['SZ','GHR'].forEach(g=>gTabs.appendChild(el('option',{value:g},g)));
  const sortSel = el('select');
  [
    {k:'model_pred_r',label:'按预测r排序(降序)'},
    {k:'model_MAE',label:'按MAE排序(升序)'}
  ].forEach(s=>sortSel.appendChild(el('option',{value:s.k},s.label)));

  const lipidTable = el('table');
  lipidTable.appendChild(el('thead',{},el('tr',{},[
    el('th',{},'脂质类别'),
    el('th',{},'MAE'),
    el('th',{},'预测r'),
    el('th',{},'均值相关(若报告)')
  ])));
  const lipidBody = el('tbody'); lipidTable.appendChild(lipidBody);

  function updateM3(){
    lipidBody.innerHTML='';
    const g = gTabs.value;
    const sortKey = sortSel.value;
    let rows = m3Data.predictive_species.filter(x=>x.group===g);
    rows = rows.slice().sort((a,b)=>{
      if(sortKey==='model_MAE') return a.model_MAE - b.model_MAE;
      return b.model_pred_r - a.model_pred_r;
    });
    rows.forEach(r=>{
      const corr = r.mean_level_corr_r===null ? '未报告/不显著' : `r=${r.mean_level_corr_r}, P=${r.mean_level_corr_p}`;
      lipidBody.appendChild(el('tr',{},[
        el('td',{},r.lipid_species),
        el('td',{},String(r.model_MAE)),
        el('td',{},String(r.model_pred_r)),
        el('td',{},corr)
      ]));
    });
  }
  gTabs.addEventListener('change',updateM3);
  sortSel.addEventListener('change',updateM3);
  updateM3();

  m3Card.appendChild(el('div',{class:'controls'},[
    el('span',{},'组别：'),
    gTabs,
    el('span',{},'排序：'),
    sortSel
  ]));
  m3Card.appendChild(lipidTable);
  m3Card.appendChild(el('p',{class:'small'},`风险提示：${m3.risk_tip}`));
  container.appendChild(m3Card);
}

(async function main(){
  const manifest = await loadJSON('../manifest.json');

  document.getElementById('page-title').textContent = manifest.sections[0]?.heading || manifest.seo_title;
  document.getElementById('page-subtitle').textContent = manifest.sections[0]?.body_markdown?.split('\n')[0] || '';
  document.getElementById('disclaimer').textContent = manifest.disclaimer;

  renderSections(manifest);
  await renderModules(manifest);
})().catch(err=>{
  console.error(err);
  document.getElementById('page-title').textContent = '加载失败';
  document.getElementById('page-subtitle').textContent = String(err);
});
