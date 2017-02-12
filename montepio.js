'use strict';

// https://github.com/segmentio/nightmare#api

const CONTAS_A_ORDEM_HREF = 'a[href="javascript:oc(9);"]';
const MOVIMENTOS_HREF = 'a[href="javascript:lk(13);"]';



function pad0(n) {
  return ( (n < 10) ? '0' + n : '' + n );
}

module.exports = function montepio(auth, nm) {
  const pin = auth.password.split('');

  function l(s) { console.log(s); return Promise.resolve(this); }

  return new Promise(function(resolve, reject) {
    nm.viewport(1024, 768)
      .goto('https://www.montepio.pt/SitePublico/pt_PT/particulares.page') // visit site
      .type('input[id="loginid_IN"]', auth.username) // insert username
      .click('input[id="net24Submit"]') // click OK submit button
      .wait('input[class="fldCheckConfirmation"]') // wait for confirmation popup
      .click('input[class="fldCheckConfirmation"]') // accept warning
      .evaluate(function() { // determine the order of the pin buttons on the pin form
        return Array.prototype.slice.apply( document.querySelectorAll('input[class="pinButton"]') )
        .map(function(el) { return el.value; });
      })
      .then(function(pinButtonLabels) {
        const pinClicks = pin.map(function(number) { // compute pin buttons to click
          return pinButtonLabels.indexOf(number);
        });
        nm
          .click('input[class="pinButton"][name="b' + pinClicks[0] + '"]') // click on the pin buttons...
          .click('input[class="pinButton"][name="b' + pinClicks[1] + '"]')
          .click('input[class="pinButton"][name="b' + pinClicks[2] + '"]')
          .click('input[class="pinButton"][name="b' + pinClicks[3] + '"]')
          .click('input[class="pinButton"][name="b' + pinClicks[4] + '"]')
          .click('input[class="pinButton"][name="b' + pinClicks[5] + '"]')
          .wait(200)
          .wait(CONTAS_A_ORDEM_HREF) // wait for contas à ordem link to exist
          .click(CONTAS_A_ORDEM_HREF) // click there
          .click(MOVIMENTOS_HREF) // click on the movimentos link
          .select('select[name="seleccaoConta"]', auth.account) // select proper account

          .click('input[value="Últimos Movimentos"]') // press the últimos movimentos button

          .wait('table td.tdClass1, table td.tdClass2') // wait for results markup to exist
          .evaluate(function() { // parse markup into array of transactions w/ { date, desc, amount, balance }
            function de(s) { return decodeURIComponent(s).replace(/\+/g, ' '); }
            function dt(s) { return [s.substring(0, 4), s.substring(4, 6), s.substring(6, 8)].join('-'); }
            function tm(s) { return [s.substring(0, 2), s.substring(2, 4)].join(':'); }
            const arr = [];
            Array.prototype.slice.apply( document.querySelectorAll('table td.tdClass1, table td.tdClass2') )
            .forEach(function(el, i) {
              if (i % 5 !== 2) { return; }
              const aEl = el.querySelector('a');
              const s = (/\)[^\(]+\(([^\)]+)/).exec( aEl.onclick.toString() )[1];
              const parts = s.replace(/'/g, '').split(',');
              arr.push({
                desc       : de(parts[0]),
                amount     : parseFloat(parts[1]),
                balance    : parseFloat(parts[4]),
                date       : dt(parts[6]),
                time       : tm(parts[8]),
                ref        : parts[10],
                _amountMov : parts[2],
                _mCurrency : parts[3],
                _location  : parts[5],
                _dateV     : parts[7],
                _check     : parts[9],
                _cCurrency : parts[11],
                _mcoperac  : parts[12],
                _branch    : parts[13],
                _accountNr : parts[14],
                _cterm     : parts[15],
                _zjournal  : parts[16]
              });
            });
            return arr;
          })
          .end() // dismiss nightmare browser
          .then(function (res) { resolve(res); }) // return back the result
          .catch(function (err) { // something went bad... trigger reject instead
            nm.end();
            reject(err);
          });
      })
      .catch(function (err) { // something went bad... trigger reject instead
        nm.end();
        reject(err);
      });
  });
};
