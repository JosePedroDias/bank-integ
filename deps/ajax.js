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
