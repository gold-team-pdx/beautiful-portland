import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Image } from 'semantic-ui-react'
import logo from '../../logoPhotos/bpdx_horizontallogo_white.png'
import 'semantic-ui-css/semantic.min.css'

const buttonStyles = {
  fontWeight: 1000, 
  color: '#000b91', 
  fontFamily: 'Varela Round',
  textWrap: 'break-word',
  fontSize: 'calc(18px + (24 - 18) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))}'
}

export default class Header extends Component {
  state = {}
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu
        borderless='true'
        size="large"
        widths={5}
        style={{
          //flexShrink: 100000, //don't allow flexbox to shrink it
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
          style={buttonStyles}
        >
          About
        </Menu.Item>
        <Menu.Item
          name="Volunteer Calendar"
          as={NavLink}
          active={activeItem === 'Volunteer Calendar'}
          onClick={this.handleItemClick}
          to="/volunteerCalendar"
          style={buttonStyles}
        >
          Volunteer
        </Menu.Item>

        <Menu.Item
          active={activeItem === 'Logo'}
          as={NavLink}
          onClick={this.handleItemClick}
          to='/'
          exact path='/'
        >
          <Image src={logo} alt="logo"></Image>
        </Menu.Item>

        <Menu.Item
          name="Stories"
          as={NavLink}
          active={activeItem === 'Stories'}
          onClick={this.handleItemClick}
          to='/Stories'
          style={buttonStyles}
        >
          Stories
        </Menu.Item>
        <Menu.Item
          name="Contact Us"
          as={NavLink}
          active={activeItem === 'Contact Us'}
          onClick={this.handleItemClick}
          to="/ContactUs"
          style={buttonStyles}
        >
          Contact Us
        </Menu.Item>
      </Menu>
    )
  }
}