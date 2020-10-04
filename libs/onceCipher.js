const convert = (char) => {
	let ch = null;
	switch (char) {
		case 32: ch = 32; break;
		case 33: ch = 33; break;
		case 46: ch = 34; break;
		case 44: ch = 35; break;
		case 63: ch = 36; break;

		default: 
			if(char < 1000)
				ch = char-48+37;
			else
				ch = char - 1040;
	}

	if(ch < 0 || ch > 46)
		ch = 32;

	return ch;
}

const unConvert = (char) => {
	let ch = null;
	switch (char) {
		case 32: ch = 32; break;
		case 33: ch = 33; break;
		case 34: ch = 46; break;
		case 35: ch = 44; break;
		case 36: ch = 63; break;

		default: 
			if(char > 32)
				ch = char-37+48;
			else
				ch = char + 1040;
	}

	return ch;
}

export const encrypt = (input, key) => {

	let output = '';

	const _input = input.toUpperCase();

	for(let i = 0; i < input.length; i++){
		const k = convert(_input.charCodeAt(i));
		const k2 = convert(key.charCodeAt(i));

		let k3 = k+k2;
		if(k3 > 46) k3 -= 46;

		console.log(unConvert(k3));

		output += String.fromCharCode(unConvert(k3));
	}

	return output;
}

export const decrypt = (input, key) => {
	let output = '';

	const _input = input.toUpperCase();

	for(let i = 0; i < input.length; i++){
		const k = convert(_input.charCodeAt(i));
		const k2 = convert(key.charCodeAt(i));

		let k3 = k-k2;
		if(k3 < 0) k3 += 46;

		console.log(unConvert(k3));

		output += String.fromCharCode(unConvert(k3));
	}

	return output;
}