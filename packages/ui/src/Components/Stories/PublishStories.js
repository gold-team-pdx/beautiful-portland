import React, { Component } from 'react'
import { Card, Image, Icon, Button, Modal } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import Story from './Story'
import '../Stylesheets/PublishStories.css'
import Moment from 'moment'

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
                    <Card.Header to='/as'>
                        <div className='card-header'>
                            <div className='capitalize'>{this.props.publish.title}</div>
                        </div>
                    </Card.Header>
                    <Card.Meta>
                        <Icon name='calendar'/>
                        {this.state.date}
                    </Card.Meta>
                    <Card.Description>
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
                        <Button color='olive' size='mini' floated='left' onClick={this.show('blurring')}>READ MORE</Button>
                    </Link>
                    {/* <Route path={'/Stories/?story=' + this.props.publish.title} component={Story} title={this.props.publish.title}/> */}
                    <Modal dimmer={dimmer} open={open} onClose={this.close}>
                        <Route
                            path={this.state.url}
                            render={(props)=><Story title={this.props.publish.title}/>}
                        />
                        <Modal.Actions>
                        <Link to='Stories'>
                            <Button color='olive' onClick={this.close}>Close</Button>
                        </Link>
                        </Modal.Actions>
                    </Modal>
                </Card.Content>
            </Card>
        )
    }
}