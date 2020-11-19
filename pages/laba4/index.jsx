import { useState, useRef } from 'react'
import Layout from 'components/layout.jsx'
import { LibInput, RippleButton, Picker } from 'components/inputs.jsx'
import sha1 from 'js-sha1';
import _ from 'lodash'

import { MdFileUpload } from 'react-icons/md'

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

const Laba1Page = (props) => {

	const [ values, setValues ] = useState('');
	const onChange = (obj) => {
		setValues(Object.assign({}, values, obj));
	}

	const fileRef = useRef(null);
	const file2Ref = useRef(null);
	const aRef = useRef(null);

	const onFileChange = (e) => {
		const file = e.target.files[0];
		if(!file) return;

		let reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.onload = () => {
			const buffer = reader.result;
			const view = new DataView(buffer); 

			const key = parseInt(values.key, 16);

			const outputBuffer = new ArrayBuffer(Math.ceil(view.byteLength/4)*4);
			const outputView = new DataView(outputBuffer);

			for(let i = 0; i < view.byteLength/4; i++){
				if(i*4+4 > view.byteLength){
					let newInt = 0;
					for(let j = 0; j < view.byteLength-i*4; j++)
						newInt = (newInt << 8) + view.getUint8(i*4+j);
					outputView.setUint32(i*4, cipher(newInt, key, values.cycles));
				}else
					outputView.setUint32(i*4, cipher(view.getUint32(i*4), key, values.cycles));
			}

			const blob = new Blob([outputView.buffer], {type: "application/octet-binary"});
			const url = URL.createObjectURL(blob);

			aRef.current.href = url;
			aRef.current.click();

		};
		e.target.value = "";
	}


	const onFile2Change = (e) => {
		const file = e.target.files[0];
		if(!file) return;

		let reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.onload = () => {
			const buffer = reader.result;
			const view = new DataView(buffer); 

			const key = parseInt(values.key, 16);

			const outputBuffer = new ArrayBuffer(Math.ceil(view.byteLength/4)*4);
			const outputView = new DataView(outputBuffer);

			for(let i = 0; i < view.byteLength/4; i++){
				if(i*4+4 > view.byteLength){
					let newInt = 0;
					for(let j = 0; j < view.byteLength-i*4; j++)
						newInt = (newInt << 8) + view.getUint8(i*4+j);
					outputView.setUint32(i*4, decypher(newInt, key, values.cycles));
				}else
					outputView.setUint32(i*4, decypher(view.getUint32(i*4), key, values.cycles));
			}

			const blob = new Blob([outputView.buffer], {type: "application/octet-binary"});
			const url = URL.createObjectURL(blob);

			aRef.current.href = url;
			aRef.current.click();

		};
		e.target.value = "";
	}

	return (
		<Layout title="Блочное шифрование DES" sub="Лабораторная работа 4" >
			<main className={style.main} style={{width: "400px"}}>
				<div className={style.pair}>
					<div>Циклов:</div>
					<Picker onChange={onChange} name="cycles" width="50px" data={dataArray}/>
					<LibInput label="Ключ (hex) - 16бит" name="key" onChange={onChange}/>					
				</div>
				
				<input type="file" hidden={true} ref={fileRef} onChange={onFileChange}/>
				<input type="file" hidden={true} ref={file2Ref} onChange={onFile2Change}/>
				<RippleButton style={{flexGrow: '1'}} onClick={() => fileRef.current.click()}><MdFileUpload/> Зашифровать файл</RippleButton>
				<RippleButton style={{flexGrow: '1'}} onClick={() => file2Ref.current.click()}><MdFileUpload/> Расшифровать файл</RippleButton>

				<a ref={aRef} download="file.bin"></a>
			</main>
		</Layout>
	);

}

export default Laba1Page;