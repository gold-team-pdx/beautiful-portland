import React, { Component } from 'react'
import { Icon, Modal, Button } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import Moment from 'moment'
import Story from './Story'
import '../Stylesheets/PublishStories.css'

export default class PublishStories extends Component {
  constructor(props){
    super(props)
    this.state = {
      date: Moment(this.props.publish.edited_timestamp).format('YYYY/MM/D, HH:mm A'),
      year: Moment(this.props.publish.edited_timestamp).format('YYYY'),
      month: Moment(this.props.publish.edited_timestamp).format('MMMM'),
      day: Moment(this.props.publish.edited_timestamp).format('D'),
      hook: this.props.publish.hook,
      content: this.props.publish.content,
      url: '/Stories/'+this.props.url,
    }
  }

    show = dimmer => () => {
      this.setState({ dimmer, open: true })
    }

    close = () => {
      this.setState({ open: false })
    }

    render () {
      const { open, dimmer } = this.state

      return (
        <div className='storyContainer'>
          <br/>
          <img alt='story' src='https://www.visittheusa.com/sites/default/files/styles/hero_m_1300x700/public/images/hero_media_image/2017-04/048df232dcf31e992cb9143f695f416e.jpeg?itok=8AQcj59p' width="100%"></img>
          <div className="storyContent">
            <Link
              to={this.state.url}
              // to={'/Stories/?story=' + this.props.publish.title}
              title={this.props.publish.title}
            >
              <h1 onClick={this.show('blurring')}><div className='capitalize' style={{color:'white'}}>{this.props.publish.title}</div></h1>
            </Link>
            {/* <Route path={'/Stories/?story=' + this.props.publish.title} component={Story} title={this.props.publish.title}/> */}
            <Modal dimmer={dimmer} open={open} onClose={this.close}>
              <Route
                path={this.state.url}
                render={(props)=><Story title={this.props.publish.title}/>}
              />
              <Modal.Actions>
                <Link to='Stories'>
                  <Button color='teal' onClick={this.close}>Close</Button>
                </Link>
              </Modal.Actions>
            </Modal>
            <hr></hr>
            <p><Icon name='calendar'/>Last Edited: {this.state.date}</p>
            <h4><i>{this.props.publish.hook}</i></h4>
          </div>
        </div>
      )
    }
}
