import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { stringify } from 'csv-stringify/sync';

function parseAddresses(html) {
  const $ = cheerio.load(html);
  const res = [];
    $('.wixui-accordion__item').each((i, el) => {
    const name = $(el).find('.wixui-accordion__title').text().trim();
    if (!name || name === 'STRIKE SUPPORT EVENT SCHEDULE')      return ;
    const text = $(el).text();
    // 888 Broadway, New York, NY 10003
    const m = text.match(/\D(\d+\s.*\d{5})\b/);
    const addr = (m && m[1]) || '';
    if (!addr || addr === 'TBD') return;
    const o = { name, addr };
    res.push(o);
  });
  return res;
}

async function main() {
  const response = await fetch('https://www.sagaftrastrike.org/picket-schedule-locations');
  const html = await response.text();
  const os = parseAddresses(html).filter(Boolean).map(({name, addr}) => [name,addr]);
  const output = stringify(os);
  console.log(output);
}



main();