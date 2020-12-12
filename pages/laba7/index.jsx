import { useState, useRef } from 'react'
import Layout from 'components/layout.jsx'
import { LibInput, RippleButton, Picker } from 'components/inputs.jsx'
import sha1 from 'js-sha1';
import _ from 'lodash'

import { MdSpellcheck, MdLock } from 'react-icons/md'

import { generateKeys, encrypt, decrypt } from 'libs/rsa.js'
import { generatePrime, fastModularExponentiation } from 'libs/tools.js'

import style from 'styles/laba.module.sass'

const initialPermutation = [];
for(let i = 0; i < 32; i++)
	initialPermutation.push(i);

_.shuffle(initialPermutation);


const keyPermutation = [];
for(let i = 0; i < 16; i++)
	keyPermutation.push(i);

_.shuffle(keyPermutation);

function cycled (int){																					//Циклический сдвиг вправо
	return (int >> 1) + ((int & 1) << 15);
}

function cipher (int, _key, cycles){

	let newInt = 0;
	for(let i = 0; i < initialPermutation.length; i++)
		newInt += ((int >> i & 1) << initialPermutation[i]);				//Здесь мы получаем нужный бит и сдвигаем его на нужную позицию перестановки
	
	let l0 = newInt >>> 16;
	let r0 = (newInt & ~(~0 << 16));																//Ну что сказать - здесь мы делим число на две части

	let key = 0;
	for(let i = 0; i < keyPermutation.length; i++)
		key += ((_key >> i & 1) << keyPermutation[i]);

	for(let i = 0; i < cycles; i++){
		key = cycled(key);
		const a = l0;
		l0 = l0 ^ key ^ r0;
		r0 = a;
	}

	const _newInt = (l0 << 16) + r0;

	let finalInt = 0;
	for(let i = 0; i < initialPermutation.length; i++)
		finalInt += ((_newInt >> initialPermutation[i] & 1) << i);

	return finalInt;
}

function decypher (int, _key, cycles){
	let newInt = 0;
	for(let i = 0; i < initialPermutation.length; i++)
		newInt += ((int >> i & 1) << initialPermutation[i]);				//Здесь мы получаем нужный бит и сдвигаем его на нужную позицию перестановки

	let l0 = (newInt >>> 16) | 0;
	let r0 = (newInt & ~(~0 << 16));																//Ну что сказать - здесь мы делим число на две части

	let key = 0;
	for(let i = 0; i < keyPermutation.length; i++)
		key += ((_key >> i & 1) << keyPermutation[i]);

	const keyArr = [];
	for(let i = 0; i < cycles; i++){
		key = cycled(key);
		keyArr.push(key);
	}

	for(let i = 0; i < cycles; i++){
		key = keyArr[cycles-i-1];
		const a = r0;
		r0 = r0 ^ key ^ l0;
		l0 = a;
	}

	const _newInt = (l0 << 16) + r0;

	let finalInt = 0;
	for(let i = 0; i < initialPermutation.length; i++)
		finalInt += ((_newInt >> initialPermutation[i] & 1) << i);

	return finalInt;
}

const dataArray = [];
for(let i = 1; i < 16; i++)
	dataArray.push(i);

const getHash = (str, cycles) => {
	const utf8 = [];

	for(let i = 0; i < str.length; i++){
		const char = str.charCodeAt(i);
		while(char !== 0){
			utf8.push(char & ~(~0<<8));
			char = char >>> 8;
		}
	}

	let lastA = 0;
	for(let i = 0; i < utf8.length; i+=2){
		const key = (utf8[i] << 8) + (utf8[i+1] || 0);

		const a = cipher(0, key, cycles);
		lastA = lastA ^ a;
	}
	if(lastA < 0)
		lastA = 0xFFFFFFFF + lastA + 1;

	return lastA;
}

const Laba1Page = (props) => {

	const [ values, setValues ] = useState({cycles: 2});
	const onChange = (obj) => {
		setValues(Object.assign({}, values, obj, {check: 0}));
	}

	const onHash = () => {
		const hash = getHash(values.password, values.cycles);

		setValues({...values, hash});
		
	}

	const onCheck = () => {
		const hash = getHash(values.password, values.cycles);

		if(hash === values.hash)
			setValues({...values, check: 1});
		else
			setValues({...values, check: -1});
	}

	return (
		<Layout title="Хэширование паролей" sub="Лабораторная работа 7" >
			<main className={style.main} style={{width: "400px"}}>
				<div className={style.pair}>
					<div>Циклов:</div>
					<Picker onChange={onChange} name="cycles" width="50px" data={dataArray}/>
					<LibInput label="Пароль" name="password" onChange={onChange} className="auto"/>			
				</div>

				<RippleButton style={{flexGrow: '1'}} onClick={onHash}><MdLock/> Хэшировать пароль</RippleButton>
				<div className={style.field}>
					<div className={style.name}>Хэш пароля</div>
					<div className={style.value}>{values.hash && values.hash.toString(16)}</div>
				</div>
				<RippleButton style={{flexGrow: '1'}} onClick={onCheck}><MdSpellcheck/> Проверить пароль</RippleButton>
				{!!values.check && ( <div>{values.check < 0?"Пароль не верный": "Пароль верный"}</div> )}
			
			</main>
		</Layout>
	);

}

export default Laba1Page;