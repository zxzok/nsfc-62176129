(function () {
  const data = window.PAGE_DATA;
  if (!data) {
    document.body.innerHTML = '<p style="padding:20px">PAGE_DATA 未加载。</p>';
    return;
  }

  const $ = (sel) => document.querySelector(sel);

  // Header
  $('#title').textContent = data.title.main;
  $('#subtitle').textContent = data.title.sub;
  $('#meta').textContent = [
    data.metadata.journal,
    data.metadata.status,
    String(data.metadata.year),
    'DOI: ' + data.metadata.doi
  ].join(' · ');

  // Sections
  const sectionsEl = $('#sections');
  data.sections.forEach(sec => {
    const wrap = document.createElement('section');
    wrap.className = 'card';
    const h2 = document.createElement('h2');
    h2.textContent = sec.heading;
    const p = document.createElement('div');
    // very small markdown-ish handling: keep line breaks
    p.innerHTML = (sec.body_markdown || '').replace(/\n/g, '<br>');
    const c = document.createElement('div');
    c.className = 'citations';
    c.textContent = '证据锚点：' + (sec.citations || []).join('；');
    wrap.appendChild(h2);
    wrap.appendChild(p);
    wrap.appendChild(c);
    sectionsEl.appendChild(wrap);
  });

  // Visual assets (only those with files)
  const visualsEl = $('#visuals');
  data.visual_assets.forEach(v => {
    const card = document.createElement('div');
    card.className = 'card';
    const h2 = document.createElement('h2');
    h2.textContent = v.title;
    card.appendChild(h2);

    const core = document.createElement('div');
    core.innerHTML = '<span class="badge">' + v.type + '</span> ' + (v.core_message || '');
    card.appendChild(core);

    if (v.files && v.files.length) {
      const webFile = v.files.find(f => f.role === 'web') || v.files[0];
      const fig = document.createElement('figure');
      const img = document.createElement('img');
      // path from web-preview/ to package root
      img.src = '../' + webFile.path;
      img.alt = v.alt_text || '';
      fig.appendChild(img);
      const cap = document.createElement('figcaption');
      cap.textContent = (v.source_ref ? ('图源：' + v.source_ref + '。') : '') + '（alt已写入）';
      fig.appendChild(cap);
      card.appendChild(fig);
    } else {
      const note = document.createElement('div');
      note.className = 'small';
      note.textContent = '此项为重绘/示意图：本包未提供成品图片，请根据制作说明设计。';
      card.appendChild(note);
    }

    const alt = document.createElement('div');
    alt.className = 'small';
    alt.textContent = 'Alt文本：' + (v.alt_text || '');
    card.appendChild(alt);

    const src = document.createElement('div');
    src.className = 'citations';
    src.textContent = '证据锚点：' + (v.source_ref || '');
    card.appendChild(src);

    visualsEl.appendChild(card);
  });

  // Modules
  const modulesEl = $('#modules');
  data.interactive_modules.forEach(m => {
    const card = document.createElement('div');
    card.className = 'card';
    const h2 = document.createElement('h2');
    h2.textContent = m.title;
    card.appendChild(h2);

    const p = document.createElement('div');
    p.textContent = m.purpose;
    card.appendChild(p);

    const controls = document.createElement('div');
    controls.className = 'small';
    controls.textContent = '交互控件：' + (m.ui_controls || []).map(c => c.control + '（' + c.label + '）').join('、');
    card.appendChild(controls);

    const schema = document.createElement('div');
    schema.className = 'small';
    schema.innerHTML = 'Schema：<code>' + m.schema_ref + '</code>';
    card.appendChild(schema);

    const risk = document.createElement('div');
    risk.className = 'small';
    risk.textContent = '风险提示：' + m.risk_note;
    card.appendChild(risk);

    const src = document.createElement('div');
    src.className = 'citations';
    src.textContent = '证据锚点：' + m.source_ref;
    card.appendChild(src);

    modulesEl.appendChild(card);
  });

  // Disclaimer
  $('#disclaimer').textContent = data.disclaimer;
})();
