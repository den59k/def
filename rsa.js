const rand = require('brorand');
const {toBigIntBE, toBigIntLE, toBufferBE, toBufferLE} =  require('bigint-buffer');
const mr = require('miller-rabin').create();
const bn = require('bn.js');

function calcSecretExponent (e, euler){
	let d;
	for(d = 2n; d < 10n; d++){
		if((1n + euler*d) % e == 0){
			
			return ((1n + euler*d) / e);
		}
	}

	return -1;
}

function fastModularExponentiation(a, b, n) {
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

function generatePrime() {

	let b = new bn(rand(20));

	while(b.isEven())
		b = b.shrn(1);

	let increment = new bn(2);

	for(let i = 0; i < 300; i++){
		console.log(b);

		for(let c of primeLowMap)
			if(b.mod(c).isZero())
				continue;

		if(mr.test(b))
			break;

		b = b.add(increment);
	}

	return BigInt('0x'+b.toString('hex'));
}


let d;
let n;
let e = 17n;

do{
	const p = generatePrime();
	const q = generatePrime();
	console.log(p);
	console.log(q);

	n = p*q;
	const euler = (p-1n)*(q-1n);

	e = 17n;

	d = calcSecretExponent(e, euler);

}while(d == -1);

const str = "Привет, как у тебя дела? Что делаешь такое интересное?";

const arr = [];

for(let i = 0; i < str.length; i++){

	const a = fastModularExponentiation(BigInt(str.charCodeAt(i)), e, n);
	arr.push(a);
}

console.log(d);

console.log(arr);

const arr2 = [];
for(let i = 0; i < arr.length; i++){

	const b = fastModularExponentiation(arr[i], d, n);

	console.log(b);
	arr2.push(Number(b));
}

console.log(String.fromCharCode(...arr2));