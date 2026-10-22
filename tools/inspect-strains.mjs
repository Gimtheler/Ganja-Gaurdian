import fs from 'fs';

const text = fs.readFileSync(process.env.TEMP + '/ci-strains.csv', 'utf8');

function parse(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (q) {
      if (c === '"') {
        if (line[i + 1] === '"') {
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
      out.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

const lines = text.split(/\r?\n/).filter(Boolean);
const head = parse(lines[0]);
const idx = Object.fromEntries(head.map(function (h, i) { return [h, i]; }));
const names = new Set();
const types = {};
for (let i = 1; i < Math.min(lines.length, 4); i += 1) {
  const c = parse(lines[i]);
  console.log(JSON.stringify({
    name: c[idx.strain_name_display],
    type: c[idx.genetics_type],
    effects: c[idx.effects],
    flavors: c[idx.flavors],
    terpenes: c[idx.terpenes],
    thc: c[idx.thc_avg],
    cbd: c[idx.cbd_avg],
    p1: c[idx.parent_1_display],
    p2: c[idx.parent_2_display],
    b: c[idx.breeder],
    fd: c[idx.flowering_days_avg],
    slug: c[idx.strain_name_slug],
    aka: c[idx.aka_strain_name],
    h: c[idx.height_indoor_cm_max],
    y: c[idx.yield_indoor_g_m2_max]
  }));
}
for (let i = 1; i < lines.length; i += 1) {
  const c = parse(lines[i]);
  const name = (c[idx.strain_name_display] || '').trim().toLowerCase();
  if (name) names.add(name);
  const t = c[idx.genetics_type] || '';
  types[t] = (types[t] || 0) + 1;
}
console.log('rows', lines.length - 1, 'unique names', names.size);
console.log(types);
