import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'
import '../Stylesheets/HomePage.css'

class HomePage extends Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

export default HomePage
