import React, { Component } from 'react'
import { Card, Button, Header, Form, Accordion, Modal, Segment } from 'semantic-ui-react'
import Axios from 'axios'
import { Icon } from 'semantic-ui-react'

export default class EditCalendarFAQ extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: 0,
      openDelete: false,
      openEdit: false,
      faqToDelete: '',
      faqToDeleteQ: '',
      faqToEditQ: '',
      newQuestion: '',
      newAnswer: ''
    }
  }

  componentDidMount = async () => {
    Axios.get('/api/getCalendarFAQ')
      .then(res => {
        let tempFAQs = JSON.parse(res.data.faq_info)
        console.log(tempFAQs)
        this.setState({
          faqs : tempFAQs
        })
      })
  }

  handleDelete = (event, data) => {
    const deletedCalendarFAQ = {deleteId: data.id}
    console.log(deletedCalendarFAQ)
    Axios.post('/api/deleteCalendarFAQ', deletedCalendarFAQ)
      .then((response) => {
        console.log(response, 'Deleted Event ' + data.id)
      })
      .catch((err) => {
        console.log(err, 'Try again.')
      })
    window.location.reload()
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex, newQuestion: '', newAnswer: '' })
  }

  onSubmit = (e) => {
    e.preventDefault()
    let data = {question: this.state.newQuestion, answer: this.state.newAnswer}
	  console.log(data)
	  Axios.post('/api/addCalendarFAQ', data)
	    .then(response => {
	      console.log(response, 'Template Submitted')
	    })
	    .catch(err => {
	      console.log(err, 'Try again.')
	    })
	  window.location.reload()
  }

  onChange = (event, data) => {
	  this.setState({ [data.name]: data.value })
  }

  displayDeleteModal = (event, data) => {
    this.setState({ faqToDelete: data.id, faqToDeleteQ: data.question })
    this.openDeleteModal()
  }

  openDeleteModal = () => {
    this.setState({ openDelete: true })
  }

  closeDeleteModal = () => {
    this.setState({ openDelete: false })
  }

  displayEditModal = (event, data) => {
    this.setState({ faqToEdit: data.id, newQuestion: data.question, newAnswer: data.answer })
    this.openEditModal()
  }

  openEditModal = () => {
    this.setState({ openEdit: true })
  }

  closeEditModal = () => {
    this.setState({ openEdit: false })
  }

  render(){
    const { activeIndex } = this.state

    return(
      <div>
        <Header as="h1">Edit Calendar FAQ</Header>
        <Segment>
          <Accordion>
            <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
              <Icon name='dropdown' /><b>Would you like to add a new FAQ?</b>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <Form onSubmit={this.onSubmit}>
                <Form.Group inline>
                  <Form.TextArea
                    name="newQuestion"
                    value={this.state.newQuestion}
                    onChange={this.onChange}
                    inline
                    label="Question"
                  />
                </Form.Group>
                <Form.Group inline>
                  <Form.TextArea
                    name="newAnswer"
                    value={this.state.newAnswer}
                    onChange={this.onChange}
                    inline
                    label="Answer"
                  />
                </Form.Group>

                <Button color='green'>
                  Submit
                </Button>
              </Form>
            </Accordion.Content>
          </Accordion>
        </Segment>

        <Card.Group>
          {this.state.faqs && this.state.faqs
            // .sort((a, b) => a.question - b.question)
            .map((faq, index) =>{
              return(
                <Card fluid key={index}>
                  <Card.Content>
                    <Card.Header>
                    Question {index+1}: {faq.question}
                    </Card.Header>
                    <Card.Description>
                      <p>Answer: {faq.answer}</p>
                      <Button.Group>
                        <Button color='blue' onClick={this.displayEditModal} id={faq._id} question={faq.question} answer={faq.answer}>
                          Edit
                        </Button>
                        <Button.Or />
                        <Button color='red' onClick={this.displayDeleteModal} id={faq._id} question={faq.question}>
                          Delete
                        </Button>
                      </Button.Group>
                    </Card.Description>
                  </Card.Content>
                </Card>
              )
            })}
          <Modal open={this.state.openEdit} onClose={this.closeEditModal} closeIcon>
            <Header icon="calendar alternate outline" content="Edit FAQ" />
            <Modal.Content>
              <h3>Edit: [{this.state.newQuestion}]</h3>
              <Form>
                <Form.TextArea
                  name="newQuestion"
                  value={this.state.newQuestion}
                  onChange={this.onChange}
                  inline
                  label="Question"
                />

                <Form.TextArea
                  name="newAnswer"
                  value={this.state.newAnswer}
                  onChange={this.onChange}
                  inline
                  label="Answer"
                />

              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={this.closeEditModal}>
                <Icon name="remove" /> Cancel
              </Button>
              <Button color="green" onClick={this.onSubmit}>
                <Icon name="checkmark" /> Submit
              </Button>
            </Modal.Actions>
          </Modal>

          <Modal open={this.state.openDelete} onClose={this.closeDeleteModal} closeIcon>
            <Header icon="calendar alternate outline" content="Delete FAQ" />
            <Modal.Content>
              <h3>Are you sure you want to delete [{this.state.faqToDeleteQ}]</h3>
            </Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={this.closeDeleteModal}>
                <Icon name="remove" /> No
              </Button>
              <Button color="green" onClick={this.handleDelete} id={this.state.faqToDelete}>
                <Icon name="checkmark" /> Yes
              </Button>
            </Modal.Actions>
          </Modal>
        </Card.Group>
      </div>
    )
  }
}