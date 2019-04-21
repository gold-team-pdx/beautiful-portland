import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import '../Stylesheets/contact.css'
import 'semantic-ui-css/semantic.min.css'

class Footer extends Component {
	state = {}
	handleItemClick = (e, { name }) => this.setState({ activeItem: name })

	render() {
		const { activeItem } = this.state
		return (
			<div className="footer">
			<Menu
				color="cust"
				borderless
				widths={4}
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
				<Menu.Item
				 name="Stories"
				 active={activeItem === 'Stories'}
				 onClick={this.handleItemClick}
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
			</div>
		)
	}
}

export default Footer
