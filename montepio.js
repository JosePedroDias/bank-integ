'use strict';

// https://github.com/segmentio/nightmare#api

const CONTAS_A_ORDEM_HREF = 'a[href="javascript:oc(9);"]';
const MOVIMENTOS_HREF = 'a[href="javascript:lk(13);"]';

module.exports = function montepio(auth, nm) {
  const pin = auth.password.split('');

  return new Promise(function(resolve, reject) {
    nm.viewport(1024, 768)
      .goto('https://www.montepio.pt/SitePublico/pt_PT/particulares.page')
      .type('input[id="loginid_IN"]', auth.username)
      .click('input[id="net24Submit"]')
      .wait('input[class="fldCheckConfirmation"]')
      .click('input[class="fldCheckConfirmation"]')
      //.wait(200)
      .evaluate(function() {
        return Array.prototype.slice.apply(
          document.querySelectorAll('input[class="pinButton"]'))
          .map(function(el) { return el.value; });
      })
      .then(function(pinButtonLabels) {
        const pinClicks = pin.map(function(number) {
          return pinButtonLabels.indexOf(number);
        });
        nm
          .click('input[class="pinButton"][name="b' + pinClicks[0] + '"]')
          .click('input[class="pinButton"][name="b' + pinClicks[1] + '"]')
          .click('input[class="pinButton"][name="b' + pinClicks[2] + '"]')
          .click('input[class="pinButton"][name="b' + pinClicks[3] + '"]')
          .click('input[class="pinButton"][name="b' + pinClicks[4] + '"]')
          .click('input[class="pinButton"][name="b' + pinClicks[5] + '"]')
          //.wait(2000)
          .wait(CONTAS_A_ORDEM_HREF)
          .click(CONTAS_A_ORDEM_HREF)
          //.wait(200)
          .click(MOVIMENTOS_HREF)
          //.wait(200)
          .select('select[name="seleccaoConta"]', auth.account)
          //.wait(200)
          .click('input[value="Últimos Movimentos"]')
          .wait('table td.tdClass1, table td.tdClass2')
          //.wait(2000)
          .evaluate(function() {
            function money(s) { return parseFloat( s.replace(/\./g, '').replace(/,/g, '.') ); }
            const arr = [];
            let o = {};
            Array.prototype.slice.apply( document.querySelectorAll('table td.tdClass1, table td.tdClass2') )
            .forEach(function(el, i) {
                const i2 = i % 5;
                if (i2 === 0) { o.date = el.innerText; }
                else if (i2 === 1) { /*o.date2 = el.innerText;*/ }
                else if (i2 === 2) { o.desc = el.innerText; }
                else if (i2 === 3) { o.amount = money(el.innerText); }
                else { o.balance = money(el.innerText); arr.push(o); o = {}; }
              });
            return arr;
          })
          //.wait(50000)
          .end()
          .then(function(arr) {
            console.log(arr);
          })
          .then(function (res) { resolve(res); })
          .catch(function (err) { reject(err); });
      })
      // .wait(50000)
      // .end()
      .then(function (res) { resolve(res); })
      .catch(function (err) { reject(err); });
  });
};
