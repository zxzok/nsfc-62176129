/* Lightweight renderer (no external dependencies). */
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

/** Minimal markdown-ish renderer: paragraphs + numbered lines + bullets. */
function renderMarkdown(md){
  const lines = String(md || '').split('\n');
  let html = '';
  let inList = false;

  const flushList = () => { if(inList){ html += '</ul>'; inList = false; } };

  for(const raw of lines){
    const line = raw.trimEnd();
    if(!line.trim()){
      flushList();
      continue;
    }
    if(line.startsWith('- ')){
      if(!inList){ html += '<ul>'; inList = true; }
      html += `<li>${escapeHtml(line.slice(2))}</li>`;
      continue;
    }
    flushList();
    // Preserve "Q：" "A：" as strong
    let safe = escapeHtml(line);
    safe = safe.replace(/^Q：/,'<strong>Q：</strong>');
    safe = safe.replace(/^A：/,'<strong>A：</strong>');
    html += `<p>${safe}</p>`;
  }
  flushList();
  return html;
}

function setMeta(site){
  document.title = site.seo?.seo_title || site.title || '科研网页包';
  const desc = site.seo?.seo_description || '';
  const kw = (site.seo?.keywords || []).join(',');
  $('meta[name="description"]').setAttribute('content', desc);
  $('meta[name="keywords"]').setAttribute('content', kw);
  $('meta[property="og:title"]').setAttribute('content', document.title);
  $('meta[property="og:description"]').setAttribute('content', desc);
}

function buildTOC(site){
  const toc = $('#toc');
  toc.innerHTML = '';
  for(const item of site.nav || []){
    const a = document.createElement('a');
    a.href = `#sec-${item.id}`;
    a.textContent = item.label;
    toc.appendChild(a);
  }
}

function renderHero(site){
  $('#page-title').textContent = site.title;
  $('#page-subtitle').textContent = site.subtitle;
  const meta = $('#page-meta');
  meta.innerHTML = '';
  const chips = [
    `slug: ${site.slug}`,
    `语言: ${site.language || 'zh-CN'}`,
    `关键词: ${(site.seo?.keywords || []).slice(0,6).join('、')}${(site.seo?.keywords || []).length>6?'…':''}`
  ];
  for(const c of chips){
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = c;
    meta.appendChild(span);
  }
  $('#disclaimer-text').textContent = site.disclaimer || '';
}

function renderGallery(site){
  const root = $('#gallery');
  root.innerHTML = '';
  for(const va of site.visual_assets || []){
    const fig = document.createElement('figure');
    fig.className = 'figure';
    const img = document.createElement('img');
    img.src = va.file;
    img.alt = va.alt_text || va.title || '';
    img.loading = 'lazy';
    const cap = document.createElement('figcaption');
    cap.className = 'cap';
    cap.innerHTML = `
      <div class="title">${escapeHtml(va.title)}</div>
      <div class="src">${escapeHtml(va.type)} · ${escapeHtml(va.source_ref)}</div>
    `;
    fig.appendChild(img);
    fig.appendChild(cap);
    root.appendChild(fig);
  }
}

async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function renderSections(site){
  const root = $('#sections-root');
  root.innerHTML = '';
  for(const sec of site.sections || []){
    const wrap = document.createElement('section');
    wrap.className = 'section';
    wrap.id = `sec-${sec.id}`;
    wrap.innerHTML = `
      <h3>${escapeHtml(sec.heading)}</h3>
      ${renderMarkdown(sec.body_markdown)}
    `;
    if(sec.citations?.length){
      const details = document.createElement('details');
      details.className = 'citations';
      details.innerHTML = `<summary>展开证据锚点</summary><ul>${sec.citations.map(c=>`<li>${escapeHtml(c)}</li>`).join('')}</ul>`;
      wrap.appendChild(details);
    }
    root.appendChild(wrap);
  }
}

/* ============== Modules ============== */

async function moduleMapSwitcher(site, host){
  const data = await loadJSON('./data/interactive/cross_species_maps.json');
  const maps = data.maps || [];
  const moduleEl = document.createElement('div');
  moduleEl.className = 'module';
  moduleEl.innerHTML = `
    <h3>跨物种脑图切换器</h3>
    <p class="desc">切换“物种”和“对比类型”，查看对应脑图与被强调的脑区列表。</p>
    <div class="controls">
      <label>物种：
        <select id="ms-species">
          <option value="rat">动物（rat）</option>
          <option value="human">人群（human）</option>
        </select>
      </label>
      <label>对比：
        <select id="ms-stage">
          <option value="baseline_difference">基线差异</option>
          <option value="intervention_effect">干预效应</option>
        </select>
      </label>
    </div>
    <div class="canvas-wrap">
      <img id="ms-img" alt="" style="width:100%;height:auto;border-radius:12px;background:#fff;border:1px solid #e5e7eb" />
    </div>
    <div class="notice" id="ms-note"></div>
    <details class="citations"><summary>来源</summary><ul><li>${escapeHtml(site.interactive_modules.find(m=>m.id==='im_map_switcher')?.source_ref || '')}</li></ul></details>
  `;
  host.appendChild(moduleEl);

  const speciesSel = $('#ms-species', moduleEl);
  const stageSel = $('#ms-stage', moduleEl);
  const img = $('#ms-img', moduleEl);
  const note = $('#ms-note', moduleEl);

  function pick(){
    const species = speciesSel.value;
    const stage = stageSel.value;
    const candidates = maps.filter(m => m.species === species && m.stage === stage);
    const chosen = candidates[0] || maps.find(m=>m.species===species) || maps[0];
    if(!chosen) return;
    img.src = chosen.asset_ref;
    img.alt = chosen.title + '（论文图裁切用于展示）';
    const regions = (chosen.regions || []).map(r=>{
      const arrow = r.direction === 'increase' ? '↑' : '↓';
      return `${r.region_name}${arrow}`;
    }).join('、') || '（论文图示未标注更多细节）';
    note.innerHTML = `<strong>${escapeHtml(chosen.title)}</strong><br/>脑区方向：${escapeHtml(regions)}<br/><span class="muted">${escapeHtml(chosen.sample_size_note || '')} · ${escapeHtml(chosen.source_ref || '')}</span>`;
  }
  speciesSel.addEventListener('change', pick);
  stageSel.addEventListener('change', pick);
  pick();
}

async function moduleRTMSProtocol(site, host){
  const data = await loadJSON('./data/interactive/rtms_protocols.json');
  const protocols = data.protocols || [];
  const moduleEl = document.createElement('div');
  moduleEl.className = 'module';
  moduleEl.innerHTML = `
    <h3>rTMS疗程拆解器（动物 vs 临床）</h3>
    <p class="desc">把关键参数拆成卡片，并用滑杆模拟“第几天”。（参数来自论文方法学）</p>
    <div class="controls">
      <label>对象：
        <select id="rp-species">
          <option value="rat">动物（rat）</option>
          <option value="human">临床（human）</option>
        </select>
      </label>
      <label>第几天：
        <input id="rp-day" type="range" min="1" max="14" value="1" />
      </label>
      <span class="chip" id="rp-day-label"></span>
    </div>
    <div id="rp-cards"></div>
    <div class="notice" id="rp-note"></div>
    <details class="citations"><summary>来源</summary><ul><li>${escapeHtml(site.interactive_modules.find(m=>m.id==='im_rtms_protocol')?.source_ref || '')}</li></ul></details>
  `;
  host.appendChild(moduleEl);

  const speciesSel = $('#rp-species', moduleEl);
  const dayRange = $('#rp-day', moduleEl);
  const dayLabel = $('#rp-day-label', moduleEl);
  const cards = $('#rp-cards', moduleEl);
  const note = $('#rp-note', moduleEl);

  function render(){
    const sp = speciesSel.value;
    const p = protocols.find(x=>x.species===sp) || protocols[0];
    if(!p) return;
    const maxDay = p.total_days || 1;
    dayRange.max = String(maxDay);
    if(Number(dayRange.value) > maxDay) dayRange.value = String(maxDay);
    dayLabel.textContent = `${dayRange.value} / ${maxDay} 天`;

    const doneSessions = (Number(dayRange.value) - 1) * (p.sessions_per_day || 0);
    const todaySessions = p.sessions_per_day || 0;
    const total = p.total_sessions || (p.total_days * p.sessions_per_day);

    cards.innerHTML = `
      <div class="gallery" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
        ${[
          ['靶点', p.target_region],
          ['频率', `${p.frequency_hz} Hz`],
          ['节奏', `${p.on_s}s on / ${p.off_s}s off`],
          ['脉冲', `${p.pulses_per_session} / 次`],
          ['单次时长', p.session_duration],
          ['疗程', `${p.sessions_per_day} 次/天 × ${p.total_days} 天（共${total}次）`]
        ].map(([k,v]) => `
          <div class="figure" style="padding:12px;">
            <div class="cap">
              <div class="title">${escapeHtml(k)}</div>
              <div class="src" style="color:var(--text);font-size:14px">${escapeHtml(v)}</div>
            </div>
          </div>`).join('')}
      </div>
    `;

    note.innerHTML = `
      <strong>第${dayRange.value}天提示</strong>：今天计划 ${todaySessions} 次治疗；到昨天为止已完成约 ${doneSessions} 次。<br/>
      <span class="muted">强度/设备备注：${escapeHtml(p.intensity_note || '')}；${escapeHtml(p.device_note || '')} · ${escapeHtml(p.source_ref || '')}</span>
      <div class="notice">风险提示：参数来自单项研究，不能据此自行调整或模仿治疗。（证据：第7页 限制段落）</div>
    `;
  }

  speciesSel.addEventListener('change', render);
  dayRange.addEventListener('input', render);
  render();
}

async function moduleCTQ(site, host){
  const data = await loadJSON('./data/interactive/ctq_metrics.json');
  const metrics = data.metrics || [];
  const moduleEl = document.createElement('div');
  moduleEl.className = 'module';
  moduleEl.innerHTML = `
    <h3>CTQ仪表盘：ELS分组差异一眼看懂</h3>
    <p class="desc">选择一个维度，查看HC与ELS组的均值±SD，并可显示P值。数据来自论文表1。</p>
    <div class="controls">
      <label>维度：
        <select id="ctq-metric"></select>
      </label>
      <button id="ctq-toggle-sd" aria-pressed="true">显示SD：开</button>
      <button id="ctq-toggle-p" aria-pressed="true">显示P值：开</button>
    </div>
    <div class="canvas-wrap">
      <canvas id="ctq-canvas" width="900" height="420" aria-label="CTQ柱状图" role="img"></canvas>
    </div>
    <div class="notice" id="ctq-note"></div>
    <details class="citations"><summary>来源</summary><ul><li>${escapeHtml(site.interactive_modules.find(m=>m.id==='im_ctq_dashboard')?.source_ref || '')}</li></ul></details>
  `;
  host.appendChild(moduleEl);

  const sel = $('#ctq-metric', moduleEl);
  const btnSD = $('#ctq-toggle-sd', moduleEl);
  const btnP = $('#ctq-toggle-p', moduleEl);
  const canvas = $('#ctq-canvas', moduleEl);
  const note = $('#ctq-note', moduleEl);
  const ctx = canvas.getContext('2d');

  metrics.forEach(m=>{
    const opt = document.createElement('option');
    opt.value = m.metric_id;
    opt.textContent = m.label;
    sel.appendChild(opt);
  });

  let showSD = true;
  let showP = true;

  function draw(){
    const m = metrics.find(x=>x.metric_id===sel.value) || metrics[0];
    if(!m) return;
    const hc = m.values.find(v=>v.group_id==='HC');
    const els = m.values.find(v=>v.group_id==='ELS');
    const maxVal = Math.max(hc.mean + (showSD?hc.sd:0), els.mean + (showSD?els.sd:0)) * 1.25;

    // clear
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // axes
    const left=80, right=canvas.width-40, top=40, bottom=canvas.height-80;
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.stroke();

    // ticks
    ctx.fillStyle = '#111827';
    ctx.font = '14px Arial';
    const ticks = 5;
    for(let i=0;i<=ticks;i++){
      const y = bottom - (bottom-top)*(i/ticks);
      const v = (maxVal*(i/ticks)).toFixed(1);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
      ctx.fillStyle = '#111827';
      ctx.fillText(v, 20, y+5);
    }

    const bars = [
      {label:'HC', mean:hc.mean, sd:hc.sd, x:left+120},
      {label:'ELS', mean:els.mean, sd:els.sd, x:left+360}
    ];
    const barW = 120;

    function yScale(val){
      return bottom - (bottom-top)*(val/maxVal);
    }

    bars.forEach(b=>{
      const y = yScale(b.mean);
      const h = bottom - y;
      // bar
      ctx.fillStyle = '#60a5fa'; // accessible blue-ish
      if(b.label==='ELS') ctx.fillStyle = '#34d399';
      ctx.fillRect(b.x, y, barW, h);

      // label
      ctx.fillStyle = '#111827';
      ctx.font='16px Arial';
      ctx.fillText(b.label, b.x + barW/2 - 14, bottom+30);

      // mean text
      ctx.font='14px Arial';
      ctx.fillText(`均值 ${b.mean.toFixed(2)}`, b.x, y-10);

      // sd whiskers
      if(showSD){
        const yTop = yScale(b.mean + b.sd);
        const yBot = yScale(Math.max(0,b.mean - b.sd));
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.x+barW/2, yTop);
        ctx.lineTo(b.x+barW/2, yBot);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(b.x+barW/2-16, yTop);
        ctx.lineTo(b.x+barW/2+16, yTop);
        ctx.moveTo(b.x+barW/2-16, yBot);
        ctx.lineTo(b.x+barW/2+16, yBot);
        ctx.stroke();
      }
    });

    // title
    ctx.fillStyle='#111827';
    ctx.font='18px Arial';
    ctx.fillText(`CTQ：${m.label}`, left, 26);

    note.innerHTML = `
      <strong>解读</strong>：这是两组平均分的差异，不代表个体经历的“对错”。<br/>
      <span class="muted">HC n=${(data.groups.find(g=>g.group_id==='HC')||{}).n}；ELS n=${(data.groups.find(g=>g.group_id==='ELS')||{}).n} · ${escapeHtml(m.source_ref||'')}</span>
      ${showP ? `<div class="notice">统计：t=${escapeHtml(String(m.test_stat))}，P=${escapeHtml(m.p_value)}（来自表1）</div>` : ''}
    `;
  }

  btnSD.addEventListener('click', ()=>{
    showSD = !showSD;
    btnSD.textContent = `显示SD：${showSD?'开':'关'}`;
    btnSD.setAttribute('aria-pressed', String(showSD));
    draw();
  });

  btnP.addEventListener('click', ()=>{
    showP = !showP;
    btnP.textContent = `显示P值：${showP?'开':'关'}`;
    btnP.setAttribute('aria-pressed', String(showP));
    draw();
  });

  sel.addEventListener('change', draw);
  if(metrics[0]) sel.value = metrics[0].metric_id;
  draw();
}

async function moduleEvidenceFilter(site, host){
  const data = await loadJSON('./data/interactive/claims_evidence_inference.json');
  const claims = data.claims || [];
  const copy = data.ui_copy || {};
  const moduleEl = document.createElement('div');
  moduleEl.className = 'module';
  moduleEl.innerHTML = `
    <h3>证据 vs 推测 过滤器</h3>
    <p class="desc">${escapeHtml(copy.intro || '')}</p>
    <div class="controls">
      <button data-filter="all">${escapeHtml(copy.toggle_all || '全部')}</button>
      <button data-filter="evidence">${escapeHtml(copy.toggle_evidence || '只看证据')}</button>
      <button data-filter="inference">${escapeHtml(copy.toggle_inference || '只看推测')}</button>
    </div>
    <div id="claims"></div>
    <details class="citations"><summary>来源</summary><ul><li>${escapeHtml(site.interactive_modules.find(m=>m.id==='im_evidence_filter')?.source_ref || '')}</li></ul></details>
  `;
  host.appendChild(moduleEl);

  const root = $('#claims', moduleEl);

  function render(filter){
    root.innerHTML = '';
    const items = claims.filter(c => filter==='all' ? true : c.type===filter);
    if(!items.length){
      root.innerHTML = '<p class="muted">没有匹配的条目。</p>';
      return;
    }
    items.forEach(c=>{
      const div = document.createElement('div');
      div.className = 'figure';
      div.style.padding='12px';
      const tag = c.type==='evidence' ? '证据' : '推测';
      div.innerHTML = `
        <div class="cap">
          <div class="title">[${escapeHtml(tag)}] ${escapeHtml(c.headline || '')}</div>
          <div class="src" style="color:var(--text);font-size:14px;margin-top:6px">${escapeHtml(c.text || '')}</div>
          <details class="citations" style="margin-top:10px">
            <summary>证据锚点</summary>
            <ul>${(c.support||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ul>
          </details>
        </div>
      `;
      root.appendChild(div);
    });
  }

  $$('.controls button', moduleEl).forEach(btn=>{
    btn.addEventListener('click', ()=>render(btn.dataset.filter));
  });
  render('all');
}

async function renderModules(site){
  const host = $('#modules-root');
  host.innerHTML = '';
  await moduleMapSwitcher(site, host);
  await moduleRTMSProtocol(site, host);
  await moduleCTQ(site, host);
  await moduleEvidenceFilter(site, host);
}

(async function main(){
  const site = await loadJSON('./data/site.json');
  setMeta(site);
  renderHero(site);
  buildTOC(site);
  renderGallery(site);
  await renderModules(site);
  renderSections(site);
})();
