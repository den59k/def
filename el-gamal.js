const { calcSecretExponent, fastModularExponentiation, generatePrime } = require('./libs/tools.js')
const crypto = require('crypto');
const sha1 = require('js-sha1');

const p = generatePrime(20);
const g = generatePrime(10);
const x = generatePrime(10);

const y = fastModularExponentiation(g, x, p);

const k = 257n;

const a = fastModularExponentiation(g, k, p);


const message = "It is a big message. Используй его с умом. И вообще, это самый простой текст";
const __M = sha1(message);
const M = BigInt("0x"+__M);

const _M = (x*a) % (p-1n);
let delta = M-_M;
if(delta < 0) delta = delta + (p-1n);
for(let i = 0; i < 2000; i++){

	console.log(delta % k);

	if(delta % k == 0)
		break;

	delta += (p-1n);
}
const b = delta/k;

const x1 = fastModularExponentiation(y, a, p);
const x2 = fastModularExponentiation(a, b, p);
const x3 = fastModularExponentiation(g, M, p);

console.log("CHECK EXPONENT");

console.log(x3);

console.log((x1*x2) % p);
