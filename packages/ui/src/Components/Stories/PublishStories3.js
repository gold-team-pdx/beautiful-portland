import React, { Component } from 'react'
import { Header, Container, Divider, Image } from 'semantic-ui-react'
import Moment from 'moment'
import Axios from 'axios'
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

    handleHeader = (event, data) => {
        console.log()
        Axios.post('/api/getStory', this.props.publish.title)
			.then((response) => {
				console.log(response, '[' + data.name + '] Got')
			})
			.catch((err) => {
				console.log(err, 'Try again.')
			})
    }

    render () {
        return (
            <div>
                <br/>
                <Container text>
                <Image size='massive' src='https://www.visittheusa.com/sites/default/files/styles/hero_m_1300x700/public/images/hero_media_image/2017-04/048df232dcf31e992cb9143f695f416e.jpeg?itok=8AQcj59p' />
                <Header as='h1'>{this.props.publish.title}
                    <Header.Subheader>Last Edited: {this.state.date}</Header.Subheader>
                    <Header as='h3'>{this.props.publish.hook}</Header>
                </Header>
                <p>{this.props.publish.content}</p>
                <Divider horizontal>Thanks</Divider>
                </Container>
                <br/><br/><br/>
            </div>
        )
    }
 }
