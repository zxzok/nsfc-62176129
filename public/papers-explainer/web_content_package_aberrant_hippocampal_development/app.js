// Prototype JS: render sections, figures, and simple interactives.
// This is intentionally lightweight (no external libs).
function readJSON(id){
  return JSON.parse(document.getElementById(id).textContent);
}
const bundle = readJSON('bundleData');
const citationMap = readJSON('citationMap');

function stageLabel(stage){
  return stage === 'childhood' ? '童年' : (stage === 'adolescence' ? '青春期' : '成年');
}

function regionLabel(region){
  const map = {
    hippocampus: '海马体',
    striatum: '纹状体',
    left_hippocampus: '左海马体',
    right_hippocampus: '右海马体'
  };
  return map[region] || region;
}

function showCitation(citeId){
  const c = citationMap[citeId];
  if(!c){ alert('未知引用：' + citeId); return; }
  const msg = `${c.label}\n类型：${c.type}\n页码：${c.page}` + (c.figure ? `\n图号：${c.figure}` : '') + (c.table ? `\n表号：${c.table}` : '');
  alert(msg);
}

// Quick read: use zh markdown file is not embedded; instead build from section list as hint
document.getElementById('quickRead').textContent = '提示：正式上线可直接渲染 content/page.zh.md 中的“30秒读懂”段落；本原型主要演示数据结构与交互。';

// Render sections list
const sectionList = document.getElementById('sectionList');
bundle.sections.forEach(sec => {
  const div = document.createElement('div');
  div.className = 'sectionItem';
  const h3 = document.createElement('h3');
  h3.textContent = sec.heading;
  const p = document.createElement('p');
  p.textContent = sec.body_markdown.replace(/\(证据：.*?\)/g,'').trim();
  div.appendChild(h3);
  div.appendChild(p);

  const cites = document.createElement('div');
  cites.className = 'cites';
  (sec.citations || []).forEach(cid => {
    const btn = document.createElement('button');
    btn.className = 'citeBtn';
    btn.textContent = citationMap[cid] ? citationMap[cid].label : cid;
    btn.addEventListener('click', ()=>showCitation(cid));
    cites.appendChild(btn);
  });
  div.appendChild(cites);
  sectionList.appendChild(div);
});

// Render figure grid
const figureGrid = document.getElementById('figureGrid');
bundle.visual_assets.forEach(v => {
  const card = document.createElement('div');
  card.className = 'figure';

  // Image or SVG
  let media;
  if(v.file_path.endsWith('.svg')){
    media = document.createElement('object');
    media.type = 'image/svg+xml';
    media.data = v.file_path;
    media.setAttribute('aria-label', v.alt_text_zh);
  }else{
    media = document.createElement('img');
    media.src = v.file_path;
    media.alt = v.alt_text_zh;
  }
  card.appendChild(media);

  const cap = document.createElement('div');
  cap.className = 'cap';
  const h4 = document.createElement('h4');
  h4.textContent = v.title;
  const p = document.createElement('p');
  p.textContent = '来源：' + (v.source_ref||[]).map(cid => citationMap[cid]?.label || cid).join('；');
  cap.appendChild(h4);
  cap.appendChild(p);

  const citeRow = document.createElement('div');
  citeRow.className = 'cites';
  (v.source_ref||[]).forEach(cid => {
    const btn = document.createElement('button');
    btn.className = 'citeBtn';
    btn.textContent = citationMap[cid]?.label || cid;
    btn.addEventListener('click', ()=>showCitation(cid));
    citeRow.appendChild(btn);
  });
  cap.appendChild(citeRow);

  card.appendChild(cap);
  figureGrid.appendChild(card);
});

// Interactive 1: Development timeline
const devData = readJSON('sampleDevelopment');
const stageSlider = document.getElementById('stageSlider');
const stageLabelEl = document.getElementById('stageLabel');
const regionSelect = document.getElementById('regionSelect');
const devResult = document.getElementById('devResult');

function updateDev(){
  const stageIndex = parseInt(stageSlider.value,10);
  const stage = ['childhood','adolescence','adulthood'][stageIndex];
  const region = regionSelect.value;
  stageLabelEl.textContent = stageLabel(stage);

  // Find record with group=MAM for simplicity
  const rec = devData.records.find(r => r.stage===stage && r.region===region && r.group==='MAM');
  if(!rec){ devResult.textContent = '未找到对应数据。'; return; }

  const dirText = rec.effect_direction === 'MAM_lower'
    ? 'MAM组较对照组更低（↓）'
    : '差异不显著（ns）';

  devResult.innerHTML = `
    <div><strong>脑区：</strong>${regionLabel(region)}</div>
    <div><strong>阶段：</strong>${stageLabel(stage)}（${devData.metadata.stage_definition[stage]}）</div>
    <div><strong>结论：</strong>${dirText}</div>
    <div><strong>显著性：</strong>${rec.group_diff_p_text}</div>
    <div class="cites"><button class="citeBtn" onclick="showCitation('p7_fig2')">第7页 图2</button></div>
  `;
}
stageSlider.addEventListener('input', updateDev);
regionSelect.addEventListener('change', updateDev);
updateDev();

// Interactive 2: Intervention compare
const interData = readJSON('sampleIntervention');
const speciesSelect = document.getElementById('speciesSelect');
const interRegionSelect = document.getElementById('interRegionSelect');
const interResult = document.getElementById('interResult');

function regionOptionsForSpecies(species){
  if(species==='rat'){
    return [
      {value:'hippocampus', label:'海马体'},
      {value:'striatum', label:'纹状体'}
    ];
  }
  return [
    {value:'left_hippocampus', label:'左海马体'},
    {value:'right_hippocampus', label:'右海马体'}
  ];
}

function updateInterRegionOptions(){
  const species = speciesSelect.value;
  interRegionSelect.innerHTML = '';
  regionOptionsForSpecies(species).forEach(opt=>{
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    interRegionSelect.appendChild(o);
  });
}

function updateInter(){
  const species = speciesSelect.value;
  const region = interRegionSelect.value;
  const rec = interData.effects.find(e => e.species===species && e.region===region);
  if(!rec){ interResult.textContent='未找到对应数据。'; return; }
  const dirMap = {increase:'增加', decrease:'减少', no_significant_change:'无显著变化'};
  const nText = typeof rec.n === 'number' ? `n=${rec.n}` : (rec.n ? JSON.stringify(rec.n) : 'n=未报告');
  interResult.innerHTML = `
    <div><strong>对象：</strong>${species==='rat'?'大鼠（MAM模型）':'青少年患者'}</div>
    <div><strong>脑区：</strong>${regionLabel(region)}</div>
    <div><strong>比较：</strong>${rec.comparison_label}</div>
    <div><strong>结果：</strong>${dirMap[rec.effect_direction] || rec.effect_direction}（${rec.p_text}）</div>
    <div><strong>样本量：</strong>${nText}</div>
    <div class="cites">
      <button class="citeBtn" onclick="showCitation('${species==='rat'?'p7_fig3':'p9_fig4'}')">${species==='rat'?'第7页 图3':'第9页 图4'}</button>
    </div>
  `;
}

speciesSelect.addEventListener('change', ()=>{
  updateInterRegionOptions();
  updateInter();
});
interRegionSelect.addEventListener('change', updateInter);
updateInterRegionOptions();
updateInter();

// Interactive 3: symptom dashboard
const symData = readJSON('sampleSymptoms');
const scaleSelect = document.getElementById('scaleSelect');
const showSd = document.getElementById('showSd');
const symBars = document.getElementById('symBars');

function updateSym(){
  const code = scaleSelect.value;
  const rec = symData.scales.find(s => s.scale_code===code);
  if(!rec){ symBars.textContent='未找到量表数据。'; return; }

  const pre = rec.pre_mean;
  const post = rec.post_mean;
  const delta = post - pre;
  const maxVal = Math.max(pre, post) * 1.1;

  function barWidth(v){ return Math.max(0, Math.min(100, (v / maxVal) * 100)); }

  const sdText = showSd.checked ? `±${rec.pre_sd.toFixed(2)} / ±${rec.post_sd.toFixed(2)}` : '';
  const pText = rec.p_threshold ? `（${rec.p_threshold}）` : '';

  symBars.innerHTML = `
    <div class="barRow">
      <div class="label"><strong>${rec.scale_name_cn}</strong> ${pText}</div>
      <div class="barMeta"><span>治疗前：${pre.toFixed(2)} ${sdText}</span><span>治疗后：${post.toFixed(2)}</span></div>
      <div class="bar"><div style="width:${barWidth(pre)}%"></div></div>
      <div class="bar" style="margin-top:8px"><div style="width:${barWidth(post)}%"></div></div>
      <div class="barMeta"><span>变化：${delta.toFixed(2)}（负值=下降）</span><span>n=${symData.n}</span></div>
      <div class="cites">
        <button class="citeBtn" onclick="showCitation('p8_table2')">第8页 表2</button>
      </div>
    </div>
  `;
}
scaleSelect.addEventListener('change', updateSym);
showSd.addEventListener('change', updateSym);
updateSym();

// Interactive 4: protocol builder
const protoData = readJSON('sampleProtocols');
const protoSelect = document.getElementById('protoSelect');
const protoResult = document.getElementById('protoResult');

function updateProto(){
  const id = protoSelect.value;
  const p = protoData.protocols.find(x => x.protocol_id===id);
  if(!p){ protoResult.textContent='未找到方案。'; return; }
  protoResult.innerHTML = `
    <div><strong>对象：</strong>${p.species==='human'?'青少年患者':'大鼠'}</div>
    <div><strong>靶点：</strong>枕叶皮层</div>
    <div><strong>频率：</strong>${p.frequency_hz} Hz</div>
    <div><strong>节律：</strong>${p.train_on_seconds}s 开 / ${p.train_off_seconds}s 关</div>
    <div><strong>每次脉冲：</strong>${p.pulses_per_session}</div>
    <div><strong>单次时长：</strong>${p.session_duration_seconds}s</div>
    <div><strong>每日次数：</strong>${p.sessions_per_day}</div>
    <div><strong>疗程：</strong>${p.total_days ? (p.total_days + '天，共' + p.total_sessions + '次') : '2周（详见说明）'}</div>
    <div><strong>强度：</strong>${p.intensity_percent_rmt ? (p.intensity_percent_rmt + '%RMT') : '论文未对动物方案报告RMT'}</div>
    <div><strong>说明：</strong>${p.notes}</div>
    <div class="cites"><button class="citeBtn" onclick="showCitation('p5_rtms_protocols')">第5页 rTMS方案</button></div>
  `;
}
protoSelect.addEventListener('change', updateProto);
updateProto();

// Expose showCitation for inline onclick
window.showCitation = showCitation;
