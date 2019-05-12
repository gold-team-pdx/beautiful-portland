import React, { Component } from 'react'
import StoryForm from './StoryForm'
import { Header } from 'semantic-ui-react'

export default class EditStory extends Component {
  render() {
    return (
      <div className="storyform">
        <Header as="h1">Edit Story</Header>
        <Header as="h5">Clear Form will result in loss of original story</Header>
        <StoryForm editId={this.props.editId} />
      </div>
    )
  }
}
