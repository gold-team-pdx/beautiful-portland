import React, { Component } from 'react'
import { Card, Image, Icon, Button } from 'semantic-ui-react'
import '../Stylesheets/PublishStories.css'
import Moment from 'moment'
import Axios from 'axios'

export default class PublishStories extends Component {
    constructor(props){
        super(props)
        this.state = {
            date: Moment(this.props.publish.edited_timestamp).format('YYYY/MM/D, HH:mm A'),
            year: Moment(this.props.publish.edited_timestamp).format('YYYY'),
            month: Moment(this.props.publish.edited_timestamp).format('MMMM'),
            version: this.props.version
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
            <Card raised>
                <Image src='https://www.visittheusa.com/sites/default/files/styles/hero_m_1300x700/public/images/hero_media_image/2017-04/048df232dcf31e992cb9143f695f416e.jpeg?itok=8AQcj59p' />
                <Card.Content>
                    <Card.Header onClick={this.handleHeader}><body class='card-header'>{this.props.publish.title}</body></Card.Header>
                    <Card.Meta><Icon name='calendar'/>{this.state.date}</Card.Meta>
                    <Card.Description><body class='card-description'>{this.props.publish.hook}</body></Card.Description>
                    <br/><Button color='olive' size='mini' floated='left'>READ MORE</Button>
                </Card.Content>
            </Card>
        )
    }
 }
