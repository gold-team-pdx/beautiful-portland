import React, { Component } from 'react'
import Axios from 'axios'
import { Card } from 'semantic-ui-react'

export default class LoadDrafts extends Component {
  constructor(props){
    super(props)
    this.state = {
      draftStory : []
    }
  }

  componentDidMount = async () => {
   Axios.get('/api/draftStories')
     .then(res => {
       let tempDraftStory = JSON.parse(res.data.draft_info)
       console.log(tempDraftStory)
       this.setState({
         draftStory : tempDraftStory
       })
     })
   }

   render () {
     return (
       <div className="viewStories">
         <div>
         <Card.Group>
              {
                 this.state.draftStory && this.state.draftStory.map(story =>
                   <Card fluid key={story.title}>
                     <Card.Content>
                       <Card.Header>{story.title}</Card.Header>
                       <Card.Meta>{story.edited_timestamp}</Card.Meta>
                       <Card.Description>{story.hook}</Card.Description>
                     </Card.Content>
                     </Card>
                   )
                 }
         </Card.Group>
         </div>
       </div>

     )
   }
 }
