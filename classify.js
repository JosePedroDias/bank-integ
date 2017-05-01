'use strict';



function sub(big, small) {
  return big.indexOf(small) !== -1;
}

function subs(big, smalls) {
  for (const small of smalls) {
    if (sub(big, small)) { return true; }
  }
  return false;
}



const classifiers = [];

classifiers.push( function isBank(o) {
  if (subs(o.desc, [
    'MGAM',
    'DESP.TRF.'
  ])) { return 'bank'; }
} );

classifiers.push( function isTax(o) {
  if (subs(o.desc, [
    'I.SELO ',
    'IMP.TRF.'
  ])) { return 'tax'; }
} );

classifiers.push( function isTransf(o) {
  if (subs(o.desc, [
    'TRF. JOSE PEDRO SACRAMENTO',
    'TRF. MARIA TAVARES SECO'
  ])) { return 'transf'; }
} );

classifiers.push( function isTransfExt(o) {
  if (subs(o.desc, [
    'TRF.P/'
  ])) { return 'transf-ext'; }
} );

classifiers.push( function isMB(o) {
  if (subs(o.desc, [
    'PAG.SERV.',
    'PAG. NET24'
  ])) { return 'mb'; }
} );

classifiers.push( function isAtm(o) {
  if (subs(o.desc, [
    '7255'
  ])) { return 'atm'; }
} );

classifiers.push( function isPay(o) {
  if (sub(o.desc, 'SKY CP LIMITED')) { return 'pay'; }
} );

classifiers.push( function isApart(o) {
  if ((/^TRF.P\/ FARINHA/).test(o.desc)) { return 'apart'; }
  if ((/^TRF.P\/ VITOR FARINHA/).test(o.desc)) { return 'apart'; }
  if ((/CONDIMINIO/).test(o.desc)) { return 'apart'; }
} );

classifiers.push( function isCommodity(o) {
  if (subs(o.desc, [
    'AGUA/GAS',
    'EDP'
  ])) { return 'commodity'; }
} );

classifiers.push( function isGas(o) {
  if (subs(o.desc, [
    'BP RESTELO',
    'CEPSA',
    'GALPGEST',
    'PA BENFICA ESTADIO',
    'PETROFAST',
    'POSTO BP',
    'POSTO GALP',
    'REPSOL',
  ])) { return 'gas'; }
} );

classifiers.push( function isRestaurant(o) {
  if (subs(o.desc, [
    'ADEGA DO SILVA',
    'ALTURA PROPICIA',
    'BURGUERS E BEER',
    'CACHORRO VADIO',
    'CASA PIZZA',
    'CONFEITARIA',
    'DI HAU',
    'DOMINO\'S',
    'ESPACO ESPELHO DAGUA',
    'GIL & PEDRO',
    'GUACAMOLE',
    'H3 ',
    'HAMBURGUERIA DO',
    'HANAMI SUSHI',
    'HONORATO',
    'LEONARDO E BRANCO',
    'MARISQUEIRA',
    'MC DONALD',
    'MCDONALD',
    'MERCADO ALGES',
    'MERCEARIA DE L PRAIN',
    'NOSOLO ITALIA',
    'NOTAVEL SIMBIOSE',
    'O COURENSE',
    'PALACIO CHIADO',
    'PITADA BOEMIA',
    'PLATAFORMA GULOSA',
    'RELENTO',
    'RESTAURANT',
    'RESTIBERICA',
    'SABE BEM',
    'SABEBEM',
    'SELFISH',
    'SLOW ALFRAGIDE',
    'SOUP ',
    'STOP-BENFICA',
    'TELEPIZZA',
    'WTW ALEGRO',
  ])) { return 'rest'; }
} );

classifiers.push( function isBar(o) {
  if (subs(o.desc, [
    'FINE FLAVOURS',
    'TAILORS COPOS',
  ])) { return 'bar'; }
} );

classifiers.push( function isSuper(o) {
  if (subs(o.desc, [
    'JUMBO',
    'MODELO BONJOUR',
    'PINGO DOCE',
    'SUPERCOR',
  ])) { return 'super'; }
} );

classifiers.push( function isElectro(o) {
  if (subs(o.desc, [
    'FNAC',
    'MEDIA MARKT',
    'RADIO POPULAR',
    'WORTEN',
  ])) { return 'electro'; }
} );

classifiers.push( function isFurn(o) {
  if (subs(o.desc, [
    'IKEA '
  ])) { return 'furn'; }
} );

classifiers.push( function isEvent(o) {
  if (subs(o.desc, [
    'BOL',
    'CINEMA',
    'TICKET'
  ])) { return 'event'; }
} );

classifiers.push( function isHealth(o) {
  if (subs(o.desc, [
    'FARMACIA'
  ])) { return 'health'; }
} );

classifiers.push( function isSchool(o) {
  if (subs(o.desc, [
    'EXTERNATO S JOSE'
  ])) { return 'school'; }
} );

classifiers.push( function isSubs(o) {
  if (subs(o.desc, [
    'DECO',
    'IMPRESA',
    'MEDIPRESS',
    'nespresso',
  ])) { return 'subs'; }
} );

classifiers.push( function isNetBuy(o) {
  if (subs(o.desc, [
    'GOG.COM',
    'ITUNES',
    'MICROSOFT',
  ])) { return 'net-buy'; }
} );

classifiers.push( function isNetSvc(o) {
  if (subs(o.desc, [
    'NETFLIX',
    'SCALEWAY',
    'Spotify',
    'UDEMYCOM',
  ])) { return 'net-svc'; }
} );

classifiers.push( function isBrico(o) {
  if (subs(o.desc, [
    'BCM BRICOLAGE',
    'BRICO DEPOT',
  ])) { return 'brico'; }
} );

classifiers.push( function isHotel(o) {
  if (subs(o.desc, [
    'HOTEL'
  ])) { return 'hotel'; }
} );

classifiers.push( function isToys(o) {
  if (subs(o.desc, [
    'DREAMY WORLD',
    'IMAGINARIUM',
    'PAPAGAIO SEM PENAS',
    'TIGER',
  ])) { return 'toys'; }
} );

classifiers.push( function isFashion(o) {
  if (subs(o.desc, [
    'AIRFUT',
    'C&A',
    'DECATHLON',
    'EL CORTE INGLES',
    'SEASIDE'
  ])) { return 'fashion'; }
} );

classifiers.push( function isGift(o) {
  if (subs(o.desc, [
    'BIMBA E LOLA',
    'FLOWERS',
    'IN TIME',
    'PERFUMES',
    'RITUALS'
  ])) { return 'gift'; }
} );

classifiers.push( function isCar(o) {
  if (subs(o.desc, [
    'PORTAGENS',
    'SANTOGAL'
  ])) { return 'car'; }
} );

classifiers.push( function isHelp(o) {
  if (subs(o.desc, [
    'TR-JOSE AUGUSTO ALEIXO DIAS'
  ])) { return 'help'; }
} );


// sink tags follow
classifiers.push( function isNegative(o) {
  if (o.amount < 0) { return 'negative'; }
} );

classifiers.push( function isPositive(o) {
  return 'positive';
} );


module.exports = function(rows) {
  rows.forEach(function(o) {
    classifiers.find(function(classifier) {
      const tag = classifier(o);
      if (tag) {
        o.tag = tag;
        return true;
      }
    })
  });
}
