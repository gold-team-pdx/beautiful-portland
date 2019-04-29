import React, { Component } from 'react'
import { Card, Accordion, Icon, Button } from 'semantic-ui-react'
import Axios from 'axios'

export default class LoadDrafts extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeIndex: -1,
      deleteId : 0
    }
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  handleDelete = () => {
    this.setState({deleteId : this.state.deleteId})
    console.log("Deleting draft with id: " + this.props.sDraft._id)
    Axios.post('/api/deleteDraft', {deleteId: this.props.sDraft._id})
      .then(res => {
         console.log(res.data);
      })
      .catch((err) => {
         console.log(err);
      })
  }
  moveToPublish = () => {
    let data = {
      _id : this.props.sDraft._id,
      edited_timestamp : this.props.sDraft.edited_timestamp,
      title : this.props.sDraft.title,
      hook : this.props.sDraft.hook,
      content : this.props.sDraft.content,
      publish_status: true
    }
    Axios.post('/api/addPublish', data)
    .then(response => {
      console.log(response, "Story has been published")
    })
    .catch(err => {
      console.log(err, "Try again.")
    })
  }

  handlePublish = () => {
    console.log("Publishing draft with id: " + this.props.sDraft._id)
    Axios.all([this.moveToPublish(), this.handleDelete()])
  }

   render () {
     const { activeIndex } = this.state


     return (
       <div className="viewStories">
         <div>
         <Card.Group>
              {
                   <Card fluid>
                     <Card.Content>
                       <Card.Header>{this.props.sDraft.title}</Card.Header>
                       <Card.Meta>{this.props.sDraft.edited_timestamp}</Card.Meta>
                       <Card.Description>{this.props.sDraft.hook}</Card.Description>
                       <Accordion >
                       <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
           							 <Icon name="dropdown" />
           						     </Accordion.Title>
                             <Accordion.Content active={activeIndex === 0 }>
                               <p>{this.props.sDraft.content}</p>
                               <Button.Group widths={3}>
                                 <Button color='blue'
                                         name='editDraft'
                                         onClick={this.handleItemClick}>Edit</Button>
                                 <Button color='green'
                                         name='publishDraft'
                                         onClick={this.handlePublish}>Publish</Button>
                                 <Button color='red'
                                         name='deleteDraft'
                                         onClick={this.handleDelete}>Delete</Button>
                               </Button.Group>
                             </Accordion.Content>
                        </Accordion>
                     </Card.Content>
                  </Card>
             }
         </Card.Group>
         </div>
       </div>

     )
   }
 }
