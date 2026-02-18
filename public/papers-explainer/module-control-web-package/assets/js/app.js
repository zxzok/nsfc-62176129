
/*
  Minimal interactive demos (vanilla JS).
  Data is loaded from window.MCN_DATA and window.CF_TOP5_DATA (assets/js/data.js).
*/

function el(id) { return document.getElementById(id); }

function clamp(x, a, b){ return Math.max(a, Math.min(b, x)); }

function renderMCN(){
  const data = window.MCN_DATA;
  const svg = el('mcn-svg');
  const info = el('mcn-info');
  if(!data || !svg) return;

  // Clear
  while(svg.firstChild) svg.removeChild(svg.firstChild);

  const W = 820, H = 420;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // Layout: circle
  const mods = data.modules;
  const R = 150;
  const cx = 240;
  const cy = 210;

  const pos = {};
  mods.forEach((m, i) => {
    const angle = (Math.PI * 2 * i) / mods.length - Math.PI/2;
    pos[m.id] = { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
  });

  // defs for arrow marker
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'arrow');
  marker.setAttribute('viewBox', '0 0 10 10');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '5');
  marker.setAttribute('markerWidth', '8');
  marker.setAttribute('markerHeight', '8');
  marker.setAttribute('orient', 'auto-start-reverse');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
  path.setAttribute('fill', '#333');
  marker.appendChild(path);
  defs.appendChild(marker);
  svg.appendChild(defs);

  // Filters
  const onlyNE2E = el('mcn-only-ne2e').checked;
  const onlyReported = el('mcn-only-reported').checked;
  const focus = el('mcn-focus').value;

  const typeOf = Object.fromEntries(mods.map(m => [m.id, m.type]));

  let edges = data.edges.slice();
  if(onlyReported) {
    edges = edges.filter(e => typeof e.amcs === 'number');
  }
  if(onlyNE2E) {
    edges = edges.filter(e => typeOf[e.from] === 'non_emotional' && typeOf[e.to] === 'emotional');
  }
  if(focus !== 'ALL') {
    edges = edges.filter(e => e.from === focus || e.to === focus);
  }

  // Draw edges
  edges.forEach(e => {
    const a = pos[e.from];
    const b = pos[e.to];
    if(!a || !b) return;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', a.x);
    line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x);
    line.setAttribute('y2', b.y);
    const w = 1 + 8 * clamp(e.amcs || 0.05, 0, 1);
    line.setAttribute('stroke-width', w);
    line.setAttribute('stroke', '#333');
    line.setAttribute('opacity', 0.35);
    line.setAttribute('marker-end', 'url(#arrow)');
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${e.from} → ${e.to}  AMCS=${e.amcs}  (${e.evidence})`;
    line.appendChild(title);

    line.addEventListener('click', () => {
      info.innerHTML = `<b>${e.from} → ${e.to}</b><br/>AMCS = <b>${e.amcs}</b><br/><small>${e.evidence}</small>`;
    });

    svg.appendChild(line);
  });

  // Draw nodes
  mods.forEach(m => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const p = pos[m.id];

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', p.x);
    circle.setAttribute('cy', p.y);
    circle.setAttribute('r', 26);
    circle.setAttribute('fill', '#fff');
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '1.5');

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', p.x);
    label.setAttribute('y', p.y + 5);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '12');
    label.textContent = m.id;

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${m.id}：${m.name_zh}（${m.type}）`;
    circle.appendChild(title);

    circle.addEventListener('click', () => {
      el('mcn-focus').value = m.id;
      renderMCN();
    });

    g.appendChild(circle);
    g.appendChild(label);
    svg.appendChild(g);
  });

  // Legend right side
  const legend = el('mcn-legend');
  legend.innerHTML = `    <div><b>模块说明</b></div>    <ul>      ${mods.map(m => `<li><b>${m.id}</b>：${m.name_zh} <small>(${m.type})</small></li>`).join('')}    </ul>    <div class="notice" style="margin-top:10px;">      仅展示论文正文明确报告的AMCS数值（见数据说明）。其余边需要从代码/补充材料提取。    </div>`;
}

function renderCFTop5(){
  const data = window.CF_TOP5_DATA;
  const svg = el('cf-svg');
  const info = el('cf-info');
  if(!data || !svg) return;

  while(svg.firstChild) svg.removeChild(svg.firstChild);
  const W = 820, H = 260;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const items = data.top5.slice();
  const max = Math.max(...items.map(d => d.cf));

  const left = 120;
  const top = 20;
  const barH = 34;
  const gap = 12;
  const scale = (W - left - 40) / max;

  items.forEach((d, i) => {
    const y = top + i * (barH + gap);

    const name = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    name.setAttribute('x', 10);
    name.setAttribute('y', y + barH * 0.7);
    name.setAttribute('font-size', '14');
    name.textContent = d.node;
    svg.appendChild(name);

    const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bar.setAttribute('x', left);
    bar.setAttribute('y', y);
    bar.setAttribute('width', d.cf * scale);
    bar.setAttribute('height', barH);
    bar.setAttribute('fill', '#333');
    bar.setAttribute('opacity', 0.75);

    const val = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    val.setAttribute('x', left + d.cf * scale + 8);
    val.setAttribute('y', y + barH * 0.7);
    val.setAttribute('font-size', '13');
    val.textContent = d.cf.toFixed(3);

    bar.addEventListener('mousemove', () => {
      info.innerHTML = `<b>${d.node}</b>（模块：${d.module}）<br/>CF = <b>${d.cf}</b><br/><small>${d.evidence}</small>`;
    });

    svg.appendChild(bar);
    svg.appendChild(val);
  });
}

function setupEvents(){
  ['mcn-only-ne2e','mcn-only-reported','mcn-focus'].forEach(id => {
    const e = el(id);
    if(e) e.addEventListener('change', () => renderMCN());
  });

  const btnA = el('toy-a');
  const btnB = el('toy-b');
  if(btnA && btnB){
    btnA.addEventListener('click', () => renderToyMDSet('A'));
    btnB.addEventListener('click', () => renderToyMDSet('B'));
  }

  const slider = el('stability-slider');
  if(slider){
    slider.addEventListener('input', () => renderStability());
  }
}

// Toy MDSet demo (NOT paper data)
const TOY = {
  nodes: ['A','B','C','D','E','F','G','H','I'],
  edges: [['A','B'],['B','C'],['C','D'],['D','E'],['E','F'],['F','G'],['G','H'],['H','I'],['C','G'],['B','E']],
  mdsets: {
    A: ['B','F'],
    B: ['C','E']
  }
};

function neighborsOf(node){
  const nb = new Set([node]);
  TOY.edges.forEach(([u,v]) => {
    if(u === node) nb.add(v);
    if(v === node) nb.add(u);
  });
  return nb;
}

function coverage(mdset){
  const cov = new Set();
  mdset.forEach(n => {
    neighborsOf(n).forEach(x => cov.add(x));
  });
  return cov;
}

function renderToyMDSet(which){
  const svg = el('toy-svg');
  const info = el('toy-info');
  if(!svg) return;
  while(svg.firstChild) svg.removeChild(svg.firstChild);

  const W=820, H=260;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const nodes = TOY.nodes;
  const mdset = TOY.mdsets[which];
  const cov = coverage(mdset);

  const x0 = 40;
  const y0 = 130;
  const step = (W - 80) / (nodes.length - 1);

  const pos = {};
  nodes.forEach((n,i)=>{ pos[n] = {x: x0 + i*step, y:y0}; });

  // edges
  TOY.edges.forEach(([u,v])=>{
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', pos[u].x);
    line.setAttribute('y1', pos[u].y);
    line.setAttribute('x2', pos[v].x);
    line.setAttribute('y2', pos[v].y);
    line.setAttribute('stroke', '#999');
    line.setAttribute('stroke-width', 2);
    line.setAttribute('opacity', 0.6);
    svg.appendChild(line);
  });

  // nodes
  nodes.forEach(n=>{
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx', pos[n].x);
    c.setAttribute('cy', pos[n].y);
    c.setAttribute('r', 18);

    let fill = '#fff';
    let stroke = '#333';
    if(mdset.includes(n)) { fill = '#333'; stroke = '#333'; }
    else if(cov.has(n)) { fill = '#fff'; stroke = '#333'; }

    c.setAttribute('fill', fill);
    c.setAttribute('stroke', stroke);
    c.setAttribute('stroke-width', 2);

    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x', pos[n].x);
    t.setAttribute('y', pos[n].y + 5);
    t.setAttribute('text-anchor','middle');
    t.setAttribute('font-size','12');
    t.setAttribute('fill', mdset.includes(n) ? '#fff' : '#333');
    t.textContent = n;

    g.appendChild(c);
    g.appendChild(t);
    svg.appendChild(g);
  });

  info.innerHTML = `示例MDSet <b>${which}</b> = { ${mdset.join(', ')} }；覆盖到节点：<b>${Array.from(cov).sort().join(', ')}</b>。<br/><small>注意：这是概念演示，不是论文真实MDSet。</small>`;
}

function renderStability(){
  const slider = el('stability-slider');
  const out = el('stability-out');
  if(!slider || !out) return;
  const v = parseInt(slider.value,10);
  // We only display statements explicitly present in the paper.
  const lines = [];
  lines.push(`当前选择：保留样本比例 <b>${v}%</b>`);
  lines.push(`节点强度（node strength）：论文报告即使只用10%样本，平均相关仍>0.8（强调‘很稳定’）。（PDF第6页，C7）`);
  if(v < 50){
    lines.push(`<span style="color:#7a4b00;"><b>ACF注意：</b>论文指出当样本<50%时，ACF平均相关会低于0.5，说明模块级ACF更敏感。（PDF第7页，C8）</span>`);
  } else {
    lines.push(`ACF：论文指出当样本≥50%时平均相关更稳定；但未在正文给出每个比例的精确数值。（PDF第7页，C8）`);
  }
  lines.push(`AMCS：论文称AMCS在样本减少时仍保持一致稳定的平均相关趋势，但正文未提供精确曲线数值。（PDF第7页，C8）`);
  out.innerHTML = lines.join('<br/>');
}

function init(){
  // populate focus dropdown
  const sel = el('mcn-focus');
  if(sel && window.MCN_DATA){
    const opts = ['ALL', ...window.MCN_DATA.modules.map(m => m.id)];
    sel.innerHTML = opts.map(v => `<option value="${v}">${v === 'ALL' ? '全部模块' : v}</option>`).join('');
  }

  setupEvents();
  renderMCN();
  renderCFTop5();
  renderToyMDSet('A');
  renderStability();
}

document.addEventListener('DOMContentLoaded', init);
