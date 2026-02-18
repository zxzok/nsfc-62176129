#!/usr/bin/env python3
"""Fix generated pages: bad titles, missing vermis page, adolescent page."""

import os, json, re, shutil
from pathlib import Path

DEST_ROOT = Path("/Users/xizhezhang/work/5. Research Project/1.在研项目/2021自然科学基金/结题/网站相关/项目源码/public/papers-explainer")
SRC_ROOT = Path("/tmp/paper_extract")

# ── 1. Fix bad titles ──────────────────────────────────

TITLE_FIXES = {
    "ai_psychiatry_web_package": 'AI走进精神科：能让诊断更客观、治疗更精准吗？',
    "biofeedback_web_package": '4周生物反馈训练，能让大学生睡得更好、没那么焦虑吗？',
    "gcbt_hrv_public_web_package": '心跳的\u201c微波动\u201d，能提示谁更受益于团体CBT？',
    "immuno-inflammatory-neuroimaging-web-pack": '抑郁、双相、精神分裂背后，可能有两种\u201c炎症底色\u201d的大脑',
    "nibs_web_content_pack": '无创\u201c脑刺激\u201d真的能缓解抑郁吗？',
    "sz_mri_public_page_pack": '长期抗精神病药会影响大脑吗？真实世界MRI给出线索',
    "module-control-web-package": '谁在牵动情绪？把抑郁、焦虑、睡眠和压力画成一张\u201c控制地图\u201d',
    "voice-depression-web-content-pack": '只用一段朗读，能多快\u201c量出\u201d抑郁程度？',
    "web_content_package_aberrant_hippocampal_development": '青春期的海马体发育\u201c掉队\u201d，能被拉回吗？',
    "visual_cortex_rtms_webpkg": '把磁刺激\u201c对准视觉皮层\u201d，能否帮青少年精神障碍的大脑找回发育节奏？',
    "cbt_biomarker_web_package": '认知行为治疗的\u201c脑影像预测\u201d：谁最可能从CBT中获益？',
}

def fix_title(pkg_name, new_title):
    html_path = DEST_ROOT / pkg_name / "index.html"
    if not html_path.exists():
        print(f"  ⚠️  {pkg_name}/index.html not found")
        return

    content = html_path.read_text(encoding='utf-8')
    # Fix <title> tag
    content = re.sub(r'<title>[^<]*</title>', f'<title>{new_title}</title>', content)
    # Fix <h1> in hero section
    content = re.sub(
        r'(<h1[^>]*>)[^<]*(</h1>)',
        rf'\g<1>{new_title}\2',
        content
    )
    html_path.write_text(content, encoding='utf-8')
    print(f"  ✅ Fixed title: {pkg_name} → {new_title[:40]}...")


# ── 2. Generate vermis page from JSON ──────────────────

def generate_vermis():
    """Generate vermis_fc_web_package page from its JSON content."""
    pkg = "vermis_fc_web_package"
    src = SRC_ROOT / pkg / "site" / "assets" / "data" / "content.json"
    data = json.loads(src.read_text(encoding='utf-8'))

    meta = data["meta"]
    title = meta["title_main"]
    subtitle = meta["title_sub"]
    sections = data["sections"]
    glossary = data.get("glossary", [])
    faq = data.get("faq", [])

    # Copy images
    dest = DEST_ROOT / pkg
    dest.mkdir(parents=True, exist_ok=True)
    vis_dest = dest / "visuals"
    vis_dest.mkdir(exist_ok=True)

    img_src = SRC_ROOT / pkg / "site" / "assets" / "images"
    img_count = 0
    if img_src.exists():
        for f in img_src.iterdir():
            if f.suffix.lower() in ['.png', '.jpg', '.svg', '.jpeg']:
                shutil.copy2(f, vis_dest / f.name)
                img_count += 1

    svg_src = SRC_ROOT / pkg / "site" / "assets" / "svgs"
    if svg_src.exists():
        for f in svg_src.iterdir():
            if f.suffix.lower() == '.svg':
                shutil.copy2(f, vis_dest / f.name)
                img_count += 1

    print(f"  Copied {img_count} images for vermis")

    # Build sections HTML
    sections_html = ""
    for i, s in enumerate(sections):
        heading = s.get("heading", "")
        body = s.get("body_markdown", "")
        if not heading or heading == title:
            continue
        if heading.lower() in ['术语小词典', 'faq', 'faq：公众最常问的问题']:
            continue

        # Clean evidence citations
        body = re.sub(r'（证据[^）]*）', '', body)
        body = re.sub(r'\(证据[^)]*\)', '', body)

        # Simple md to html
        body = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', body)
        body = re.sub(r'\*(.+?)\*', r'<em>\1</em>', body)
        body = re.sub(r'^[-•]\s*(.+)$', r'<li>\1</li>', body, flags=re.MULTILINE)
        body = re.sub(r'((?:<li>.*?</li>\n?)+)', r'<ul>\1</ul>', body)
        body = re.sub(r'\n\n+', '</p><p>', body)
        body = f'<p>{body}</p>'
        body = body.replace('\n', '<br>')
        body = re.sub(r'<p>\s*</p>', '', body)

        bg = 'background:var(--surface);' if i % 2 == 0 else ''
        sections_html += f'''
<section class="section" style="{bg}">
  <div class="container">
    <h2 class="reveal">{heading}</h2>
    <div class="reveal">{body}</div>
  </div>
</section>'''

    # Glossary HTML
    glossary_html = ""
    if glossary:
        items = ""
        for g in glossary:
            term = g.get("term", "")
            defn = g.get("definition", "")
            analogy = g.get("analogy", "")
            analogy_html = f'<div class="glossary-analogy">{analogy}</div>' if analogy else ''
            items += f'''
      <div class="glossary-item reveal">
        <div class="glossary-term">{term}</div>
        <div class="glossary-def">{defn}</div>
        {analogy_html}
      </div>'''
        glossary_html = f'''
<section class="section" style="background:var(--surface);" id="glossary">
  <div class="container">
    <div class="section-label reveal">术语词典</div>
    <h2 class="reveal" style="margin-top:0.5rem;">核心术语</h2>
    {items}
  </div>
</section>'''

    # FAQ HTML
    faq_html = ""
    if faq:
        items = ""
        for f_item in faq:
            q = f_item.get("q", "")
            a = f_item.get("a", "")
            a = re.sub(r'（证据[^）]*）', '', a)
            a = re.sub(r'\(证据[^)]*\)', '', a)
            a = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', a)
            a = a.replace('\n', '<br>')
            items += f'''
      <div class="faq-item reveal">
        <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">
          {q}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="faq-a"><p>{a}</p></div>
      </div>'''
        faq_html = f'''
<section class="section" id="faq">
  <div class="container">
    <div class="section-label reveal">常见问题</div>
    <h2 class="reveal" style="margin-top:0.5rem;">FAQ</h2>
    {items}
  </div>
</section>'''

    html = f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../adaptive_control_dynamic_networks_web_package/shared.css">
</head>
<body>
<div id="nsfc-nav">
  <a href="../../#/" style="color:#48cae4;text-decoration:none;font-size:14px;font-weight:500;display:flex;align-items:center;gap:6px;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
    返回主站
  </a>
  <span style="color:rgba(255,255,255,0.5);font-size:12px;letter-spacing:0.5px;">NSFC 62176129</span>
</div>

<div class="reading-progress" id="readingProgress"></div>

<section class="hero">
  <div class="container">
    <span class="hero-badge">论文解读</span>
    <h1 style="margin-top:1rem;">{title}</h1>
    <p class="hero-subtitle">{subtitle}</p>
    <p style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin-top:1rem;">{meta["paper_citation"]}</p>
  </div>
</section>

{sections_html}
{glossary_html}
{faq_html}

<footer class="site-footer">
  <div class="container">
    <p>本页面内容基于论文生成，仅用于科学传播与学术交流。</p>
    <p style="margin-top:0.5rem;"><a href="../../#/">NSFC 62176129 项目主站</a></p>
  </div>
</footer>

<script>
window.addEventListener('scroll', function() {{
  var h = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('readingProgress').style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
}}, {{ passive: true }});
var observer = new IntersectionObserver(function(entries) {{
  entries.forEach(function(e) {{ if (e.isIntersecting) e.target.classList.add('visible'); }});
}}, {{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }});
document.querySelectorAll('.reveal').forEach(function(el) {{ observer.observe(el); }});
</script>
</body>
</html>'''

    (dest / "index.html").write_text(html, encoding='utf-8')
    print(f"  ✅ Generated vermis page: {title}")


# ── 3. Fix adolescent page from page_content.json ──────

def fix_adolescent():
    """Regenerate adolescent page from page_content.json."""
    pkg = "adolescent-psychotic-mood-brain-network"
    src = SRC_ROOT / pkg / "content" / "page_content.json"
    data = json.loads(src.read_text(encoding='utf-8'))

    title = data["sections"][0]["heading"]  # hero heading
    subtitle_raw = data["sections"][0].get("body_markdown", "")
    # Extract subtitle from the body
    subtitle_match = re.search(r'副标题：(.+?)(?:\n|（)', subtitle_raw)
    subtitle = subtitle_match.group(1).strip() if subtitle_match else ""

    sections = data["sections"][1:]  # skip hero
    glossary_data = data.get("glossary", [])
    faq_data = data.get("faq", [])

    # Copy images
    dest = DEST_ROOT / pkg
    vis_dest = dest / "visuals"
    vis_dest.mkdir(exist_ok=True)

    img_src = SRC_ROOT / pkg / "assets" / "images"
    img_count = 0
    if img_src.exists():
        for f in img_src.iterdir():
            if f.suffix.lower() in ['.png', '.jpg', '.svg', '.jpeg']:
                shutil.copy2(f, vis_dest / f.name)
                img_count += 1

    svg_src = SRC_ROOT / pkg / "assets" / "svgs"
    if svg_src.exists():
        for f in svg_src.iterdir():
            if f.suffix.lower() == '.svg':
                shutil.copy2(f, vis_dest / f.name)
                img_count += 1

    print(f"  Copied {img_count} images for adolescent")

    # Build sections
    sections_html = ""
    for i, s in enumerate(sections):
        heading = s.get("heading", "")
        body = s.get("body_markdown", "")
        if not heading:
            continue
        if heading.lower() in ['术语小词典', 'faq']:
            continue

        body = re.sub(r'（证据[^）]*）', '', body)
        body = re.sub(r'\(证据[^)]*\)', '', body)
        body = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', body)
        body = re.sub(r'\*(.+?)\*', r'<em>\1</em>', body)
        body = re.sub(r'^[-•]\s*(.+)$', r'<li>\1</li>', body, flags=re.MULTILINE)
        body = re.sub(r'((?:<li>.*?</li>\n?)+)', r'<ul>\1</ul>', body)
        body = re.sub(r'\n\n+', '</p><p>', body)
        body = f'<p>{body}</p>'
        body = body.replace('\n', '<br>')
        body = re.sub(r'<p>\s*</p>', '', body)

        bg = 'background:var(--surface);' if i % 2 == 0 else ''
        sections_html += f'''
<section class="section" style="{bg}">
  <div class="container">
    <h2 class="reveal">{heading}</h2>
    <div class="reveal">{body}</div>
  </div>
</section>'''

    # Glossary
    glossary_html = ""
    if glossary_data:
        items = ""
        for g in glossary_data:
            term = g.get("term", "")
            defn = g.get("plain_language", g.get("definition", ""))
            analogy = g.get("analogy", "")
            analogy_html = f'<div class="glossary-analogy">{analogy}</div>' if analogy else ''
            items += f'''
      <div class="glossary-item reveal">
        <div class="glossary-term">{term}</div>
        <div class="glossary-def">{defn}</div>
        {analogy_html}
      </div>'''
        glossary_html = f'''
<section class="section" style="background:var(--surface);" id="glossary">
  <div class="container">
    <div class="section-label reveal">术语词典</div>
    <h2 class="reveal" style="margin-top:0.5rem;">核心术语</h2>
    {items}
  </div>
</section>'''

    # FAQ
    faq_html = ""
    if faq_data:
        items = ""
        for f_item in faq_data:
            q = f_item.get("q", "")
            a = f_item.get("a", "")
            a = re.sub(r'（证据[^）]*）', '', a)
            a = a.replace('\n', '<br>')
            items += f'''
      <div class="faq-item reveal">
        <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">
          {q}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="faq-a"><p>{a}</p></div>
      </div>'''
        faq_html = f'''
<section class="section" id="faq">
  <div class="container">
    <div class="section-label reveal">常见问题</div>
    <h2 class="reveal" style="margin-top:0.5rem;">FAQ</h2>
    {items}
  </div>
</section>'''

    paper = data.get("paper", {})
    citation = f'{paper.get("journal", "")}, {paper.get("year", "")}'

    html = f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../adaptive_control_dynamic_networks_web_package/shared.css">
</head>
<body>
<div id="nsfc-nav">
  <a href="../../#/" style="color:#48cae4;text-decoration:none;font-size:14px;font-weight:500;display:flex;align-items:center;gap:6px;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
    返回主站
  </a>
  <span style="color:rgba(255,255,255,0.5);font-size:12px;letter-spacing:0.5px;">NSFC 62176129</span>
</div>

<div class="reading-progress" id="readingProgress"></div>

<section class="hero">
  <div class="container">
    <span class="hero-badge">论文解读</span>
    <h1 style="margin-top:1rem;">{title}</h1>
    <p class="hero-subtitle">{subtitle}</p>
    <p style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin-top:1rem;">{citation}</p>
  </div>
</section>

{sections_html}
{glossary_html}
{faq_html}

<footer class="site-footer">
  <div class="container">
    <p>本页面内容基于论文生成，仅用于科学传播与学术交流。</p>
    <p style="margin-top:0.5rem;"><a href="../../#/">NSFC 62176129 项目主站</a></p>
  </div>
</footer>

<script>
window.addEventListener('scroll', function() {{
  var h = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('readingProgress').style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
}}, {{ passive: true }});
var observer = new IntersectionObserver(function(entries) {{
  entries.forEach(function(e) {{ if (e.isIntersecting) e.target.classList.add('visible'); }});
}}, {{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }});
document.querySelectorAll('.reveal').forEach(function(el) {{ observer.observe(el); }});
</script>
</body>
</html>'''

    (dest / "index.html").write_text(html, encoding='utf-8')
    print(f"  ✅ Regenerated adolescent page: {title}")


# ── Main ──────────────────────────────────────────

def main():
    print("=== Fixing titles ===")
    for pkg, title in TITLE_FIXES.items():
        fix_title(pkg, title)

    print("\n=== Generating vermis page ===")
    generate_vermis()

    print("\n=== Fixing adolescent page ===")
    fix_adolescent()

    print("\n=== Done ===")

if __name__ == '__main__':
    main()
