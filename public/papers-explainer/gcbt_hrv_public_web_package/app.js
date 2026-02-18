async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('Failed to load '+path);
  return await res.json();
}

function el(tag, cls, html){
  const node = document.createElement(tag);
  if(cls) node.className = cls;
  if(html !== undefined) node.innerHTML = html;
  return node;
}

function render(){
  loadJSON('../site_package.json').then(pkg=>{
    document.getElementById('title').textContent = pkg.sections.find(s=>s.id==='hero')?.heading || pkg.slug;
    document.getElementById('subtitle').textContent = pkg.sections.find(s=>s.id==='hero')?.body_markdown || '';
    document.getElementById('disclaimer').textContent = pkg.disclaimer || '';

    const sectionsWrap = document.getElementById('sections');
    pkg.sections.filter(s=>s.id!=='hero').forEach(sec=>{
      const s = el('section','section');
      s.appendChild(el('h2','',sec.heading));
      s.appendChild(el('div','',sec.body_markdown));
      const c = el('div','cites', '<strong>证据：</strong> ' + (sec.citations||[]).join('；'));
      s.appendChild(c);
      sectionsWrap.appendChild(s);
    });

    const modules = document.getElementById('modules');
    pkg.interactive_modules.forEach(m=>{
      const card = el('div','card');
      card.appendChild(el('h3','',m.title));
      card.appendChild(el('p','',m.purpose));
      const kv = el('div','kv');
      kv.innerHTML = `
        <div>数据文件</div><div>${(m.data_files||[]).join(', ')}</div>
        <div>控制方式</div><div>${(m.ui_controls||[]).join(' / ')}</div>
        <div>证据来源</div><div>${m.source_ref}</div>
      `;
      card.appendChild(kv);
      const pre = el('pre','', JSON.stringify(m.schema, null, 2));
      pre.style.maxHeight = '240px';
      pre.style.overflow = 'auto';
      pre.style.background = '#0b1020';
      pre.style.color = '#d7e0ff';
      pre.style.padding = '10px';
      pre.style.borderRadius = '10px';
      card.appendChild(el('p','meta','Schema（截断展示）：'));
      card.appendChild(pre);
      modules.appendChild(card);
    });
  }).catch(err=>{
    document.getElementById('title').textContent = '加载失败';
    document.getElementById('subtitle').textContent = String(err);
  });
}

render();
