import React, { Component } from 'react'
import { Card, Accordion, Icon, Button } from 'semantic-ui-react'

export default class LoadDrafts extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeIndex: -1
    }
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
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
                                         onClick={this.handleItemClick}>Publish</Button>
                                 <Button color='red'
                                         name='deleteDraft'
                                         onClick={this.handleItemClick}>Delete</Button>
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
