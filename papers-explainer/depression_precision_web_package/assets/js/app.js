(function(){
  'use strict';

  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function inlineFormat(s){
    // bold **text**
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // inline code `code`
    s = s.replace(/`([^`]+?)`/g, '<code>$1</code>');
    return s;
  }

  function mdToHtml(md){
    const lines = String(md || '').split('\n');
    let html = '';
    let inList = false;
    let inBlockquote = false;

    function closeList(){
      if(inList){ html += '</ul>'; inList=false; }
    }
    function closeBlockquote(){
      if(inBlockquote){ html += '</blockquote>'; inBlockquote=false; }
    }

    for(const rawLine of lines){
      const line = rawLine.trimEnd();

      if(line.trim() === ''){
        closeList();
        closeBlockquote();
        continue;
      }

      // Headings
      if(/^###\s+/.test(line)){
        closeList(); closeBlockquote();
        const text = inlineFormat(escapeHtml(line.replace(/^###\s+/,'')));
        html += `<h3>${text}</h3>`;
        continue;
      }
      if(/^##\s+/.test(line)){
        closeList(); closeBlockquote();
        const text = inlineFormat(escapeHtml(line.replace(/^##\s+/,'')));
        html += `<h2>${text}</h2>`;
        continue;
      }
      if(/^#\s+/.test(line)){
        closeList(); closeBlockquote();
        const text = inlineFormat(escapeHtml(line.replace(/^#\s+/,'')));
        html += `<h1>${text}</h1>`;
        continue;
      }

      // Blockquote
      if(/^\>\s+/.test(line)){
        closeList();
        if(!inBlockquote){
          html += '<blockquote>';
          inBlockquote = true;
        }
        const text = inlineFormat(escapeHtml(line.replace(/^\>\s+/,'')));
        html += `<p>${text}</p>`;
        continue;
      } else {
        closeBlockquote();
      }

      // Unordered list
      if(/^\-\s+/.test(line)){
        if(!inList){ html += '<ul>'; inList=true; }
        const text = inlineFormat(escapeHtml(line.replace(/^\-\s+/,'')));
        html += `<li>${text}</li>`;
        continue;
      }

      // Paragraph
      closeList();
      const text = inlineFormat(escapeHtml(line));
      html += `<p>${text}</p>`;
    }

    // Cleanup
    if(inList) html += '</ul>';
    if(inBlockquote) html += '</blockquote>';
    return html;
  }

  function getContent(){
    const el = document.getElementById('content-data');
    if(!el) throw new Error('Missing embedded content json');
    return JSON.parse(el.textContent);
  }

  function renderHero(content){
    $('#page-title').textContent = content.page.title;
    $('#page-subtitle').textContent = content.page.subtitle;

    const hero = content.page.hero_30sec;
    const heroCards = [
      {label:'一句话问题', text: hero.problem},
      {label:'一句话方法', text: hero.method},
      {label:'一句话发现', text: hero.finding},
      {label:'一句话意义', text: hero.meaning},
    ];
    const heroGrid = $('#hero-30sec');
    heroGrid.innerHTML = heroCards.map(c => `
      <div class="hero-card">
        <div class="label">${escapeHtml(c.label)}</div>
        <div class="text">${escapeHtml(c.text)}</div>
      </div>
    `).join('');

    const pm = content.paper;
    const meta = $('#paper-meta');
    meta.innerHTML = `
      <div class="meta-row">
        <span class="badge">期刊：${escapeHtml(pm.journal)}</span>
        <span class="badge">年份：${escapeHtml(pm.year)}</span>
        <span class="badge">DOI：${escapeHtml(pm.doi)}</span>
        <span class="badge">许可：${escapeHtml(pm.open_access_license)}</span>
      </div>
      <div class="meta-row" style="margin-top:8px;">
        <span class="badge">证据位置：${escapeHtml(pm.evidence)}</span>
      </div>
      <div style="margin-top:8px;color:var(--muted);">
        30秒读懂证据：${escapeHtml(hero.citations.join('；'))}
      </div>
    `;
  }

  function renderTOC(content){
    const items = [
      ...content.page.sections.map(s => ({id:s.id, label:s.heading})),
      {id:'visuals', label:'图文并茂'},
      {id:'interactive', label:'交互模块'},
      {id:'faq', label:'FAQ'},
      {id:'disclaimer', label:'免责声明'},
    ];
    const toc = $('#toc');
    toc.innerHTML = items.map(it => `<a href="#${escapeHtml(it.id)}">${escapeHtml(it.label)}</a>`).join('');
  }

  function renderSections(content){
    const container = $('#section-content');
    container.innerHTML = content.page.sections.map(s => `
      <article class="section" id="${escapeHtml(s.id)}">
        <h2>${escapeHtml(s.heading)}</h2>
        <div class="prose">${mdToHtml(s.body_markdown)}</div>
        <div class="evidence">${escapeHtml(s.citations.join('；'))}</div>
      </article>
    `).join('');
  }

  function renderVisuals(content){
    const grid = $('#visual-grid');
    grid.innerHTML = content.page.visual_assets.map(v => `
      <figure class="visual" id="${escapeHtml(v.id)}">
        <img src="${escapeHtml(v.file)}" alt="${escapeHtml(v.alt_text)}" loading="lazy"/>
        <figcaption class="visual-body">
          <div class="visual-title">${escapeHtml(v.title)}</div>
          <div class="visual-meta">类型：${escapeHtml(v.type)} · 来源：${escapeHtml(v.source_ref)}</div>
          <div class="visual-core"><strong>核心信息：</strong>${escapeHtml(v.core_message)}</div>
          <div class="visual-alt"><strong>无障碍alt：</strong>${escapeHtml(v.alt_text)}</div>
        </figcaption>
      </figure>
    `).join('');
  }

  function moduleById(content, id){
    return content.page.interactive_modules.find(m => m.id === id);
  }

  function setActiveChips(groupSelector, activeValue, attrName){
    const chips = $all(groupSelector);
    chips.forEach(btn => {
      const v = btn.getAttribute(attrName);
      btn.classList.toggle('active', v === activeValue);
    });
  }

  function renderModuleSubtype(content){
    const m = moduleById(content,'im-01-subtype-toggle');
    if(!m) return;
    $('#evidence-im-01').textContent = m.source_ref;
    $('#risk-im-01').textContent = m.default_copy.risk_tip;

    let current = 'archetypal';

    function cardForDirection(dir){
      if(dir === 'increase') return '↑（更高）';
      if(dir === 'decrease') return '↓（更低）';
      return '—';
    }

    function render(){
      setActiveChips('#module-subtype .chip', current, 'data-subtype');
      const d = m.data.find(x => x.subtype_id === current);
      if(!d) return;
      const frontal = d.groups.find(g => g.group_id==='frontal');
      const posterior = d.groups.find(g => g.group_id==='posterior');
      const html = `
        <div class="kv">
          <div class="k">你选的亚型</div><div class="v"><strong>${escapeHtml(d.subtype_name_zh)}</strong>（相对健康对照）</div>

          <div class="k">前部区域（Frontal）</div>
          <div class="v">${cardForDirection(frontal?.alff_direction)}；例：${escapeHtml((frontal?.examples||[]).join('、'))}</div>

          <div class="k">后部区域（Posterior）</div>
          <div class="v">${cardForDirection(posterior?.alff_direction)}；例：${escapeHtml((posterior?.examples||[]).join('、'))}</div>

          <div class="k">证据锚点</div><div class="v">${escapeHtml(d.evidence)}</div>
        </div>
      `;
      $('#panel-subtype').innerHTML = html;
    }

    $all('#module-subtype .chip').forEach(btn => {
      btn.addEventListener('click', () => {
        current = btn.getAttribute('data-subtype');
        render();
      });
    });

    render();
  }

  function renderModuleTarget(content){
    const m = moduleById(content,'im-02-target-compare');
    if(!m) return;
    $('#evidence-im-02').textContent = m.source_ref;
    $('#risk-im-02').textContent = m.default_copy.risk_tip;

    let current = 'archetypal';

    function render(){
      setActiveChips('#module-target .chip', current, 'data-target-subtype');
      const d = m.data.find(x => x.subtype_id === current);
      if(!d) return;
      const label = current === 'archetypal' ? '原型' : '非典型';
      const html = `
        <div class="kv">
          <div class="k">亚型</div><div class="v"><strong>${label}</strong></div>
          <div class="k">刺激靶点</div><div class="v"><strong>${escapeHtml(d.target)}</strong></div>
          <div class="k">频率</div><div class="v">${escapeHtml(d.frequency_hz)} Hz</div>
          <div class="k">每次脉冲数</div><div class="v">${escapeHtml(d.pulses_per_session)} pulses</div>
          <div class="k">总次数/疗程</div><div class="v">${escapeHtml(d.sessions_total)} 次（两周，论文方案）</div>
          <div class="k">强度</div><div class="v">${escapeHtml(d.motor_threshold_percent)}% RMT</div>
          <div class="k">为什么选这里</div><div class="v">${escapeHtml(d.rationale)}</div>
          <div class="k">证据锚点</div><div class="v">${escapeHtml(d.evidence)}</div>
        </div>
      `;
      $('#panel-target').innerHTML = html;
    }

    $all('#module-target .chip').forEach(btn => {
      btn.addEventListener('click', () => {
        current = btn.getAttribute('data-target-subtype');
        render();
      });
    });

    render();
  }

  function fmtPercent(v){
    if(v === null || typeof v === 'undefined') return '—';
    const n = Number(v);
    if(Number.isNaN(n)) return '—';
    return n.toFixed(2) + '%';
  }

  function renderModuleTimeline(content){
    const m = moduleById(content,'im-03-timeline');
    if(!m) return;
    $('#evidence-im-03').textContent = m.source_ref;
    $('#risk-im-03').textContent = m.default_copy.risk_tip;

    let subtype = 'archetypal';
    let idx = 0; // 0=T0,1=T1,2=T2

    function render(){
      setActiveChips('#module-timeline .chip', subtype, 'data-time-subtype');

      const d = m.data.find(x => x.subtype_id === subtype);
      if(!d) return;
      const tp = d.timepoints[idx];

      const label = subtype === 'archetypal' ? '原型' : '非典型';
      const html = `
        <div class="kv">
          <div class="k">亚型</div><div class="v"><strong>${label}</strong></div>
          <div class="k">时间点</div><div class="v"><strong>${escapeHtml(tp.label)}</strong></div>

          <div class="k">总体响应率</div><div class="v">${fmtPercent(tp.overall_response_percent)}</div>
          <div class="k">总体缓解率</div><div class="v">${fmtPercent(tp.overall_remission_percent)}</div>

          <div class="k">自杀意念响应率*</div><div class="v">${fmtPercent(tp.suicidality_response_percent)}</div>
          <div class="k">自杀意念缓解率*</div><div class="v">${fmtPercent(tp.suicidality_remission_percent)}</div>

          <div class="k">影像提示</div><div class="v">${escapeHtml(tp.imaging_note)}</div>

          <div class="k">样本完成情况</div>
          <div class="v">分到该亚型：${d.participants.n_assigned}人；完成第1周：${d.participants.n_completed_week1}人；完成两周：${d.participants.n_completed_week2}人（脱落原因：${escapeHtml(d.participants.dropout_reason)}）。</div>

          <div class="k">基线量表（均值±SD）</div>
          <div class="v">HAMD‑17：${d.baseline.hamd17_mean}±${d.baseline.hamd17_sd}；HAMA：${d.baseline.hama_mean}±${d.baseline.hama_sd}</div>

          <div class="k">证据锚点</div><div class="v">${escapeHtml(d.evidence)}</div>
        </div>
        <p style="margin-top:10px;color:var(--muted);font-size:12px;">
          *自杀意念百分比仅针对基线Item‑3 &gt; 0 的人群；具体定义见论文方法。（证据：第3页 2.7；第5页 3.4）
        </p>
      `;
      $('#panel-timeline').innerHTML = html;

      // Sync slider aria text
      const slider = $('#time-slider');
      slider.setAttribute('aria-valuetext', tp.id);
    }

    $all('#module-timeline .chip').forEach(btn => {
      btn.addEventListener('click', () => {
        subtype = btn.getAttribute('data-time-subtype');
        render();
      });
    });

    $('#time-slider').addEventListener('input', (e) => {
      idx = Number(e.target.value);
      render();
    });

    render();
  }

  function renderGlossarySearch(content){
    const m = moduleById(content,'im-04-glossary-search');
    if(!m) return;
    $('#evidence-im-04').textContent = m.source_ref;
    $('#risk-im-04').textContent = m.default_copy.risk_tip;

    const allTerms = content.page.glossary || [];

    function renderList(filter){
      const q = (filter||'').trim().toLowerCase();
      const list = allTerms.filter(t => {
        if(!q) return true;
        return (t.term||'').toLowerCase().includes(q) ||
               (t.explain||'').toLowerCase().includes(q) ||
               (t.analogy||'').toLowerCase().includes(q);
      });

      const html = list.map(t => `
        <div class="card" style="margin:10px 0;">
          <div class="card-title">${escapeHtml(t.term)}</div>
          <div class="card-body"><strong>一句话解释：</strong>${escapeHtml(t.explain)}</div>
          <div class="card-body" style="margin-top:8px;"><strong>类比：</strong>${escapeHtml(t.analogy)}</div>
          <div class="card-evidence">证据：${escapeHtml(t.source_ref || '论文未标注')}</div>
        </div>
      `).join('') || `<p style="color:var(--muted);">没有匹配结果。换个关键词试试。</p>`;

      $('#panel-glossary').innerHTML = html;
    }

    const input = $('#glossary-search');
    input.addEventListener('input', () => renderList(input.value));
    renderList('');
  }

  function renderFAQ(content){
    const faq = content.page.faq || [];
    const root = $('#faq-accordion');

    root.innerHTML = faq.map((item, idx) => {
      const id = `faq-${idx}`;
      return `
        <div class="item">
          <button type="button" aria-expanded="false" aria-controls="${id}">
            ${escapeHtml(item.q)}
          </button>
          <div class="panel" id="${id}" hidden>
            <div class="prose">${mdToHtml(item.a)}</div>
            <div class="qa-meta">证据：${escapeHtml(item.source_ref || '论文未提供')}</div>
          </div>
        </div>
      `;
    }).join('');

    $all('.accordion .item button', root).forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const panelId = btn.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if(panel) panel.hidden = expanded;
      });
    });
  }

  function renderDisclaimer(content){
    $('#disclaimer-text').textContent = content.page.disclaimer;
  }

  function setupDownload(content){
    const btn = $('#btn-download-json');
    btn.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(content, null, 2)], {type:'application/json;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'content.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  function init(){
    const content = getContent();
    renderHero(content);
    renderTOC(content);
    renderSections(content);
    renderVisuals(content);
    renderModuleSubtype(content);
    renderModuleTarget(content);
    renderModuleTimeline(content);
    renderGlossarySearch(content);
    renderFAQ(content);
    renderDisclaimer(content);
    setupDownload(content);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
