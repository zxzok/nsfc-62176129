/**
 * Placeholder JS for future interactive modules.
 * This package ships with JSON schemas and suggested data structures,
 * but does not implement full interactions out of the box.
 *
 * You can use these helpers as a starting point.
 */

async function loadJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return await res.json();
}

function byId(id) {
  return document.getElementById(id);
}

// Example: populate the "paper card" from data/site_content.json
(async () => {
  try {
    const site = await loadJSON("./data/site_content.json");
    const el = byId("json-download");
    if (el) {
      el.href = "./data/site_content.json";
      el.textContent = "下载结构化JSON（site_content.json）";
    }
  } catch (e) {
    // silent fail for offline preview
    console.warn(e);
  }
})();
