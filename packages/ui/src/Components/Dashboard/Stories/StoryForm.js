import React,{ Component } from 'react'
import { Form, Segment, Button, TextArea, Confirm, Grid } from 'semantic-ui-react'
import Axios from 'axios'

export default class StoryForm extends Component {
  constructor(props){
    super(props)
    this.handlePublish = this.handlePublish.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
      _id: '',
      title: '',
      hook: '',
      content: '',
      publish_status: false,
      editedTimestamp: '',
      open: false,
      isEnabled: false
    }
  }

  componentDidMount = () => {
    let editId = this.props.editId
    console.log(editId)
    if(editId !== '0000' || editId !== null || editId !== undefined) {
    Axios.post('/api/getStoryEdit', { id: this.props.editId })
        .then((response) => {
         console.log(response)
         this.setState({
           _id : response.data._id,
         title :response.data.title,
         hook :  response.data.hook,
         content : response.data.content,
         editedTimestamp : response.data.edited_timestamp,
         publish_status : response.data.publish_status
      })
    })
       .catch((error) => {
         console.log(error)
      })
    }
  }


  handlePublish = async (e) => {
    await this.setState({ publish_status : true })
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
    if(this.state.publish_status) {
      this.handlePublish()
    } else {
      Axios.post("/api/addDraft", this.state)
       .then(response => {
         console.log(response, "Story saved to drafts")
       })
       .catch(err => {
         console.log(err, "Try again.")
       })
     }
    this.open()
    console.log(this.state)
  }

  clearForm = () => {
    this.setState({
    title: '',
    hook: '',
    content: '',
    publish_status: false,
    open: false,
    isEnabled : false
  })

  this.close()
}

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })
  onChange = async (e) => {
    await this.setState({ [e.target.name]: e.target.value })
    console.log(this.state.title + ' ' + this.state.hook + ' ' + this.state.content)
    if(this.state.title && this.state.hook && this.state.content){
      this.setState({isEnabled : true})
    }
  }



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
          <input name="hook"
                 placeholder="Subtitle"
                 value={this.state.hook}
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
         <Grid stackable columns={3}>
          <Grid.Column>
             <Button color="blue"
                     fluid
                     disabled={!this.state.isEnabled}
                     onClick={this.handleSave}>Save</Button>
             <Confirm open={this.state.open}
                      content='Your Story was saved as a draft'
                      onCancel={this.close}
                      onConfirm={this.clearForm}
             />
          </Grid.Column>
          <Grid.Column >
             <Button color="green"
                     fluid
                     disabled={!this.state.isEnabled}
                     onClick={this.handlePublish}>Publish</Button>
             <Confirm open={this.state.open}
                      content='Your Story was published'
                      onCancel={this.close}
                      onConfirm={this.clearForm}
             />
          </Grid.Column>
          <Grid.Column>
            <Button color="red" fluid /*floated='right'*/ onClick={this.open}>Delete</Button>
            <Confirm open={this.state.open} onCancel={this.close} onConfirm={this.clearForm} />
          </Grid.Column>
          </Grid>
        </Form>
      </Segment>
    )
  }
}
