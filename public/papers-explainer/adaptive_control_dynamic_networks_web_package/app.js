async function loadPage(){
  const main = document.getElementById('main');
  try{
    const res = await fetch('../structured/page.json');
    const page = await res.json();

    document.getElementById('page-title').textContent = page.sections?.[0]?.heading || page.seo_title || '页面';
    document.getElementById('page-subtitle').textContent = (page.sections?.[0]?.body_markdown || '').split('\n')[0] || '';

    // sections
    for(const s of page.sections){
      const sec = document.createElement('section');
      sec.className = 'section';
      const h = document.createElement('h2');
      h.textContent = s.heading;
      sec.appendChild(h);

      const body = document.createElement('div');
      body.innerHTML = markdownToHtml(s.body_markdown || '');
      sec.appendChild(body);

      if(s.citations && s.citations.length){
        const c = document.createElement('div');
        c.className='citations';
        c.textContent = '证据锚点：' + s.citations.join('；');
        sec.appendChild(c);
      }
      main.appendChild(sec);
    }

    // visuals
    const visSec = document.createElement('section');
    visSec.className='section';
    visSec.innerHTML = '<h2>可用视觉资产（重绘）</h2>';
    const grid = document.createElement('div');
    grid.className='asset-grid';
    for(const a of page.visual_assets || []){
      const card = document.createElement('div');
      card.className='card';
      card.innerHTML = `
        <h3>${a.title}</h3>
        <p class="citations">类型：${a.type}<br/>来源：${a.source_ref}</p>
        <img src="../${a.files.png}" alt="${escapeHtml(a.alt_text)}"/>
      `;
      grid.appendChild(card);
    }
    visSec.appendChild(grid);
    main.appendChild(visSec);

    // interactive
    const imSec = document.createElement('section');
    imSec.className='section';
    imSec.innerHTML = '<h2>交互模块（schema 预览）</h2>';
    for(const m of page.interactive_modules || []){
      const card = document.createElement('div');
      card.className='card';
      card.innerHTML = `<h3>${m.title}</h3>
        <p>${m.purpose}</p>
        <p class="citations">来源：${m.source_ref}</p>
        <p class="citations">Schema 文件：<code>${m.schema_file}</code></p>`;
      imSec.appendChild(card);
    }
    main.appendChild(imSec);

    document.getElementById('disclaimer').textContent = page.disclaimer || '';

  }catch(err){
    main.innerHTML = '<p>无法加载 structured/page.json。建议在项目根目录执行：<code>python3 -m http.server 8000</code>，然后访问 <code>http://localhost:8000/dev/</code>。</p><pre>' + String(err) + '</pre>';
  }
}

// very small markdown-to-html: supports headings, bold, paragraphs, line breaks
function markdownToHtml(md){
  if(!md) return '';
  let html = escapeHtml(md);
  // headings
  html = html.replace(/^###\s(.+)$/gm,'<h4>$1</h4>');
  html = html.replace(/^##\s(.+)$/gm,'<h3>$1</h3>');
  html = html.replace(/^#\s(.+)$/gm,'<h2>$1</h2>');
  // bold
  html = html.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  // blockquote
  html = html.replace(/^>\s(.+)$/gm,'<blockquote>$1</blockquote>');
  // line breaks
  html = html.replace(/\n\n/g,'</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/\n/g,'<br/>');
  return html;
}

function escapeHtml(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

loadPage();
