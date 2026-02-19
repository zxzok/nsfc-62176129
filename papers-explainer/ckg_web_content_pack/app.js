(function(){
  const pack = window.CKG_PACK;
  if(!pack){ document.body.innerHTML = '<p style="padding:20px">数据加载失败：CKG_PACK不存在</p>'; return; }

  // Hero
  document.getElementById('hero-title').textContent = pack.hero.title;
  document.getElementById('hero-subtitle').textContent = pack.hero.subtitle;
  const heroImg = document.getElementById('hero-image');
  heroImg.src = '../' + pack.hero.cover_image.file; // relative from site/
  heroImg.alt = pack.hero.cover_image.alt_text || '';
  document.getElementById('hero-caption').textContent = pack.hero.cover_image.caption;

  // TOC + sections
  const toc = document.getElementById('toc');
  const content = document.getElementById('content');

  const tocFrag = document.createDocumentFragment();
  pack.sections.forEach(sec=>{
    const a = document.createElement('a');
    a.href = '#' + sec.id;
    a.textContent = sec.heading;
    tocFrag.appendChild(a);
  });
  toc.appendChild(tocFrag);

  pack.sections.forEach(sec=>{
    const section = document.createElement('section');
    section.className = 'section';
    section.id = sec.id;

    const h2 = document.createElement('h2');
    h2.textContent = sec.heading;

    const body = document.createElement('div');
    body.className = 'body';
    body.innerHTML = renderMarkdownLike(sec.body_markdown);

    section.appendChild(h2);
    section.appendChild(body);

    if(sec.citations && sec.citations.length){
      const citeBox = document.createElement('div');
      citeBox.className = 'citations';
      citeBox.innerHTML = '<strong>证据锚点：</strong>' + sec.citations.map(c=>{
        const p = c.page ? ('第' + c.page + '页') : '';
        const f = c.figure ? ('，' + c.figure) : '';
        const s = c.section ? ('，' + c.section) : '';
        return escapeHtml(c.label) + '（' + [p,f,s].filter(Boolean).join('') + '）';
      }).join('；');
      section.appendChild(citeBox);
    }

    content.appendChild(section);
  });

  // Visual assets
  const assetsGrid = document.getElementById('assets-grid');
  pack.visual_assets.forEach(va=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${escapeHtml(va.title)}</h3>
      <div class="small"><span class="badge">${escapeHtml(va.type)}</span> <span class="badge">${escapeHtml(va.source_ref)}</span></div>
      <p class="small"><strong>核心信息：</strong>${escapeHtml(va.core_message)}</p>
      ${va.file && va.file.includes('site/assets') ? `<img src="../${va.file}" alt="${escapeHtml(va.alt_text)}" style="width:100%;height:auto;border:1px solid #eee;border-radius:8px;margin-top:8px;" />` : ''}
      ${va.file && va.file.endsWith('.svg') ? `<p class="small">文件：<code>${escapeHtml(va.file)}</code></p>`: ''}
    `;
    assetsGrid.appendChild(card);
  });

  // Modules
  const modulesGrid = document.getElementById('modules-grid');
  pack.interactive_modules.forEach(m=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${escapeHtml(m.title)}</h3>
      <p class="small"><strong>目的：</strong>${escapeHtml(m.purpose)}</p>
      <p class="small"><strong>数据结构：</strong><code>${escapeHtml(m.schema_file)}</code></p>
      <p class="small"><strong>示例数据：</strong><code>${escapeHtml(m.example_data_file)}</code></p>
      <p class="small"><strong>风险提示：</strong>${escapeHtml(m.risk_note)}</p>
    `;
    modulesGrid.appendChild(card);
  });

  // Glossary
  const gl = document.getElementById('glossary-list');
  pack.glossary.forEach(item=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${escapeHtml(item.term)}</h3>
      <p class="small"><strong>解释：</strong>${escapeHtml(item.explanation)}</p>
      <p class="small"><strong>类比：</strong>${escapeHtml(item.analogy)}</p>
      <p class="small"><strong>来源：</strong>${escapeHtml(item.source_ref)}</p>
    `;
    gl.appendChild(div);
  });

  // FAQ
  const faqList = document.getElementById('faq-list');
  pack.faq.forEach((item, idx)=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>Q${idx+1}. ${escapeHtml(item.q)}</h3>
      <div class="small">${renderMarkdownLike(item.a_markdown)}</div>
      <p class="small"><strong>来源：</strong>${escapeHtml(item.source_ref)}</p>
    `;
    faqList.appendChild(div);
  });

  document.getElementById('disclaimer-text').textContent = pack.disclaimer.text;

  function renderMarkdownLike(md){
    if(!md) return '';
    // extremely small subset: paragraphs + headings + bold
    const esc = escapeHtml(md);
    // headings ### -> h3
    let html = esc
      .replace(/^###\s(.+)$/gm, '<h3>$1</h3>')
      .replace(/^##\s(.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    html = '<p>' + html + '</p>';
    html = html.replace('<p></p>', '');
    return html;
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }
})();