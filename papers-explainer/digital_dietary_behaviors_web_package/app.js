/* Demo renderer + minimal interactive modules */
async function loadJSON(path) {
  const res = await fetch(path, {cache: 'no-store'});
  if (!res.ok) throw new Error('Failed to load ' + path);
  return res.json();
}

function el(tag, attrs={}, ...children) {
  const node = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) {
    if (c === null || c === undefined) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

function renderSections(data) {
  const sectionsWrap = document.getElementById('sections');
  sectionsWrap.innerHTML = '';
  const toc = document.getElementById('toc');
  toc.className = 'toc';
  toc.innerHTML = '';

  for (const s of data.sections) {
    const id = s.id;
    toc.appendChild(el('a', {href: '#' + id}, s.heading));

    const sec = el('section', {id, class: 'card', 'aria-labelledby': id + '-h'});
    sec.appendChild(el('h2', {id: id + '-h'}, s.heading));
    const body = el('div', {class: 'section-body'});
    for (const para of String(s.body_markdown || '').split(/\n\n+/)) {
      body.appendChild(el('p', {}, para));
    }
    sec.appendChild(body);
    if (s.citations && s.citations.length) {
      sec.appendChild(el('div', {class:'citations'}, '证据来源：' + s.citations.join('；')));
    }
    sectionsWrap.appendChild(sec);
  }
}

function renderVisualAssets(data) {
  const wrap = document.getElementById('visual-assets');
  wrap.innerHTML = '';
  for (const a of data.visual_assets) {
    const card = el('div', {class:'asset'});
    const isImg = a.file_path.endsWith('.png') || a.file_path.endsWith('.jpg') || a.file_path.endsWith('.jpeg') || a.file_path.endsWith('.svg');
    if (isImg) {
      card.appendChild(el('img', {src: a.file_path.replace('site/',''), alt: a.alt_text || a.title}));
    }
    card.appendChild(el('div', {class:'tag'}, a.type));
    card.appendChild(el('div', {class:'title'}, a.title));
    card.appendChild(el('div', {class:'src'}, a.source_ref));
    wrap.appendChild(card);
  }
}

function renderGlossary(data) {
  const wrap = document.getElementById('glossary');
  wrap.innerHTML = '';
  for (const item of data.glossary) {
    const details = el('details', {});
    details.appendChild(el('summary', {}, item.term));
    details.appendChild(el('p', {}, item.definition));
    details.appendChild(el('p', {class:'muted'}, '类比：' + item.analogy));
    wrap.appendChild(details);
  }
}

function renderFAQ(data) {
  const wrap = document.getElementById('faq');
  wrap.innerHTML = '';
  for (const item of data.faq) {
    const details = el('details', {});
    details.appendChild(el('summary', {}, item.q));
    details.appendChild(el('p', {}, item.a));
    wrap.appendChild(details);
  }
}

/* --- Module 1: Meal grouping demo --- */
function withinTimeWindow(timeStr, start, end) {
  // timeStr like "07:24:34", start like "06:30", end like "08:30"
  const [h,m,s] = timeStr.split(':').map(Number);
  const t = h*3600 + m*60 + (s||0);
  const [sh,sm] = start.split(':').map(Number);
  const [eh,em] = end.split(':').map(Number);
  const ts = sh*3600 + sm*60;
  const te = eh*3600 + em*60;
  return t >= ts && t <= te;
}

function inferMealType(isoTs, windows) {
  const timePart = isoTs.split('T')[1] || '';
  if (withinTimeWindow(timePart, windows.breakfast.start, windows.breakfast.end)) return 'breakfast';
  if (withinTimeWindow(timePart, windows.lunch.start, windows.lunch.end)) return 'lunch';
  if (withinTimeWindow(timePart, windows.dinner.start, windows.dinner.end)) return 'dinner';
  return 'outside_window';
}

function groupMeals(records, mergeWindowHours, windows) {
  const sorted = [...records].sort((a,b)=> new Date(a.timestamp) - new Date(b.timestamp));
  const merged = [];
  let current = null;
  const mergeWindowMs = mergeWindowHours*3600*1000;

  for (const r of sorted) {
    const t = new Date(r.timestamp).getTime();
    if (!current) {
      current = {startTs: r.timestamp, endTs: r.timestamp, records:[r]};
      continue;
    }
    const lastT = new Date(current.endTs).getTime();
    if (t - lastT <= mergeWindowMs) {
      current.endTs = r.timestamp;
      current.records.push(r);
    } else {
      merged.push(current);
      current = {startTs: r.timestamp, endTs: r.timestamp, records:[r]};
    }
  }
  if (current) merged.push(current);

  return merged.map((m, idx)=> {
    const total = m.records.reduce((sum,x)=>sum + (Number(x.amount_usd || x.amount || 0) || 0), 0);
    const mealType = inferMealType(m.records[0].timestamp, windows);
    return {
      meal_id: idx+1,
      meal_time: m.records[0].timestamp,
      meal_type: mealType,
      transactions: m.records.length,
      total_amount: Number(total.toFixed(2))
    };
  });
}

async function renderMealGroupingModule(container) {
  const moduleData = await loadJSON('data/modules/meal_grouping_demo_sample.json');
  const datasetSel = el('select', {});
  for (const ds of moduleData.datasets) {
    datasetSel.appendChild(el('option', {value: ds.dataset_id}, ds.dataset_id + (ds.is_synthetic ? '（合成）' : '（论文示例）')));
  }

  const mergeRange = el('input', {type:'range', min:'0.5', max:'6', step:'0.5', value:String(moduleData.rules.merge_window_hours)});
  const mergeValue = el('span', {class:'badge'}, mergeRange.value + ' h');

  const btn = el('button', {}, '重新计算');
  const out = el('div', {});
  const recTable = el('div', {});

  function renderTables() {
    const ds = moduleData.datasets.find(d=> d.dataset_id === datasetSel.value);
    const records = ds.records;
    // records table
    const t = el('table', {class:'table'});
    const thead = el('thead', {}, el('tr', {},
      el('th', {}, 'timestamp'), el('th', {}, 'amount'), el('th', {}, 'cafeteria'), el('th', {}, 'source')
    ));
    const tbody = el('tbody', {});
    for (const r of records) {
      tbody.appendChild(el('tr', {},
        el('td', {}, r.timestamp),
        el('td', {}, String(r.amount_usd ?? r.amount ?? '')),
        el('td', {}, r.cafeteria || ''),
        el('td', {}, r.source_ref || '')
      ));
    }
    t.appendChild(thead); t.appendChild(tbody);
    recTable.innerHTML = '';
    recTable.appendChild(el('h4', {}, '输入记录'));
    recTable.appendChild(t);

    // grouped meals
    const meals = groupMeals(records, Number(mergeRange.value), moduleData.rules.meal_time_windows);
    const t2 = el('table', {class:'table'});
    const th2 = el('thead', {}, el('tr', {},
      el('th', {}, 'meal_id'), el('th', {}, 'meal_time'), el('th', {}, 'meal_type'), el('th', {}, 'transactions'), el('th', {}, 'total')
    ));
    const tb2 = el('tbody', {});
    for (const m of meals) {
      tb2.appendChild(el('tr', {},
        el('td', {}, String(m.meal_id)),
        el('td', {}, m.meal_time),
        el('td', {}, m.meal_type),
        el('td', {}, String(m.transactions)),
        el('td', {}, String(m.total_amount))
      ));
    }
    t2.appendChild(th2); t2.appendChild(tb2);
    out.innerHTML = '';
    out.appendChild(el('h4', {}, '合并结果（演示）'));
    out.appendChild(t2);
    out.appendChild(el('p', {class:'muted'}, '说明：论文把“2小时内多次交易”合并为一餐，并用三餐时间窗标注早餐/午餐/晚餐。（证据：PDF第3页 Time Patterns）'));
  }

  mergeRange.addEventListener('input', ()=> { mergeValue.textContent = mergeRange.value + ' h'; });
  btn.addEventListener('click', renderTables);
  datasetSel.addEventListener('change', renderTables);

  container.appendChild(el('div', {class:'controls'},
    el('div', {}, el('label', {}, '示例数据集'), datasetSel),
    el('div', {}, el('label', {}, '合并窗口'), mergeRange, mergeValue),
    el('div', {}, el('label', {}, ' '), btn)
  ));
  container.appendChild(recTable);
  container.appendChild(out);

  renderTables();
}

/* --- Module 2: Variability ruler --- */
function secToLabel(sec) {
  const m = Math.floor(sec/60);
  const s = Math.floor(sec%60);
  return m + '分' + String(s).padStart(2,'0') + '秒';
}

async function renderVariabilityModule(container) {
  const data = await loadJSON('data/modules/variability_benchmarks.json');
  const featureSel = el('select', {});
  const featureNames = {
    'weekday_lunch_time_MAD': '工作日午餐时间波动（MAD）',
    'weekday_dinner_time_MAD': '工作日晚餐时间波动（MAD）',
    'weekday_lunch_dinner_interval_MAD': '工作日午晚间隔波动（MAD）'
  };
  for (const [k,v] of Object.entries(featureNames)) {
    featureSel.appendChild(el('option', {value:k}, v));
  }
  const range = el('input', {type:'range', min:'0', max:'3600', step:'10', value:'1800'});
  const valBadge = el('span', {class:'badge'}, secToLabel(Number(range.value)));
  const scale = el('div', {class:'scale'});
  const note = el('div', {});

  function render() {
    const feature = featureSel.value;
    const val = Number(range.value);
    valBadge.textContent = secToLabel(val);

    const bs = data.benchmarks.filter(b=> b.feature_id === feature);
    scale.innerHTML = '';
    const max = 3600;
    function addMarker(x, label) {
      const left = Math.max(0, Math.min(100, x/max*100));
      const m = el('div', {class:'marker', style:`left:${left}%`});
      m.appendChild(el('div', {class:'label'}, label));
      scale.appendChild(m);
    }

    for (const b of bs) {
      addMarker(b.value_seconds, b.group);
    }
    addMarker(val, '你输入的值');

    // text
    const sorted = [...bs].sort((a,b)=>a.value_seconds-b.value_seconds);
    const pos = sorted.findIndex(b=> val <= b.value_seconds);
    let msg = '';
    if (pos === -1) msg = '你的值高于论文三组的参考值范围（仅概念对比）。';
    else if (pos === 0) msg = '你的值低于或接近健康组参考值（仅概念对比）。';
    else msg = '你的值介于 ' + sorted[pos-1].group + ' 与 ' + sorted[pos].group + ' 的参考值之间（仅概念对比）。';

    note.innerHTML = '';
    note.appendChild(el('p', {}, msg));
    const list = el('ul', {});
    for (const b of bs) {
      list.appendChild(el('li', {}, `${b.group}: ${secToLabel(b.value_seconds)}（来源：${b.source_ref}）`));
    }
    note.appendChild(list);
    note.appendChild(el('p', {class:'muted'}, '风险提示：这里是把“群体平均水平”做成标尺，不能用于个人判断。（证据：PDF第9页 Limitations）'));
  }

  range.addEventListener('input', render);
  featureSel.addEventListener('change', render);

  container.appendChild(el('div', {class:'controls'},
    el('div', {}, el('label', {}, '选择指标'), featureSel),
    el('div', {}, el('label', {}, '你的值（概念）'), range, valBadge)
  ));
  container.appendChild(scale);
  container.appendChild(note);

  render();
}

/* --- Module 3: AOR Explorer --- */
async function renderAORModule(container) {
  const data = await loadJSON('data/modules/pattern_associations.json');
  const outcomeSel = el('select', {});
  const daySel = el('select', {});
  const patternSel = el('select', {});

  const outcomeNames = {
    'mild_depression':'轻度抑郁',
    'moderate_severe_depression':'中重度抑郁',
    'depression_with_anxiety':'抑郁合并焦虑',
    'all_subjects_with_anxiety':'全体样本中的焦虑'
  };
  for (const [k,v] of Object.entries(outcomeNames)) outcomeSel.appendChild(el('option', {value:k}, v));
  for (const v of ['weekday','weekend']) daySel.appendChild(el('option', {value:v}, v==='weekday'?'工作日':'周末'));
  for (const v of ['Bre-Lun-Din','Lun-Din']) patternSel.appendChild(el('option', {value:v}, v));

  const out = el('div', {});

  function fmtAOR(row) {
    if (row.is_reference) return 'Ref.';
    const ci = (row.ci_low!=null && row.ci_high!=null) ? ` (${row.ci_low}-${row.ci_high})` : '';
    return row.aor + ci;
  }

  function sigHint(row) {
    if (row.is_reference) return '参考组';
    if (row.ci_low==null || row.ci_high==null) return 'CI缺失';
    if (row.ci_low > 1 || row.ci_high < 1) return 'CI不跨1（可能显著）';
    return 'CI跨1（不确定）';
  }

  function interpretation(row) {
    if (row.is_reference) return '这是参考组（Ref.），其它水平的AOR都与它相比。';
    const direction = row.aor < 1 ? '更少同时出现（AOR<1）' : '更常同时出现（AOR>1）';
    return `${direction}。注意：这是统计关联，不是因果结论。`;
  }

  function render() {
    const rows = data.associations.filter(r =>
      r.outcome === outcomeSel.value &&
      r.day_type === daySel.value &&
      r.pattern === patternSel.value
    ).sort((a,b)=> {
      const order = {'Rare':0,'Normal':1,'Always':2};
      return order[a.level]-order[b.level];
    });

    out.innerHTML = '';
    const t = el('table', {class:'table'});
    const thead = el('thead', {}, el('tr', {},
      el('th', {}, 'level'),
      el('th', {}, 'AOR (95% CI)'),
      el('th', {}, '提示'),
      el('th', {}, '解释')
    ));
    const tbody = el('tbody', {});
    for (const r of rows) {
      tbody.appendChild(el('tr', {},
        el('td', {}, r.level),
        el('td', {}, fmtAOR(r)),
        el('td', {}, sigHint(r)),
        el('td', {}, interpretation(r))
      ));
    }
    t.appendChild(thead); t.appendChild(tbody);
    out.appendChild(t);
    out.appendChild(el('p', {class:'muted'}, '风险提示：AOR来自多因素回归，表示控制协变量后的“关联强度”，不能用来推断因果或进行个人判断。（证据：PDF第4页 Statistical Analysis；PDF第9页 Limitations）'));
  }

  outcomeSel.addEventListener('change', render);
  daySel.addEventListener('change', render);
  patternSel.addEventListener('change', render);

  container.appendChild(el('div', {class:'controls'},
    el('div', {}, el('label', {}, '结果变量'), outcomeSel),
    el('div', {}, el('label', {}, '日类型'), daySel),
    el('div', {}, el('label', {}, '模式'), patternSel)
  ));
  container.appendChild(out);

  render();
}

/* --- Module 4: Model dashboard --- */
async function renderModelDashboard(container) {
  const data = await loadJSON('data/modules/model_performance.json');
  const taskSel = el('select', {});
  for (const t of data.tasks) {
    taskSel.appendChild(el('option', {value:t.task_id}, t.task_id));
  }
  const out = el('div', {});

  function render() {
    const task = data.tasks.find(t=> t.task_id === taskSel.value) || data.tasks[0];
    out.innerHTML = '';

    const badges = el('p', {});
    badges.appendChild(el('span', {class:'badge'}, '算法：' + data.model.algorithm));
    badges.appendChild(el('span', {class:'badge'}, 'C=' + data.model.hyperparameters.C));
    badges.appendChild(el('span', {class:'badge'}, 'gamma=' + data.model.hyperparameters.gamma));
    badges.appendChild(el('span', {class:'badge'}, 'CV=' + data.model.validation.cv_folds + '折'));
    out.appendChild(badges);

    const m = task.metrics;
    const t = el('table', {class:'table'});
    const tbody = el('tbody', {});
    for (const [k,v] of Object.entries(m)) {
      tbody.appendChild(el('tr', {}, el('th', {}, k), el('td', {}, String(v))));
    }
    t.appendChild(tbody);
    out.appendChild(el('p', {}, '对比：' + task.comparisons.join(' vs ')));
    out.appendChild(t);
    out.appendChild(el('p', {class:'muted'}, '风险提示：这些指标来自研究数据上的模型评估，并不等同于临床诊断准确率；且研究对象为特定校园人群。（证据：PDF第7页 表2；PDF第9页 Limitations）'));
  }

  taskSel.addEventListener('change', render);
  container.appendChild(el('div', {class:'controls'}, el('div', {}, el('label', {}, '切换任务'), taskSel)));
  container.appendChild(out);
  render();
}

/* --- Render interactive modules list --- */
async function renderInteractiveModules(data) {
  const wrap = document.getElementById('interactive-modules');
  wrap.innerHTML = '';

  for (const m of data.interactive_modules) {
    const box = el('div', {class:'module', id: m.id});
    box.appendChild(el('h3', {}, m.title));
    box.appendChild(el('p', {}, m.purpose));
    box.appendChild(el('p', {class:'muted'}, '证据来源：' + m.source_ref));
    const inner = el('div', {});
    box.appendChild(inner);

    // bind module renderers
    try {
      if (m.id === 'im_meal_grouping') await renderMealGroupingModule(inner);
      if (m.id === 'im_variability_ruler') await renderVariabilityModule(inner);
      if (m.id === 'im_aor_explorer') await renderAORModule(inner);
      if (m.id === 'im_model_dashboard') await renderModelDashboard(inner);
    } catch (e) {
      inner.appendChild(el('p', {}, '模块数据加载失败：' + String(e)));
      inner.appendChild(el('p', {class:'muted'}, '请确认通过 http.server 等方式访问，而不是直接打开本地文件。'));
    }

    box.appendChild(el('div', {class:'risk'}, '风险提示：交互演示用于帮助理解论文方法与结果，不用于个人自测或诊断。'));
    wrap.appendChild(box);
  }
}

async function main() {
  document.getElementById('build-time').textContent = new Date().toISOString();
  try {
    const data = await loadJSON('data/content.json');

    document.getElementById('page-title').textContent = data.sections?.[0]?.heading?.split('｜')[0] || '公众解读';
    document.getElementById('page-subtitle').textContent = data.sections?.[0]?.heading?.split('｜')[1] || '';
    document.getElementById('paper-meta').textContent = `${data.paper_reference?.journal || ''} ${data.paper_reference?.year || ''} · DOI: ${data.paper_reference?.doi || ''}`;

    renderSections(data);
    renderVisualAssets(data);
    await renderInteractiveModules(data);
    renderGlossary(data);
    renderFAQ(data);
    document.getElementById('disclaimer').textContent = data.disclaimer || '';
  } catch (e) {
    const main = document.getElementById('sections');
    main.innerHTML = '';
    main.appendChild(el('section', {class:'card'}, el('h2', {}, '加载失败'), el('p', {}, String(e)), el('p', {class:'muted'}, '请在 site 目录启动本地服务器后再访问，例如：python -m http.server 8000')));
  }
}

main();
