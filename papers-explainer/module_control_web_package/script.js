
function parseJSON(id) {
  const el = document.getElementById(id);
  return JSON.parse(el.textContent);
}

function mdToText(md) {
  // very small markdown-to-text: strip headings and emphasis for demo
  return md
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1");
}

const SITE = parseJSON("site-data");
const IM = parseJSON("im-data");

document.getElementById("main-title").textContent = SITE.sections[0].heading;
document.getElementById("sub-title").textContent = SITE.sections[0].body_markdown.split("\n")[0].replace(/\*\*/g,"");
document.getElementById("summary").textContent = SITE.sections[0].body_markdown.split("\n").slice(2).join("\n").trim();
document.getElementById("disclaimer").textContent = SITE.disclaimer;

const contentEl = document.getElementById("content");
SITE.sections.slice(1).forEach(sec => {
  const s = document.createElement("section");
  s.className = "card";
  const h = document.createElement("h2");
  h.textContent = sec.heading;
  const p = document.createElement("pre");
  p.style.whiteSpace = "pre-wrap";
  p.textContent = mdToText(sec.body_markdown);
  const cite = document.createElement("p");
  cite.className = "note";
  cite.textContent = "引用锚点：" + (sec.citations || []).join("；");
  s.appendChild(h);
  s.appendChild(p);
  s.appendChild(cite);
  contentEl.appendChild(s);
});

// ---------- IM1: module explorer ----------
const im1Tabs = document.getElementById("im1-tabs");
const im1Body = document.getElementById("im1-body");
const modules = IM.im1.modules;

function renderModule(m) {
  im1Body.innerHTML = "";
  const header = document.createElement("div");
  header.innerHTML = `
    <span class="badge">${m.module_id}</span>
    <span class="badge">${m.module_type}</span>
    <span class="badge">条目数：${m.item_count}</span>
  `;
  const desc = document.createElement("p");
  desc.textContent = m.module_name_zh + "（" + m.description + "）";
  const metrics = document.createElement("p");
  const acf = (m.acf === null || m.acf === undefined) ? "未报告" : m.acf;
  const outd = (m.out_degree_strength === null || m.out_degree_strength === undefined) ? "未报告" : m.out_degree_strength;
  const ind = (m.in_degree_strength === null || m.in_degree_strength === undefined) ? "未报告" : m.in_degree_strength;
  metrics.textContent = `ACF：${acf} ｜ 出向：${outd} ｜ 入向：${ind}`;
  const ul = document.createElement("ul");
  m.items.forEach(it => {
    const li = document.createElement("li");
    li.textContent = `${it.item_id}（${it.scale || "量表未标注"}）`;
    ul.appendChild(li);
  });

  const src = document.createElement("p");
  src.className = "note";
  src.textContent = "数据来源：" + JSON.stringify(m.source_ref);

  im1Body.appendChild(header);
  im1Body.appendChild(desc);
  im1Body.appendChild(metrics);
  im1Body.appendChild(ul);
  im1Body.appendChild(src);
}

modules.forEach((m, idx) => {
  const btn = document.createElement("button");
  btn.textContent = m.module_id;
  btn.addEventListener("click", () => {
    [...im1Tabs.querySelectorAll("button")].forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderModule(m);
  });
  if (idx === 0) btn.classList.add("active");
  im1Tabs.appendChild(btn);
});
renderModule(modules[0]);

// ---------- IM2: control overview ----------
const im2Body = document.getElementById("im2-body");
const im2Btns = document.querySelectorAll("#im2 .controls button");
const ctrl = IM.im2;

function barRow(label, value, max) {
  const row = document.createElement("div");
  const v = (value === null || value === undefined) ? null : Number(value);
  row.innerHTML = `<div class="note">${label}：${v === null ? "未报告" : v}</div>`;
  const bar = document.createElement("div");
  bar.className = "bar";
  const span = document.createElement("span");
  span.style.width = v === null ? "0%" : (100 * v / max).toFixed(1) + "%";
  bar.appendChild(span);
  row.appendChild(bar);
  return row;
}

function renderIM2(view) {
  im2Body.innerHTML = "";
  if (view === "group") {
    const max = Math.max(...ctrl.amcs_group_means.map(d => d.mean_amcs));
    ctrl.amcs_group_means.forEach(d => {
      const label = `${d.from_type} → ${d.to_type}（均值）`;
      im2Body.appendChild(barRow(label, d.mean_amcs, max));
    });
    const note = document.createElement("p");
    note.className = "note";
    note.textContent = "（证据：第7页 图4D）";
    im2Body.appendChild(note);
    return;
  }

  const key = view === "out" ? "out_degree_strength" : "in_degree_strength";
  const max = Math.max(...ctrl.modules.map(m => m[key]).filter(v => v !== null && v !== undefined));
  ctrl.modules.forEach(m => {
    im2Body.appendChild(barRow(m.module_id, m[key], max));
  });

  const edgesTitle = document.createElement("h4");
  edgesTitle.textContent = "代表性连线（论文报告/图中标注）";
  im2Body.appendChild(edgesTitle);

  const table = document.createElement("table");
  table.className = "table";
  table.innerHTML = "<thead><tr><th>from</th><th>to</th><th>AMCS</th><th>来源</th></tr></thead>";
  const tb = document.createElement("tbody");
  ctrl.edge_highlights.slice(0,6).forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${e.from}</td><td>${e.to}</td><td>${e.amcs ?? e.amcs_display}</td><td>${e.source_ref}</td>`;
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  im2Body.appendChild(table);
}

im2Btns.forEach(btn => {
  btn.addEventListener("click", () => {
    im2Btns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderIM2(btn.dataset.view);
  });
});
im2Btns[0].classList.add("active");
renderIM2("out");

// ---------- IM3: driver symptoms ----------
const im3Body = document.getElementById("im3-body");
const im3Filter = document.getElementById("im3-filter");
const drivers = IM.im3.driver_nodes;

function renderIM3() {
  im3Body.innerHTML = "";
  const filter = im3Filter.value;
  const rows = drivers.filter(d => filter === "ALL" ? true : d.module_id === filter)
                      .sort((a,b) => b.cf - a.cf);

  const table = document.createElement("table");
  table.className = "table";
  table.innerHTML = "<thead><tr><th>条目</th><th>模块</th><th>CF</th><th>来源</th></tr></thead>";
  const tb = document.createElement("tbody");
  rows.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${d.item_id}</td><td>${d.module_id}</td><td>${d.cf}</td><td>${d.source_ref}</td>`;
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  im3Body.appendChild(table);

  const meta = document.createElement("p");
  meta.className = "note";
  meta.textContent = `补充：论文报告共有 ${IM.im3.meta.driver_nodes_count}/37 个节点至少出现过一次驱动角色，但未公开全体37项CF。`;
  im3Body.appendChild(meta);
}
im3Filter.addEventListener("change", renderIM3);
renderIM3();

// ---------- IM4: stability ----------
const im4Body = document.getElementById("im4-body");
const im4Btns = document.querySelectorAll("#im4 .controls button");
const stab = IM.im4;

function renderIM4(view) {
  im4Body.innerHTML = "";
  const title = document.createElement("p");
  title.className = "note";
  title.textContent = `参数：抽样比例 ${stab.bootstrap.sampling_ratio}，重复 ${stab.bootstrap.repeats} 次。（证据：${stab.bootstrap.source_ref}）`;
  im4Body.appendChild(title);

  if (view === "mdset") {
    const max = Math.max(...stab.mdset_size_distribution.map(d => d.proportion));
    stab.mdset_size_distribution.forEach(d => {
      im4Body.appendChild(barRow(`MDSet大小=${d.mdset_size}`, d.proportion, max));
    });
    const note = document.createElement("p");
    note.className = "note";
    note.textContent = "（证据：第8页 图5F）";
    im4Body.appendChild(note);
  } else {
    const max = Math.max(...stab.module_count_distribution.map(d => d.proportion));
    stab.module_count_distribution.forEach(d => {
      im4Body.appendChild(barRow(`模块数=${d.module_count}`, d.proportion, max));
    });
    const note = document.createElement("p");
    note.className = "note";
    note.textContent = "（证据：第8页 图5E）";
    im4Body.appendChild(note);
  }

  if (stab.stability_statements && stab.stability_statements.length) {
    const ul = document.createElement("ul");
    stab.stability_statements.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s.claim + "（证据：" + s.source_ref + "）";
      ul.appendChild(li);
    });
    im4Body.appendChild(ul);
  }
}

im4Btns.forEach(btn => {
  btn.addEventListener("click", () => {
    im4Btns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderIM4(btn.dataset.view);
  });
});
im4Btns[0].classList.add("active");
renderIM4("modules");
