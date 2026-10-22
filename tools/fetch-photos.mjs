/**
 * Downloads openly licensed cannabis photographs from Wikimedia Commons
 * and writes assets/js/photo-library.js. Only CC0, public domain, CC BY
 * and CC BY-SA files are kept, and each one is credited in that catalog.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'assets', 'images', 'library');
const catalogPath = path.join(root, 'assets', 'js', 'photo-library.js');
const UA = 'GanjaGuardian/1.0 (educational static strain guide; local project)';
const API = 'https://commons.wikimedia.org/w/api.php';
const MAX_FILES = 1600;

const START_CATEGORIES = [
  'Category:Cannabis by strain',
  'Category:Cannabis (seedlings)',
  'Category:Cannabis buds',
  'Category:Cannabis plants',
  'Category:Cannabis cultivation',
  'Category:Cannabis leaves',
  'Category:Cannabis textures'
];

const SKIP_CATEGORY = /illustration|in art|law|media|religion|organization|vending|polling|statistic|history of|culture|by country|by continent|by sex|cannabinoid|wiki ?project|video|herbarium|consumption|munchie|grow shop|textile|paper|plastic|concrete|fibre|fiber|food|oil|product|flag|map|coat of arms|research$/i;

const SKIP_TITLE = /logo|icon\b|flag\b|\bmap\b|diagram|illustration|drawing|painting|poster|cartoon|coat of arms|\bgraph\b|\bchart\b|molecule|structural formula|ballot|election|protest|rally|parliament|emblem|\bseal\b|\bstamp\b|banknote|\bcoin\b|\.svg|screenshot|meme|emoji|newspaper|document scan|coat of|herald|raid|eradication|maze|labyrinth|wikibook|historical district|confiscat|seized|police|sheriff|in art/i;

const SKIP_SUBJECT = /mite|mold\b|mould|mildew|\brot\b|botrytis|deficiency|nutrient burn|light burn|\bdisease\b|\bpest\b|aphid|fungus|\bwilt\b|herbarium|\bjoint\b|\bbong\b|smoking|cigarette|edible|brownie/;

const GENERIC = new Set([
  'white', 'royal', 'haze', 'kush', 'skunk', 'diesel', 'cheese', 'elephant', 'cbd',
  'gelato', 'sherbet', 'sherbert', 'cookie', 'cookies', 'cake', 'cream', 'dream',
  'widow', 'purple', 'blue', 'green', 'gold', 'black', 'sour', 'sweet', 'super',
  'og', 'ice', 'snow', 'bud', 'power', 'plant', 'early', 'master', 'pure', 'big',
  'critical', 'original', 'special', 'ultra', 'lemon', 'orange', 'banana', 'apple',
  'mango', 'cherry', 'berry', 'honey', 'vanilla', 'chocolate', 'pineapple',
  'strawberry', 'watermelon', 'silver', 'platinum', 'diamond', 'crystal', 'ak'
]);

function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

async function api(params) {
  const url = new URL(API);
  Object.entries(params).forEach(function (entry) {
    url.searchParams.set(entry[0], entry[1]);
  });
  url.searchParams.set('format', 'json');
  url.searchParams.set('maxlag', '5');
  let lastError = null;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
    if (response.status === 429 || response.status >= 500) {
      const retryAfter = Number(response.headers.get('retry-after'));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 8000 * (attempt + 1);
      console.log('Commons asked us to slow down. Waiting ' + Math.round(wait / 1000) + 's.');
      await sleep(wait);
      lastError = new Error('HTTP ' + response.status);
      continue;
    }
    const data = await response.json();
    if (data.error && data.error.code === 'maxlag') {
      await sleep(2000);
      lastError = new Error('maxlag');
      continue;
    }
    if (data.error) {
      throw new Error(data.error.code + ': ' + data.error.info);
    }
    return data;
  }
  throw lastError || new Error('API failed');
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function norm(value) {
  return stripHtml(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function licenseOk(name) {
  const n = String(name || '').toLowerCase();
  if (!n) return false;
  if (/non-?commercial|\bnc\b/.test(n)) return false;
  if (/noderiv|no deriv|\bnd\b/.test(n)) return false;
  if (n.includes('public domain') || n === 'pd' || n.includes('cc0') || n.includes('no restrictions') || n.includes('no known copyright')) return true;
  if (n.includes('cc by')) return true;
  return false;
}

function loadStrains() {
  const extra = fs.readFileSync(path.join(root, 'assets', 'js', 'strains-extra.js'), 'utf8');
  const data = fs.readFileSync(path.join(root, 'assets', 'js', 'data.js'), 'utf8');
  const strains = [];
  const seen = new Set();
  function add(name, slug) {
    const key = norm(name);
    if (!key || seen.has(slug)) return;
    const tokens = key.split(' ').filter(Boolean);
    if (tokens.length < 2 && (key.length < 6 || GENERIC.has(key))) return;
    if (key.length < 5) return;
    seen.add(slug);
    strains.push({ slug: slug, name: name, norm: key, tokens: tokens });
  }
  const extraRe = /"n":"((?:\\.|[^"\\])*)","s":"([^"]+)"/g;
  let match;
  while ((match = extraRe.exec(extra))) {
    add(match[1].replace(/\\"/g, '"'), match[2]);
  }
  const handRe = /slug:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)'/g;
  while ((match = handRe.exec(data))) {
    add(match[2], match[1]);
  }
  strains.sort(function (a, b) {
    return b.norm.length - a.norm.length;
  });
  return strains;
}

function knownSourceUrls() {
  const blobs = [
    fs.readFileSync(path.join(root, 'assets', 'js', 'data.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'credits.html'), 'utf8')
  ];
  const urls = new Set();
  blobs.forEach(function (blob) {
    const re = /https:\/\/commons\.wikimedia\.org\/wiki\/File:[^"'\s)]+/g;
    let match;
    while ((match = re.exec(blob))) urls.add(decodeURIComponent(match[0]));
  });
  return urls;
}

function catLabel(title) {
  return title
    .replace(/^Category:/, '')
    .replace(/\s*\([^)]*\)/g, ' ')
    .replace(/\b(cannabis|marijuana|strain|strains)\b/ig, ' ');
}

async function collectCategories() {
  const files = new Map();
  const seenCats = new Set();
  const queue = START_CATEGORIES.map(function (title) {
    return { title: title, depth: 0 };
  });

  while (queue.length) {
    const current = queue.shift();
    if (seenCats.has(current.title)) continue;
    seenCats.add(current.title);
    console.log('Category ' + current.title + ' (' + files.size + ' files so far)');
    if (current.depth > 0 && (SKIP_CATEGORY.test(current.title) || SKIP_TITLE.test(current.title))) continue;
    let cont;
    do {
      const params = {
        action: 'query',
        list: 'categorymembers',
        cmtitle: current.title,
        cmlimit: '500'
      };
      if (cont) params.cmcontinue = cont;
      const data = await api(params);
      const members = (data.query && data.query.categorymembers) || [];
      members.forEach(function (member) {
        if (member.ns === 14) {
          queue.push({ title: member.title, depth: current.depth + 1 });
          return;
        }
        if (member.ns !== 6) return;
        if (!files.has(member.title)) files.set(member.title, new Set());
        files.get(member.title).add(current.title);
      });
      cont = data.continue && data.continue.cmcontinue;
      await sleep(700);
    } while (cont);
    if (files.size > 5000) break;
  }
  return files;
}

async function collectSearch(files) {
  const queries = [
    'cannabis bud filemime:image/jpeg',
    'cannabis flower filemime:image/jpeg',
    'cannabis plant filemime:image/jpeg',
    'cannabis seedling filemime:image/jpeg',
    'cannabis drying filemime:image/jpeg',
    'hemp plant filemime:image/jpeg',
    'marijuana flower filemime:image/jpeg'
  ];
  for (const query of queries) {
    let offset = 0;
    while (offset < 300) {
      const data = await api({
        action: 'query',
        list: 'search',
        srsearch: query,
        srnamespace: '6',
        srlimit: '50',
        sroffset: String(offset)
      });
      const hits = (data.query && data.query.search) || [];
      if (!hits.length) break;
      hits.forEach(function (hit) {
        if (!files.has(hit.title)) files.set(hit.title, new Set());
      });
      if (!data.continue) break;
      offset += 50;
      await sleep(700);
    }
  }
}

function matchStrains(strains, title, categories) {
  const labels = Array.from(categories).map(catLabel).join(' ');
  const hay = ' ' + norm(title.replace(/^File:/, '') + ' ' + labels) + ' ';
  const hits = [];
  for (const strain of strains) {
    const needle = ' ' + strain.norm + ' ';
    const at = hay.indexOf(needle);
    if (at === -1) continue;
    const start = at;
    const end = at + needle.length;
    if (hits.some(function (hit) { return !(end <= hit.start || start >= hit.end); })) continue;
    hits.push({ slug: strain.slug, start: start, end: end });
    if (hits.length === 3) break;
  }
  return hits.map(function (hit) { return hit.slug; });
}

function detectStage(title, categories) {
  const text = norm(title + ' ' + Array.from(categories).join(' '));
  if (SKIP_SUBJECT.test(text)) return null;
  if (/seedling|sprout|cotyledon|germinat/.test(text)) return 'seedling';
  if (/trichome|macro|close up|closeup|microscop/.test(text)) return 'detail';
  if (/drying|dry room|hung to dry|hanging to dry|harvest/.test(text)) return 'harvest';
  if (/dried|cured|trimmed|nug\b|bud/.test(text)) return 'dried';
  if (/flowering|bloom|in flower|cola/.test(text)) return 'flowering';
  if (/vegetative|young plant|vegging/.test(text)) return 'vegetative';
  if (/flower|floret/.test(text)) return 'flowering';
  if (/leaf|leaves|foliage/.test(text)) return 'vegetative';
  if (/seed\b|seeds\b/.test(text)) return null;
  if (/plant|garden|outdoor|indoor|grow/.test(text)) return 'flowering';
  return 'dried';
}

const STAGE_LABEL = {
  seedling: 'Seedling',
  vegetative: 'Vegetative',
  flowering: 'Flowering',
  harvest: 'Harvest & dry',
  dried: 'Dried flower',
  detail: 'Close-up'
};

async function imageInfo(titles) {
  const data = await api({
    action: 'query',
    prop: 'imageinfo',
    titles: titles.join('|'),
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '960',
    iiextmetadatafilter: 'LicenseShortName|Artist|LicenseUrl|ImageDescription|ObjectName'
  });
  const pages = (data.query && data.query.pages) || {};
  return Object.values(pages);
}

async function download(url, dest) {
  let lastError = null;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) });
    if (response.status === 429 || response.status >= 500) {
      const retryAfter = Number(response.headers.get('retry-after'));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 4000 * (attempt + 1);
      await sleep(wait);
      lastError = new Error('HTTP ' + response.status);
      continue;
    }
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const type = response.headers.get('content-type') || '';
    if (!type.startsWith('image/')) throw new Error('not an image');
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 12000 || buffer.length > 2500000) throw new Error('bad size ' + buffer.length);
    fs.writeFileSync(dest, buffer);
    return buffer.length;
  }
  throw lastError || new Error('download failed');
}

function extFor(mime, url) {
  if (mime.includes('png') || /\.png($|\?)/i.test(url)) return 'png';
  if (mime.includes('webp') || /\.webp($|\?)/i.test(url)) return 'webp';
  return 'jpg';
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  console.log('Loading strain names...');
  const strains = loadStrains();
  const known = knownSourceUrls();
  console.log('Strain names that can be matched: ' + strains.length);

  console.log('Walking Commons categories...');
  const files = await collectCategories();
  console.log('Category files: ' + files.size);
  console.log('Searching Commons...');
  await collectSearch(files);
  console.log('Unique files: ' + files.size);

  const titles = Array.from(files.keys());
  const kept = [];
  for (let i = 0; i < titles.length; i += 40) {
    const batch = titles.slice(i, i + 40);
    let pages = [];
    try {
      pages = await imageInfo(batch);
    } catch (error) {
      console.log('info batch failed: ' + error.message);
      await sleep(1500);
      continue;
    }
    pages.forEach(function (page) {
      if (!page || !page.imageinfo || !page.imageinfo[0]) return;
      const info = page.imageinfo[0];
      const meta = info.extmetadata || {};
      const license = stripHtml(meta.LicenseShortName && meta.LicenseShortName.value);
      if (!licenseOk(license)) return;
      const mime = info.mime || '';
      if (!/jpeg|png|webp/.test(mime)) return;
      const width = info.thumbwidth || info.width || 0;
      if (width < 480) return;
      const title = page.title || '';
      if (SKIP_TITLE.test(title)) return;
      const sourceUrl = 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(title).replace(/%3A/g, ':').replace(/%2F/g, '/');
      const plainSource = 'https://commons.wikimedia.org/wiki/' + title.replace(/ /g, '_');
      if (known.has(plainSource) || known.has(sourceUrl)) return;
      const categories = files.get(title) || new Set();
      const categoryText = Array.from(categories).join(' ');
      if (SKIP_TITLE.test(categoryText)) return;
      if (!/cannabis|hemp|marijuana|ganja|sativa|indica|kush|trichome/i.test(title + ' ' + categoryText)) return;
      const stage = detectStage(title, categories);
      if (!stage) return;
      const description = stripHtml(meta.ImageDescription && meta.ImageDescription.value);
      const objectName = stripHtml(meta.ObjectName && meta.ObjectName.value);
      let alt = objectName || description || title.replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '').replace(/_/g, ' ');
      alt = alt.replace(/\s+/g, ' ').trim();
      if (alt.length > 160) alt = alt.slice(0, 157).replace(/\s+\S*$/, '') + '...';
      if (SKIP_TITLE.test(alt) || SKIP_SUBJECT.test(norm(alt))) return;
      let author = stripHtml(meta.Artist && meta.Artist.value);
      author = author.replace(/^(author|photographer)\s*:\s*/i, '').trim();
      if (!author || author.length > 80) author = author ? author.slice(0, 80).trim() : 'Wikimedia Commons contributor';
      const matched = matchStrains(strains, title + ' ' + objectName, categories);
      kept.push({
        title: title,
        url: info.thumburl || info.url,
        mime: mime,
        alt: alt,
        author: author,
        license: license,
        licenseUrl: stripHtml(meta.LicenseUrl && meta.LicenseUrl.value),
        sourceUrl: plainSource,
        stage: stage,
        stageLabel: STAGE_LABEL[stage],
        strains: matched
      });
    });
    if (i % 200 === 0) console.log('Checked ' + Math.min(i + 40, titles.length) + ' / ' + titles.length + ', kept ' + kept.length);
    await sleep(500);
  }

  kept.sort(function (a, b) {
    if (b.strains.length !== a.strains.length) return b.strains.length - a.strains.length;
    return a.title.localeCompare(b.title);
  });
  const namedItems = kept.filter(function (item) { return item.strains.length; });
  const perStage = { seedling: [], vegetative: [], flowering: [], harvest: [], dried: [], detail: [] };
  kept.forEach(function (item) {
    if (item.strains.length) return;
    if (perStage[item.stage]) perStage[item.stage].push(item);
  });
  let selected = namedItems.slice();
  Object.keys(perStage).forEach(function (stage) {
    selected = selected.concat(perStage[stage].slice(0, 120));
  });
  const named = namedItems.length;
  console.log('Downloading ' + selected.length + ' photos (' + named + ' named strains)...');

  const records = [];
  let index = 0;
  for (const item of selected) {
    index += 1;
    const ext = extFor(item.mime, item.url);
    const file = String(index).padStart(4, '0') + '.' + ext;
    const dest = path.join(outDir, file);
    try {
      await download(item.url, dest);
      records.push({
        src: 'assets/images/library/' + file,
        alt: item.alt,
        author: item.author,
        license: item.license,
        licenseUrl: item.licenseUrl,
        sourceUrl: item.sourceUrl,
        stage: item.stage,
        stageLabel: item.stageLabel,
        strains: item.strains
      });
      if (records.length % 25 === 0) console.log('Saved ' + records.length);
    } catch (error) {
      console.log('skip ' + item.title + ' (' + error.message + ')');
    }
    await sleep(1100);
  }

  const matched = records.filter(function (record) { return record.strains.length; }).length;
  const body = '(function () {\n  \'use strict\';\n  var GG = (window.GG = window.GG || {});\n  GG.PHOTO_LIBRARY = ' +
    JSON.stringify(records) + ';\n})();\n';
  fs.writeFileSync(catalogPath, body);
  const stages = {};
  records.forEach(function (record) {
    stages[record.stage] = (stages[record.stage] || 0) + 1;
  });
  console.log('Done. Photos: ' + records.length + ', named strains: ' + matched);
  console.log(JSON.stringify(stages));
}

main().catch(function (error) {
  console.error(error);
  process.exit(1);
});
