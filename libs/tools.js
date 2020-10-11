const rand = require('brorand');
const {toBigIntBE, toBigIntLE, toBufferBE, toBufferLE} =  require('bigint-buffer');
const mr = require('miller-rabin').create();
const bn = require('bn.js');


module.exports.calcSecretExponent = function (e, euler){
	let d;
	for(d = 2n; d < 100n; d++){
		if((1n + euler*d) % e == 0){
			
			return ((1n + euler*d) / e);
		}
	}

	return -1;
}

module.exports.fastModularExponentiation = function(a, b, n) {
  a = a % n;
  var result = 1n;
  var x = a;

  while(b > 0){
    var leastSignificantBit = b % 2n;
    b = b / 2n;

    if (leastSignificantBit == 1n) {
      result = result * x;
      result = result % n;
    }

    x = x * x;
    x = x % n;
  }
  return result;
};

const primeLow = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
const primeLowMap = primeLow.map((i) => new bn(i));

module.exports.generatePrime = function(size) {

	let b = new bn(rand(size));

	while(b.isEven())
		b = b.shrn(1);

	let increment = new bn(2);

	for(let i = 0; i < 300; i++){

		for(let c of primeLowMap)
			if(b.mod(c).isZero())
				continue;

		if(mr.test(b))
			break;

		b = b.add(increment);
	}

	return BigInt('0x'+b.toString('hex'));
}
