const _rnd = function(mx) { return BigInt(Math.floor(Math.random()*mx)); }
const _30 = 1 << 30;
const _4 = 1 << 4;

export default function rnd64() { 
  var bi = (_rnd(_30) << BigInt(34)) + (_rnd(_30)<<BigInt(4)) + _rnd(_4); 
  return BigInt.asUintN(64, bi).toString();
}
