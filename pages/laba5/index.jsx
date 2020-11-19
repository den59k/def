import { useState, useRef } from 'react'
import Layout from 'components/layout.jsx'
import { LibInput, RippleButton, Picker } from 'components/inputs.jsx'
import sha1 from 'js-sha1';
import _ from 'lodash'

import { MdFileUpload } from 'react-icons/md'

import { generateKeys, encrypt, decrypt } from 'libs/rsa.js'
import { generatePrime, fastModularExponentiation } from 'libs/tools.js'

import style from 'styles/laba.module.sass'


function zeroPad (num) {
	if(num.length <= 8)
  	return "00000000".slice(num.length) + num;					//Мы должны будем дополнить нашу строку нулями слева
  else
  	return "0000000000000000".slice(num.length)+num;
}

const Laba1Page = (props) => {

	const [ values, setValues ] = useState('');

	const onChange = (obj) => {
		if("input" in obj){
			const binary = [];
		 	for (var i = 0; i < obj.input.length; i++) 
	    	binary.push(zeroPad(obj.input[i].charCodeAt(0).toString(2)));
		 	
	    const str = binary.join("");

	    let k = 0;
	    let n = 1;
	    let hamming = [];
	    while(k < str.length){
	    	if(hamming.length < n-1){
	    		const end = k+n-1-hamming.length;
	    		for(let i = k; i < Math.min(end, str.length); i++){
	    			hamming.push(str[i]);
	    		}
	    		k = end;
	    	}
	    	if(k < str.length)
	    		hamming.push(0);
	    	n *= 2;
	    }
	    n = 1;
	    const controlBits = [];
	    while(n < hamming.length){
	    	const a = 0;
	    	for(let i = n-1; i < hamming.length; i+=n*2)
	    		for(let j = 0; j < n; j++)
	    			a += hamming[i+j] === '1';
	    	controlBits.push(a);
	    	n *= 2;
	    }

	    obj.controlBits = controlBits;

	    n = 1;
	    for(let i = 0; i < controlBits.length; i++){
	    	hamming[n-1] = controlBits[i]%2;
	    	n *= 2;
	    }

	    obj.hamming = hamming.join("");
	    obj.binary = binary;

	    obj.error = 0;
		}

		let error = 0;
		if(obj.hamming){
			let n = 1;
			while(n < obj.hamming.length){
				const a = 0;
				for(let i = n-1; i < obj.hamming.length; i+=n*2)
	    		for(let j = 0; j < n; j++)
	    			a += obj.hamming[i+j] === '1';

	    	if(a%2 === 1)
	    		error += n;

				n*= 2;
			}

			let str = "";
			let array = [];
			n = 1;
			for(let i = 1; i < obj.hamming.length+1; i++){
				if(i === n){ n*=2; continue; }

				str += (i !== error)? obj.hamming[i-1]: (obj.hamming[i-1]==='1'?'0': '1');			//Инвертируем ошибочный бит
				if(str.length === 8){
					array.push(parseInt(str, 2));
					str ="";
				}
			}
			obj.error = error;
			obj.str = String.fromCharCode(...array);
		}

		setValues(Object.assign({}, values, obj));
	}

	return (
		<Layout title="Код Хэмминга" sub="Лабораторная работа 5" >
			<main className={style.main} style={{width: "500px"}}>
				<LibInput label="Строка (UTF-8)" name="input" onChange={onChange}/>
				<div className={style.field}>
					<div className={style.name}>Бинарное представление</div>
					<div className={style.value}>{values.binary && values.binary.join(" ")}</div>
				</div>

				<div className={style.field}>
					<div className={style.name}>Контрольные значения</div>
					<div className={style.value}>{values.controlBits && values.controlBits.join(", ")}</div>
				</div>

				<textarea className={style.textArea} rows="3" placeholder="Текст + Код хэмминга" 
					onChange={(e) => onChange({hamming: e.target.value})} value={values.hamming}>
				</textarea>

				<div>{values.error === 0? "В строке нет ошибок": ("Ошибка в символе "+values.error)}</div>

				<div className={style.field}>
					<div className={style.name}>Восстановленная строка</div>
					<div className={style.value} style={{fontSize: "16px"}}>{values.str}</div>
				</div>

			</main>
		</Layout>
	);

}

export default Laba1Page;