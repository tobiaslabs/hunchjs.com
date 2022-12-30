import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

const FeatureList = [
	{
		title: 'Serverless Search',
		// This is how you would add SVG images to the features.
		// Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
		description: (
			<>
				HunchJS was designed as a true serverless search solution, no
				persistent running services required.
			</>
		),
	},
	{
		title: 'Bet on Markdown',
		// Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
		description: (
			<>
				HunchJS sticks with what's been proven: Markdown files with
				Frontmatter, for ultimate portability.
			</>
		),
	},
	{
		title: 'No Surprises',
		// Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
		description: (
			<>
				HunchJS is built to be plain and simple, on the belief that the
				right simple options make software more powerful.
			</>
		),
	},
]

function Feature({ Svg, title, description }) {
	return (
		<div className={clsx('col col--4')}>
			{/*<div className="text--center">*/}
			{/*	<Svg className={styles.featureSvg} role="img" />*/}
			{/*</div>*/}
			<div className="text--center padding-horiz--md">
				<h3>{title}</h3>
				<p>{description}</p>
			</div>
		</div>
	)
}

export default function HomepageFeatures() {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	)
}
