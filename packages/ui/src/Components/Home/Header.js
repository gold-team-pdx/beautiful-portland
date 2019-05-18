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
        color={'teal'}
        size="large"
        widths={5}
        style={{
          flexShrink: 100000, //don't allow flexbox to shrink it
          borderRadius: 0, //clear semantic-ui style
          margin: 0, //clear semantic-ui style
          backgroundColor: '#4cc7e1', //change to theme color
        }}
      >
        <Menu.Item
          name="About"
          as={NavLink}
          active={activeItem === 'About'}
          onClick={this.handleItemClick}
          to="/about"
          style={{fontWeight: 1000}}
        >
          About
        </Menu.Item>
        <Menu.Item
          name="Volunteer Calendar"
          as={NavLink}
          active={activeItem === 'Volunteer Calendar'}
          onClick={this.handleItemClick}
          to="/volunteerCalendar"
          style={{fontWeight: 1000}}
        >
          Volunteer Calendar
        </Menu.Item>

        <Menu.Item
          active={activeItem === 'Logo'}
          as={NavLink}
          onClick={this.handleItemClick}
          to="/"
          exact path= '/'
          style={{fontWeight: 1000}}
        >
          <img src={logo} alt="logo" />
        </Menu.Item>

        <Menu.Item
          name="Stories"
          as={NavLink}
          active={activeItem === 'Stories'}
          onClick={this.handleItemClick}
          to="/Stories"
          style={{fontWeight: 1000}}
        >
          Stories
        </Menu.Item>
        <Menu.Item
          name="Contact Us"
          as={NavLink}
          active={activeItem === 'Contact Us'}
          onClick={this.handleItemClick}
          to="/ContactUs"
          style={{fontWeight: 1000}}
        >
          Contact Us
        </Menu.Item>
      </Menu>
    )
  }
}