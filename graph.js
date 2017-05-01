'use strict';

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

    // process month events
    o = bag.map(function(es) {
      let positive = 0;
      let negative = 0;
      const tags = {};
      es.forEach(function(e) {
        if (e.amount >= 0) { positive += e.amount; }
        else {               negative += e.amount; }
        const tag = e.tag || 'untagged'; // generic tag for untagged rows
        if (!(tag in tags)) { tags[tag] = 0; }
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

    if (!hasTags) { // cash flow graph
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
    } else { // tags stacked area graph
      // find relevant signs and sort by sign
      const ignoreTags = [];// 'positive', 'negative', 'pay', 'help', 'electro', 'subs', 'bank', 'bar', 'toys', 'cinema', 'net-svc', 'atm', 'fashion', 'car', 'furn', 'school', 'sport', 'hotel', 'health', 'apart', 'brico'];
      let tagSigns = {};
      o.forEach(function(e) {
        for (let tag of Object.keys(e.tags)) {
          if (ignoreTags.indexOf(tag) !== -1) { continue; }
          const isNeg = e.tags[tag] < 0;
          const sign = (isNeg ? '-' : '+');
          tagSigns[tag] = sign;
        }
      });
      let tags = Object.keys(tagSigns);
      tags = tags.map(function(t) { return tagSigns[t] + t; });
      tags.sort();

      // default row before adding stuff
      const defaultRow = new Array(tags.length+1).join().split('').fill(0);
      
      const rows = [tags];
      o.forEach(function(e) {
        const row = defaultRow.slice();
        for (let tag of Object.keys(e.tags)) {
          const index = tags.indexOf(tagSigns[tag] + tag);
          if (index === -1) { continue; }
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
          type: 'area',
          _type: 'area-spline',
          __type: 'bar',
          groups: [ stack1, stack2 ],
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
