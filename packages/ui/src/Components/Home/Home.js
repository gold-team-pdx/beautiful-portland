import React, { Component } from 'react'
import Slider from './Slider'
import DonateButton from './DonateButton'
import 'semantic-ui-css/semantic.min.css'
import '../Stylesheets/Home.css'
import HomeLayout from '../Layouts/HomeLayout'
import Axios from 'axios'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mission_stmt: ''
    }
  }

  componentDidMount() {
    Axios.get('/api/content', {params: {type: 'Mission Statement'}})
      .then(res => {
        if(res.data) {
          this.setState({mission_stmt: res.data.content})
        }
      }).catch(err => {
        console.log(err, 'Couldn\'t get data from server')
      })
  }

  render() {
    return (
      <HomeLayout>
        <div className="Home">
          <div className="Logo">{/* <h1 className="Logo"></h1> */}</div>
          <div className="ImageCarousel">
            <Slider />
          </div>
          <div className="DonateButton">
            <DonateButton />
          </div>
          <div>
            <h2 className="MissionHeader"> Our Mission </h2>
            <h5 className="MissionStatement">
              {this.state.mission_stmt}
            </h5>
          </div>
        </div>
      </HomeLayout>
    )
  }
}
