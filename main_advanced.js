'use strict';

const auth = require('./auth.json');
const integ = require('./montepio_advanced');
const Nightmare = require('nightmare');
const db = require('./db');

// const nm = Nightmare();
// const nm = Nightmare({show: true});
const nm = Nightmare({
  show: true,
  waitTimeout      : 5000,
  executionTimeout : 2000,
  pollInterval     :  100,
  openDevTools: { mode: 'detach' }
});

integ(auth, nm)
.then(function(res) {
  const accountNo = auth.account.split('|')[0];
  const d = db('data/' + accountNo);
  console.log('at start #%s', d.size());

  console.log('scrapped #%s', res.length); d.puts(res);

  console.log('at end   #%s', d.size());
})
.catch(function(err) { console.error(err) });
