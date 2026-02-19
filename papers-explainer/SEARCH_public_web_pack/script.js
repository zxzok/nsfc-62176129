// Basic, dependency-free renderer for the content pack.

async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return await res.json();
}

function el(tag, attrs={}, children=[]){
  const node = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k === 'class') node.className = v;
    else if(k === 'html') node.innerHTML = v;
    else if(k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for(const c of children){
    if(typeof c === 'string') node.appendChild(document.createTextNode(c));
    else if(c) node.appendChild(c);
  }
  return node;
}

function renderHero(appHeader, page){
  appHeader.innerHTML = '';
  appHeader.appendChild(el('h1', {}, [page.title]));
  appHeader.appendChild(el('p', {class:'subtitle'}, [page.subtitle]));
  const meta = el('div', {class:'meta'}, [
    el('span', {class:'badge'}, ['Data: Wave 1 (baseline)']),
    el('span', {class:'badge'}, ['Focus: grades 4–12']),
    el('span', {class:'badge'}, ['Plan: every 6 months × 5 years'])
  ]);
  appHeader.appendChild(meta);
  appHeader.appendChild(el('p', {class:'small'}, ['All key claims cite page/figure/table anchors from the paper.']));
}

function renderTOC(tocEl, sections){
  tocEl.innerHTML = '';
  tocEl.appendChild(el('h2', {}, ['目录']));
  const ul = el('ul');
  for(const s of sections){
    ul.appendChild(el('li', {}, [
      el('a', {href: `#${s.id}`}, [s.heading])
    ]));
  }
  tocEl.appendChild(ul);
}

function renderSections(mainEl, sections){
  mainEl.innerHTML = '';
  for(const s of sections){
    const sec = el('section', {id: s.id});
    sec.appendChild(el('h2', {}, [s.heading]));
    // body_markdown is already simple markdown-ish; render as paragraphs + line breaks.
    // For production, swap this out with a markdown parser if needed.
    const parts = s.body_markdown.split(/\n\n+/);
    for(const p of parts){
      const clean = p.trim();
      if(!clean) continue;
      // simple bold markdown **text**
      const html = clean
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br/>');
      sec.appendChild(el('p', {html}));
    }
    if(Array.isArray(s.citations) && s.citations.length){
      sec.appendChild(el('p', {class:'cite'}, [`证据锚点：${s.citations.join('；')}`]));
    }
    mainEl.appendChild(sec);
  }
}

function renderVisualGallery(mainEl, assets){
  const sec = el('section', {id:'visuals'});
  sec.appendChild(el('h2', {}, ['图文并茂：配图与示意（可直接用）']));
  sec.appendChild(el('p', {class:'small'}, ['图像文件位于 assets/ 目录；图注包含来源页码/图号/表号。']));
  const grid = el('div', {class:'grid'});
  for(const a of assets){
    const fig = el('figure');
    const img = el('img', {src: a.file, alt: a.alt_text, loading:'lazy'});
    fig.appendChild(img);
    fig.appendChild(el('figcaption', {}, [
      el('strong', {}, [a.title]),
      el('div', {class:'small'}, [`类型：${a.type}`]),
      el('div', {class:'small'}, [`来源：${a.source_ref}`])
    ]));
    grid.appendChild(fig);
  }
  sec.appendChild(grid);
  mainEl.appendChild(sec);
}

function renderGlossaryAndFAQ(mainEl, glossary, faq){
  const sec = el('section', {id:'glossary'});
  sec.appendChild(el('h2', {}, ['术语小词典与FAQ']));
  sec.appendChild(el('p', {class:'small'}, ['面向公众：每个术语用一句话解释，并给出类比；FAQ回答严格以论文证据为界。']));

  const gWrap = el('div', {class:'module'});
  gWrap.appendChild(el('h3', {}, ['术语小词典']));
  for(const item of glossary){
    const d = el('details');
    d.appendChild(el('summary', {}, [item.term]));
    d.appendChild(el('p', {}, [item.definition]));
    d.appendChild(el('p', {class:'small'}, [`类比：${item.analogy}`]));
    d.appendChild(el('p', {class:'cite'}, [`证据锚点：${item.source_ref}`]));
    gWrap.appendChild(d);
  }
  sec.appendChild(gWrap);

  const fWrap = el('div', {class:'module', style:'margin-top:14px'});
  fWrap.appendChild(el('h3', {}, ['FAQ']));
  for(const item of faq){
    const d = el('details');
    d.appendChild(el('summary', {}, [item.q]));
    d.appendChild(el('p', {}, [item.a]));
    d.appendChild(el('p', {class:'cite'}, [`证据锚点：${item.source_ref}`]));
    fWrap.appendChild(d);
  }
  sec.appendChild(fWrap);
  mainEl.appendChild(sec);
}

function renderFooter(footerEl, page){
  footerEl.innerHTML = '';
  footerEl.appendChild(el('div', {}, [page.disclaimer]));
  footerEl.appendChild(el('div', {class:'small', style:'margin-top:10px'}, [
    'Citation: ', page.citation
  ]));
}

// -------- Interactive modules --------

function renderModuleContainer(mainEl){
  const sec = el('section', {id:'interactive'});
  sec.appendChild(el('h2', {}, ['交互模块：让公众“玩明白”研究结论']));
  sec.appendChild(el('p', {class:'small'}, ['以下模块为可落地的最小实现（MVP），数据来自 data/ 目录；字段规范见 interactive/ 目录。']));
  mainEl.appendChild(sec);
  return sec;
}

function toCNGroup(g){
  if(g==='students') return '学生';
  if(g==='caregivers') return '照护者';
  if(g==='teachers') return '教师';
  return g;
}
function toCNDimension(d){
  const map = {location:'点位', education_level:'学段', sex:'性别', race:'族群'};
  return map[d] || d;
}

function dashboardModule(container, data){
  const mod = el('div', {class:'module', id:'mod-dashboard'});
  mod.appendChild(el('h3', {}, ['模块1｜首轮样本看板']));
  mod.appendChild(el('p', {}, ['选择参与者类别与统计维度，查看论文表1中的首轮样本构成。']));

  const controls = el('div', {class:'controls'});
  const tabGroups = ['students','caregivers','teachers'];
  let currentGroup = 'students';
  let currentDim = 'education_level';

  const tabButtons = tabGroups.map(g => {
    const b = el('button', {type:'button', 'aria-pressed': g===currentGroup ? 'true':'false'}, [toCNGroup(g)]);
    b.addEventListener('click', () => {
      currentGroup = g;
      tabButtons.forEach(btn => btn.setAttribute('aria-pressed','false'));
      b.setAttribute('aria-pressed','true');
      render();
    });
    return b;
  });
  tabButtons.forEach(b => controls.appendChild(b));

  const select = el('select', {'aria-label':'统计维度选择'});
  ['location','education_level','sex','race'].forEach(d => {
    select.appendChild(el('option', {value:d}, [toCNDimension(d)]));
  });
  select.value = currentDim;
  select.addEventListener('change', () => { currentDim = select.value; render(); });
  controls.appendChild(select);
  mod.appendChild(controls);

  const out = el('div');
  mod.appendChild(out);

  const risk = el('p', {class:'risk'}, ['风险提示：样本构成≠心理问题发生率；论文未报告各量表分数分布与患病率。']);
  mod.appendChild(risk);

  function render(){
    out.innerHTML = '';
    const rows = data.records.filter(r => r.respondent_group===currentGroup && r.dimension===currentDim);
    if(!rows.length){
      out.appendChild(el('p', {class:'small'}, ['该组合在论文表1中未报告，因此不展示。']));
      return;
    }
    const max = Math.max(...rows.map(r => r.count));
    const table = el('table', {class:'table'});
    table.appendChild(el('thead', {}, [
      el('tr', {}, [
        el('th', {}, ['分类']),
        el('th', {}, ['人数']),
        el('th', {class:'barcell'}, ['相对大小'])
      ])
    ]));
    const tbody = el('tbody');
    for(const r of rows){
      const pct = max ? (r.count / max) : 0;
      const bar = el('div', {class:'hbar', style:`width:${Math.round(pct*100)}%`});
      tbody.appendChild(el('tr', {}, [
        el('td', {}, [r.label]),
        el('td', {}, [r.count.toLocaleString('zh-CN')]),
        el('td', {}, [bar])
      ]));
    }
    table.appendChild(tbody);
    out.appendChild(table);
    out.appendChild(el('p', {class:'cite'}, [`数据来源：${rows[0].source_ref}`]));
  }

  render();
  container.appendChild(mod);
}

function completionModule(container, data){
  const mod = el('div', {class:'module', id:'mod-completion'});
  mod.appendChild(el('h3', {}, ['模块2｜完成率探险：语音/面部任务怎么“掉数据”？']));
  mod.appendChild(el('p', {}, ['点击不同任务，查看完成率与论文报告的掉落原因。']));

  const controls = el('div', {class:'controls'});
  const taskIds = data.tasks.map(t => t.task_id);
  let current = taskIds[0];

  const btns = taskIds.map(id => {
    const b = el('button', {type:'button', 'aria-pressed': id===current ? 'true':'false'}, [id]);
    b.addEventListener('click', () => {
      current = id;
      btns.forEach(x => x.setAttribute('aria-pressed','false'));
      b.setAttribute('aria-pressed','true');
      render();
    });
    return b;
  });
  btns.forEach(b => controls.appendChild(b));
  mod.appendChild(controls);

  const out = el('div');
  mod.appendChild(out);

  const risk = el('p', {class:'risk'}, ['风险提示：完成率反映的是数据收集过程，不代表学生心理状态好坏；论文未报告按学校/年级细分的完成率。']);
  mod.appendChild(risk);

  function render(){
    out.innerHTML = '';
    const t = data.tasks.find(x => x.task_id===current);
    if(!t){
      out.appendChild(el('p', {}, ['未找到该任务数据。']));
      return;
    }
    const pct = Math.round(t.completion_rate * 1000)/10;
    out.appendChild(el('p', {}, [`${t.task_label_cn}：完成 ${t.completed_records_n.toLocaleString('zh-CN')} 条记录（约 ${pct}%）`]));
    const prog = el('div', {class:'progress', role:'progressbar', 'aria-valuemin':'0', 'aria-valuemax':'100', 'aria-valuenow': String(pct), 'aria-label':'完成率进度条'});
    prog.appendChild(el('div', {class:'bar', style:`width:${pct}%`}));
    out.appendChild(prog);
    out.appendChild(el('p', {class:'small'}, [`论文报告总体掉落率范围：${t.dropout_rate_range_reported}`]));
    out.appendChild(el('p', {class:'small'}, [`掉落原因（论文明示）：${t.dropout_reasons_reported.join('；')}`]));
    out.appendChild(el('p', {class:'cite'}, [`数据来源：${t.source_ref}`]));
  }

  render();
  container.appendChild(mod);
}

function flowModule(container, data){
  const mod = el('div', {class:'module', id:'mod-flow'});
  mod.appendChild(el('h3', {}, ['模块3｜把流程点亮：两天内发生了什么？']));
  mod.appendChild(el('p', {}, ['点击流程步骤，查看“谁做、用什么设备、采集什么数据、为何这样设计”。']));

  const controls = el('div', {class:'controls'});
  const stepIds = data.steps.map(s => s.step_id);
  let current = stepIds[0];

  const select = el('select', {'aria-label':'流程步骤选择'});
  for(const s of data.steps){
    select.appendChild(el('option', {value:s.step_id}, [s.step_id]));
  }
  select.value = current;
  select.addEventListener('change', () => { current = select.value; render(); });
  controls.appendChild(select);
  mod.appendChild(controls);

  const out = el('div');
  mod.appendChild(out);

  const risk = el('p', {class:'risk'}, ['风险提示：流程展示用于理解研究设计；论文未报告个体诊断或转介/干预实施细节。']);
  mod.appendChild(risk);

  function render(){
    out.innerHTML = '';
    const s = data.steps.find(x => x.step_id===current);
    if(!s){ out.appendChild(el('p', {}, ['未找到该步骤。'])); return; }
    out.appendChild(el('p', {}, [`第${s.day}天｜角色：${s.actor}`]));
    out.appendChild(el('p', {class:'small'}, [`设备/入口：${s.device}`]));
    const ul = el('ul');
    for(const item of s.what_is_collected){
      ul.appendChild(el('li', {}, [item]));
    }
    out.appendChild(ul);
    if(s.trigger_rule){
      out.appendChild(el('p', {class:'small'}, [`触发规则：${s.trigger_rule}`]));
    }
    if(s.time_limit_seconds){
      out.appendChild(el('p', {class:'small'}, [`时限：每项任务 ${s.time_limit_seconds} 秒（论文描述）`]));
    }
    out.appendChild(el('p', {class:'cite'}, [`数据来源：${s.source_ref}`]));
  }

  render();
  container.appendChild(mod);
}

function followupModule(container, data){
  const mod = el('div', {class:'module', id:'mod-followup'});
  mod.appendChild(el('h3', {}, ['模块4｜随访时间线：为什么要每6个月一次？']));
  mod.appendChild(el('p', {}, ['拖动滑杆查看从基线到5年的重复测量节点（每6个月一次）。']));

  const wrap = el('div', {class:'range-wrap'});
  const slider = el('input', {type:'range', min:'0', max:'60', step:String(data.follow_up_interval_months), value:'0', 'aria-label':'随访时间（月）'});
  const label = el('span', {class:'small'}, ['0 个月（基线）']);
  wrap.appendChild(slider);
  wrap.appendChild(label);
  mod.appendChild(wrap);

  const out = el('div', {class:'small'});
  mod.appendChild(out);
  out.textContent = `规则：${data.cohort_rule}`;

  slider.addEventListener('input', () => {
    const m = Number(slider.value);
    label.textContent = `${m} 个月`;
  });

  mod.appendChild(el('p', {class:'cite'}, [`来源：${data.source_ref}`]));
  mod.appendChild(el('p', {class:'risk'}, ['风险提示：时间线是研究计划；论文未报告未来每一轮的具体日期与预计样本量。']));
  container.appendChild(mod);
}

async function renderInteractiveModules(sectionEl){
  const dash = await loadJSON('data/table1_counts.json');
  const completion = await loadJSON('data/task_completion.json');
  const flow = await loadJSON('data/flow_steps.json');
  const follow = await loadJSON('data/followup_plan.json');

  dashboardModule(sectionEl, dash);
  completionModule(sectionEl, completion);
  flowModule(sectionEl, flow);
  followupModule(sectionEl, follow);
}

async function main(){
  try{
    const page = await loadJSON('content/page.json');
    const glossary = await loadJSON('content/glossary.json');
    const faq = await loadJSON('content/faq.json');

    const header = document.querySelector('.hero');
    const toc = document.getElementById('toc');
    const mainEl = document.getElementById('main');
    const footer = document.getElementById('footer');

    renderHero(header, page);
    renderTOC(toc, page.sections);
    renderSections(mainEl, page.sections);
    renderVisualGallery(mainEl, page.visual_assets);

    const interactiveSection = renderModuleContainer(mainEl);
    await renderInteractiveModules(interactiveSection);

    renderGlossaryAndFAQ(mainEl, glossary, faq);
    renderFooter(footer, page);

    // Update document title for SEO
    document.title = page.seo?.seo_title || page.title;
  }catch(err){
    console.error(err);
    const header = document.querySelector('.hero');
    header.innerHTML = '';
    header.appendChild(el('h1', {}, ['内容加载失败']));
    header.appendChild(el('p', {class:'subtitle'}, ['请确认目录结构是否完整，并使用本地服务器预览。']));
    header.appendChild(el('pre', {class:'small'}, [String(err)]));
  }
}

main();
