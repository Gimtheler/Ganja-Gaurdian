/**
 * Adds cultivar names from the CC BY 4.0 Cannabis Intelligence Database
 * that are not already in the local guide. Same display name is kept once.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const csvPath = process.env.TEMP + '/ci-strains.csv';
const extraPath = path.join(root, 'assets', 'js', 'strains-extra.js');
const dataPath = path.join(root, 'assets', 'js', 'data.js');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          q = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      q = true;
    } else if (c === ',') {
      row.push(cur);
      cur = '';
    } else if (c === '\n') {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = '';
    } else if (c !== '\r') {
      cur += c;
    }
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

function norm(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function squeeze(value) {
  return norm(value).replace(/ /g, '');
}

function slugify(value) {
  return norm(value).replace(/ /g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'strain';
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const EFFECT_RULES = [
  [/sleep|sedat|couch|insomn/, 'sleepy'],
  [/relax|calm|peace|chill/, 'relaxed'],
  [/hunger|munch|appetite/, 'hungry'],
  [/euphor/, 'euphoric'],
  [/happ|uplift|giggl|arous/, 'happy'],
  [/energ|focus|stimul|alert/, 'energetic'],
  [/creat|inspir/, 'creative'],
  [/dizz/, 'dizzy']
];

const FLAVOUR_RULES = [
  [/berr|grape|cherry/, 'berry'],
  [/citrus|lemon|orange|lime|tang/, 'citrus'],
  [/diesel|fuel|gas/, 'diesel'],
  [/pine\b|woody|wood\b|cedar/, 'pine'],
  [/mint|menthol/, 'mint'],
  [/vanilla|cream/, 'vanilla'],
  [/sweet|sugar|candy|honey|tropic/, 'sweet'],
  [/earth|musk|skunk|kush|spice|pepper|herb|flowe|cheese/, 'earthy']
];

const TERPENE_RULES = [
  [/myrcene/, 'myrcene'],
  [/limonene/, 'limonene'],
  [/caryophyllene/, 'caryophyllene'],
  [/pinene/, 'pinene'],
  [/terpinolene/, 'terpinolene'],
  [/humulene/, 'humulene']
];

function mapTokens(text, rules, limit) {
  const found = [];
  const blob = String(text || '').toLowerCase();
  rules.forEach(function (rule) {
    if (rule[0].test(blob) && found.indexOf(rule[1]) === -1) {
      found.push(rule[1]);
    }
  });
  return found.slice(0, limit);
}

function loadExisting() {
  const names = new Set();
  const slugs = new Set();
  const extra = fs.readFileSync(extraPath, 'utf8');
  const data = fs.readFileSync(dataPath, 'utf8');
  const re = /"n":"((?:\\.|[^"\\])*)","s":"([^"]+)"/g;
  let match;
  while ((match = re.exec(extra))) {
    const name = match[1].replace(/\\"/g, '"').replace(/\\u([0-9a-fA-F]{4})/g, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });
    names.add(norm(name));
    names.add(squeeze(name));
    slugs.add(match[2]);
  }
  const hand = /slug:\s*'([^']+)',\s*\r?\n\s*name:\s*'([^']+)'/g;
  while ((match = hand.exec(data))) {
    slugs.add(match[1]);
    names.add(norm(match[2]));
    names.add(squeeze(match[2]));
  }
  return { names: names, slugs: slugs };
}

function score(row) {
  return ['thc_avg', 'cbd_avg', 'effects', 'flavors', 'terpenes', 'parent_1_display', 'breeder', 'flowering_days_avg', 'genetics_type', 'indica_percentage']
    .reduce(function (total, key) {
      return total + (row[key] ? 1 : 0);
    }, 0);
}

function typeFor(row) {
  const raw = String(row.genetics_type || row.category_type || '').toLowerCase();
  if (raw.includes('indica') && !raw.includes('sativa') && !raw.includes('hybrid')) return 'Indica';
  if (raw.includes('sativa') && !raw.includes('indica') && !raw.includes('hybrid')) return 'Sativa';
  if (raw.includes('hybrid') || (raw.includes('indica') && raw.includes('sativa'))) return 'Hybrid';
  const indica = num(row.indica_percentage);
  if (indica !== null) {
    if (indica >= 60) return 'Indica';
    if (indica <= 40) return 'Sativa';
    return 'Hybrid';
  }
  return 'Hybrid';
}

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const head = rows[0];
const idx = Object.fromEntries(head.map(function (key, i) { return [key, i]; }));
const existing = loadExisting();
const best = new Map();

rows.slice(1).forEach(function (cols) {
  const record = {};
  head.forEach(function (key, i) {
    record[key] = cols[i] || '';
  });
  const name = (record.strain_name_display || record.strain_name_original || '').trim();
  const key = norm(name);
  if (!key || key.length < 2) return;
  if (existing.names.has(key) || existing.names.has(squeeze(name))) return;
  const current = best.get(key);
  if (!current || score(record) > score(current)) {
    best.set(key, record);
  }
});

const lines = [];
function cleanName(value) {
  const name = String(value || '').replace(/\s+/g, ' ').trim();
  if (name.length < 3 || name.length > 42) return '';
  if (!/[a-z]/i.test(name)) return '';
  if (/https?:|for sale|seedbank|what'?s inside|recombinant|<|Ã|Â|&amp;|pack\)/i.test(name)) return '';
  return name;
}

best.forEach(function (record) {
  const name = cleanName(record.strain_name_display || record.strain_name_original);
  if (!name) return;
  let slug = slugify(name);
  if (existing.slugs.has(slug)) {
    let n = 2;
    while (existing.slugs.has(slug + '-' + n)) n += 1;
    slug = slug + '-' + n;
  }
  existing.slugs.add(slug);
  const thc = num(record.thc_avg);
  const cbd = num(record.cbd_avg);
  const fd = num(record.flowering_days_avg);
  const height = num(record.height_indoor_cm_max) || num(record.height_outdoor_cm_max);
  const yieldG = num(record.yield_indoor_g_m2_max) || num(record.yield_outdoor_g_plant_max);
  const parents = [record.parent_1_display, record.parent_2_display]
    .map(cleanName)
    .filter(function (parent) { return parent && norm(parent) !== norm(name); });
  const aka = (record.aka_strain_name || '').trim();
  const row = {
    n: name,
    s: slug,
    t: typeFor(record),
    th: thc !== null && thc > 0 && thc <= 40 ? Math.round(thc * 10) / 10 : null,
    cb: cbd !== null && cbd >= 0 && cbd <= 30 ? Math.round(cbd * 10) / 10 : null,
    e: mapTokens(record.effects, EFFECT_RULES, 3),
    f: mapTokens(record.flavors, FLAVOUR_RULES, 3),
    tp: mapTokens(record.terpenes, TERPENE_RULES, 3),
    p: parents.slice(0, 2),
    b: (record.breeder || record.seed_bank || '').trim(),
    a: aka && norm(aka) !== norm(name) ? [aka] : [],
    fd: fd !== null && fd >= 40 && fd <= 160 ? fd : null,
    h: height !== null && height >= 20 && height <= 400 ? height : null,
    y: yieldG !== null && yieldG > 0 && yieldG < 5000 ? yieldG : null
  };
  lines.push('    ' + JSON.stringify(row));
});

const source = fs.readFileSync(extraPath, 'utf8');
const end = source.lastIndexOf('  ];');
if (end === -1) {
  throw new Error('Could not find the end of strains-extra.js');
}
let prefix = source.slice(0, end).replace(/\s*$/, '');
if (!prefix.endsWith(',')) {
  prefix += ',';
}
const updated = prefix + '\n' + lines.join(',\n') + '\n' + source.slice(end);
if (!lines.length) {
  console.log('No missing strain names.');
  process.exit(0);
}
fs.writeFileSync(extraPath, updated);
console.log('Added ' + lines.length + ' strains. Library names were ' + existing.names.size + '.');
