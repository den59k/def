const { calcSecretExponent, fastModularExponentiation, generatePrime } = require('./tools.js')

export function generateKeys (p, q) {
	const n = p*q; 
	const euler = (p-1n)*(q-1n);

	const e = 17n;
	const d = calcSecretExponent(e, euler);

	return { public: {e, n}, private: {d, n} };
}

//Разбиваем строку на блоки
export const encrypt = (str, publicKey) => {

	const size = publicKey.n.toString(16).length-4;
	console.log(size);

	let k = 1n;
	let m = 0n;
	let array = [];

	let s = 0;
	for(let i = 0; i < str.length; i++){
		m = m + BigInt(str.charCodeAt(i)) * k;
		k *= 65536n;
		s += 4;

		if(s >= size){
			array.push(m);
			k = 1n;
			s = 0;
			m = 0n;
		}
	}
	if(s >= 0)
		array.push(m);


	const {e, n} = publicKey;
	const arr = [];


	for(let i = 0; i < array.length; i++){

		const a = fastModularExponentiation(array[i], e, n);
		arr.push(a);
	}

	let outString = "";
	for(let i = 0; i < array.length; i++){
		let q = array[i];
		while(q > 0){
			outString += String.fromCharCode(Number(q%65536n));
			q /= 65536n;
		}
	}
	console.log(outString);

	return arr;
}

export const decrypt = (arr, privateKey) => {

	const {d, n} = privateKey;
	console.log(d, n);
	let outString = "";
	for(let i = 0; i < arr.length; i++){

		let q = fastModularExponentiation(arr[i], d, n);
		console.log(q);
		while(q > 0){
			outString += String.fromCharCode(Number(q%65536n));
			q /= 65536n;
		}
	}

	return outString;

}

/*
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

console.log(String.fromCharCode(...arr2));*/