import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import logo from '../../logoPhotos/bpdx_circlelogo_white.png'
import 'semantic-ui-css/semantic.min.css'

export default class Header extends Component {
	state = {}
	handleItemClick = (e, { name }) => this.setState({ activeItem: name })

	render() {
		const { activeItem } = this.state

		return (
			<Menu
				inverted
				color={'olive'}
				size="massive"
				widths={5}
				style={{
					flexShrink: 100000, //don't allow flexbox to shrink it
					borderRadius: 0, //clear semantic-ui style
					margin: 0 //clear semantic-ui style
				}}
			>
				<Menu.Item
					name="About"
					as={NavLink}
					active={activeItem === 'About'}
					onClick={this.handleItemClick}
					to="/about"
				>
					About
				</Menu.Item>
				<Menu.Item
					name="Volunteer Calender"
					as={NavLink}
					active={activeItem === 'Volunteer Calender'}
					onClick={this.handleItemClick}
					to="/volunteer-form"
				>
					Volunteer Calender
				</Menu.Item>

				<Menu.Item active={activeItem === 'Logo'} as={NavLink} onClick={this.handleItemClick} to="/">
					<img src={logo} alt="logo" />
				</Menu.Item>

				<Menu.Item
					name="Stories"
					as={NavLink}
					active={activeItem === 'Stories'}
					onClick={this.handleItemClick}
					to="/Stories"
				>
					Stories
				</Menu.Item>
				<Menu.Item
					name="Contact Us"
					as={NavLink}
					active={activeItem === 'Contact Us'}
					onClick={this.handleItemClick}
					to="/ContactUs"
				>
					Contact Us
				</Menu.Item>
			</Menu>
		)
	}
}
