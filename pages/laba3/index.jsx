import { useState, useRef } from 'react'
import Layout from 'components/layout.jsx'
import { LibInput, RippleButton, Picker } from 'components/inputs.jsx'
import sha1 from 'js-sha1';

import { FaLock, FaUnlock, FaCodepen, FaSuperpowers } from 'react-icons/fa'
import { GiRegeneration } from 'react-icons/gi'

import { generateKeys, encrypt, decrypt } from 'libs/rsa.js'
import { generatePrime, fastModularExponentiation } from 'libs/tools.js'

import style from 'styles/laba.module.sass'

let keys = null;

const dataArray = [];
for(let i = 3; i < 50; i+=3)
	dataArray.push(i);

let array = [];

const Laba1Page = (props) => {

	const [ outputValue, setOutputValue ] = useState('');
	const [ pq, setPq ] = useState({p: 0n, g: 0n, x: 0n});
	const [ privateKey, setPrivateKey ] = useState(null);
	const [ publicKey, setPublicKey ] = useState(null);

	const [values, setValues] = useState({text: '', sign: ''});


	const generate = () => {
		const size = values.size || 3;

		const p = generatePrime(size);
		const g = generatePrime(size/2);
		const x = generatePrime(size/2);

		const y = fastModularExponentiation(g, x, p);
		const k = 257n;
		const a = fastModularExponentiation(g, k, p);

		setPq({
			p, g, x, y, k, a
		});
	}

	const onSign = () => {
		const message = values.text;
		const { p, g, x, y, k, a } = pq;
		const __M = sha1(message);
		const M = BigInt("0x"+__M);

		const _M = (x*a) % (p-1n);
		let delta = M-_M;
		if(delta < 0) delta = delta + (p-1n);
		for(let i = 0; i < 2000; i++){

			if(delta % k == 0)
				break;

			delta += (p-1n);
		}
		const b = delta/k;

		console.log(a);
		setValues(Object.assign({}, values, {
			hash: __M,
			sign: a.toString(16)+"\n"+b.toString(16)
		}))

	}

	const onChange = (e) => {
		setValues(Object.assign({}, values, e));
	}

const checkSign = () => {
	const message = values.text;
	const { y, g, p } = pq;

	const sign = values.sign.split("\n");
	const a = BigInt("0x"+sign[0]);
	const b = BigInt("0x"+sign[1]);

	const __M = sha1(message);
	const M = BigInt("0x"+__M);

	const x1 = fastModularExponentiation(y, a, p);
	const x2 = fastModularExponentiation(a, b, p);
	const x3 = fastModularExponentiation(g, M, p);

	console.log(x3);

	console.log((x1*x2) % p);

	setValues(Object.assign({}, values, {check: (x3 === (x1*x2) % p)}));
}

	return (
		<Layout title="Подпись Эль-Гамаля" sub="Лабораторная работа 3">
			<main className={style.main}>

				<div className={style.pair}>
					<div>Байт:</div>
					<Picker onChange={onChange} name="size" width="50px" data={dataArray}/>
					<RippleButton style={{flexGrow: '1'}} onClick={generate}><FaCodepen/> Сгенерировать числа и посчитать ключ</RippleButton>
				</div>

				<div className={style.pair} style={{flexWrap: "wrap"}}>
					{Object.keys(pq).map(key => (
						<div className={style.field} key={key}>
							<div className={style.name}>{key}</div>
							<div className={style.value}>{pq[key].toString(16)}</div>
						</div>
					))}
				</div>

				<textarea className={style.textArea} rows="6" placeholder="Исходный Текст" 
					onChange={(e) => onChange({text: e.target.value})} value={values.text}>
				</textarea>

				<RippleButton style={{flexGrow: '1'}} onClick={onSign}><FaSuperpowers/> Подписать</RippleButton>

				<div className={style.field}>
					<div className={style.name}>Хэш сообщения (SHA1)</div>
					<div className={style.value}>{values.hash}</div>
				</div>

				<textarea className={style.textArea} rows="2" placeholder="Подпись" 
					onChange={(e) => onChange({sign: e.target.value})} value={values.sign}>
				</textarea>

				<RippleButton style={{flexGrow: '1'}} onClick={checkSign}><FaSuperpowers/> Проверить подпись</RippleButton>

				<div className={style.field}>
					<div className={style.name}>Результат проверки</div>
					<div className={style.value}>{values.check?"Подпись верна" : "Подпись не верна"}</div>
				</div>

			</main>
		</Layout>
	);

}

export default Laba1Page;