/**
 * Girls Following Jesus – Evaluation
 * Lives in the responses Google Sheet (Extensions › Apps Script) beside Index.html.
 * Deployed as a web app (Execute as: Me, Who has access: Anyone), the /exec link
 * shows the animated evaluation page and saves each submission to the Responses tab.
 */
// The responses spreadsheet (from its link: docs.google.com/spreadsheets/d/<ID>/edit).
var SPREADSHEET_ID = '17gJO9-K6Z-kIfJDbS87Nsm0mPJmfV9-1WS4n12ZmlZY';
var SHEET_NAME = 'Responses';

var CAPITALS = ['Core Capital', 'Capital Compass', 'Capital Toolkit', 'Brand Capital',
  'Social Capital', 'Dominion Capital', 'Economic Capital'];

var FIELDS = [
  ['name', 'Name'],
  ['favourite', 'Favourite session'],
  ['why', 'Why it was their favourite'],
  ['moment', 'Standout moment'],
  ['lesson', 'Biggest lesson'],
  ['grow', 'Capital to grow in + next step'],
  ['changed', 'How it changed them'],
  ['continue', 'CONTINUE'],
  ['stop', 'STOP'],
  ['start', 'START'],
  ['seas', 'Comment on SEAs'],
  ['overall', 'Overall rating'],
  ['recommend', 'Would recommend'],
  ['other', 'Other thoughts / prayer requests']
];

function headers_() {
  return ['Submitted at', 'Response ID']
    .concat(CAPITALS.map(function (c) { return c + ' (1–5)'; }))
    .concat(FIELDS.map(function (f) { return f[1]; }));
}

function sheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    var h = headers_();
    sh.getRange(1, 1, 1, h.length).setValues([h])
      .setFontWeight('bold').setBackground('#c8497a').setFontColor('#ffffff').setWrap(true);
    sh.setFrozenRows(1);
    sh.setColumnWidths(1, h.length, 180);
  }
  return sh;
}

/** Run once from the editor to create the Responses tab with its headings. */
function setup() {
  sheet_();
}

/** Run from the editor to check saving works: adds a TEST row to the Responses tab. */
function testSave() {
  save_({ id: 'test-' + Date.now(), r: [5, 5, 5, 5, 5, 5, 5], name: 'TEST (delete me)', overall: 'Excellent' });
  Logger.log('Saved a TEST row to ' + SpreadsheetApp.openById(SPREADSHEET_ID).getUrl());
}

function doGet(e) {
  if (!(e && e.parameter && e.parameter.d)) {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Girls Following Jesus Evaluation')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
  }
  var ok = false;
  try {
    var raw = e && e.parameter && e.parameter.d;
    if (raw) {
      save_(JSON.parse(raw));
      ok = true;
    }
  } catch (err) {
    console.error(err);
  }
  return page_(ok);
}

/** Called by the page (google.script.run) when a participant taps Submit. */
function submitResponse(d) {
  save_(d);
  return true;
}

function doPost(e) {
  return doGet({ parameter: { d: e && e.postData && e.postData.contents } });
}

function save_(d) {
  var clip = function (v, n) { return String(v == null ? '' : v).slice(0, n); };
  var ratings = (d.r || []).slice(0, CAPITALS.length);
  while (ratings.length < CAPITALS.length) ratings.push('');
  var row = [new Date(), clip(d.id, 40)]
    .concat(ratings.map(function (x) { var n = Number(x); return n >= 1 && n <= 5 ? n : ''; }))
    .concat(FIELDS.map(function (f) { return clip(d[f[0]], 2000); }));

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheet_();
    // Same response sent twice (e.g. after changing an answer) updates its row instead of adding one.
    var hit = d.id ? sh.getRange('B:B').createTextFinder(String(d.id)).matchEntireCell(true).findNext() : null;
    if (hit && hit.getRow() > 1) {
      sh.getRange(hit.getRow(), 1, 1, row.length).setValues([row]);
    } else {
      sh.appendRow(row);
    }
  } finally {
    lock.releaseLock();
  }
}

function page_(ok) {
  var html =
    '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:Georgia,serif;' +
    'background:radial-gradient(circle at 50% 0,#f6e3e9,#fbf3f5 60%);color:#3a1d33;text-align:center;padding:24px}' +
    '.c{max-width:420px;background:#fff;border-radius:22px;padding:36px 28px;box-shadow:0 18px 50px -24px rgba(122,38,80,.35)}' +
    'h1{font-size:28px;margin:12px 0}em{color:#c8497a}p{font-family:system-ui,sans-serif;color:#7a5a70;line-height:1.6}' +
    '.m{font-size:48px}</style></head><body><div class="c">' +
    (ok
      ? '<div class="m">🌸</div><h1>Thank you, <em>sister!</em></h1><p>Your answers have been received by the Girls Following Jesus team. You can close this tab.</p>' +
        '<p><i>"He who began a good work in you will carry it on to completion." Philippians 1:6</i></p>'
      : '<div class="m">🙏</div><h1>Something went wrong</h1><p>Your answers didn\'t come through. Please go back to the evaluation and tap Submit again, or use "Also send on WhatsApp".</p>') +
    '</div></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setTitle('Girls Following Jesus')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
