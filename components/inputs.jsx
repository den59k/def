import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import cn from 'classnames'
import styles from './inputs.module.sass'

export const LibInput = (props) => {

	const [ value, setValue ] = useState(props.value || '');

	useEffect(() => {
		setValue(props.value);
	}, [props.value]);

	const _props = Object.assign({}, props);
	delete _props.className;
	delete _props.label;
	delete _props.onChange;

	const onInput = (e) => {
		const _value = e.currentTarget.value;
		setValue(_value);
		if(props.onChange && props.name)
			props.onChange({[props.name]: _value});
	}

	return (
		<div className={cn({
			[styles.input]: true,  
			[props.className]: props.className,
			[styles.active]: value!=='',
			[styles.errored]: !!props.error
		})}>
			<label>{props.label}</label>
			<input {..._props} value={value} onChange={onInput} onInput={onInput}/>
			{props.icon}
		</div>
	);

}

let __counter = 0;
export const RippleButton = (props) => {

	const size = props.size || 100;

	const [ ripples, setRipples ] = useState([]);

	const ripplesRef = useRef();
	ripplesRef.current = ripples;

	useEffect(() => () => {								//Нам нужно сбросить эффект при размонтировании компонента
		for(let el of ripplesRef.current)
			clearTimeout(el.timeout);
	}, []);


	const onClick = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();

		const newRipple = {
			left: e.clientX - rect.left - size/2, top: e.clientY - rect.top - size/2, 
			id: __counter++, 
			size
		}

		newRipple.timeout = setTimeout(() => {
			if(ripplesRef.current.length > 1)
				setRipples(ripplesRef.current.slice(1));
			else
				setRipples([]);
		}, 1000);

		setRipples([...ripples, newRipple]);

	}

	const _props = Object.assign({}, props);
	delete _props.className;
	delete _props.children;
	delete _props.type;
	delete _props.to;

	if(props.to)

		return (
			<Link href={props.to}>
				<a onMouseDown={onClick} {..._props} className={cn({
					[styles.rippleButton]: true, 
					[props.className]: true,
					[styles.clear]: props.type === 'clear'
				})}>
					{props.children}
					{ripples.map((el) => (
						<div 
							className={styles.ripple}
							style={{top: el.top, left: el.left, width: el.size+'px', height: el.size+'px'}} 
							key={el.id}
						></div>
					))}
				</a>
			</Link>
		)

	else
		return (
			<button onMouseDown={onClick} {..._props} className={cn({
				[styles.rippleButton]: true, 
				[props.className]: true,
				[styles.clear]: props.type === 'clear'
			})}>
				{props.children}
				{ripples.map((el) => (
					<div 
						className={styles.ripple}
						style={{top: el.top, left: el.left, width: el.size+'px', height: el.size+'px'}} 
						key={el.id}
					></div>
				))}
			</button>
		)
}