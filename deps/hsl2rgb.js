'use strict';

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
