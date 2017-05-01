'use strict';

const fs = require('fs');
const crypto = require('crypto');



function idFromData(o) {
  const hash = crypto.createHash('sha256');
  hash.update( JSON.stringify(o) );
  return hash.digest('hex');
}



module.exports = function(dbName) {
  const dataM = new Map(); // for lookups
  let data = {}; // for storing in fs only

  const fn = dbName + '.db.json';

  try {
    data = JSON.parse( fs.readFileSync(fn).toString() );
    for (const id in data) {
      dataM.set(id, data[id]);
    }
  } catch (ex) {
  }

  function save() {
    // fs.writeFileSync(fn, JSON.stringify(data) );
    fs.writeFileSync(fn, JSON.stringify(data, null, 2) );
  }

  const API = {};

  function put(o) {
    if ('_id' in o) { delete o['_id']; }
    const id = idFromData(o);
    o._id = id;

    dataM.set(id, o);
    data[id] = o;
  }

  API.clear = function() {
    dataM.clear();
    data = {};
    save();
  }

  API.put = function(o) {
    put(o);
    save();
  };

  API.puts = function(oArr) {
    oArr.forEach(put);
    save();
  };

  API.delete = function(oOrId) {
    const id = (typeof oOrId === 'string') ? oOrId : oOrId._id;
    delete data[id];
    dataM.delete(id);
    save();
  };

  API.get = function(id) {
    return dataM.get(id);
  };

  API.has = function(oOrId) {
    const id = (typeof oOrId === 'string') ? oOrId : oOrId._id;
    return dataM.has(id);
  };

  API.iterator = function() {
    return dataM.values(); // entries, keys, values
  };

  API.size = function() {
    //return dataM.size();
    return Object.keys(data).length;
  };

  API.filter = function(fn) {
    if (!fn) { fn = function() { return true; } }
    const res = [];
    const _it = dataM.values();
    let it = _it.next();
    while (!it.done) {
      const v = it.value;
      if (fn(v)) { res.push(v); }
      it = _it.next();
    };
    return res;
  };

  return API;
}
