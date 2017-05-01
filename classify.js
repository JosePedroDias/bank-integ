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

classifiers.push( function isPay(o) {
  if (sub(o.desc, 'SKY CP LIMITED')) { return 'pay'; }
} );

classifiers.push( function isApart(o) {
  if ((/^TRF.P\/ FARINHA/).test(o.desc)) { return 'apart'; }
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
    'DI HAU',
    'ESPACO ESPELHO DAGUA',
    'GIL & PEDRO',
    'GUACAMOLE',
    'HAMBURGUERIA DO',
    'HANAMI SUSHI',
    'LEONARDO E BRANCO',
    'MARISQUEIRA',
    'MC DONALD',
    'MCDONALD',
    'MERCEARIA DE L PRAIN',
    'NOSOLO ITALIA',
    'NOTAVEL SIMBIOSE',
    'O COURENSE',
    'PALACIO CHIADO',
    'PITADA BOEMIA',
    'PLATAFORMA GULOSA',
    'RELENTO',
    'RESTAURANTE',
    'SABE BEM',
    'SABEBEM',
    'SELFISH',
    'STOP-BENFICA',
    'TELEPIZZA',
    'WTW ALEGRO',
  ])) { return 'rest'; }
} );

classifiers.push( function isSuper(o) {
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

classifiers.push( function isAtm(o) {
  if (subs(o.desc, [
    '7255'
  ])) { return 'atm'; }
} );

classifiers.push( function isCinema(o) {
  if (subs(o.desc, [
    'CINEMA'
  ])) { return 'cinema'; }
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

classifiers.push( function isSport(o) {
  if (subs(o.desc, [
    'AIRFUT',
    'DECATHLON',
  ])) { return 'sport'; }
} );

classifiers.push( function isSubs(o) {
  if (subs(o.desc, [
    'DECO',
    'IMPRESA',
    'MEDIPRESS',
    'nespresso',
  ])) { return 'subs'; }
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

classifiers.push( function isBank(o) {
  if (subs(o.desc, [
    'C&A'
  ])) { return 'fashion'; }
} );

classifiers.push( function isBank(o) {
  if (subs(o.desc, [
    'PORTAGENS',
    'SANTOGAL'
  ])) { return 'car'; }
} );

classifiers.push( function isBank(o) {
  if (subs(o.desc, [
    'MGAM'
  ])) { return 'bank'; }
} );

classifiers.push( function isHelp(o) {
  if (subs(o.desc, [
    'TR-JOSE AUGUSTO ALEIXO DIAS'
  ])) { return 'help'; }
} );



module.exports = function(rows) {
  rows.forEach(function(o) {
    o.tags = [];
    classifiers.forEach(function(classifier) {
      const res = classifier(o);
      if (res) { o.tags.push(res); }
    })
  });
}
