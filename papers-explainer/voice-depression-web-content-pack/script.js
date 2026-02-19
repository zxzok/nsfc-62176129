async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('Failed to load '+path);
  return res.json();
}

function el(tag, attrs={}, children=[]){
  const e=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k==='class') e.className=v;
    else if(k==='text') e.textContent=v;
    else e.setAttribute(k,v);
  }
  for(const c of children) e.appendChild(c);
  return e;
}

function renderBars(container, rows){
  const total = Math.max(...rows.map(r=>r.avg_time_s||0));
  for(const r of rows.filter(x=>x.step_key!=='total')){
    const row = el('div', {class:'bar-row'});
    row.appendChild(el('div', {class:'label', text:r.step_name.replace('Extract ','').replace(' using the Covarep toolbox','COVAREP特征提取')}));
    const bar = el('div', {class:'bar', role:'presentation'});
    const fill = el('span');
    fill.style.transform = `scaleX(${(r.avg_time_s/total).toFixed(4)})`;
    bar.appendChild(fill);
    row.appendChild(bar);
    row.appendChild(el('div', {class:'val', text:`${r.avg_time_s.toFixed(1)}s`}));
    container.appendChild(row);
  }
}

function renderKPI(container, pre, post){
  container.innerHTML='';
  container.appendChild(el('div', {class:'k'}, [
    el('div', {class:'t', text:'HAMD（治疗前，均值±SD）'}),
    el('div', {class:'n', text:`${pre.mean.toFixed(2)} ± ${pre.sd.toFixed(2)}`})
  ]));
  container.appendChild(el('div', {class:'k'}, [
    el('div', {class:'t', text:'HAMD（治疗后，均值±SD）'}),
    el('div', {class:'n', text:`${post.mean.toFixed(2)} ± ${post.sd.toFixed(2)}`})
  ]));
}

function renderFeaturePills(container, features){
  container.innerHTML='';
  for(const f of features){
    container.appendChild(el('div', {class:'pill'}, [
      el('div', {class:'name', text:f.name}),
      el('div', {class:'meta', text:`p=${f.p_value}（图5，第9页）`})
    ]));
  }
}

async function main(){
  // Title/subtitle from markdown frontmatter is not parsed here; keep simple.
  document.getElementById('title').textContent = '只用一段朗读，能多快“量出”抑郁程度？';
  document.getElementById('subtitle').textContent = '手机录音提取声音特征，用神经网络预测HAMD量表分数，并追踪网络CBT前后变化';
  document.getElementById('meta').textContent = '数据来源：Wang et al., Frontiers in Psychiatry (2023), CC BY';
  document.getElementById('blurb').textContent = '研究在47名参与者的统一朗读录音中筛出30个与HAMD显著相关的声学特征，并用神经网络预测量表分数（r=0.682，MAE=3.137；图4，第7页）。18名完成ICBT随访者HAMD下降，且4个特征显著降低（图5，第9页）。';

  // Runtime bars
  const runtime = await loadJSON('../data/key_results.json').catch(()=>null);
  const table2csv = await fetch('../data/table2_runtime.csv');
  const csvText = await table2csv.text();
  const lines = csvText.trim().split(/?
/);
  const header = lines[0].split(',');
  const rows = lines.slice(1).map(l=>{
    const parts = l.split(',');
    const obj={};
    header.forEach((h,i)=>obj[h]=parts[i]);
    obj.avg_time_s = obj.avg_time_s ? Number(obj.avg_time_s) : 0;
    obj.sd_time_s = obj.sd_time_s ? Number(obj.sd_time_s) : null;
    return obj;
  });
  renderBars(document.getElementById('runtime-bars'), rows);

  // ICBT KPI
  const kr = await loadJSON('../data/key_results.json');
  renderKPI(
    document.getElementById('hamd-card'),
    {mean: kr.longitudinal_hamd.hamd_pre_mean, sd: kr.longitudinal_hamd.hamd_pre_sd},
    {mean: kr.longitudinal_hamd.hamd_post_mean, sd: kr.longitudinal_hamd.hamd_post_sd}
  );
  renderFeaturePills(document.getElementById('icbt-features'), kr.icbt_sensitive_features);
}

main().catch(err=>{
  console.error(err);
  document.getElementById('main').prepend(el('div', {class:'card'}, [
    el('h2', {text:'加载失败'}),
    el('p', {text: String(err)})
  ]));
});
