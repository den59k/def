import { useState, useRef } from 'react'
import Layout from 'components/layout.jsx'
import { LibInput, RippleButton, Picker } from 'components/inputs.jsx'
import sha1 from 'js-sha1';
import _ from 'lodash'

import { MdSpellcheck, MdLock } from 'react-icons/md'

import { generateKeys, encrypt, decrypt } from 'libs/rsa.js'
import { generatePrime, fastModularExponentiation } from 'libs/tools.js'

import style from 'styles/laba.module.sass'

const round = (i, max) => {
	while(i >= max)
		i -= max;
	return i;
}
const Laba1Page = (props) => {

	const [ values, setValues ] = useState({cycles: 2});
	const onChange = (obj) => {
		
		const newVal = Object.assign({}, values, obj);

		if(newVal.text && newVal.gamma && newVal.gamma.length > 0){
			let ciphered = "";
			for(let i = 0; i < newVal.text.length; i++){
				ciphered = ciphered + String.fromCharCode(newVal.text.charCodeAt(i) ^ newVal.gamma[round(i, newVal.gamma.length)]);

			}

			newVal.ciphered = ciphered;
		}

		setValues(newVal);
	}

	const generateGamma = () => {
		const str = values.text;
		const arr = [];
		for(let i = 0; i < str.length; i++)
			arr.push(_.random(0, 256, false));

		onChange({gamma: arr, gammaStr: arr.map(i => i.toString(16)).join('') });
	}

	const cipher = () => {

	}

	return (
		<Layout title="Метод гаммирования" sub="Лабораторная работа 8" >
			<main className={style.main} style={{width: "400px"}}>
				<LibInput label="Исходный текст" name="text" onChange={onChange} className="auto"/>			
				

				<RippleButton style={{flexGrow: '1'}} onClick={generateGamma}><MdLock/> Сгенерировать гамму</RippleButton>

				<div className={style.field}>
					<div className={style.name}>Гамма (HEX)</div>
					<div className={style.value}>{values.gammaStr}</div>
				</div>

				
				<div className={style.field}>
					<div className={style.name}>Результат шифрования (XOR)</div>
					<div className={style.value}>{values.ciphered}</div>
				</div>

			</main>
		</Layout>
	);

}

export default Laba1Page;