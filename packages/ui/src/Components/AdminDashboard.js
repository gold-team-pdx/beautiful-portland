import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import VolunteerList from './VolunteerList'
import './Stylesheets/AdminDashboard.css'

export default class AdminDashboard extends Component {
    state = {
        activeItem: 'volunteerList'
    }

    handleItemClick = (e, { name }) => this.setState({activeItem: name})
    
    render() {
        const { activeItem } = this.state
        const itemsToRender = {'volunteerList': <VolunteerList />}
        return (
            <div className='adminView'>
                {/* <div className='adminDash'>
                    <Menu>
                        <Menu.Item>
                            Logo Here?
                        </Menu.Item>
                        <Menu.Item>
                            Logout
                        </Menu.Item>
                    </Menu>
                </div> */}
                <div className='dashMenu'>
                    <Menu vertical size='huge'>
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
                </div>
                <div className='content'>
                {
                    itemsToRender[this.state.activeItem.toString()]
                }
                </div>
            </div>
        )
    }
}
