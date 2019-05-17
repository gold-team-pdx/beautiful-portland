import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../logoPhotos/bpdx_circlelogo_white.png'
import { Icon, Menu, Sidebar, Responsive } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const NavBarMobile = ({
  children,
  activeItem,
  handleClickItem,
  onPusherClick,
  onToggle,
  visible,
  handleSidebarHide
}) => (
  <Sidebar.Pushable>
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      color="teal"
      vertical
      visible={visible}
    >
      <Menu.Item
        name="About"
        as={NavLink}
        active={activeItem === 'About'}
        onClick={handleClickItem}
        onHide={handleSidebarHide}
        to="/about"
      >
        About
      </Menu.Item>
      <Menu.Item
        name="Volunteer Calender"
        as={NavLink}
        active={activeItem === 'Volunteer Calender'}
        onClick={handleClickItem}
        onHide={handleSidebarHide}
        to="/volunteerCalendar"
      >
        Volunteer Calender
      </Menu.Item>

      <Menu.Item
        active={activeItem === 'Logo'}
        as={NavLink}
        onClick={handleClickItem}
        onHide={handleSidebarHide}
        to="/"
      >
        Home
      </Menu.Item>

      <Menu.Item
        name="Stories"
        as={NavLink}
        active={activeItem === 'Stories'}
        onClick={handleClickItem}
        onHide={handleSidebarHide}
        to="/Stories"
      >
        Stories
      </Menu.Item>
      <Menu.Item
        name="Contact Us"
        as={NavLink}
        active={activeItem === 'Contact Us'}
        onClick={handleClickItem}
        onHide={handleSidebarHide}
        to="/ContactUs"
      >
        Contact Us
      </Menu.Item>
    </Sidebar>

    <Sidebar.Pusher
      dimmed={visible}
      onClick={onPusherClick}
      style={{ minHeight: '100vh' }}
    >
      <Menu inverted color="teal">
        <Menu.Item onClick={onToggle}>
          <Icon name="sidebar" />
        </Menu.Item>
      </Menu>
    </Sidebar.Pusher>
  </Sidebar.Pushable>
)

const NavBarDesktop = ({ activeItem, handleItemClick }) => (
  <Menu
    inverted
    color={'teal'}
    size="large"
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
      onClick={handleItemClick}
      to="/about"
    >
      About
    </Menu.Item>
    <Menu.Item
      name="Volunteer Calender"
      as={NavLink}
      active={activeItem === 'Volunteer Calender'}
      onClick={handleItemClick}
      to="/volunteerCalendar"
    >
      Volunteer Calender
    </Menu.Item>

    <Menu.Item
      active={activeItem === 'Logo'}
      as={NavLink}
      onClick={handleItemClick}
      to="/"
    >
      <img src={logo} alt="logo" />
    </Menu.Item>

    <Menu.Item
      name="Stories"
      as={NavLink}
      active={activeItem === 'Stories'}
      onClick={handleItemClick}
      to="/Stories"
    >
      Stories
    </Menu.Item>
    <Menu.Item
      name="Contact Us"
      as={NavLink}
      active={activeItem === 'Contact Us'}
      onClick={handleItemClick}
      to="/ContactUs"
    >
      Contact Us
    </Menu.Item>
  </Menu>
)

const NavBarChildren = ({ children }) => <div>{children}</div>

class NavBar extends Component {
  state = {
    visible: false,
    activeItem: ''
  }

  handleItemClick = (e, { name }) =>
    this.setState({ activeItem: name, visible: !this.state.visible })

  handlePusher = () => {
    const { visible } = this.state

    if (visible) this.setState({ visible: false })
  }

  handleToggle = () => this.setState({ visible: !this.state.visible })

  render() {
    const { activeItem, visible } = this.state
    const { children } = this.props
    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <NavBarMobile
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            handleClickItem={this.handleItemClick}
            visible={visible}
            activeItem={activeItem}
          />
          <NavBarChildren>{children}</NavBarChildren>
        </Responsive>

        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavBarDesktop
            activeItem={activeItem}
            handleItemClick={this.handleItemClick}
          />
          <NavBarChildren>{children}</NavBarChildren>
        </Responsive>
      </div>
    )
  }
}

export default NavBar
