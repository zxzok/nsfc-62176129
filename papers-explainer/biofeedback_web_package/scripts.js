async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('Failed to load '+path);
  return await res.json();
}

function el(tag, attrs={}, children=[]){
  const n=document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class') n.className=v;
    else if(k==='html') n.innerHTML=v;
    else n.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).filter(Boolean).forEach(c=>n.appendChild(typeof c==='string'?document.createTextNode(c):c));
  return n;
}

function fmtP(p){
  if(typeof p==='string') return p;
  if(p===null||p===undefined) return 'NA';
  return p.toFixed(3);
}

function renderSections(page){
  document.getElementById('heroTitle').textContent = page.hero.title;
  document.getElementById('heroSubtitle').textContent = page.hero.subtitle;
  document.getElementById('heroSource').textContent = '来源：' + page.hero.source_ref.join('；');
  const wrap=document.getElementById('sections');

  function mdToHtml(md){
    // Tiny markdown-ish renderer: **bold**, blank-line paragraphs, and line breaks
    const html = (md || '')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    return html
      .split(/\n{2,}/)
      .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');
  }
  page.sections.forEach(sec=>{
    const block=el('div',{class:'block'});
    block.appendChild(el('h2',{},sec.heading));    // Render body_markdown (minimal)
    block.appendChild(el('div',{html: mdToHtml(sec.body_markdown)}));
    block.appendChild(el('div',{class:'cite'},'证据锚点：'+sec.citations.join('；')));
    wrap.appendChild(block);
  });
  document.getElementById('disclaimer').textContent = page.disclaimer;
}

function initScaleModule(data){
  const root=document.getElementById('modScale');
  root.appendChild(el('h3',{},'量表变化对比器'));
  root.appendChild(el('p',{class:'small'},'数据来源：论文表1（第5页）。展示中位数与IQR，以及变化量的组间检验Z/P。'));

  const measures=[...new Set(data.map(d=>d.measure))];
  const sel=el('select');
  measures.forEach(m=>sel.appendChild(el('option',{value:m},m)));
  root.appendChild(el('label',{},'选择量表'));
  root.appendChild(sel);

  const view=el('select');
  ['Baseline','Week4','Change'].forEach(v=>view.appendChild(el('option',{value:v},v)));
  root.appendChild(el('label',{},'查看哪个指标'));
  root.appendChild(view);

  const out=el('div');
  root.appendChild(out);

  function render(){
    const m=sel.value;
    const v=view.value;
    const rows=data.filter(d=>d.measure===m);
    const table=el('table',{class:'table'});
    table.appendChild(el('thead',{},el('tr',{},[
      el('th',{},'组别'),el('th',{},'中位数'),el('th',{},'IQR'),el('th',{},'变化量组间检验')
    ])));
    const tb=el('tbody');
    rows.forEach(r=>{
      const obj = v==='Baseline'?r.baseline:(v==='Week4'?r.week4:r.change);
      tb.appendChild(el('tr',{},[
        el('td',{},r.group),
        el('td',{},String(obj.median)),
        el('td',{},`${obj.p25} – ${obj.p75}`),
        el('td',{},`Z=${r.between_group_change_test.z}, P=${fmtP(r.between_group_change_test.p)}`)
      ]));
    });
    table.appendChild(tb);
    out.innerHTML='';
    out.appendChild(table);
    out.appendChild(el('p',{class:'small'},'提示：组内下降≠组间变化量显著。以ISI为例，变化量组间P=0.006。'));
  }
  sel.addEventListener('change',render);
  view.addEventListener('change',render);
  render();
}

function initSpeechModule(data){
  const root=document.getElementById('modSpeech');
  root.appendChild(el('h3',{},'语音特征证据浏览器'));
  root.appendChild(el('p',{class:'small'},'数据来源：论文表2（第6页）。注意：表2不含原始特征值方向，只含检验Z/P。'));

  const famSel=el('select');
  ['All','Energy','MFCC','Formant','VoiceQuality','Other'].forEach(f=>famSel.appendChild(el('option',{value:f},f)));
  root.appendChild(el('label',{},'特征类别'));
  root.appendChild(famSel);

  const stageSel=el('select');
  ['change','week4','baseline'].forEach(s=>stageSel.appendChild(el('option',{value:s},s)));
  root.appendChild(el('label',{},'比较阶段'));
  root.appendChild(stageSel);

  const pRange=el('input',{type:'range',min:'0.001',max:'0.05',step:'0.001',value:'0.05'});
  const pLabel=el('div',{class:'small'});
  root.appendChild(el('label',{},'P值阈值（只显示≤阈值）'));
  root.appendChild(pRange);
  root.appendChild(pLabel);

  const out=el('div');
  root.appendChild(out);

  function pToNum(p){
    if(typeof p==='number') return p;
    if(typeof p==='string' && p.startsWith('<')) return parseFloat(p.replace('<','').trim());
    const n=parseFloat(p);
    return Number.isFinite(n)?n:1;
  }

  function render(){
    const fam=famSel.value;
    const stage=stageSel.value;
    const thr=parseFloat(pRange.value);
    pLabel.textContent = `当前阈值：${thr.toFixed(3)}`;

    let rows=data;
    if(fam!=='All') rows=rows.filter(r=>r.feature_family===fam);
    rows = rows.map(r=>{
      const st = r[stage];
      return {...r, _p:pToNum(st.p), _z:st.z, _p_raw:st.p};
    }).filter(r=>r._p<=thr)
      .sort((a,b)=>a._p-b._p)
      .slice(0,10);

    const table=el('table',{class:'table'});
    table.appendChild(el('thead',{},el('tr',{},[
      el('th',{},'特征'),el('th',{},'类别'),el('th',{},'Z'),el('th',{},'P')
    ])));
    const tb=el('tbody');
    rows.forEach(r=>tb.appendChild(el('tr',{},[
      el('td',{},r.feature_name),
      el('td',{},el('span',{class:'badge'},r.feature_family)),
      el('td',{},String(r._z)),
      el('td',{},String(r._p_raw))
    ])));
    table.appendChild(tb);
    out.innerHTML='';
    out.appendChild(table);
    out.appendChild(el('p',{class:'small'},'提示：这里展示的是两组差异的检验结果，而不是“声音变大/变小”。'));
  }

  famSel.addEventListener('change',render);
  stageSel.addEventListener('change',render);
  pRange.addEventListener('input',render);
  render();
}

function initCorrModule(symSpeech, physSpeech){
  const root=document.getElementById('modCorr');
  root.appendChild(el('h3',{},'相关关系地图（简化版）'));
  root.appendChild(el('p',{class:'small'},'数据来源：第5页（症状↔语音相关）与第7页表4（生理↔语音相关）。相关不等于因果。'));

  const tab=el('select');
  ['Symptom-Speech (Change)','Symptom-Speech (Baseline)','Physiology-Speech (Change)'].forEach(t=>tab.appendChild(el('option',{value:t},t)));
  root.appendChild(el('label',{},'选择关系类型'));
  root.appendChild(tab);

  const out=el('div');
  root.appendChild(out);

  function render(){
    let rows=[];
    if(tab.value==='Symptom-Speech (Change)'){
      rows=symSpeech.change.map(d=>({left:d.symptom_improvement,right:d.speech_feature,r:d.r,p:d.p,src:'第5页'}));
    }else if(tab.value==='Symptom-Speech (Baseline)'){
      rows=symSpeech.baseline.map(d=>({left:d.symptom,right:d.speech_feature,r:d.r,p:d.p,src:'第5页'}));
    }else{
      rows=physSpeech.map(d=>({left:d.phys_feature,right:d.speech_feature,r:d.r,p:d.p,src:'第7页 表4'}));
    }
    rows = rows.sort((a,b)=>a.p-b.p).slice(0,12);

    const table=el('table',{class:'table'});
    table.appendChild(el('thead',{},el('tr',{},[
      el('th',{},'左侧变量'),el('th',{},'右侧变量'),el('th',{},'r'),el('th',{},'P'),el('th',{},'来源')
    ])));
    const tb=el('tbody');
    rows.forEach(r=>tb.appendChild(el('tr',{},[
      el('td',{},r.left),
      el('td',{},r.right),
      el('td',{},String(r.r)),
      el('td',{},String(r.p)),
      el('td',{},r.src)
    ])));
    table.appendChild(tb);

    out.innerHTML='';
    out.appendChild(table);
    out.appendChild(el('p',{class:'small'},'风险提示：相关关系只说明“样本中一起变化”，不能推出因果。'));
  }

  tab.addEventListener('change',render);
  render();
}

function initMLModule(models){
  const root=document.getElementById('modML');
  root.appendChild(el('h3',{},'预测模型解读器'));
  root.appendChild(el('p',{class:'small'},'数据来源：第7–8页图1–4；标签定义见第4页。'));

  const sel=el('select');
  [['anxiety','焦虑响应预测'],['insomnia','失眠响应预测']].forEach(([v,t])=>sel.appendChild(el('option',{value:v},t)));
  root.appendChild(el('label',{},'选择任务'));
  root.appendChild(sel);

  const out=el('div');
  root.appendChild(out);

  function metrics(cm){
    const {tn,fp,fn,tp}=cm;
    const n=tn+fp+fn+tp;
    const acc=(tn+tp)/n;
    const sens=tp/(tp+fn);
    const spec=tn/(tn+fp);
    return {n,acc,sens,spec};
  }

  function render(){
    const k=sel.value;
    const m=models[k];
    const cm=m.confusion_matrix;
    const met=metrics(cm);

    out.innerHTML='';
    out.appendChild(el('p',{},`标签定义：${models.label_definition}`));
    out.appendChild(el('p',{class:'small'},`来源：${models.label_source_ref}`));

    const t=el('table',{class:'table'});
    t.appendChild(el('thead',{},el('tr',{},[el('th',{},''),el('th',{},'预测0'),el('th',{},'预测1')])));
    t.appendChild(el('tbody',{},[
      el('tr',{},[el('td',{},'真实0'),el('td',{},String(cm.tn)),el('td',{},String(cm.fp))]),
      el('tr',{},[el('td',{},'真实1'),el('td',{},String(cm.fn)),el('td',{},String(cm.tp))])
    ]));
    out.appendChild(t);

    out.appendChild(el('p',{class:'small'},`论文报告准确率：${Math.round(m.reported_accuracy*100)}%；按图中计数计算≈${(met.acc*100).toFixed(1)}%。`));
    out.appendChild(el('p',{class:'small'},`敏感度（命中响应者）≈${(met.sens*100).toFixed(1)}%；特异度（识别非响应者）≈${(met.spec*100).toFixed(1)}%。`));
    out.appendChild(el('p',{class:'small'},`ROC AUC（5折）：${m.roc_auc_folds.join(', ')}；均值≈${m.roc_auc_mean}。`));
    out.appendChild(el('p',{class:'small'},'风险提示：准确率约六成，误判仍不少，不适用于个人自测。'));
  }

  sel.addEventListener('change',render);
  render();
}

(async function main(){
  const page = await loadJSON('site_data.json');
  renderSections(page);

  const scales = await loadJSON('../data/clinical_scales_table1.json');
  initScaleModule(scales);

  const speech = await loadJSON('../data/speech_features_table2.json');
  initSpeechModule(speech);

  const symSpeech = await loadJSON('../data/symptom_speech_corr.json');
  const physSpeech = await loadJSON('../data/phys_speech_corr_table4.json');
  initCorrModule(symSpeech, physSpeech);

  const models = await loadJSON('../data/prediction_models.json');
  initMLModule(models);
})();
