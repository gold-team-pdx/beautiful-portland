import React, { Component } from 'react'
import { Card, Accordion, Icon, Button } from 'semantic-ui-react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import RichTextEditor from 'react-rte'

export default class LoadPublished extends Component {
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

  handleDelete = () => {
    console.log('Deleting published Story with id: ' + this.props.sPublish._id)
    Axios.post('/api/deletePublish', {deleteId: this.props.sPublish._id})
      .then(res => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    window.location.reload()
  }

  handleEdit = (e) => {
    this.props.updateParent()
    this.props.updateParentID(this.props.sPublish._id)
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
                  <Card.Header>{this.props.sPublish.title}</Card.Header>
                  <Card.Meta>{this.props.sPublish.edited_timestamp}</Card.Meta>
                  <Card.Description>{this.props.sPublish.hook}</Card.Description>
                  <Accordion>
                    <Accordion.Title active={activeIndex === 0}
                      index={0}
                      onClick={this.handleClick}
                    >
           							 <Icon name="dropdown" />
           						     </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                      <RichTextEditor
                        value={RichTextEditor.createValueFromString(this.props.sPublish.content, 'html')}
                        readOnly
                      />
                      <Button.Group widths={2}>
                        <Button color='blue'
                          name='editDraft'
                          as={Link}
                          to='/EditStory'
                          onClick={this.handleEdit}>Edit</Button>
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
