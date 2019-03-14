import React, { Component } from 'react'
import Slider from './Slider'
import DonateButton from './DonateButton'
import Footer from './Footer'
import 'semantic-ui-css/semantic.min.css'
import './Stylesheets/Home.css'

export default class Home extends Component {
	render() {
		return (
			<div className="Home">
				<div className="Logo">
					<h1 className="Logo">Logo Here</h1>
				</div>
				<div className="ImageCarousel">
					<Slider />
				</div>
				<div className="MissionStatement">
					<h2> Our Mission </h2>
					<h5>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lobortis iaculis enim a
						auctor. Nam euismod dui in mattis vehicula. Praesent condimentum semper justo tempor aliquam.
						Aliquam ex elit, ornare sed urna at, pulvinar pretium nisl. Aliquam eu rutrum turpis. Cras
						finibus felis ut massa pulvinar dictum. Nulla sodales orci porttitor nisl eleifend, in convallis
						risus sagittis. Integer sollicitudin mauris nisi, vel blandit tortor vulputate ut. Nulla
						efficitur massa sem, sed pretium nisi efficitur quis. V estibulum hendrerit nibh eu ligula
						mattis, at sodales nisl tempus. Pellentesque at risus a augue maximus venenatis vitae quis ante.
					</h5>
				</div>
				<div className="DonateButton">
					<DonateButton />
				</div>
				<div style={{ flex: 1, position: 'fixed', bottom: 0, width: '100%' }}>
					<Footer />
				</div>
			</div>
		)
	}
}
