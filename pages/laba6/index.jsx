import { useState, useRef } from 'react'
import Layout from 'components/layout.jsx'
import { LibInput, RippleButton, Picker } from 'components/inputs.jsx'
import sha1 from 'js-sha1';
import _ from 'lodash'

import { MdFileUpload } from 'react-icons/md'

import { generateKeys, encrypt, decrypt } from 'libs/rsa.js'
import { generatePrime, fastModularExponentiation } from 'libs/tools.js'

import style from 'styles/laba.module.sass'

function setTable(item, table, str=""){
	if(item.children){
		setTable(item.children[0], table, str+"0")
		setTable(item.children[1], table, str+"1")
	}else
		table.set(item.key, str || "0");
}

const Laba6Page = (props) => {

	const [ values, setValues ] = useState('');

	const onChange = (obj) => {

		if(obj.input){
			const chars = new Map();
			for(let i = 0; i < obj.input.length; i++){
				const a = obj.input[i];
				chars.set(a, (chars.get(a) || 0) + 1);
			}

			let array = [];
			for(let [key, value] of chars.entries())
				array.push({key, count: value});
			
			while(array.length > 1){
				array = _.sortBy(array, ['count']);
				const newArr = array.slice(2);
				newArr.push({ count: array[0].count+ array[1].count, children: array.slice(0, 2) });
				array = newArr;
			}

			const table = new Map();
			setTable(array[0], table);

			let tableStr = "";
			for(let [key, value] of table)
				tableStr += key+":"+value + "  ";

			obj.tableStr = tableStr;

			let archiveStr = "";
			for(let i = 0; i < obj.input.length; i++)
				archiveStr += table.get(obj.input[i]);
		
			obj.archiveStr = archiveStr;

			let hexStr = "";
			let _str = "";
			for(let i = archiveStr.length-1; i >= 0; i--){
				_str = archiveStr[i]+_str;
				if(_str.length === 8){
					hexStr = parseInt(_str, 2).toString(16) + hexStr;
					_str = "";
				}
			}
			if(_str)
				hexStr = parseInt(_str, 2).toString(16) + hexStr;

			obj.hexStr = hexStr;

			const arr = [];

			let cursor = 1;
			while(cursor <= hexStr.length){
				let c = cursor;
				let str = "";
				const condition = (hexStr[c] === hexStr[c-1])
				while((hexStr[c] === hexStr[c-1]) === condition && c < hexStr.length && c-cursor < 16)
					c++;

				if(condition || c === hexStr.length)
					c+=1;

				arr.push(hexStr.slice(cursor-1, c-1));
				cursor = c;
			}

			obj.RLE = arr;

			obj.RLEstr = arr.map(item => (item.length <= 1 || item[0] !== item[1])?("0"+item.length.toString(16)+item): (item.length.toString(16)+item[0]) ).join("");
		}

		setValues(Object.assign({}, values, obj));
	}

	return (
		<Layout title="Методы сжатия информации" sub="Лабораторная работа 6" >
			<main className={style.main} style={{width: "500px"}}>
				<LibInput label={"Исходный текст - "+(values.input?values.input.length: 0)+" байт"} name="input" onChange={onChange}/>
				<div className={style.field}>
					<div className={style.name}>Таблица символов</div>
					<div className={style.value}>{values.tableStr}</div>
				</div>
				<div className={style.field}>
					<div className={style.name}>Сжатая строка (Хаффман)</div>
					<div className={style.value}>{values.archiveStr}</div>
				</div>
				<div className={style.field}>
					<div className={style.name}>Сжатая строка (Хаффман) - HEX - {values.hexStr?(Math.ceil(values.hexStr.length/2)): 0} байт</div>
					<div className={style.value}>{values.hexStr}</div>
				</div>

				<div className={style.field}>
					<div className={style.name}>Блоки RLE для сжатия</div>
					<div className={style.value}>{values.RLE && values.RLE.join(", ")}</div>
				</div>

				<div className={style.field}>
					<div className={style.name}>Блоки RLE для сжатия - {values.RLEstr?(Math.ceil(values.RLEstr.length/2)): 0} байт</div>
					<div className={style.value}>{values.RLEstr}</div>
				</div>


			</main>
		</Layout>
	);

}

export default Laba6Page;