import React,{ Component } from 'react'
import { Form, Segment, Button, TextArea, Confirm, Grid } from 'semantic-ui-react'
import Axios from 'axios'

export default class StoryForm extends Component {
  constructor(props){
    super(props)
     this.state = {
      title: '',
      subtitle: '',
      content: '',
      publishedStatus: false,
      editedTimestamp: '',
      open: false
    }
  }


  handlePublish = (e) => {
    e.preventDefault()
    this.setState({ publishedStatus : true })
    Axios.post("/api/addPublish", this.state)
      .then(response => {
        console.log(response, "Story has been published")
      })
      .catch(err => {
        console.log(err, "Try again.")
      })
    this.open()
    console.log(this.state)
  }

  handleSave = (e) => {
    e.preventDefault()
    Axios.post("/api/addDraft", this.state)
      .then(response => {
        console.log(response, "Story saved to drafts")
      })
      .catch(err => {
        console.log(err, "Try again.")
      })
    this.open()
    console.log(this.state)
  }

  clearForm = () => {
    this.setState({
    title: '',
    subtitle: '',
    content: '',
    publishedStatus: false,
    open: false
  })

  this.close()
}

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })
  onChange = e => this.setState({ [e.target.name]: e.target.value })

  render() {

    return (
      <Segment>
        <Form>
          <Form.Field>
          <label>Title</label>
          <input name="title"
                 placeholder="Title"
                 value={this.state.title}
                 onChange={this.onChange}
          />
          </Form.Field>
          <Form.Field>
          <label>Subtitle</label>
          <input name="subtitle"
                 placeholder="Subtitle"
                 value={this.state.subtitle}
                 onChange={this.onChange}
         />
         </Form.Field>
         <Form.Field>
         <label>Content</label>
         <TextArea name="content"
                   placeholder='Your Story'
                   rows="15"
                   value={this.state.content}
                   onChange={this.onChange}
         />
         </Form.Field>
         <Grid columns='equal'>
          <Grid.Column>
             <Button color="blue" onClick={this.handleSave}>Save</Button>
             <Confirm open={this.state.open}
                      content='Your Story was saved as a draft'
                      onCancel={this.close}
                      onConfirm={this.clearForm}
             />
          </Grid.Column>
          <Grid.Column width={12}>
             <Button color="green" onClick={this.handlePublish}>Publish</Button>
             <Confirm open={this.state.open}
                      content='Your Story was published'
                      onCancel={this.close}
                      onConfirm={this.clearForm}
             />
          </Grid.Column>
          <Grid.Column>
            <Button color="red" floated='right' onClick={this.open}>Delete</Button>
            <Confirm open={this.state.open} onCancel={this.close} onConfirm={this.clearForm} />
          </Grid.Column>
          </Grid>
        </Form>
      </Segment>
    )
  }
}
