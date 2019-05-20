import React, { Component } from 'react'
import { Card, Image, Icon, Button, Modal } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import Story from './Story'
import '../Stylesheets/PublishStories.css'
import Moment from 'moment'

// Sitewide Text Styles
const paragraphStyles = {
  fontFamily: 'Nunito',
  color: '#000b91', 
  fontSize: 'calc(14px + (26 - 14) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
} 

const headerStyles = {
  fontFamily: 'Nunito',
  color: '#000b91', 
  fontSize: 'calc(20px + (42 - 20) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))}'
}

const dropdownStyles = {
  fontFamily: 'Nunito', 
  color: '#000b91', 
  fontSize: 'calc(12px + (20 - 12) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
}

export default class PublishStories extends Component {
  constructor(props){
    super(props)
    this.state = {
      date: Moment(this.props.publish.edited_timestamp).format('YYYY/MM/D, HH:mm A'),
      year: Moment(this.props.publish.edited_timestamp).format('YYYY'),
      month: Moment(this.props.publish.edited_timestamp).format('MMMM'),
      version: this.props.version,
      // url: this.props.url
      url: '/Stories/'+this.props.url,
      // url: '/Stories?id='+this.props.publish.title+'&ts='+this.props.publish.edited_timestamp,
      open: false
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
        <Card raised>
          <Image src='https://www.visittheusa.com/sites/default/files/styles/hero_m_1300x700/public/images/hero_media_image/2017-04/048df232dcf31e992cb9143f695f416e.jpeg?itok=8AQcj59p' />
          <Card.Content>
            <Card.Header to='/as' style={paragraphStyles}>
              <div className='card-header'>
                <div className='capitalize'>{this.props.publish.title}</div>
              </div>
            </Card.Header>
            <Card.Meta>
              <Icon name='calendar'/>
              {this.state.date}
            </Card.Meta>
            <Card.Description style={dropdownStyles}>
              <div className='card-description'>
                <i>{this.props.publish.hook}</i>
              </div>
            </Card.Description>
            <br/>

            <Link
              to={this.state.url}
              // to={'/Stories/?story=' + this.props.publish.title}
              title={this.props.publish.title}
            >
              <Button size='small' floated='left' onClick={this.show('blurring')} style={{paragraphStyles, backgroundColor:'#a8efae'}}>READ MORE</Button>
            </Link>
            {/* <Route path={'/Stories/?story=' + this.props.publish.title} component={Story} title={this.props.publish.title}/> */}
            <Modal dimmer={dimmer} open={open} onClose={this.close}>
              <Route
                path={this.state.url}
                render={(props)=><Story title={this.props.publish.title}/>}
              />
              <Modal.Actions>
                <Link to='Stories'>
                  <Button size='large' onClick={this.close} style={{backgroundColor: '#a8efae'}}>Close</Button>
                </Link>
              </Modal.Actions>
            </Modal>
          </Card.Content>
        </Card>
      )
    }
}