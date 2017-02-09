'use strict';

const auth = require('./auth.json');
const integ = require('./' + auth.bank);

const Nightmare = require('nightmare');

const nm = Nightmare();
// const nm = Nightmare({show: true});
// const nm = Nightmare({show: true, openDevTools: { mode: 'detach' } });

integ(auth, nm)
.then(function(res) {
  console.log(res);
})
.catch(function(err) {
  console.error(err);
});
