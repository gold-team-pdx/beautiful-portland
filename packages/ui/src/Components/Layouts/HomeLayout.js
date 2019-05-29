import React, { Component } from 'react'
import Footer from '../Home/Footer'
import Header from '../Home/Header'
import '../Stylesheets/HomeLayout.css'

class HomeLayout extends Component {
  render() {
    return (
      <div className="Site">
        <div className="Header">
          <Header />
        </div>
        <main className="Site-content">
          <div>{this.props.children}</div>
        </main>
        <div className="Footer">
          <Footer />
        </div>
      </div>
    )
  }
}

export default HomeLayout
