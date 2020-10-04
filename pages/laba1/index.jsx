import { useState, useRef } from 'react'
import Layout from 'components/layout.jsx'
import { LibInput, RippleButton } from 'components/inputs.jsx'

import { FaLock, FaUnlock } from 'react-icons/fa'

import { encrypt, decrypt } from 'libs/onceCipher.js'

import style from 'styles/laba.module.sass'

const Laba1Page = (props) => {

	const [ outputValue, setOutputValue ] = useState('');

	const values = useRef({});

	const _encrypt = () => {

		const _str = encrypt(values.current.input, values.current.key);

		setOutputValue(_str);
	}

	const _decrypt = () => {

		const _str = decrypt(values.current.input, values.current.key);

		setOutputValue(_str);
	}

	const onChange = (e) => {
		Object.assign(values.current, e);
	}

	return (
		<Layout title="Одноразовый шифр" sub="Лабораторная работа 1">
			<main className={style.main}>
				<textarea className={style.textArea} rows="6" placeholder="Одноразовый ключ" 
					onChange={(e) => onChange({key: e.target.value})}>
				</textarea>
				
				<LibInput label="Исходный текст" name="input" onChange={onChange}/>
				<div className={style.buttons}>
					<RippleButton onClick={_encrypt}><FaLock/> Зашифровать!</RippleButton>
					<RippleButton onClick={_decrypt}><FaUnlock/> Расшифровать!</RippleButton>
				</div>
				<LibInput label="Преобразованный текст" value={outputValue}/>
		
			</main>
		</Layout>
	);

}

export default Laba1Page;