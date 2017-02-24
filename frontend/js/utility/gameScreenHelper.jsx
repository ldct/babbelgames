export function shuffle(rngSeed, a) {

  var ret = [];

  a.forEach((e, i) => {
    ret[i] = e;
  });

  var rngIter = rngSeed;

  const random = function () {
    var x = Math.sin(rngIter++) * 10000;
    return x - Math.floor(x);
  }

  var j, x, i;
  for (i = ret.length; i; i -= 1) {
    j = Math.floor(random() * i);
    x = ret[i - 1];
    ret[i - 1] = ret[j];
    ret[j] = x;
  }

  return ret;
}