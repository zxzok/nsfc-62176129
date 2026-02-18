(function(){
  const data = window.PAGE_DATA;
  if(!data){
    document.getElementById('page-title').textContent = '未找到PAGE_DATA';
    return;
  }

  // Set title/meta
  document.title = data.seo_title || data.sections?.[0]?.heading || '页面预览';
  const metaDesc = document.querySelector('meta[name="description"]');
  if(metaDesc) metaDesc.setAttribute('content', data.seo_description || '');

  // Header
  const hero = data.sections?.find(s => s.id === 'hero') || data.sections?.[0];
  document.getElementById('page-title').textContent = hero?.heading || '页面标题';
  document.getElementById('page-subtitle').textContent = hero?.body_markdown?.replace(/\*\*/g,'') || '';
  document.getElementById('page-evidence').textContent = (hero?.citations?.length ? ('证据：' + hero.citations.join('；')) : '');

  // TOC
  const toc = document.getElementById('toc');
  (data.sections || []).forEach(sec => {
    if(sec.id === 'hero') return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#sec-' + sec.id;
    a.textContent = sec.heading;
    li.appendChild(a);
    toc.appendChild(li);
  });

  // Sections
  const root = document.getElementById('sections-root');
  (data.sections || []).forEach(sec => {
    if(sec.id === 'hero') return;

    const wrap = document.createElement('section');
    wrap.id = 'sec-' + sec.id;

    const h = document.createElement('h2');
    h.textContent = sec.heading;
    wrap.appendChild(h);

    // body_markdown: minimal rendering (paragraph split)
    const body = document.createElement('div');
    const parts = (sec.body_markdown || '').split('\n');
    parts.forEach(line => {
      const t = line.trim();
      if(!t) return;
      if(t.startsWith('### ')){
        const h3 = document.createElement('h3');
        h3.textContent = t.replace(/^###\s*/, '');
        body.appendChild(h3);
      }else{
        const p = document.createElement('p');
        p.textContent = t.replace(/\*\*/g,'');
        body.appendChild(p);
      }
    });
    wrap.appendChild(body);

    if(sec.citations && sec.citations.length){
      const c = document.createElement('div');
      c.className = 'citations';
      c.innerHTML = '<span>证据锚点：</span>' + sec.citations.map(x => `<code>${escapeHtml(x)}</code>`).join('');
      wrap.appendChild(c);
    }

    root.appendChild(wrap);
  });

  // Visual assets
  const grid = document.getElementById('visual-grid');
  (data.visual_assets || []).forEach(v => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.alt = v.alt_text || v.title || '';
    img.loading = 'lazy';
    // resolve paths relative to /web/
    img.src = '../' + (v.thumbnail || v.file);
    card.appendChild(img);

    const body = document.createElement('div');
    body.className = 'body';

    const t = document.createElement('p');
    t.className = 'title';
    t.textContent = v.title;
    body.appendChild(t);

    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = `${v.type}｜${v.source_ref}`;
    body.appendChild(meta);

    const cap = document.createElement('p');
    cap.className = 'caption';
    cap.textContent = v.caption || '';
    body.appendChild(cap);

    card.appendChild(body);
    grid.appendChild(card);
  });

  // Interactive modules
  const modulesRoot = document.getElementById('modules-root');
  (data.interactive_modules || []).forEach(m => {
    const wrap = document.createElement('div');
    wrap.className = 'module';

    const h3 = document.createElement('h3');
    h3.textContent = m.title;
    wrap.appendChild(h3);

    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = m.purpose + (m.source_ref ? `（证据：${m.source_ref}）` : '');
    wrap.appendChild(p);

    // Add a small live demo only for the wordcount calculator
    if(m.id === 'im-wordcount-calculator'){
      const controls = document.createElement('div');
      controls.className = 'controls';

      const label = document.createElement('label');
      label.setAttribute('for', 'wc-slider');
      label.textContent = '额外增加的词数（Δwords）';
      controls.appendChild(label);

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = 0;
      slider.max = 200;
      slider.step = 1;
      slider.value = 10;
      slider.id = 'wc-slider';
      controls.appendChild(slider);

      const out = document.createElement('div');
      out.className = 'output';
      controls.appendChild(out);

      const note = document.createElement('p');
      note.className = 'muted';
      note.textContent = '计算规则：Δt = 0.075 × Δwords（来自论文GLMM结果；证据：第5页 Quantitative validation；第3页 Table 2）';
      controls.appendChild(note);

      function render(){
        const dw = Number(slider.value);
        const dt = dw * 0.075;
        out.textContent = `预计多花时间：${dt.toFixed(2)} 秒（当Δwords=${dw}）`;
      }
      slider.addEventListener('input', render);
      render();

      wrap.appendChild(controls);
    }else{
      const hint = document.createElement('div');
      hint.className = 'block';
      hint.textContent = '实现提示：本内容包提供该模块的JSON Schema（见schemas/）与数据衍生脚本（scripts/build_derived_data.py）。';
      wrap.appendChild(hint);
    }

    modulesRoot.appendChild(wrap);
  });

  // Disclaimer
  document.getElementById('disclaimer-text').textContent = data.disclaimer || '';

  function escapeHtml(str){
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#039;");
  }
})();
