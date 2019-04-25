import React,{ Component } from 'react'
import StoryForm from './StoryForm'
import { Header } from 'semantic-ui-react'
export default class NewStory extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return(
      <div className="storyform">
       <Header as="h1">Create New Story</Header>
       <StoryForm />
    </div>
    )
  }
}
