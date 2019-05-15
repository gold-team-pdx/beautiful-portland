import React, { Component } from 'react'
import { Header, Modal, Image, Container, Icon } from 'semantic-ui-react'
import Moment from 'moment'
import Axios from 'axios'
import '../Stylesheets/PublishStories.css'

export default class PublishStories extends Component {
    constructor(props){
        super(props)
        this.state = {
            publishStory: [],
            date: '',
            title: this.props.title
        }
    }

    componentDidMount() {
        let path = "/api/getOneStory?title=" + this.props.title
        console.log(this.props.title)
        Axios.get(path)
			.then((response) => {
                let tempPubStory = JSON.parse(response.data.published_info)
                console.log(response)
                this.setState({
                    publishStory: tempPubStory[0],
                    date: Moment(tempPubStory[0].edited_timestamp).format('YYYY/MM/D, HH:mm A')
                })
                console.log(this.state.publishStory)
			})
			.catch((err) => {
				console.log(err, 'Try again.')
			})
    }

    close = () => this.setState({ open: false })

    render () {
        return (
            <div>
                <Modal.Content>
                    <Modal.Description>
                    <Image size='massive' src='https://www.visittheusa.com/sites/default/files/styles/hero_m_1300x700/public/images/hero_media_image/2017-04/048df232dcf31e992cb9143f695f416e.jpeg?itok=8AQcj59p'/><br/>
                    <Container text>
                        <Header as='h1'><div className='capitalize'>{this.state.title}</div>
                            <Header.Subheader><Icon name='calendar'/>Last Edited: {this.state.date}</Header.Subheader>
                        </Header>
                        <Header as='h3'><i>{this.state.publishStory.hook}</i></Header>
                        <p>{this.state.publishStory.content}</p>
                        <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /><br/>
                        <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /><br/>
                        <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /><br/>
                        <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    </Container>
                    </Modal.Description>
                </Modal.Content>
            </div>
        )
    }
 }
