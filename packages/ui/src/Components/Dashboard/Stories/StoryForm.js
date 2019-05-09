import React,{ Component } from 'react'
import { Form, Segment, Button, TextArea, Confirm, Grid, Modal, Icon } from 'semantic-ui-react'
import Axios from 'axios'
import '../../Stylesheets/StoryForm.css'

export default class StoryForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      _id: '',
      title: '',
      hook: '',
      content: '',
      publish_status: false,
      editedTimestamp: '',
      open: false,
      isEnabled: false,
      postPhotoName: 'No Photo',
      postPhoto: {},
      addModalOpen: false,
      postImageData: '',
      openRemovePhoto: false,
    }
  }

  componentDidMount = () => {
    if(this.props.editId !== undefined) {
    Axios.post('/api/getStoryEdit', { id: this.props.editId })
        .then((response) => {
         console.log(response)
         //Axios.get('/api/getStoryPhoto')
         this.setState({
          _id : response.data._id,
          title :response.data.title,
          hook :  response.data.hook,
          content : response.data.content,
          editedTimestamp : response.data.edited_timestamp,
          publish_status : response.data.publish_status,
          postPhotoName: response.data.postPhotoName
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

    // Only add the photo if it hasn't already been added to s3
    // or if it has been changed
    let fileName = this.state.postImageData.split('/').pop()
    console.log(fileName)
    // If the keys are different, push new file.
    if(fileName !== this.state.postPhotoName) {
      Axios.post('/api/addImageIntoStories', {
        fileToAdd: this.state.postPhoto})
        .then(res => {
          console.log('Photo saved in s3')
          this.clearForm()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

 /*Checks for publish_status if load through edit*/
  handleSave = (e) => {
    if(this.state.publish_status) {
      this.handlePublish()
    } 
    else {
      Axios.post("/api/addDraft", this.state)
       .then(response => {
         console.log(response, "Story saved to drafts")
       })
       .catch(err => {
         console.log(err, "Try again.")
       })
      // Only add the photo if it hasn't already been added to s3
      // or if it has been changed
      let fileName = this.state.postImageData.split('/').pop()
      console.log(fileName)
      // If the keys are different, push new file.
      if(fileName !== this.state.postPhotoName) {
        Axios.post('/api/addImageIntoStories', {
          fileToAdd: this.state.postPhoto})
          .then(res => {
            console.log('Photo saved in s3')
            this.clearForm()
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
    
  }

  clearForm = () => {
    this.setState({
      title: '',
      hook: '',
      content: '',
      publish_status: false,
      open: false,
      isEnabled : false,
      postPhotoName: 'No Photo',
      postPhoto: {},
      postImageData: '' 
    })
    this.close()
 }

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  onChange = async (e) => {
    await this.setState({ [e.target.name]: e.target.value })
    if(this.state.title && this.state.hook && this.state.content){
      this.setState({isEnabled : true})
    }
  }

  // Image Modal Functions
  handleModalClose = () => this.setState({addModalOpen: false})
  handleModalOpen = () => this.setState({addModalOpen: true})
  
  // Alert modal for removing photo from post
  openRemovePhoto = () => this.setState({ openRemovePhoto: true })
  closeRemovePhoto = () => this.setState({ openRemovePhoto: false })

  // Add Image to post
  addPhoto = (input) => {
    let reader = new FileReader()
    let name = input.value.toString().split(/(\\|\/)/g).pop().split('.')[0]
    let data = ''
    let newFile = {}
    let newFileName = name + '&' + Date.now() + '&' + this.state.title
    reader.onerror = () => {
        reader.abort()
        console.log("Problem parsing input file")
    }
    reader.onload = e => {
      data = e.target.result
      newFile = {
          "fileData": data,
          "fileName": newFileName
      }
      // TODO: Bad practice to call set state twice -> will call separate function.
      this.setState({postImageData: data})
    }
    reader.readAsDataURL(input.files[0])
    this.setState({
      postPhotoName: newFileName,
      postPhoto: newFile,
      addModalOpen: false
    })
  }

  // Remove image from post
  removePhotoFromStory = () => {
    this.setState({
      postPhotoName: 'No Photo',
      postPhoto: {},
      postImageData: '',
      openRemovePhoto: false,
    })
  }
  render() {
    return (
      <Segment>
        <Form className="storyForm">
          <Form.Field>
          <label>Title</label>
          <input name="title"
                 placeholder="Title"
                 value={this.state.title}
                 onChange={this.onChange}
          />
          </Form.Field>
          { // This is a large if/else shorthand statement.
            // IF
            this.state.postPhotoName === 'No Photo' ? 
            // THEN
            <Form.Field className="noPhotoAdded"> 
              <Modal  trigger={<Button color="green" fluid onClick={this.handleModalOpen}>Add Photo to Post</Button>}
                  open= {this.state.addModalOpen}
                  onClose={this.handleModalClose}>
                <Modal.Content>
                  <h2>Add Photo to Post</h2>
                  <Form>
                      <input type='file' id="file" name="file" accept="image/png, image/jpeg"></input>
                  </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' inverted onClick={this.handleModalClose}>
                        <Icon name='remove' /> 
                        Cancel
                    </Button>
                    <Button color='green' inverted onClick={e => this.addPhoto(document.getElementById("file"))}>
                        <Icon name='checkmark' /> 
                        Add Photo to Post
                    </Button>
                </Modal.Actions> 
              </Modal>
            </Form.Field> 
            // END THEN
            // ELSE
            :
            <Form.Field className="photoAdded">
              <img alt="blog" className="imageToAdd" src={this.state.postImageData}></img>
              <Grid stackable columns={2}>
                <Grid.Column>
                  <Button color="red" floated="right" fluid onClick={this.openRemovePhoto}>Remove Photo</Button>
                  <Confirm open={this.state.openRemovePhoto} onCancel={this.closeRemovePhoto} onConfirm={this.removePhotoFromStory} />
                </Grid.Column>
                <Grid.Column>
                  <Modal  trigger={<Button color="yellow" fluid floated="left" onClick={this.handleModalOpen}>Change Photo</Button>}
                      open= {this.state.addModalOpen}
                      onClose={this.handleModalClose}>
                    <Modal.Content>
                      <h2>Add Photo to Post</h2>
                      <Form>
                          <input type='file' id="file" name="file" accept="image/png, image/jpeg"></input>
                      </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' inverted onClick={this.handleModalClose}>
                            <Icon name='remove' /> 
                            Cancel
                        </Button>
                        <Button color='green' inverted onClick={e => this.addPhoto(document.getElementById("file"))}>
                            <Icon name='checkmark' /> 
                            Add Photo to Post
                        </Button>
                    </Modal.Actions> 
                  </Modal>
                </Grid.Column>
              </Grid>
            </Form.Field>
            // END ELSE
          }
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
                     onClick={this.open}>Save</Button>
             <Confirm open={this.state.open}
                      content='Your Story was saved as a draft'
                      onCancel={this.close}
                      onConfirm={this.handleSave}
             />
          </Grid.Column>
          <Grid.Column >
             <Button color="green"
                     fluid
                     disabled={!this.state.isEnabled}
                     onClick={this.open}>Publish</Button>
             <Confirm open={this.state.open}
                      content='Your Story was published'
                      onCancel={this.close}
                      onConfirm={this.handlePublish}
             />
          </Grid.Column>
          <Grid.Column>
            <Button color="red" fluid onClick={this.open}>Clear Form</Button>
            <Confirm open={this.state.open} onCancel={this.close} onConfirm={this.clearForm} />
          </Grid.Column>
          </Grid>
        </Form>
      </Segment>
    )
  }
}
