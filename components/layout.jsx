import Head from 'next/head'
import style from 'styles/layout.module.sass'

const Layout = (props) => {

	return (
		<div className={style.layout}>
			<Head>
				<title>{props.title}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<div className={style.title}>
				<h2>{props.sub}</h2>
				<h1>{props.title}</h1>
			</div>
			<div className={style.content}>
				{props.children}
			</div>
		</div>
	);

}

export default Layout;