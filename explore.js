'use strict';

const fs = require('fs');

const db = require('./db');
const tab = require('tab'); // npm install tab
const classify = require('./classify');



const ACCOUNT_NO = '019100068360'  // EU
// const ACCOUNT_NO = '019100068022'; // BLAZIS



const f1 = 'data/' + ACCOUNT_NO + '.clean';
const d1 = db(f1);
console.log('loaded %s with %s items', ACCOUNT_NO, d1.size());

function sig(n) { return (n < 0 ? -1 : (n > 0 ? 1 : 0) ); }

const DAY = 24 * 60 * 60 * 1000;
const t0 = new Date().valueOf() - 30 * DAY;
let rows = d1.filter(
  function() { return true; } // don't filter
  // function(o) { return new Date(o.date).getMonth() === 1; } // on february
  // function(o) { return o.ts > t0; } // last 30 days
);



rows.sort(function(a, b) { return sig(a.ts - b.ts); }); // by time
//rows.sort(function(a, b) { return sig(a.amount - b.amount); }); // by amount



const dows = 'dom seg ter qua qui sex sáb'.split(' ');

function pad(s, n, r) {
  const l = s.length;
  if (l > n) { return s; }
  const p = new Array(n - l + 1).join(' ');
  return (r ? p+s : s+p);
}

classify(rows);


rows.forEach(function(o) {
  o.tags = o.tags.join(' ');
  delete o.date;
  delete o.time;
  delete o.ts;
  delete o.ref;
  delete o._id;
});
fs.writeFileSync( 'rows.json', JSON.stringify(rows) );
process.exit(0);



rows.forEach(function(o) {
  o.amount  = o.amount.toFixed(2);
  o.balance = o.balance.toFixed(2);
  o.dow = dows[ new Date( o.dateS ).getDay() ];
  o.dateS = o.dateS.substring(5, 16).replace('T', ' ');
  o.tags = o.tags.join(' ');
});

// rows = rows.filter(function(o) { return !o.tags; }) // ONLY THOSE



tab.emitTable({
  columnSeparator: '|',
  columns: [
    { label:'dow',     align:'left',  width:  3 },
    { label:'dateS',   align:'left',  width: 11 },
    { label:'balance', align:'right', width: 10 },
    { label:'amount',  align:'right', width: 10 },
    { label:'desc',    align:'left',  width: 30 },
    { label:'ref',     align:'left',  width: 15 },
    { label:'tags',    align:'left',  width: 20 }
  ],
  rows: rows
});
