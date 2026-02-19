async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('Failed to load '+path);
  return res.json();
}

function mdToHTML(md){
  // tiny markdown-ish: bold + paragraphs + line breaks
  if(!md) return "";
  return md
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\n\n+/g,'</p><p>')
    .replace(/\n/g,'<br/>');
}



function citeLine(citations){
  if(!citations || !citations.length) return '';
  return '证据：' + citations.join('；');
}

function setTabs(){
  const tabs = [
    {btn:document.getElementById('tabA'), panel:document.getElementById('panelA')},
    {btn:document.getElementById('tabB'), panel:document.getElementById('panelB')},
    {btn:document.getElementById('tabC'), panel:document.getElementById('panelC')},
  ];
  tabs.forEach((t, idx)=>{
    t.btn.addEventListener('click', ()=>{
      tabs.forEach((x)=>{x.btn.setAttribute('aria-selected','false'); x.panel.classList.remove('active');});
      t.btn.setAttribute('aria-selected','true');
      t.panel.classList.add('active');
      t.btn.focus();
    });
  });
}

function renderEffectSummary(summary){
  const box = document.getElementById('effectSummary');
  const main = summary.effect_sets.find(x=>x.effect_id==='post_vs_pre_summary');
  const mid = summary.effect_sets.find(x=>x.effect_id==='midpoint_vs_pre_summary');
  const pb = summary.publication_bias;
  box.innerHTML = `
    <h3>关键数字（终点 vs 基线）</h3>
    <p><strong>d=${main.pooled_d}</strong>（95%CI ${main.ci_low}–${main.ci_high}），I²=${main.heterogeneity_i2}%</p>
    <p class="small">${main.source_ref}</p>
    <hr style="border:none;border-top:1px solid var(--border);margin:10px 0;"/>
    <h3>中期效果（中点 vs 基线）</h3>
    <p><strong>d=${mid.pooled_d}</strong>（95%CI ${mid.ci_low}–${mid.ci_high}），I²=${mid.heterogeneity_i2}%</p>
    <p class="small">${mid.source_ref}</p>
    <hr style="border:none;border-top:1px solid var(--border);margin:10px 0;"/>
    <h3>证据提醒</h3>
    <p>发表偏倚信号：Egger t=${pb.eggers_t}，P=${pb.p_value}。</p>
    <p class="small">${pb.source_ref}</p>
  `;
}

function renderEffectTable(fig5){
  const wrap = document.getElementById('effectTable');
  const rows = fig5.studies.map(s=>`<tr><td>${s.study}</td><td>${s.std_diff}</td><td>[${s.ci_low}, ${s.ci_high}]</td><td>${s.p}</td></tr>`).join('');
  wrap.innerHTML = `
    <table class="table" aria-label="逐研究效应量（从图5提取）">
      <thead><tr><th>研究</th><th>Std diff</th><th>95%CI</th><th>P</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="small">来源：${fig5.source_ref}</p>
  `;
}

function renderClusters(data){
  const dirSel = document.getElementById('clusterDirection');
  const netSel = document.getElementById('clusterNetwork');
  const list = document.getElementById('clusterList');

  function draw(){
    const dir = dirSel.value;
    const net = netSel.value;
    const items = data.clusters
      .filter(c=>c.direction===dir)
      .filter(c=>net==='all' ? true : (c.network_annotation===net));

    list.innerHTML = items.map(c=>`
      <details class="details" style="margin:8px 0;">
        <summary>簇${c.cluster_id}｜${c.brain_region}（${c.hemisphere}）</summary>
        <p>坐标（MNI）：(${c.mni_x}, ${c.mni_y}, ${c.mni_z})；体积：${c.volume_mm3} mm³</p>
        <p>网络标签：${c.network_annotation}</p>
        <p class="small">证据：${c.source_ref}</p>
      </details>
    `).join('');

    if(items.length===0){
      list.innerHTML = '<p class="small">没有匹配条目。</p>';
    }
  }

  dirSel.addEventListener('change', draw);
  netSel.addEventListener('change', draw);
  draw();
}

function renderModerators(mod){
  const wrap = document.getElementById('moderatorCards');
  const items = mod.moderators;

  wrap.innerHTML = items.map(m=>{
    const sg = m.subgroup || {};
    const uv = m.univariate || {};
    return `
      <details class="details" style="margin:8px 0;">
        <summary>${m.name} <span class="small">（${m.category}）</span></summary>
        <p><strong>分组比较</strong>：χ²=${sg.chi_squared ?? 'NA'}；P=${sg.p_value ?? 'NA'}；I²=${sg.i2_percent ?? 'NA'}</p>
        <p><strong>单变量元回归</strong>：Q=${uv.q_value ?? 'NA'}；P=${uv.p_value ?? 'NA'}；系数=${uv.coefficient ?? 'NA'}</p>
        <p class="small">证据：${mod.source_ref}</p>
      </details>
    `;
  }).join('');
}

function renderStudies(studies){
  const tableWrap = document.getElementById('studiesTable');
  const filterNibs = document.getElementById('filterNibs');
  const filterScale = document.getElementById('filterScale');
  const search = document.getElementById('searchStudy');

  function uniq(arr){return Array.from(new Set(arr)).sort();}
  uniq(studies.map(s=>s.nibs_type)).forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;filterNibs.appendChild(o);});
  uniq(studies.map(s=>s.depression_scale)).forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;filterScale.appendChild(o);});

  function draw(){
    const nibs = filterNibs.value;
    const scale = filterScale.value;
    const q = search.value.trim().toLowerCase();

    const filtered = studies.filter(s=>{
      const ok1 = nibs==='all' || s.nibs_type===nibs;
      const ok2 = scale==='all' || s.depression_scale===scale;
      const hay = `${s.author_year} ${s.country} ${s.publication_year}`.toLowerCase();
      const ok3 = !q || hay.includes(q);
      return ok1 && ok2 && ok3;
    }).sort((a,b)=> (b.total_sample_size||0)-(a.total_sample_size||0));

    const rows = filtered.map(s=>`<tr>
      <td>${s.author_year}</td><td>${s.country}</td><td>${s.publication_year}</td>
      <td>${s.nibs_type}</td><td>${s.depression_scale}</td><td>${s.total_sample_size}</td>
      <td class="small">${s.source_ref}</td>
    </tr>`).join('');

    tableWrap.innerHTML = `
      <table class="table" aria-label="纳入研究列表">
        <thead><tr><th>研究</th><th>国家</th><th>年份</th><th>刺激</th><th>量表</th><th>样本量</th><th>证据</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  filterNibs.addEventListener('change', draw);
  filterScale.addEventListener('change', draw);
  search.addEventListener('input', draw);
  draw();
}

async function main(){
  setTabs();
  const site = await loadJSON('../data/site.json');
  const effectSummary = await loadJSON('../data/datasets/effect_summary.json');
  const fig5 = await loadJSON('../data/datasets/effects_post_fig5.json');
  const clusters = await loadJSON('../data/datasets/ale_clusters.json');
  const moderators = await loadJSON('../data/datasets/moderators.json');
  const studies = await loadJSON('../data/datasets/studies.json');

  // Title/subtitle from markdown front matter is in content file; for demo we just use constants:
  document.getElementById('pageTitle').textContent = '无创“脑刺激”真的能缓解抑郁吗？';
  document.getElementById('pageSubtitle').textContent = '汇总14项fMRI研究：刺激前额叶后，症状平均改善很大，同时大脑关键网络出现可重复变化（证据：第1页摘要；第7页表2/图4；第5页Scale-based Analysis）';

  // 30s from sections
  const thirty = site.sections.find(s=>s.id==='thirty_seconds');
  document.getElementById('thirty').innerHTML = '<p>'+mdToHTML(thirty.body_markdown)+'</p>';
  document.getElementById('thirtyCite').textContent = citeLine(thirty.citations);

  // simple badges
  const badges = document.getElementById('badges');
  badges.innerHTML = [
    '14项研究 / 584人（第1页摘要；第3页Study Characteristics）',
    'd=1.82（第5页；第8页图5）',
    'I²=87%（第5页）',
    'P<0.001，簇>150 mm³（第1页摘要；第3页）'
  ].map(t=>`<span class="badge">${t}</span>`).join('');

  // KPI cards
  const kpi = document.getElementById('kpi');
  kpi.innerHTML = `
    <div class="card"><h3>纳入研究</h3><p>14项fMRI研究<br/><span class="small">（第1页摘要；第3页）</span></p></div>
    <div class="card"><h3>总样本</h3><p>584人<br/><span class="small">（第1页摘要；第3页Study Characteristics）</span></p></div>
    <div class="card"><h3>终点改善</h3><p>d=1.82<br/><span class="small">（第5页；第8页图5）</span></p></div>
    <div class="card"><h3>差异</h3><p>I²=87%<br/><span class="small">（第5页）</span></p></div>
  `;

  // why/how/limits
  const why = site.sections.find(s=>s.id==='why');
  document.getElementById('whyBody').innerHTML = '<p>'+mdToHTML(why.body_markdown)+'</p>';
  document.getElementById('whyCite').textContent = citeLine(why.citations);

  const how = site.sections.find(s=>s.id==='how');
  document.getElementById('howBody').innerHTML = '<p>'+mdToHTML(how.body_markdown)+'</p>';
  document.getElementById('howCite').textContent = citeLine(how.citations);

  const limits = site.sections.find(s=>s.id==='limits_next');
  document.getElementById('limitsBody').innerHTML = '<p>'+mdToHTML(limits.body_markdown)+'</p>';
  document.getElementById('limitsCite').textContent = citeLine(limits.citations);

  // effects modules
  renderEffectSummary(effectSummary);
  renderEffectTable(fig5);

  // clusters
  renderClusters(clusters);

  // moderators
  renderModerators(moderators);

  // studies
  renderStudies(studies);

  // glossary/faq from markdown files (optional): for demo keep tiny placeholders
  document.getElementById('glossaryBody').innerHTML = '<p class="small">详见内容包 content/glossary.md</p>';
  document.getElementById('faqBody').innerHTML = '<p class="small">详见内容包 content/faq.md</p>';
  document.getElementById('disclaimer').textContent = site.disclaimer;
}

main().catch(err=>{
  console.error(err);
  document.getElementById('pageTitle').textContent = '加载失败：请检查本地路径与静态服务器';
});
