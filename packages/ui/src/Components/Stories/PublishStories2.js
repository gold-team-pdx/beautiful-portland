import React, { Component } from 'react'
import { Header, Button, Grid, Item } from 'semantic-ui-react'
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
                <Grid columns={2}>
                    <Grid.Column width={1}>
                        <Header as='h3'>{this.state.month}
                        <Header.Subheader disabled>{this.state.year}</Header.Subheader>
                        <hr/>
                        <Header.Subheader><b>{this.state.day}</b></Header.Subheader>
                        </Header>
                    </Grid.Column>

                    <Grid.Column width={13}>
                        <Item.Group Relaxed>
                            <Item>
                                <Item.Image size='big' src='https://www.visittheusa.com/sites/default/files/styles/hero_m_1300x700/public/images/hero_media_image/2017-04/048df232dcf31e992cb9143f695f416e.jpeg?itok=8AQcj59p' />
                                    <Item.Content verticalAlign='middle'>
                                        <Item.Header as='h1'>{this.props.publish.title}</Item.Header>
                                        <hr/>
                                        <Item.Meta>{this.props.publish.hook}</Item.Meta>
                                        <br/>
                                        <Item.Description><body class='body'>{this.state.content}</body></Item.Description>
                                        <br/>
                                        <Button color='olive' floated='left'>Read More</Button>
                                    </Item.Content>
                            </Item>
                        </Item.Group>
                    </Grid.Column>
                </Grid>
                <br/>
            </div>
        )
    }
 }
