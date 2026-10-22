/**
 * Adds openly licensed Commons photos for listed strains.
 * A file is kept only when its category or its file name is that cultivar.
 * New files go in photos2, photos3, ... with at most 99 images in each folder.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = path.join(root, 'assets', 'js', 'photo-library.js');
const UA = 'GanjaGuardian/1.0 (educational static strain guide; local project)';
const API = 'https://commons.wikimedia.org/w/api.php';
const FOLDER_CAP = 99;
const PER_STRAIN_CAP = 6;

const SKIP_FILE = /logo|icon\b|flag\b|diagram|illustration|drawing|painting|poster|cartoon|tin\b|jar\b|bottle|label|box\b|sticker|ointment|capsule|packet|therapy|product|seed pack|raid|maze|seal\b|pool|piscina|beach|hotel|grinder|paraphernalia|hashish|edible|brownie|dispensary|menu|ice cream|buganda|statue|wedding reception|\bmap\b|selection of|edibles/i;
const FAMILY = new Set(['kush', 'haze', 'skunk', 'diesel', 'og', 'cookies', 'cake', 'widow']);
const ALIASES = new Map([
  ['g 13', 'g13'],
  ['god s gift', 'gods gift'],
  ['new york city diesel', 'nyc diesel']
]);
const PLANT_CUE = /cannabis|marijuana|marihuana|ganja|\bweed\b|\bstrain\b|\bbud\b|\bbuds\b|flower|bloom|trichome|cola|sativa|indica|plant/;
const EXTRA_WORDS = new Set(['photo', 'image', 'pic', 'close', 'up', 'macro', 'dub', 'female', 'male', 'plant', 'plants', 'flower', 'flowers', 'bud', 'buds', 'cola', 'bloom', 'blooming', 'day', 'days', 'week', 'weeks', 'grown', 'grow', 'by', 'variety', 'variedad', 'de', 'di', 'of', 'the', 'a', 'an', 'and', 'with', 'in', 'on', 'cut', 'dried', 'dry', 'fresh', 'harvested', 'young', 'leaf', 'leaves', 'trichome', 'trichomes', 'marijuana', 'cannabis', 'marihuana', 'strain', 'strains', 'sativa', 'indica', 'hybrid', 'medical', 'flos', 'gram', 'numero', 'no']);

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
    const text = await response.text();
    if (response.status === 429 || response.status >= 500 || !text.startsWith('{')) {
      const wait = 5000 * (attempt + 1);
      console.log('Waiting ' + Math.round(wait / 1000) + 's');
      await sleep(wait);
      lastError = new Error('HTTP ' + response.status);
      continue;
    }
    const data = JSON.parse(text);
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
    byName.set(norm(match[1].replace(/\\"/g, '"')), match[2]);
  }
  const hand = /slug:\s*'([^']+)',\s*\r?\n\s*name:\s*'([^']+)'/g;
  while ((match = hand.exec(data))) byName.set(norm(match[2]), match[1]);
  FAMILY.forEach(function (name) { byName.delete(name); });
  return byName;
}

function lookup(label, byName) {
  if (!label || FAMILY.has(label)) return '';
  if (byName.has(label)) return byName.get(label);
  const alias = ALIASES.get(label);
  if (alias && byName.has(alias)) return byName.get(alias);
  return '';
}

function loadCatalog() {
  const text = fs.readFileSync(catalogPath, 'utf8');
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  const records = JSON.parse(text.slice(start, end + 1));
  const known = new Set(records.map(function (record) { return record.sourceUrl; }));
  [path.join(root, 'assets', 'js', 'data.js'), path.join(root, 'credits.html')].forEach(function (file) {
    const blob = fs.readFileSync(file, 'utf8');
    const re = /https:\/\/commons\.wikimedia\.org\/wiki\/File:[^"'\s)]+/g;
    let found;
    while ((found = re.exec(blob))) known.add(found[0]);
  });
  const counts = {};
  records.forEach(function (record) {
    const slug = record.strains && record.strains[0];
    if (slug) counts[slug] = (counts[slug] || 0) + 1;
  });
  return { text: text, start: start, end: end, records: records, known: known, counts: counts };
}

function catLabel(title) {
  return norm(title.replace(/^Category:/, '').replace(/\s*\([^)]*\)/g, ' '));
}

function fileLabel(title) {
  return norm(title.replace(/^File:/, '').replace(/\bgrown by\b.*$/, ' ').replace(/\.[a-z0-9]+$/i, ''));
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

function titleSlug(title, names) {
  const label = fileLabel(title);
  if (!PLANT_CUE.test(label) || SKIP_FILE.test(title)) return '';
  let best = '';
  let slug = '';
  for (const entry of names) {
    if (entry[0].length <= best.length) continue;
    if ((' ' + label + ' ').includes(' ' + entry[0] + ' ')) {
      best = entry[0];
      slug = entry[1];
    }
  }
  if (!slug) return '';
  const leftover = label.replace(best, ' ').split(' ').filter(function (word) {
    return word && !EXTRA_WORDS.has(word) && !/^\d+$/.test(word);
  });
  if (leftover.length) return '';
  return slug;
}

function writeCatalog(text, start, end, records) {
  fs.writeFileSync(catalogPath, text.slice(0, start) + JSON.stringify(records) + text.slice(end + 1));
}

async function main() {
  const byName = loadStrains();
  const names = Array.from(byName.entries()).sort(function (a, b) { return b[0].length - a[0].length; });
  const catalog = loadCatalog();
  const files = new Map();

  const categories = ['Category:Cannabis by strain'];
  const seenCats = new Set();
  while (categories.length) {
    const title = categories.shift();
    if (seenCats.has(title)) continue;
    seenCats.add(title);
    if (/unidentified|in art|raid|maze|^Category:Kush$/.test(title)) continue;
    let cont;
    do {
      const params = { action: 'query', list: 'categorymembers', cmtitle: title, cmlimit: '500', cmtype: 'file|subcat' };
      if (cont) params.cmcontinue = cont;
      const data = await api(params);
      ((data.query && data.query.categorymembers) || []).forEach(function (member) {
        if (member.ns === 14) categories.push(member.title);
        if (member.ns === 6) {
          if (!files.has(member.title)) files.set(member.title, new Set());
          files.get(member.title).add(title);
        }
      });
      cont = data.continue && data.continue.cmcontinue;
      await sleep(700);
    } while (cont);
    console.log(title + ' (' + files.size + ' files)');
  }

  const searches = [
    'filetype:bitmap "cannabis strain"',
    'filetype:bitmap "variedad de cannabis"',
    'filetype:bitmap "marijuana strain"'
  ];
  for (const search of searches) {
    let offset = 0;
    while (offset !== null && offset < 500) {
      const data = await api({
        action: 'query',
        list: 'search',
        srnamespace: '6',
        srlimit: '50',
        sroffset: String(offset),
        srsearch: search
      });
      const hits = (data.query && data.query.search) || [];
      hits.forEach(function (hit) {
        if (!files.has(hit.title)) files.set(hit.title, new Set());
      });
      console.log(search + ' +' + hits.length);
      offset = data.continue && data.continue.sroffset ? Number(data.continue.sroffset) : null;
      await sleep(1200);
      if (!hits.length) break;
    }
  }

  const titles = Array.from(files.keys());
  const chosen = [];
  for (let i = 0; i < titles.length; i += 20) {
    const data = await api({
      action: 'query',
      prop: 'imageinfo',
      titles: titles.slice(i, i + 20).join('|'),
      iiprop: 'url|mime|size|extmetadata',
      iiurlwidth: '960',
      iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist'
    });
    Object.values((data.query && data.query.pages) || {}).forEach(function (page) {
      const info = page.imageinfo && page.imageinfo[0];
      if (!info) return;
      const meta = info.extmetadata || {};
      const license = stripHtml(meta.LicenseShortName && meta.LicenseShortName.value);
      const title = page.title || '';
      if (!licenseOk(license) || !/jpeg|png|webp/.test(info.mime || '') || SKIP_FILE.test(title)) return;
      const sourceUrl = 'https://commons.wikimedia.org/wiki/' + title.replace(/ /g, '_');
      if (catalog.known.has(sourceUrl)) return;
      const labels = Array.from(files.get(title) || []).map(catLabel).filter(Boolean);
      let slug = '';
      let best = '';
      labels.forEach(function (label) {
        const hit = lookup(label, byName);
        if (hit && label.length > best.length) {
          slug = hit;
          best = label;
        }
      });
      const named = fileLabel(title);
      const categoryProvesIt = slug && (lookup(named, byName) === slug || named.includes(best) || PLANT_CUE.test(named));
      if (!categoryProvesIt) slug = titleSlug(title, names);
      if (!slug) return;
      if ((catalog.counts[slug] || 0) >= PER_STRAIN_CAP) return;
      let author = stripHtml(meta.Artist && meta.Artist.value).replace(/^(author|photographer)\s*:\s*/i, '');
      if (!author || author.length > 80) author = 'Wikimedia Commons contributor';
      const stage = stageFor(title);
      catalog.counts[slug] = (catalog.counts[slug] || 0) + 1;
      chosen.push({
        title: title,
        url: info.thumburl || info.url,
        mime: info.mime,
        slug: slug,
        number: catalog.counts[slug],
        alt: title.replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '').replace(/_/g, ' '),
        author: author,
        license: license,
        licenseUrl: stripHtml(meta.LicenseUrl && meta.LicenseUrl.value),
        sourceUrl: sourceUrl,
        stage: stage,
        stageLabel: STAGE_LABEL[stage]
      });
    });
    await sleep(800);
  }

  console.log('New matches ' + chosen.length);
  let savedCount = 0;
  for (const item of chosen) {
    const folderNumber = 2 + Math.floor(savedCount / FOLDER_CAP);
    const folder = 'photos' + folderNumber;
    const dir = path.join(root, folder);
    fs.mkdirSync(dir, { recursive: true });
    const ext = /png/i.test(item.mime) ? 'png' : /webp/i.test(item.mime) ? 'webp' : 'jpg';
    const file = item.slug + '-' + item.number + '.' + ext;
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
        fs.writeFileSync(path.join(dir, file), buf);
        saved = true;
      }
      if (!saved) throw new Error('not saved');
      catalog.records.push({
        src: folder + '/' + file,
        alt: item.alt,
        author: item.author,
        license: item.license,
        licenseUrl: item.licenseUrl || '',
        sourceUrl: item.sourceUrl,
        stage: item.stage,
        stageLabel: item.stageLabel,
        strains: [item.slug]
      });
      catalog.known.add(item.sourceUrl);
      savedCount += 1;
      writeCatalog(catalog.text, catalog.start, catalog.end, catalog.records);
      console.log('Saved ' + folder + '/' + file + '  ' + item.title);
    } catch (error) {
      catalog.counts[item.slug] -= 1;
      console.log('skip ' + item.title + ' (' + error.message + ')');
    }
    await sleep(700);
  }
  writeCatalog(catalog.text, catalog.start, catalog.end, catalog.records);
  console.log('Done. Added ' + savedCount + ' photos.');
}

main().catch(function (error) {
  console.error(error);
  process.exit(1);
});
