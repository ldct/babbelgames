export function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(window.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

window.rngSeed = 1;
window.random = function () {
  var x = Math.sin(window.rngSeed++) * 10000;
  return x - Math.floor(x);
}