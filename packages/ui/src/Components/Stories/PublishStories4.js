import React, { Component } from 'react'
import { Header, Container, Divider, Image, Icon } from 'semantic-ui-react'
import Moment from 'moment'
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
      content: this.props.publish.content
    }
  }

  render () {
    return (
      <div>
        <br/>
        <Container text>
          <Image size='massive' src='https://www.visittheusa.com/sites/default/files/styles/hero_m_1300x700/public/images/hero_media_image/2017-04/048df232dcf31e992cb9143f695f416e.jpeg?itok=8AQcj59p' />
          <Header as='h1'><div className='capitalize'>{this.props.publish.title}</div>
            <Header.Subheader><Icon name='calendar'/>Last Edited: {this.state.date}</Header.Subheader>
          </Header>
          <Header as='h3'><i>{this.props.publish.hook}</i></Header>
          <div className='horizontalReadMore'>
            <p>{this.props.publish.content}</p>
          </div>
          <Divider horizontal>Read More</Divider>
        </Container>
        <br/><br/><br/>
      </div>
    )
  }
}
