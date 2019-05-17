import React, { Component } from 'react'
import Footer from '../Home/Footer'
import Header from '../Home/Header'
import NavBar from '../Home/MobileNavbar'
import '../Stylesheets/HomeLayout.css'

class HomeLayout extends Component {
  render() {
    return (
      <div className="Site">
        <div className="Header">
          <Header />
        </div>
        <div className="Site-content">{this.props.children}</div>
        <div className="Footer">
          <Footer />
        </div>
      </div>
    )
  }
}

export default HomeLayout
