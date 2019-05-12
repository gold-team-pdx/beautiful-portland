import React, { Component } from 'react'
import Footer from '../Home/Footer'
import Header from '../Home/Header'
import '../Stylesheets/HomeLayout.css'

class HomeLayout extends Component {
  render() {
    return (
      <div>
        <div className="Header">
          <Header />
        </div>
        <div className="Main">{this.props.children}</div>
        <div className="Footer">
          <Footer />
        </div>
      </div>
    )
  }
}

export default HomeLayout
