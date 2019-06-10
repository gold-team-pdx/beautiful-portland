import React, { Component } from 'react'
import { Card, Image, Icon, Button, Modal } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import ReadMore from './ReadMore'
import '../Stylesheets/PublishStories.css'
import LogoPlaceHolder from './../../logoPhotos/bpdx_story_place_holder.png'
import Moment from 'moment'

// Sitewide Text Styles
const paragraphStyles = {
  fontFamily: 'Quicksand',
  fontSize: 'calc(14px + (26 - 14) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
}

const dropdownStyles = {
  fontFamily: 'Quicksand',
  fontSize: 'calc(12px + (20 - 12) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
}

export default class Story extends Component {
  constructor(props){
    super(props)
    this.state = {
      date: Moment(this.props.publish.edited_timestamp).format('YYYY/MM/D, HH:mm A'),
      year: Moment(this.props.publish.edited_timestamp).format('YYYY'),
      month: Moment(this.props.publish.edited_timestamp).format('MMMM'),
      version: this.props.version,
      url: '/Stories/'+this.props.url,
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
    const imageUrl = this.props.publish.imageUrl

    return (
      <Card raised>
        <div className='outer-div'>{imageUrl==='notFound' ? (
          <Image className='card-image' fluid src={LogoPlaceHolder} alt="Beautiful Portland Logo"/>
        ):(
          <Image className='card-image' fluid src={this.props.publish.imageUrl} alt={'Photo for story: ' + this.props.publish.title} />
        )}</div>
        <Card.Content>
          <Card.Header to='/as' style={paragraphStyles}>
            <div className='capitalize'>{this.props.publish.title}</div>
          </Card.Header>

          <Card.Meta>
            <Icon name='calendar'/>{' '}{this.state.date} edited
          </Card.Meta>

          <Card.Description style={dropdownStyles}>
            <p>{this.props.publish.hook}</p>
          </Card.Description>
          <br/><br/>

          <Link to={this.state.url} title={this.props.publish.title}>
            <Button size='small' floated='left' onClick={this.show('blurring')} style={{position: 'absolute', bottom: '10px', boxShadow: '3px 3px #888888', paragraphStyles, backgroundColor:'#a8efae'}}>READ MORE</Button>
          </Link>

          <Modal dimmer={dimmer} open={open} onClose={this.close}>
            <Route
              path={this.state.url}
              render={(props)=><ReadMore title={this.props.publish.title}/>}
            />
            <Modal.Actions>
              <Link to='/Stories'>
                <Button size='large' onClick={this.close} style={{backgroundColor: '#a8efae'}}>Close</Button>
              </Link>
            </Modal.Actions>
          </Modal>
        </Card.Content>
      </Card>
    )
  }
}

