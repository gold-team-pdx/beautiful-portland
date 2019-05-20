import React, { Component } from 'react'
import Slider from './Slider'
import DonateButton from './DonateButton'
import 'semantic-ui-css/semantic.min.css'
import '../Stylesheets/Home.css'
import HomeLayout from '../Layouts/HomeLayout'
import Axios from 'axios'
import RichTextEditor from 'react-rte'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mission_stmt: RichTextEditor.createEmptyValue()
    }
  }

  componentDidMount() {
    Axios.get('/api/content', {params: {type: 'Mission Statement'}})
      .then(res => {
        if(res.data) {
          this.setState({mission_stmt: RichTextEditor.createValueFromString(res.data.content, 'html')})
        }
      }).catch(err => {
        console.log(err, 'Couldn\'t get data from server')
      })
  }

  render() {
    return (
      <HomeLayout>
        <div className="Home">
          <div className="ImageCarousel">
            <Slider />
          </div>
          <div className="DonateButton">
            <DonateButton />
          </div>
          <div>
            <h2 className="MissionHeader"> Our Mission </h2>
            <RichTextEditor
              editorClassName="MissionStatement"
              value={this.state.mission_stmt}
              readOnly
            />
          </div>
        </div>
      </HomeLayout>
    )
  }
}
