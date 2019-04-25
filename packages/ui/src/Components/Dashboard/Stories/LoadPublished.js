import React, { Component } from 'react'
import Axios from 'axios'
import { Card } from 'semantic-ui-react'

export default class LoadPublished extends Component {
  constructor(props){
    super(props)
    this.state = {
      publishStory : []
    }
  }

  componentDidMount = async () => {
   Axios.get('/api/publishedStories')
     .then(res => {
       let tempPubStory = JSON.parse(res.data.published_info)
       console.log(tempPubStory)
       this.setState({
         publishStory : tempPubStory
       })
     })
   }

   render () {
     return (
       <div className="viewStories">
         <div>
         <Card.Group>
              {
                 this.state.publishStory && this.state.publishStory.map(story =>
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
