'use strict';

function ajax(o) {
  var xhr = new XMLHttpRequest();
  if (o.withCredentials) { xhr.withCredentials = true; }
  xhr.open(o.method || 'GET', o.url, true);
  var cbInner = function() {
    if (xhr.readyState === 4 && xhr.status > 199 && xhr.status < 300) {
      return o.cb(null, JSON.parse(xhr.response));
    }
    o.cb('error requesting ' + o.url);
  };
  xhr.onload  = cbInner;
  xhr.onerror = cbInner;
  xhr.send(o.body || null);
}


function hex2(n) {
  const s = n.toString(16);
  return (s.length > 1) ? s : '0' + s;
}

// adapted from https://github.com/kayellpeee/hsl_rgb_converter/blob/master/converter.js
function hsl2rgb(hue, saturation, lightness){
  let chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation;
  let huePrime = hue / 60;
  let secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

  huePrime = Math.floor(huePrime);
  let red, green, blue;

  if( huePrime === 0 ){
    red = chroma;
    green = secondComponent;
    blue = 0;
  }else if( huePrime === 1 ){
    red = secondComponent;
    green = chroma;
    blue = 0;
  }else if( huePrime === 2 ){
    red = 0;
    green = chroma;
    blue = secondComponent;
  }else if( huePrime === 3 ){
    red = 0;
    green = secondComponent;
    blue = chroma;
  }else if( huePrime === 4 ){
    red = secondComponent;
    green = 0;
    blue = chroma;
  }else if( huePrime === 5 ){
    red = chroma;
    green = 0;
    blue = secondComponent;
  }

  let lightnessAdjustment = lightness - (chroma / 2);
  red += lightnessAdjustment;
  green += lightnessAdjustment;
  blue += lightnessAdjustment;
  const rgb = [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];
  return '#' + hex2(rgb[0]) + hex2(rgb[1]) + hex2(rgb[2]);
};


const hasTags = (location.search.length > 1);


document.querySelector('#toggle-tags').addEventListener('click', function() {
  location.search = (hasTags ? '' : 'tags');
});


ajax({
  url: 'rows.json',
  cb: function(err, o) {
    if (err) {
      return alert(err);
    }

    // groupByMonth
    let currentMonth = '';
    const labels = [];
    const bag = [];
    o.forEach(function(e) {
      const d = new Date(e.dateS);
      const month = `${d.getFullYear()}-${d.getMonth()+1}`;
      // console.log(month);
      let monthBag;
      if (month !== currentMonth) {
        monthBag = [];
        bag.push(monthBag);
        labels.push(month);
        currentMonth = month;
      } else {
        monthBag = bag[ bag.length - 1 ];
      }
      monthBag.push(e);
    });
    //console.log(labels);
    //console.log(bag);

    // @TODO: may be a bug - discrepancy between overall negative and negative tags for the same month!

    // process month events
    o = bag.map(function(es) {
      let positive = 0;
      let negative = 0;
      const tags = {};
      es.forEach(function(e) {
        if (e.amount >= 0) { positive += e.amount; }
        else {               negative += e.amount; }
        const tag = e.tags || (e.amount >= 0 ? 'positive' : 'negative');
        if (!('tag' in tags)) { tags[tag] = 0; }
        tags[tag] += e.amount;
      });

      return {
        // balance  : es[0].balance,
        balance  : es[es.length-1].balance,
        //balance  : (es[0].balance + es[es.length-1].balance)/2,
        positive : positive,
        negative : negative,
        net      : positive + negative,
        tags     : tags
      }
    });
    //console.log(o);

    // http://c3js.org/reference.html
    // http://c3js.org/examples.html

    if (!hasTags) {
      const balCol = o.map(function(e) { return e.balance;  }); balCol.unshift('balance');
      const netCol = o.map(function(e) { return e.net;      }); netCol.unshift('net');
      const posCol = o.map(function(e) { return e.positive; }); posCol.unshift('positive');
      const negCol = o.map(function(e) { return e.negative; }); negCol.unshift('negative');

      c3.generate({
        data: {
          columns: [
            balCol,
            netCol,
            posCol,
            negCol
          ],
          type: 'bar',
          types: { balance: 'line', net: 'line' },
          groups: [ ['positive', 'negative'] ],
          colors: {
            balance  : '#FF00FF',
            net      : '#000000',
            positive : '#22AA22',
            negative : '#AA2222'
          }
        },
        grid: { y: { lines: [{value:0}] } },
        axis: { x: { tick: { format: function(i) { return labels[i]; } } } },
        tooltip: { format: { value: function (value, ratio, id, index) { return value.toFixed(2); } } }
      });
    } else {
      // find relevant signs and sort by sign
      let tagSigns = {};
      o.forEach(function(e) {
        for (let tag of Object.keys(e.tags)) {
          const isNeg = e.tags[tag] < 0;
          const sign = (isNeg ? '-' : '+');
          tagSigns[tag] = sign;
        }
      });
      let tags = Object.keys(tagSigns);
      tags = tags.map(function(t) { return tagSigns[t] + t; });
      tags.sort();

      // default row before adding stuff
      const defaultRow = new Array(tags.length+1).join('0').split('').map(function(s) { return +s; });
      
      const rows = [tags];
      o.forEach(function(e) {
        const row = defaultRow.slice();
        for (let tag of Object.keys(e.tags)) {
          const index = tags.indexOf(tagSigns[tag] + tag);
          row[index] = e.tags[tag];
        }
        rows.push(row);
      });

      // stacks of positive and negative tags
      const stack1 = tags.filter(function(t) { return t[0] === '+'; });
      const stack2 = tags.filter(function(t) { return t[0] === '-'; });

      const chart = c3.generate({
        data: {
          rows: rows,
          type: 'area-spline', groups: [ stack1, stack2 ], // area area-spline area-step
          //type: 'bar', groups: [ tags ],
          order: null
        },
        grid: { y: { lines: [{value:0}] } },
        axis: { x: { tick: { format: function(i) { return labels[i]; } } } },
        tooltip: { format: { value: function (value, ratio, id, index) { if (value) return value.toFixed(2); } } }
      });

      // apply custom colors (maximizing visual difference, hopefully)
      const light = [0.2, 0.4, 0.6, 0.8];
      const sat = [0.6, 0.9];
      function randomColor(i, n) {
        return hsl2rgb((i/n) * 360, sat[i % 2], light[i % 4]);
      }
      const colors = {};
      for (const i in tags) {
        const tag = tags[i];
        colors[tag] = randomColor(i, tags.length);
      }
      chart.data.colors(colors);
    }

  }
});
