import Head from 'next/head'
import Link from 'next/link'
import Layout from 'components/layout.jsx'
import _ from 'lodash'

import style from 'styles/laba.module.sass'

const links = [];
for(let i = 1; i <= 8; i++)
	links.push({to: "/laba"+i, title: "Лабораторная работа "+i});

export default function Home() {
  return (
    <Layout title="Защита информации" sub="Лабораторные работы" >
    	<main className={style.main} style={{width: "400px"}}>
    		{links.map(item => (
    			<Link key={item.to} href={item.to}>
    				<a>{item.title}</a>
    			</Link>
  			))}
    	</main>
    </Layout>
  )
}
