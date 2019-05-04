import React, { Component } from 'react'
import Header from '../Home/Header'
import Pagination from './Pagination'
import 'semantic-ui-css/semantic.min.css'
import '../Stylesheets/Home.css'

export default class Home extends Component {
	render() {
		return (
			<div className="Home">
			    <div style={{ flex: 1, top: 0, width: '100%', margin:"auto" }}>
					  <Header />
					</div>

				<div>
					<h2 className="MissionHeader"> Our Mission </h2>
					<h5 className="MissionStatement">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lobortis iaculis enim a
						auctor. Nam euismod dui in mattis vehicula. Praesent condimentum semper justo tempor aliquam.
						Aliquam ex elit, ornare sed urna at, pulvinar pretium nisl. Aliquam eu rutrum turpis. Cras
						finibus felis ut massa pulvinar dictum. Nulla sodales orci porttitor nisl eleifend, in convallis
						risus sagittis. Integer sollicitudin mauris nisi, vel blandit tortor vulputate ut. Nulla
						efficitur massa sem, sed pretium nisi efficitur quis. V estibulum hendrerit nibh eu ligula
						mattis, at sodales nisl tempus. Pellentesque at risus a augue maximus venenatis vitae quis ante.
					</h5>
				</div>
                <div>
                    <Pagination/>
                </div>
			</div>
		)
	}
}
