import React, { Component } from 'react'
import { Header, Button, Grid, Item, Modal } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import Story from './Story'
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
      content: this.props.publish.content,
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

      return (
        <div>
          <br/>
          <Grid columns={2}>
            <Grid.Column width={1}>
              <Header as='h3'>{this.state.month}
                <Header.Subheader disabled>{this.state.year}</Header.Subheader>
                <hr/>
                <Header.Subheader><b>{this.state.day}</b></Header.Subheader>
              </Header>
            </Grid.Column>

            <Grid.Column width={13}>
              <Item.Group relaxed>
                <Item>
                  <Item.Image size='big' src='https://www.visittheusa.com/sites/default/files/styles/hero_m_1300x700/public/images/hero_media_image/2017-04/048df232dcf31e992cb9143f695f416e.jpeg?itok=8AQcj59p' />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header as='h1'><div className='capitalize'>{this.props.publish.title}</div></Item.Header>
                    <hr/>
                    <Item.Meta><i>{this.props.publish.hook}</i></Item.Meta>
                    <br/>
                    <Item.Description><div className='body'>{this.state.content}</div></Item.Description>
                    <br/>
                    <Link
                      to={this.state.url}
                      // to={'/Stories/?story=' + this.props.publish.title}
                      title={this.props.publish.title}
                    >
                      <Button color='teal' floated='left' onClick={this.show(true)}>Read More</Button>
                    </Link>
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
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
          </Grid>
          <br/><br/><br/>
        </div>
      )
    }
}
