/**
 * Downloads openly licensed photos only when a Commons strain category
 * matches a cultivar in this guide. Packaging, raids and unnamed plants are skipped.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'assets', 'images', 'strains');
const catalogPath = path.join(root, 'assets', 'js', 'photo-library.js');
const UA = 'GanjaGuardian/1.0 (educational static strain guide; local project)';
const API = 'https://commons.wikimedia.org/w/api.php';

const SKIP_FILE = /logo|icon\b|flag\b|diagram|illustration|drawing|painting|poster|cartoon|tin\b|jar\b|bottle|label|logo|box\b|sticker|ointment|capsule|packet|therapy|product|seed pack|raid|maze|seal\b/i;
const FAMILY = new Set(['kush', 'haze', 'skunk', 'diesel', 'og', 'cookies', 'cake', 'widow']);

function sleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

function norm(value) {
  return String(value || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function licenseOk(name) {
  const n = String(name || '').toLowerCase();
  if (!n || /non-?commercial|\bnc\b|noderiv|\bnd\b/.test(n)) return false;
  return n.includes('public domain') || n === 'pd' || n.includes('cc0') || n.includes('no restrictions') || n.includes('no known copyright') || n.includes('cc by');
}

async function api(params) {
  const url = new URL(API);
  Object.entries(params).forEach(function (entry) { url.searchParams.set(entry[0], String(entry[1])); });
  url.searchParams.set('format', 'json');
  let lastError = null;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(25000) });
    if (response.status === 429 || response.status >= 500) {
      const retryAfter = Number(response.headers.get('retry-after'));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 5000 * (attempt + 1);
      console.log('Waiting ' + Math.round(wait / 1000) + 's');
      await sleep(wait);
      lastError = new Error('HTTP ' + response.status);
      continue;
    }
    const data = await response.json();
    if (data.error) throw new Error(data.error.info || data.error.code);
    return data;
  }
  throw lastError || new Error('API failed');
}

function loadStrains() {
  const extra = fs.readFileSync(path.join(root, 'assets', 'js', 'strains-extra.js'), 'utf8');
  const data = fs.readFileSync(path.join(root, 'assets', 'js', 'data.js'), 'utf8');
  const byName = new Map();
  const re = /"n":"((?:\\.|[^"\\])*)","s":"([^"]+)"/g;
  let match;
  while ((match = re.exec(extra))) {
    const name = match[1].replace(/\\"/g, '"');
    byName.set(norm(name), match[2]);
  }
  const hand = /slug:\s*'([^']+)',\s*\r?\n\s*name:\s*'([^']+)'/g;
  while ((match = hand.exec(data))) {
    byName.set(norm(match[2]), match[1]);
  }
  return byName;
}

function knownSources() {
  const blobs = [
    fs.readFileSync(path.join(root, 'assets', 'js', 'data.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'credits.html'), 'utf8')
  ];
  const urls = new Set();
  blobs.forEach(function (blob) {
    const re = /https:\/\/commons\.wikimedia\.org\/wiki\/File:[^"'\s)]+/g;
    let match;
    while ((match = re.exec(blob))) urls.add(match[0]);
  });
  return urls;
}

function catLabel(title) {
  return norm(title.replace(/^Category:/, '').replace(/\s*\([^)]*\)/g, ' '));
}

function stageFor(title) {
  const text = norm(title);
  if (/seedling|sprout|cotyledon/.test(text)) return 'seedling';
  if (/trichome|macro|close up/.test(text)) return 'detail';
  if (/drying|harvest|hung/.test(text)) return 'harvest';
  if (/bud|dried|cured|trimmed|nug/.test(text)) return 'dried';
  if (/flower|bloom|cola/.test(text)) return 'flowering';
  if (/leaf|vegetative|young/.test(text)) return 'vegetative';
  return 'flowering';
}

const STAGE_LABEL = {
  seedling: 'Seedling',
  vegetative: 'Vegetative',
  flowering: 'Flowering',
  harvest: 'Harvest & dry',
  dried: 'Dried flower',
  detail: 'Close-up'
};

function writeCatalog(records) {
  const body = '(function () {\n  \'use strict\';\n  var GG = (window.GG = window.GG || {});\n  GG.PHOTO_LIBRARY = ' +
    JSON.stringify(records) + ';\n})();\n';
  fs.writeFileSync(catalogPath, body);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.readdirSync(path.join(root, 'assets', 'images', 'library')).forEach(function (file) {
    if (/\.(jpe?g|png|webp)$/i.test(file)) {
      fs.unlinkSync(path.join(root, 'assets', 'images', 'library', file));
    }
  });
  const byName = loadStrains();
  const known = knownSources();
  const files = new Map();
  const seen = new Set();
  const queue = ['Category:Cannabis by strain'];
  while (queue.length) {
    const title = queue.shift();
    if (seen.has(title)) continue;
    seen.add(title);
    if (seen.size > 1 && /unidentified|in art|raid|maze/.test(title)) continue;
    let cont;
    do {
      const params = { action: 'query', list: 'categorymembers', cmtitle: title, cmlimit: '500' };
      if (cont) params.cmcontinue = cont;
      const data = await api(params);
      ((data.query && data.query.categorymembers) || []).forEach(function (member) {
        if (member.ns === 14) queue.push(member.title);
        if (member.ns === 6) {
          if (!files.has(member.title)) files.set(member.title, new Set());
          files.get(member.title).add(title);
        }
      });
      cont = data.continue && data.continue.cmcontinue;
      await sleep(600);
    } while (cont);
    console.log(title + ' (' + files.size + ' files)');
  }

  const titles = Array.from(files.keys());
  const chosen = [];
  for (let i = 0; i < titles.length; i += 40) {
    const data = await api({
      action: 'query',
      prop: 'imageinfo',
      titles: titles.slice(i, i + 40).join('|'),
      iiprop: 'url|mime|size|extmetadata',
      iiurlwidth: '960',
      iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|ImageDescription'
    });
    Object.values((data.query && data.query.pages) || {}).forEach(function (page) {
      const info = page.imageinfo && page.imageinfo[0];
      if (!info) return;
      const meta = info.extmetadata || {};
      const license = stripHtml(meta.LicenseShortName && meta.LicenseShortName.value);
      if (!licenseOk(license)) return;
      if (!/jpeg|png|webp/.test(info.mime || '')) return;
      const title = page.title || '';
      if (SKIP_FILE.test(title)) return;
      const sourceUrl = 'https://commons.wikimedia.org/wiki/' + title.replace(/ /g, '_');
      if (known.has(sourceUrl)) return;
      const labels = Array.from(files.get(title) || []).map(catLabel).filter(Boolean);
      let slug = '';
      let best = '';
      labels.forEach(function (label) {
        if (FAMILY.has(label)) return;
        const hit = byName.get(label);
        if (hit && label.length > best.length) {
          slug = hit;
          best = label;
        }
      });
      if (!slug) return;
      let author = stripHtml(meta.Artist && meta.Artist.value).replace(/^(author|photographer)\s*:\s*/i, '');
      if (!author || author.length > 80) author = 'Wikimedia Commons contributor';
      const stage = stageFor(title);
      chosen.push({
        title: title,
        url: info.thumburl || info.url,
        mime: info.mime,
        slug: slug,
        alt: title.replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '').replace(/_/g, ' '),
        author: author,
        license: license,
        licenseUrl: stripHtml(meta.LicenseUrl && meta.LicenseUrl.value),
        sourceUrl: sourceUrl,
        stage: stage,
        stageLabel: STAGE_LABEL[stage]
      });
    });
    await sleep(500);
  }

  console.log('Matched ' + chosen.length + ' strain photos');
  const records = [];
  const counts = {};
  for (const item of chosen) {
    counts[item.slug] = (counts[item.slug] || 0) + 1;
    const ext = /png/i.test(item.mime) ? 'png' : /webp/i.test(item.mime) ? 'webp' : 'jpg';
    const file = item.slug + '-' + counts[item.slug] + '.' + ext;
    const dest = path.join(outDir, file);
    try {
      let saved = false;
      for (let attempt = 0; attempt < 4 && !saved; attempt += 1) {
        const response = await fetch(item.url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) });
        if (response.status === 429) {
          await sleep(4000 * (attempt + 1));
          continue;
        }
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const buf = Buffer.from(await response.arrayBuffer());
        if (buf.length < 8000) throw new Error('too small');
        fs.writeFileSync(dest, buf);
        saved = true;
      }
      if (!saved) throw new Error('not saved');
      records.push({
        src: 'assets/images/strains/' + file,
        alt: item.alt,
        author: item.author,
        license: item.license,
        licenseUrl: item.licenseUrl || '',
        sourceUrl: item.sourceUrl,
        stage: item.stage,
        stageLabel: item.stageLabel,
        strains: [item.slug]
      });
      writeCatalog(records);
      console.log('Saved ' + file);
    } catch (error) {
      console.log('skip ' + item.title + ' (' + error.message + ')');
    }
    await sleep(900);
  }
  writeCatalog(records);
  console.log('Done. ' + records.length + ' photos for ' + Object.keys(counts).length + ' strains.');
}

main().catch(function (error) {
  console.error(error);
  process.exit(1);
});
