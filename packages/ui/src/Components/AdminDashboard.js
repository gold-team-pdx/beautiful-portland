import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class AdminDashboard extends Component {
    state = {
        activeItem: 'events'
    }

    handleItemClick = (e, { name }) => this.setState({activeItem: name})
    
    render() {
        const { activeItem } = this.state
        return (
            <Menu vertical>
                <Menu.Item name='events' active={activeItem === 'events'} onClick={this.handleItemClick}>
                    Events
                </Menu.Item>
                <Menu.Item name='volunteerList' active={activeItem === 'volunteerList'} onClick={this.handleItemClick}>
                    Volunteers
                </Menu.Item>
                <Menu.Item name='addImages' active={activeItem === 'addImages'} onClick={this.handleItemClick}>
                    Add Image
                </Menu.Item>
                <Menu.Item name='newStory' active={activeItem === 'newStory'} onClick={this.handleItemClick}>
                    New Story
                </Menu.Item>
            </Menu>
        )
    }
}
