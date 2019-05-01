import React,{ Component } from 'react'
import StoryForm from './StoryForm'
import { Header } from 'semantic-ui-react'

export default class EditStory extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return(
      <div className="storyform">
       <Header as="h1">Edit Story</Header>
       <StoryForm editId={this.props.editId}/>
    </div>
    )
  }
}
