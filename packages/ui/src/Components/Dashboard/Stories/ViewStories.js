import React, { Component } from 'react'
import { Segment, Button } from 'semantic-ui-react'
import LoadPublished from './LoadPublished'
import LoadDrafts from './LoadDrafts'
import '../../Stylesheets/AdminDashboard.css'

export default class ViewStories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: 'loadPublished'
    }
  }

  handleItemClick = (e, { name }) => this.setState({activeItem: name})

  render () {
    const { activeItem } = this.state
    const itemsToRender = {'loadPublished': <LoadPublished />, 'loadDrafts' : <LoadDrafts /> }

    return (
       <div>
        <Segment>
        <div className="storyButtons">
          <Button.Group widths={2}>
            <Button name='loadPublished'
                    active={activeItem === 'loadPublished'}
                    onClick={this.handleItemClick}>Published</Button>
            <Button name='loadDrafts'
                    active={activeItem === 'loadDrafts'}
                    onClick={this.handleItemClick}>Drafts</Button>
          </Button.Group>
        </div>
           {
             itemsToRender[this.state.activeItem.toString()]
           }
        </Segment>
     </div>
    )
  }
}
