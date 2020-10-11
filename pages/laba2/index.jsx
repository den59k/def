import { useState, useRef } from 'react'
import Layout from 'components/layout.jsx'
import { LibInput, RippleButton, Picker } from 'components/inputs.jsx'

import { FaLock, FaUnlock, FaCodepen, FaSuperpowers } from 'react-icons/fa'
import { GiRegeneration } from 'react-icons/gi'

import { generateKeys, encrypt, decrypt } from 'libs/rsa.js'
import { generatePrime } from 'libs/tools.js'

import style from 'styles/laba.module.sass'

let keys = null;

const dataArray = [];
for(let i = 3; i < 50; i+=3)
	dataArray.push(i);

const convert = (str) => {
	const arr = [0, 0];
	if(str.length % 2 === 0) str = "0"+str;
	for(let i = 0; i < str.length; i+=2){
		const k = parseInt("0x"+str[i]+str[i+1]);

		arr.push(k);
	}

	return String.fromCharCode(...arr);
}

let array = [];

const Laba1Page = (props) => {

	const [ outputValue, setOutputValue ] = useState('');
	const [ pq, setPq ] = useState({p: 0n, q: 0n});
	const [ privateKey, setPrivateKey ] = useState(null);
	const [ publicKey, setPublicKey ] = useState(null);

	const [values, setValues] = useState({text: '', cipherText: ''});


	const generate = () => {
		const size = values.size || 3;

		setPq({
			p: generatePrime(size),
			q: generatePrime(size)
		})
	}

	const generateKey = () => {
		keys = generateKeys(pq.p, pq.q);
		console.log(keys);
		const privateKeyStr = window.btoa(convert(keys.private.d.toString(16)) + convert(keys.private.n.toString(16)));
		const publicKeyStr = window.btoa(convert(keys.public.e.toString(16)) + convert(keys.public.n.toString(16)));

		setPrivateKey(privateKeyStr);
		setPublicKey(publicKeyStr);

	}

	const onChange = (e) => {
		setValues(Object.assign({}, values, e));
	}

	const _encrypt = () => {
		if(values.text.length === 0) return;
		console.log(values.text);
		const arr = encrypt(values.text, keys.public);

		array = arr;

		const cipherText = array.map(i => i.toString(16)).join("\n");
		setValues(Object.assign({}, values, {cipherText} ));
	}

	const _decrypt = () => {
		if(values.cipherText.length === 0) return;
		const _arr = values.cipherText.split("\n").map(str => BigInt("0x"+str));


		const decrypted = decrypt(_arr, keys.private);

		console.log(decrypted);
		setValues(Object.assign({}, values, {text: decrypted} ));
	}



	return (
		<Layout title="Алгоритм RSA" sub="Лабораторная работа 2">
			<main className={style.main}>

				<div className={style.pair}>
					<div>Байт:</div>
					<Picker onChange={onChange} name="size" width="50px" data={dataArray}/>
					<RippleButton style={{flexGrow: '1'}} onClick={generate}><FaCodepen/> Сгенерировать пару чисел</RippleButton>
				</div>

				<div className={style.pair}>
					{Object.keys(pq).map(key => (
						<div className={style.field} key={key}>
							<div className={style.name}>{key}</div>
							<div className={style.value}>{pq[key].toString()}</div>
						</div>
					))}
				</div>


				{pq.p > 0 && pq.q > 0 && (<RippleButton style={{flexGrow: '1'}} onClick={generateKey}><FaSuperpowers/> Сгенерировать ключ</RippleButton>)}

				{publicKey && privateKey && (
					<div className={style.pair}>
						<div className={style.column}> 
							<div className={style.field}>
								<div className={style.name}>Публичный ключ RSA</div>
								<div className={style.value}>{publicKey}</div>
							</div>

							<RippleButton onClick={_encrypt}><FaLock/> Зашифровать открытым ключом</RippleButton>
							<textarea className={style.textArea} rows="6" placeholder="Исходный Текст" 
								onChange={(e) => onChange({text: e.target.value})} value={values.text}>
							</textarea>

						</div>

						<div className={style.column}> 
							<div className={style.field}>
								<div className={style.name}>Приватный ключ RSA</div>
								<div className={style.value}>{privateKey}</div>
							</div>

							<RippleButton onClick={_decrypt}><FaUnlock/> Расшифровать закрытым ключом</RippleButton>

							<textarea className={style.textArea} rows="6" placeholder="Шифрованный текст" 
								onChange={(e) => onChange({cipherText: e.target.value})} value={values.cipherText}>
							</textarea>

						</div>
					</div>
				)}

			</main>
		</Layout>
	);

}

export default Laba1Page;