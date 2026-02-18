#!/usr/bin/env python3
"""
Generate modern HTML pages for all paper explainer packages.
Reads content from /tmp/paper_extract/, generates pages to public/papers-explainer/.
"""

import os, json, re, glob, shutil
from pathlib import Path

SRC_ROOT = Path("/tmp/paper_extract")
DEST_ROOT = Path("/Users/xizhezhang/work/5. Research Project/1.在研项目/2021自然科学基金/结题/网站相关/项目源码/public/papers-explainer")
SKIP = {"adaptive_control_dynamic_networks_web_package"}  # already done

# ── Helpers ──────────────────────────────────────────────

def find_pkg_root(pkg_name):
    """Find the actual content root (handles double-nesting)."""
    base = SRC_ROOT / pkg_name
    # Check for double-nested (same name)
    inner = base / pkg_name
    if inner.is_dir():
        return inner
    # Check for differently-named inner dirs
    subdirs = [d for d in base.iterdir() if d.is_dir() and not d.name.startswith('.')]
    if len(subdirs) == 1:
        # Check if the single subdir looks like a content root
        sub = subdirs[0]
        has_content = any((sub / f).exists() for f in ['content', 'data', 'assets', 'site', 'web', 'web_demo'])
        has_files = any((sub / f).exists() for f in ['manifest.json', 'README.md', 'index.html'])
        if has_content or has_files:
            return sub
    return base


def find_content_files(root):
    """Find main content, FAQ, glossary files."""
    content = faq = glossary = None

    # Priority order for main content
    content_candidates = [
        'content/zh/index.md', 'content/page.zh.md', 'content/page.md',
        'content/index.md', 'content/page_content.md', 'content/page_copy.md',
        'content/page_longform.md', 'site/page.md',
    ]
    for c in content_candidates:
        p = root / c
        if p.exists():
            content = p
            break

    # Search more broadly if not found
    if not content:
        for pattern in ['content/**/*.md', 'content/**/*.json', '**/*page*.md']:
            found = sorted(root.glob(pattern))
            found = [f for f in found if f.is_file() and 'glossary' not in f.name.lower() and 'faq' not in f.name.lower() and 'visual' not in f.name.lower() and 'interactive' not in f.name.lower() and 'wireframe' not in f.name.lower()]
            if found:
                # Prefer .md over .json, prefer longer files
                md_files = [f for f in found if f.suffix == '.md']
                content = md_files[0] if md_files else found[0]
                break

    # JSON content fallback
    if not content:
        for pattern in ['data/content.json', 'assets/data/content.json', 'content/page_content.json',
                        'data/site_content.json', 'data/content_pack.json', 'data/site_package.json',
                        'data/page_content.json', 'data/site.json', 'content/content_bundle.json',
                        'content/structured_output.json', 'site_package.json', 'data/page_data.json',
                        'data/site-structure.json']:
            p = root / pattern
            if p.exists():
                content = p
                break

    # FAQ
    for pattern in ['content/faq.md', 'content/faq.zh.md', 'content/glossary_faq.md',
                     'content/glossary_faq.zh.md', 'data/glossary_faq.json',
                     'content/*faq*', 'content/*FAQ*']:
        found = list(root.glob(pattern))
        if found:
            faq = found[0]
            break

    # Glossary
    for pattern in ['content/glossary.md', 'content/glossary.zh.md']:
        p = root / pattern
        if p.exists():
            glossary = p
            break

    return content, faq, glossary


def find_images(root):
    """Find all image files (PNG, SVG, JPG) excluding paper scans."""
    images = []
    for ext in ['*.png', '*.svg', '*.jpg', '*.jpeg']:
        for f in root.rglob(ext):
            rel = str(f.relative_to(root))
            # Skip paper page scans, node_modules, dev directories
            if any(skip in rel.lower() for skip in ['paper_page', 'page_scan', 'node_modules', 'placeholder']):
                continue
            images.append(f)
    return images


def read_file(path):
    """Read file content."""
    try:
        return path.read_text(encoding='utf-8')
    except:
        return ""


def parse_md_sections(text):
    """Parse markdown into sections based on headings."""
    sections = []
    current = {"heading": "", "level": 0, "body": []}

    for line in text.split('\n'):
        m = re.match(r'^(#{1,3})\s+(.+)$', line)
        if m:
            if current["heading"] or current["body"]:
                sections.append(current)
            level = len(m.group(1))
            current = {"heading": m.group(2).strip(), "level": level, "body": []}
        else:
            current["body"].append(line)

    if current["heading"] or current["body"]:
        sections.append(current)

    # Clean up body text
    for s in sections:
        s["body"] = '\n'.join(s["body"]).strip()

    return sections


def extract_title_subtitle(sections):
    """Extract title and subtitle from first section."""
    if not sections:
        return "论文解读", ""

    title = sections[0]["heading"]
    subtitle = ""
    body = sections[0]["body"]

    # Extract subtitle from bold text or first line
    bold_match = re.search(r'\*\*(.+?)\*\*', body)
    if bold_match:
        subtitle = bold_match.group(1)
    elif body:
        first_line = body.split('\n')[0].strip()
        if first_line and not first_line.startswith('>') and not first_line.startswith('（'):
            subtitle = first_line[:120]

    return title, subtitle


def md_to_html(text):
    """Convert markdown to HTML (simple converter)."""
    if not text:
        return ""

    html = text
    # Escape HTML entities (but preserve existing HTML-like content)
    # Don't escape since we want to allow some markdown formatting

    # Bold
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    # Italic
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    # Inline code
    html = re.sub(r'`(.+?)`', r'<code>\1</code>', html)
    # Blockquotes
    html = re.sub(r'^>\s*(.+)$', r'<blockquote>\1</blockquote>', html, flags=re.MULTILINE)
    # Numbered lists
    html = re.sub(r'^(\d+)[)）]\s*(.+)$', r'<li>\2</li>', html, flags=re.MULTILINE)
    # Bullet lists
    html = re.sub(r'^[-•]\s*(.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    # Wrap consecutive <li> in <ul>
    html = re.sub(r'((?:<li>.*?</li>\n?)+)', r'<ul>\1</ul>', html)
    # Sub-headings within body
    html = re.sub(r'^####\s+(.+)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
    html = re.sub(r'^###\s+(.+)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
    # Paragraphs (double newline)
    html = re.sub(r'\n\n+', '</p><p>', html)
    html = f'<p>{html}</p>'
    # Single newlines within paragraphs
    html = html.replace('\n', '<br>')
    # Clean up empty paragraphs
    html = re.sub(r'<p>\s*</p>', '', html)
    # Remove evidence citations in parentheses for cleaner reading
    html = re.sub(r'（证据[^）]*）', '', html)
    html = re.sub(r'\(证据[^)]*\)', '', html)

    return html


def extract_json_content(json_path):
    """Extract content sections from JSON files."""
    try:
        data = json.loads(read_file(json_path))
    except:
        return [], "", ""

    sections = []
    title = ""
    subtitle = ""

    # Handle different JSON structures
    if isinstance(data, dict):
        # Try page.json format
        if 'sections' in data:
            title = data.get('seo_title', data.get('title', ''))
            for s in data['sections']:
                sections.append({
                    "heading": s.get('heading', s.get('title', '')),
                    "level": 2,
                    "body": s.get('body_markdown', s.get('body', s.get('content', '')))
                })
        # Try content_pack.json / site_content.json format
        elif 'page' in data:
            page = data['page']
            title = page.get('title', page.get('seo_title', ''))
            subtitle = page.get('subtitle', page.get('description', ''))
            for s in page.get('sections', []):
                sections.append({
                    "heading": s.get('heading', s.get('title', '')),
                    "level": 2,
                    "body": s.get('body_markdown', s.get('body', s.get('content', '')))
                })
        elif 'hero' in data:
            title = data['hero'].get('title', data['hero'].get('heading', ''))
            subtitle = data['hero'].get('subtitle', '')
            for key in ['sections', 'content_sections', 'body_sections']:
                if key in data:
                    for s in data[key]:
                        sections.append({
                            "heading": s.get('heading', s.get('title', '')),
                            "level": 2,
                            "body": s.get('body_markdown', s.get('body', s.get('content', '')))
                        })
                    break
        elif 'title' in data:
            title = data['title']
            subtitle = data.get('subtitle', data.get('description', ''))

        # Extract glossary/FAQ from JSON if embedded
        for key in ['glossary', 'glossary_items', 'terms']:
            if key in data and isinstance(data[key], list):
                body_parts = []
                for item in data[key]:
                    term = item.get('term', item.get('name', ''))
                    defn = item.get('definition', item.get('description', item.get('explanation', '')))
                    if term:
                        body_parts.append(f"**{term}**：{defn}")
                if body_parts:
                    sections.append({"heading": "术语词典", "level": 2, "body": '\n\n'.join(body_parts)})

        for key in ['faq', 'faq_items', 'questions']:
            if key in data and isinstance(data[key], list):
                body_parts = []
                for item in data[key]:
                    q = item.get('question', item.get('q', ''))
                    a = item.get('answer', item.get('a', ''))
                    if q:
                        body_parts.append(f"**{q}**\n\n{a}")
                if body_parts:
                    sections.append({"heading": "常见问题", "level": 2, "body": '\n\n'.join(body_parts)})

    return sections, title, subtitle


def parse_faq_md(text):
    """Parse FAQ markdown into Q&A pairs."""
    pairs = []
    current_q = ""
    current_a = []

    for line in text.split('\n'):
        m = re.match(r'^#{1,3}\s+(.+)$', line)
        if m:
            heading = m.group(1).strip()
            if heading.lower() in ['faq', '常见问题', 'frequently asked questions']:
                continue
            if current_q:
                pairs.append((current_q, '\n'.join(current_a).strip()))
            current_q = heading
            current_a = []
        elif current_q:
            current_a.append(line)

    if current_q:
        pairs.append((current_q, '\n'.join(current_a).strip()))

    return pairs


def parse_glossary_md(text):
    """Parse glossary markdown into term definitions."""
    terms = []
    current_term = ""
    current_def = []
    current_analogy = ""

    for line in text.split('\n'):
        m = re.match(r'^#{1,3}\s+(.+)$', line)
        if m:
            heading = m.group(1).strip()
            if heading.lower() in ['术语小词典', '术语表', 'glossary', '术语词典']:
                continue
            if current_term:
                terms.append((current_term, '\n'.join(current_def).strip(), current_analogy))
            current_term = heading
            current_def = []
            current_analogy = ""
        elif line.strip().startswith('类比：') or line.strip().startswith('比喻：'):
            current_analogy = line.strip().split('：', 1)[1].strip() if '：' in line else line.strip()
        elif current_term:
            current_def.append(line)

    if current_term:
        terms.append((current_term, '\n'.join(current_def).strip(), current_analogy))

    return terms


# ── HTML Template ────────────────────────────────────────

def generate_page(pkg_name, title, subtitle, sections, images, faq_pairs, glossary_terms, has_sub=False):
    """Generate the complete HTML page."""

    # Build image gallery HTML
    images_html = ""
    if images:
        cards = []
        for img in images[:12]:  # Limit to 12 images
            fname = os.path.basename(img)
            alt = fname.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ')
            cards.append(f'''
        <div class="visual-card">
          <img src="visuals/{fname}" alt="{alt}" loading="lazy">
          <div class="visual-card-body">
            <p>{alt}</p>
          </div>
        </div>''')
        images_html = f'''
    <div class="section-label reveal">图表资料</div>
    <h2 class="reveal" style="margin-top:0.5rem;">研究图表</h2>
    <div class="feature-grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));">
      {"".join(cards)}
    </div>'''

    # Build sections HTML
    sections_html = ""
    for i, s in enumerate(sections):
        if not s["heading"] or s["heading"] == title:
            continue
        if s["heading"].lower() in ['术语小词典', '术语表', 'glossary', 'faq', '常见问题']:
            continue

        bg = 'background:var(--surface);' if i % 2 == 0 else ''
        body_html = md_to_html(s["body"])

        # Insert relevant images inline
        section_img = ""
        if images and i < len(images):
            img_file = os.path.basename(images[min(i, len(images)-1)])
            section_img = f'''
      <div class="figure reveal" style="margin-top:1.5rem;">
        <img src="visuals/{img_file}" alt="{s['heading']}" loading="lazy">
      </div>'''

        sections_html += f'''
<section class="section" style="{bg}">
  <div class="container">
    <h2 class="reveal">{s["heading"]}</h2>
    <div class="reveal">{body_html}</div>
    {section_img if i < 3 and images else ""}
  </div>
</section>'''

    # FAQ HTML
    faq_html = ""
    if faq_pairs:
        faq_items = ""
        for q, a in faq_pairs:
            a_html = md_to_html(a)
            faq_items += f'''
      <div class="faq-item reveal">
        <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">
          {q}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="faq-a">{a_html}</div>
      </div>'''
        faq_html = f'''
<section class="section" id="faq">
  <div class="container">
    <div class="section-label reveal">常见问题</div>
    <h2 class="reveal" style="margin-top:0.5rem;">FAQ</h2>
    {faq_items}
  </div>
</section>'''

    # Glossary HTML
    glossary_html = ""
    if glossary_terms:
        g_items = ""
        for term, defn, analogy in glossary_terms:
            analogy_html = f'<div class="glossary-analogy">{analogy}</div>' if analogy else ''
            defn_clean = defn.split('\n')[0].strip() if defn else ''
            g_items += f'''
      <div class="glossary-item reveal">
        <div class="glossary-term">{term}</div>
        <div class="glossary-def">{defn_clean}</div>
        {analogy_html}
      </div>'''
        glossary_html = f'''
<section class="section" style="background:var(--surface);" id="glossary">
  <div class="container">
    <div class="section-label reveal">术语词典</div>
    <h2 class="reveal" style="margin-top:0.5rem;">核心术语</h2>
    {g_items}
  </div>
</section>'''

    # Images section
    images_section = ""
    if images_html:
        images_section = f'''
<section class="section" style="background:var(--surface);">
  <div class="container">
    {images_html}
  </div>
</section>'''

    subtitle_html = f'<p class="hero-subtitle">{subtitle}</p>' if subtitle else ''

    return f'''<!doctype html>
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
    {subtitle_html}
  </div>
</section>

{sections_html}
{images_section}
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


# ── Main Processing ──────────────────────────────────────

def process_package(pkg_name):
    """Process a single package."""
    print(f"\n{'='*60}")
    print(f"Processing: {pkg_name}")

    root = find_pkg_root(pkg_name)
    print(f"  Root: {root}")

    content_path, faq_path, glossary_path = find_content_files(root)
    images = find_images(root)

    print(f"  Content: {content_path}")
    print(f"  FAQ: {faq_path}")
    print(f"  Glossary: {glossary_path}")
    print(f"  Images: {len(images)}")

    if not content_path:
        print(f"  ⚠️  No content found, skipping")
        return False

    # Parse content
    sections = []
    title = ""
    subtitle = ""

    if content_path.suffix == '.md':
        text = read_file(content_path)
        sections = parse_md_sections(text)
        title, subtitle = extract_title_subtitle(sections)
    elif content_path.suffix == '.json':
        sections, title, subtitle = extract_json_content(content_path)

    if not title:
        title = pkg_name.replace('_', ' ').replace('-', ' ').title()

    print(f"  Title: {title}")
    print(f"  Sections: {len(sections)}")

    # Parse FAQ
    faq_pairs = []
    if faq_path:
        faq_text = read_file(faq_path)
        if faq_path.suffix == '.md':
            faq_pairs = parse_faq_md(faq_text)
            # If combined glossary_faq file, also check for glossary
            if 'glossary' in faq_path.name.lower() and not glossary_path:
                # Split: sections before "FAQ" are glossary, after are FAQ
                pass
        elif faq_path.suffix == '.json':
            try:
                faq_data = json.loads(faq_text)
                if isinstance(faq_data, dict):
                    for key in ['faq', 'faq_items', 'questions']:
                        if key in faq_data:
                            for item in faq_data[key]:
                                q = item.get('question', item.get('q', ''))
                                a = item.get('answer', item.get('a', ''))
                                if q:
                                    faq_pairs.append((q, a))
            except:
                pass

    # Parse glossary
    glossary_terms = []
    if glossary_path:
        g_text = read_file(glossary_path)
        if glossary_path.suffix == '.md':
            glossary_terms = parse_glossary_md(g_text)

    # Destination
    dest = DEST_ROOT / pkg_name
    dest.mkdir(parents=True, exist_ok=True)
    vis_dest = dest / "visuals"
    vis_dest.mkdir(exist_ok=True)

    # Copy images
    copied_images = []
    for img in images[:12]:
        fname = img.name
        # Avoid duplicates
        if fname in [os.path.basename(x) for x in copied_images]:
            continue
        shutil.copy2(img, vis_dest / fname)
        copied_images.append(str(img))

    print(f"  Copied {len(copied_images)} images")

    # Generate HTML
    html = generate_page(
        pkg_name, title, subtitle, sections,
        copied_images, faq_pairs, glossary_terms
    )

    # Write index.html
    (dest / "index.html").write_text(html, encoding='utf-8')
    print(f"  ✅ Generated index.html")

    return True


def main():
    # Find all packages
    packages = []
    for d in sorted(SRC_ROOT.iterdir()):
        if d.is_dir() and d.name not in SKIP and not d.name.startswith('.'):
            packages.append(d.name)

    print(f"Found {len(packages)} packages to process")

    success = 0
    failed = []

    for pkg in packages:
        try:
            if process_package(pkg):
                success += 1
            else:
                failed.append(pkg)
        except Exception as e:
            print(f"  ❌ Error: {e}")
            failed.append(pkg)

    print(f"\n{'='*60}")
    print(f"Done: {success} succeeded, {len(failed)} failed")
    if failed:
        print(f"Failed: {', '.join(failed)}")


if __name__ == '__main__':
    main()
