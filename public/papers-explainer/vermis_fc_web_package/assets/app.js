/* Minimal, dependency-free client script
 * Loads assets/data/content.json and renders:
 * - sections (with explicit evidence refs: PDF页码/图表)
 * - visual gallery (png + svg)
 * - three interactive modules
 * - glossary + FAQ
 * - citations map
 */

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fmt(num, digits=3) {
  if (num === null || num === undefined || Number.isNaN(num)) return "—";
  return Number(num).toFixed(digits);
}
function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

function el(tag, attrs = {}, children = "") {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  if (typeof children === "string") node.innerHTML = children;
  else if (Array.isArray(children)) children.forEach(ch => node.appendChild(ch));
  else if (children instanceof Node) node.appendChild(children);
  return node;
}

function evidenceLinks(codes, citations) {
  // codes: ["C6","C7"]
  return codes.map(code => {
    const ref = citations?.[code]?.ref ?? code;
    const safeRef = escapeHTML(ref);
    return `<a class="anchor" href="#cit-${escapeHTML(code)}" title="查看证据锚点 ${escapeHTML(code)}">${safeRef}</a>`;
  }).join("；");
}

function expandEvidenceInText(text, citations) {
  // Transform "（证据：C1；C3）" into "（证据：PDF第1页摘要；PDF第2页2.1节、表1）" with links
  return text.replace(/（证据：([^）]+)）/g, (m, inner) => {
    const codes = inner.match(/\bC\d{1,2}\b/g) || [];
    if (codes.length === 0) return m;
    const expanded = evidenceLinks(codes, citations);
    return `（证据：${expanded}）`;
  });
}

function renderMarkdown(md, citations) {
  // Very small markdown renderer:
  // - paragraphs by blank line
  // - **bold**
  // - line breaks
  const safe = escapeHTML(md);
  const withEvidence = expandEvidenceInText(safe, citations);
  const withBold = withEvidence.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const paras = withBold.split(/\n\s*\n/g).map(p => p.trim()).filter(Boolean);
  return paras.map(p => `<p>${p.replaceAll("\n", "<br/>")}</p>`).join("\n");
}

function buildSection(sec, citations) {
  const section = el("section", { id: sec.id, class: "section" });
  section.appendChild(el("h2", {}, escapeHTML(sec.heading)));
  section.appendChild(el("div", { class: "md" }, renderMarkdown(sec.body_markdown, citations)));
  return section;
}

function buildGallery(visualAssets, citations) {
  const wrapper = el("section", { id: "visuals", class: "section" });
  wrapper.appendChild(el("h2", {}, "图文速览（素材可直接复用）"));
  wrapper.appendChild(el("p", { class: "muted" }, "包含：论文图1/图2截图 + 6张可重绘SVG示意。每张图都配alt文本与证据锚点（页码/图表）。"));

  const grid = el("div", { class: "gallery" });

  for (const v of visualAssets) {
    const fig = el("figure", { class: "figure", id: v.id });
    if (v.path.endsWith(".svg")) {
      const obj = el("object", { type: "image/svg+xml", data: v.path, "aria-label": v.alt_text });
      fig.appendChild(obj);
    } else {
      fig.appendChild(el("img", { src: v.path, alt: v.alt_text, loading: "lazy" }));
    }
    const codes = v.source_ref || [];
    fig.appendChild(el("figcaption", {}, `
      <strong>${escapeHTML(v.title)}</strong><br/>
      <span class="cite">（证据：${evidenceLinks(codes, citations)}）</span>
    `));
    grid.appendChild(fig);
  }

  wrapper.appendChild(grid);
  wrapper.appendChild(el("details", {}, `
    <summary>无障碍说明（为什么每张图都写alt）</summary>
    <p>本内容包默认每张图都提供可读alt文本，让视障用户能理解图意；交互模块也提供可读数值输出与风险提示。</p>
  `));
  return wrapper;
}

function buildHAMDModule(mod, citations) {
  const root = el("div", { class: "module", id: mod.id });
  root.appendChild(el("h3", {}, escapeHTML(mod.title)));
  root.appendChild(el("p", { class: "module-desc" }, escapeHTML(mod.purpose)));

  const baseline = el("input", { type: "number", min: "0", step: "1", value: "24", id: "hamd_baseline" });
  const week2 = el("input", { type: "number", min: "0", step: "1", value: "12", id: "hamd_week2" });
  const out = el("div", { class: "output", role: "status", "aria-live": "polite" });

  function recalc() {
    const b = Number(baseline.value);
    const w = Number(week2.value);
    if (!Number.isFinite(b) || !Number.isFinite(w) || b <= 0) {
      out.innerHTML = `<div class="big">请输入有效的基线分数（>0）。</div><div class="muted small">${escapeHTML(mod.risk_note)}</div>`;
      return;
    }
    const rate = (b - w) / b;
    const pct = Math.round(rate * 1000) / 10;
    const resp = rate >= 0.5;
    out.innerHTML = `
      <div class="big">下降比例：${pct}%</div>
      <div>判定：<strong>${resp ? "早期响应（≥50%）" : "未达到早期响应（<50%）"}</strong></div>
      <div class="muted small">（证据：${evidenceLinks(["C1","C3"], citations)}）</div>
      <div class="muted small" style="margin-top:8px">${escapeHTML(mod.risk_note)}</div>
    `;
  }
  baseline.addEventListener("input", recalc);
  week2.addEventListener("input", recalc);

  root.appendChild(el("div", { class: "form-row" }, [
    el("div", { class: "field" }, [el("label", { for: "hamd_baseline" }, "基线HAMD分数"), baseline]),
    el("div", { class: "field" }, [el("label", { for: "hamd_week2" }, "第2周HAMD分数"), week2]),
  ]));
  root.appendChild(out);
  recalc();
  return root;
}

function buildModelModule(mod, citations) {
  const root = el("div", { class: "module", id: mod.id });
  root.appendChild(el("h3", {}, escapeHTML(mod.title)));
  root.appendChild(el("p", { class: "module-desc" }, escapeHTML(mod.purpose)));

  const age = el("input", { type: "range", min: "10", max: "20", step: "0.1", value: "15.8", id: "age_years" });
  const fc = el("input", { type: "range", min: "-1.5", max: "3.0", step: "0.01", value: "0.8", id: "fc_value_z" });
  const gender = el("select", { id: "gender_var" }, `
    <option value="0">gender变量=0</option>
    <option value="1">gender变量=1</option>
  `);

  const ageVal = el("div", { class: "muted small" });
  const fcVal = el("div", { class: "muted small" });
  const out = el("div", { class: "output", role: "status", "aria-live": "polite" });

  function recalc() {
    const a = Number(age.value);
    const f = Number(fc.value);
    const g = Number(gender.value);

    ageVal.innerHTML = `当前：${fmt(a,1)} 岁（演示范围；研究平均年龄见表1）<span class="cite">（证据：${evidenceLinks(["C3"], citations)}）</span>`;
    fcVal.innerHTML = `当前：${fmt(f,2)} z（演示范围；论文未报告FC取值范围）<span class="cite">（证据：${evidenceLinks(["C9"], citations)}）</span>`;

    const logOdds = 6.071 + 0.312*f - 0.308*a - 0.707*g;
    const p = sigmoid(logOdds);
    const pct = Math.round(p*1000)/10;

    out.innerHTML = `
      <div class="big">模型输出（教育演示）：响应概率 ≈ ${pct}%</div>
      <div class="muted">log-odds = ${fmt(logOdds,3)}</div>
      <div class="muted small">AUC=0.760（95%CI 0.678–0.843，p&lt;0.001）<span class="cite">（证据：${evidenceLinks(["C9","C1"], citations)}）</span></div>
      <div class="muted small" style="margin-top:8px">${escapeHTML(mod.risk_note)}</div>
      <div class="muted small">提示：gender变量0/1的编码含义论文未报告，因此这里只展示“变量改变会怎样”，不映射具体性别。<span class="cite">（证据：${evidenceLinks(["C9"], citations)}）</span></div>
    `;
  }

  age.addEventListener("input", recalc);
  fc.addEventListener("input", recalc);
  gender.addEventListener("change", recalc);

  root.appendChild(el("div", { class: "form-row" }, [
    el("div", { class: "field" }, [el("label", { for: "age_years" }, "年龄（年）"), age, ageVal]),
    el("div", { class: "field" }, [el("label", { for: "fc_value_z" }, "关键FC值（z）"), fc, fcVal]),
    el("div", { class: "field" }, [el("label", { for: "gender_var" }, "gender变量（0/1）"), gender]),
  ]));
  root.appendChild(out);
  recalc();
  return root;
}

function buildMapModule(mod, clusters, citations) {
  const root = el("div", { class: "module", id: mod.id });
  root.appendChild(el("h3", {}, escapeHTML(mod.title)));
  root.appendChild(el("p", { class: "module-desc" }, escapeHTML(mod.purpose)));

  const comparison = el("select", { id: "cmp" });
  for (const c of clusters.comparisons) {
    const opt = document.createElement("option");
    opt.value = c.comparison_id;
    opt.textContent = c.label;
    comparison.appendChild(opt);
  }
  const query = el("input", { type: "text", placeholder: "例如：Temporal 或 Frontal", id: "q" });
  const sort = el("select", { id: "sort" }, `
    <option value="voxel_count_desc">按体素数（降序）</option>
    <option value="f_desc">按F值（降序）</option>
  `);

  const tableWrap = el("div", { class: "table-wrap" });
  const table = el("table", { "aria-label": "脑区簇列表" });
  tableWrap.appendChild(table);

  function filterAndSort() {
    const cmp = comparison.value;
    const q = query.value.trim().toLowerCase();
    const s = sort.value;

    let rows = clusters.clusters.filter(cl => cl.comparison_id === cmp);
    if (q) {
      rows = rows.filter(cl => (cl.aal_region_labels || []).some(r => r.toLowerCase().includes(q)));
    }
    if (s === "voxel_count_desc") rows.sort((a,b) => b.voxel_count - a.voxel_count);
    if (s === "f_desc") rows.sort((a,b) => b.statistic_f_reported - a.statistic_f_reported);

    const header = `
      <thead><tr>
        <th>簇ID</th><th>体素数</th><th>峰值坐标（MNI, mm）</th><th>F值</th><th>区域标签（AAL）</th><th>证据</th>
      </tr></thead>
    `;
    const body = rows.map(r => {
      const tags = (r.aal_region_labels || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("");
      const mni = `(${r.peak_mni.x}, ${r.peak_mni.y}, ${r.peak_mni.z})`;
      const codes = r.source_ref || [];
      return `<tr>
        <td>${escapeHTML(r.cluster_id)}</td>
        <td>${r.voxel_count}</td>
        <td>${escapeHTML(mni)}</td>
        <td>${fmt(r.statistic_f_reported,3)}</td>
        <td>${tags}</td>
        <td class="muted small">${evidenceLinks(codes, citations)}</td>
      </tr>`;
    }).join("");

    const note = clusters.comparisons.find(x => x.comparison_id === cmp)?.direction_note || "";
    const noteCodes = clusters.comparisons.find(x => x.comparison_id === cmp)?.source_ref || [];
    root.querySelector("#cmp-note").innerHTML = `${escapeHTML(note)} <span class="cite">（证据：${evidenceLinks(noteCodes, citations)}）</span>`;
    table.innerHTML = `${header}<tbody>${body}</tbody>`;
  }

  comparison.addEventListener("change", filterAndSort);
  query.addEventListener("input", filterAndSort);
  sort.addEventListener("change", filterAndSort);

  root.appendChild(el("div", { class: "form-row" }, [
    el("div", { class: "field" }, [el("label", { for: "cmp" }, "比较类型"), comparison]),
    el("div", { class: "field" }, [el("label", { for: "q" }, "搜索区域标签"), query]),
    el("div", { class: "field" }, [el("label", { for: "sort" }, "排序"), sort]),
  ]));
  root.appendChild(el("div", { class: "muted small", id: "cmp-note", style: "margin-top:10px" }, ""));
  root.appendChild(tableWrap);
  root.appendChild(el("div", { class: "muted small", style: "margin-top:10px" },
    `风险提示：${escapeHTML(mod.risk_note)}（证据：${evidenceLinks(["C13"], citations)}）`));
  filterAndSort();
  return root;
}

function buildGlossary(glossary, citations) {
  const sec = el("section", { id: "glossary_sec", class: "section" });
  sec.appendChild(el("h2", {}, "术语小词典（一句话+类比）"));
  sec.appendChild(el("p", { class: "muted" }, "你不需要背术语：每条都用一句话解释，并给一个直观类比。"));

  const grid = el("div", { class: "card-grid" });
  for (const item of glossary) {
    const codes = item.source_ref || [];
    grid.appendChild(el("div", { class: "card" }, `
      <div class="card-title">${escapeHTML(item.term)}</div>
      <div class="card-body">${escapeHTML(item.definition)}<br/>
        <span class="muted small">类比：${escapeHTML(item.analogy)}</span><br/>
        <span class="cite">（证据：${evidenceLinks(codes, citations)}）</span>
      </div>
    `));
  }
  sec.appendChild(grid);
  return sec;
}

function buildFAQ(faq, citations) {
  const sec = el("section", { id: "faq_sec", class: "section" });
  sec.appendChild(el("h2", {}, "FAQ：公众最常问的问题"));
  sec.appendChild(el("p", { class: "muted" }, "回答尽量指向论文证据；论文未提供的，明确写“未报告”。"));

  for (const item of faq) {
    const codes = item.source_ref || [];
    const d = el("details", { class: "faq" }, `
      <summary>${escapeHTML(item.q)}</summary>
      <p>${expandEvidenceInText(escapeHTML(item.a), citations)}</p>
      <p class="cite">（证据：${evidenceLinks(codes, citations)}）</p>
    `);
    sec.appendChild(d);
  }
  return sec;
}

function buildCitationsMap(citations) {
  const list = document.getElementById("citations-list");
  const entries = Object.entries(citations).sort((a,b) => a[0].localeCompare(b[0], "en", {numeric:true}));
  for (const [code, c] of entries) {
    list.appendChild(el("div", { class: "citation-item", id: `cit-${code}` }, `
      <div><span class="code">${escapeHTML(code)}</span><span class="txt">${escapeHTML(c.label)}</span></div>
      <div class="muted small">${escapeHTML(c.ref)}</div>
    `));
  }
}

(async function init(){
  try{
    document.getElementById("build-time").textContent = new Date().toISOString().slice(0,19).replace("T"," ");
    const content = await loadJSON("assets/data/content.json");
    const clusters = await loadJSON("assets/data/clusters.json");
    const citations = content.citations || {};

    // Hero
    document.getElementById("hero-title").textContent = content.meta.title_main;
    document.getElementById("hero-subtitle").textContent = content.meta.title_sub;
    document.getElementById("kpi-n").textContent = "132";
    document.getElementById("disclaimer-text").textContent = content.disclaimer;

    // Sections (skip placeholders rendered elsewhere)
    const dyn = document.getElementById("dynamic-content");
    const skip = new Set(["visuals", "interactives", "glossary_sec", "faq_sec"]);
    for (const sec of content.sections) {
      if (skip.has(sec.id)) continue;
      dyn.appendChild(buildSection(sec, citations));
    }

    // Visual gallery
    const vg = document.getElementById("visual-gallery");
    vg.appendChild(buildGallery(content.visual_assets, citations));

    // Interactives
    const ia = document.getElementById("interactive-area");
    const interactSec = el("section", { id: "interactives", class: "section" });
    interactSec.appendChild(el("h2", {}, "交互模块：把研究“玩明白”"));
    interactSec.appendChild(el("p", { class:"muted" }, "目标是理解研究规则与方向，而不是把统计结论当作个人诊断。"));

    const mod1 = content.interactive_modules.find(m => m.id === "im_hamd");
    const mod2 = content.interactive_modules.find(m => m.id === "im_model");
    const mod3 = content.interactive_modules.find(m => m.id === "im_map");

    interactSec.appendChild(buildHAMDModule(mod1, citations));
    interactSec.appendChild(buildModelModule(mod2, citations));
    interactSec.appendChild(buildMapModule(mod3, clusters, citations));
    ia.appendChild(interactSec);

    // Glossary + FAQ
    const ga = document.getElementById("glossary-area");
    ga.appendChild(buildGlossary(content.glossary || [], citations));
    const fa = document.getElementById("faq-area");
    fa.appendChild(buildFAQ(content.faq || [], citations));

    // Citations map
    buildCitationsMap(citations);

  }catch(err){
    console.error(err);
    const dyn = document.getElementById("dynamic-content");
    dyn.appendChild(el("div", { class:"module" }, `<h3>加载失败</h3><p class="muted">请使用本地服务器预览（见页脚命令）。错误：${escapeHTML(err.message)}</p>`));
  }
})();
