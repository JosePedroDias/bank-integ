'use strict';

// https://github.com/segmentio/nightmare#api

const CONTAS_A_ORDEM_HREF = 'a[href="javascript:oc(9);"]';
const MOVIMENTOS_HREF = 'a[href="javascript:lk(13);"]';
const NEXT_PAGE_LINK = ".txtPaginaActiva a img[src='/imagens/setaAzulDireita2.gif']";

module.exports = function montepio(auth, nm) {

  function logIn(userName, pinS) {
    return new Promise(
      function(resolve, reject) {
        const pin = pinS.split('');
        nm.viewport(1024, 768)
          .goto('https://www.montepio.pt/SitePublico/pt_PT/particulares.page') // visit site
          .type('input[id="loginid_IN"]', userName) // insert username
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
            nm.click('input[class="pinButton"][name="b' + pinClicks[0] + '"]') // click on the pin buttons...
              .click('input[class="pinButton"][name="b' + pinClicks[1] + '"]')
              .click('input[class="pinButton"][name="b' + pinClicks[2] + '"]')
              .click('input[class="pinButton"][name="b' + pinClicks[3] + '"]')
              .click('input[class="pinButton"][name="b' + pinClicks[4] + '"]')
              .click('input[class="pinButton"][name="b' + pinClicks[5] + '"]')
              .wait(200)
              .wait(CONTAS_A_ORDEM_HREF) // wait for contas à ordem link to exist
              .then(resolve)
              .catch(reject);
            })
            .catch(reject);
        }
      );
  }

  function chooseAccount(account) {
    return new Promise(
      function(resolve, reject) {
        nm.wait(CONTAS_A_ORDEM_HREF) // wait for contas à ordem link to exist
          .click(CONTAS_A_ORDEM_HREF) // click there
          .click(MOVIMENTOS_HREF) // click on the movimentos link
          .wait('select[name="seleccaoConta"]') // wait for account select to exit
          .select('select[name="seleccaoConta"]', auth.account) // select proper account
          .then(resolve)
          .catch(reject);
      }
    );
  }

  function getRecentTransactions(account) {
    return new Promise(
      function(resolve, reject) {
        chooseAccount(account)
        .then(function() {
          nm.click('input[value="Últimos Movimentos"]') // press the últimos movimentos button
            .then(function() {
              parseTransactionPage().then(resolve).catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
      }
    );
  }

  function hasMoreTransactionPages() {
    return nm
      .exists(NEXT_PAGE_LINK);
  }

  function requestNextTransactionPage() {
    return nm
      .click(NEXT_PAGE_LINK)
      .wait(1000);
  }

  function getTransactions(account, from, to) {
    const s = from.split('-');
    const e = to.split('-');
    return new Promise(
      function(resolve, reject) {
        chooseAccount(account)
        .then(function() {
          nm.click('input[value="Pesquisa Movimentos"]') // press the pesquisa movimentos button
            .wait('select[id="agendamentoIniAno"]')
            .select('select[id="agendamentoIniAno"]', s[0])
            .select('select[id="agendamentoIniMes"]', s[1])
            .select('select[id="agendamentoIniDia"]', s[2])
            .select('select[id="agendamentoFimAno"]', e[0])
            .select('select[id="agendamentoFimMes"]', e[1])
            .select('select[id="agendamentoFimDia"]', e[2])
            .click('input[value="Consultar"]') // press the pesquisa movimentos button
            .then(function() {
              let allResults = [];
              function step() {
                parseTransactionPage()
                .then(function(res) {
                  // console.log('GOT %s RESULTS', res.length);
                  allResults = allResults.concat(res);
                  hasMoreTransactionPages()
                  .then(function(hasMore) {
                    // console.log('MORE? %s', hasMore);
                    if (!hasMore) {
                      resolve(allResults); return;
                    }
                    requestNextTransactionPage()
                    .then(step)
                    .catch(reject);
                  })
                  .catch(reject);
                })
                .catch(reject);
              }
              step();
            })
            .catch(reject);
        })
        .catch(reject);
      }
    );
  }

  function parseTransactionPage() {
    return new Promise(
      function(resolve, reject) {
        nm.wait(2000) // montepio does weird stuff refreshing the contents... let it breathe
          .wait('table td.tdClass1 a, table td.tdClass2 a') // wait for results markup to exist
          .evaluate(function() { // parse markup into array of transactions
            function de(s) { return unescape( s.replace(/\+/g, ' ') ); }
            function dt(s) { return [s.substring(0, 4), s.substring(4, 6), s.substring(6, 8)].join('-'); }
            function tm(s) { return [s.substring(0, 2), s.substring(2, 4)].join(':'); }
            return Array.prototype.slice.apply( document.querySelectorAll('table td.tdClass1 a, table td.tdClass2 a') )
            .map(function(aEl) {
              aEl.style.fontWeight = 'bold'; // DEBUG
              const s = (/\)[^\(]+\(([^\)]+)/).exec( aEl.onclick.toString() )[1]; // console.log(s);
              const parts = s.replace(/'/g, '').split(','); // console.log(parts);
              return {
                desc       : de(parts[0]),
                amount     : parseFloat(parts[1]),
                balance    : parseFloat(parts[4]),
                date       : dt(parts[6]),
                time       : tm(parts[8]),
                ref        : de(parts[10]),
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
              };
            });
        })
        .then(resolve)
        .catch(reject);
      }
    );
  }

  return new Promise(function(resolve, reject) {
    console.log('Logging in to %s user...', auth.username);
    logIn(auth.username, auth.password)
    .then(function() {
      const _then = function(res) {
        resolve(res); nm.end();
      }
      if (!auth.startDate || !auth.endDate) {
        console.log('Fetching recent transactions from %s account...', auth.account);
        getRecentTransactions(auth.account).then(_then).catch(reject);
      }
      else {
        console.log('Fetching transactions from %s to %s of %s account...', auth.startDate, auth.endDate, auth.account);
        getTransactions(auth.account, auth.startDate, auth.endDate).then(_then).catch(reject);
      }
    })
    .catch(reject);
  });
};
