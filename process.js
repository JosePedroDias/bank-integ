'use strict';

const db = require('./db');

// const ACCOUNT_NO = '019100068022'; // BLAZIS
const ACCOUNT_NO = '019100068360'  // EU

const f0 = 'data/' + ACCOUNT_NO;
const f1 = 'data/' + ACCOUNT_NO + '.clean';

const d0 = db(f0);
const d1 = db(f1);

d1.clear();

console.log('loaded %s with %s items', ACCOUNT_NO, d0.size());

d0.filter().forEach(function(o) {
  const o2 = {}
  for (const k in o) {
    if (k[0] === '_') { continue; }
    o2[k] = o[k];
  }
  o2.dateS = o.date + 'T' + o.time + ':00';
  o2.ts = new Date(o2.dateS).valueOf();
  d1.put(o2);
});


d1.filter().forEach(function(o) {
  console.log(o);
});
