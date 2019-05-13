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
      openSave: false,
      openPublish: false,
      openClear: false,
      // Photo data
      // holds filename
      postPhotoName: 'No Photo',
      // Holds file buffer data and filename for s3
      postPhoto: {},
      // Holds image url or buffer data for serving image
      postImageData: '',
      // Holds old image to remove 
      oldPhotoName: '',
      // Modal and confirm bools
      addModalOpen: false,
      openRemovePhoto: false,
    }
  }

  componentDidMount = () => {
    if(this.props.editId !== undefined) {
      Axios.post('/api/getStoryEdit', { id: this.props.editId })
        .then((response) => {
         //Get photo from s3 bucket to serve
         if(response.data.postPhotoName !== 'No Photo')
          this.getPhotoFromS3(response.data.postPhotoName)
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

  handlePublish = () => {
    // Object spread syntax, immediately sets publish_status to true,
    // but doesn't set state of object
    let data = {
      ...this.state, publish_status: true
    }
    // Sets state for later
    this.setState({publish_status: true})
    if(this.state._id !== undefined && this.state._id !== '') {
      Axios.post("/api/editedStory", data)
        .then(response => {
          console.log(response, "Story has been edited and saved to published")
          this.handleDelete()
          // Handles removing uneeded photos from s3 bucket
          if(this.state.oldPhotoName !== '') {
            this.removeFromS3Bucket()
          }
          // Handles adding new photos to s3 bucket AND
          // does a clearForm()
          if(this.state.postPhotoName !== 'No Photo') {
            this.addToS3Bucket()
          }
          else {
            this.clearForm()
          }
         
        })
        .catch(err => {
          console.log(err, "Try again.")
        })
    } 
    else {
      Axios.post("/api/addPublish", data)
      .then(response => {
        console.log(response, "Story has been published")
        this.handleDelete()
        if(this.state.oldPhotoName !== '') {
          this.removeFromS3Bucket()
        }
        if(this.state.postPhotoName !== 'No Photo') {
          this.addToS3Bucket()
        }
        else {
          this.clearForm()
        }
      })
      .catch(err => {
        console.log(err, "Try again.")
      })
    }
    this.handleClosePublish()
  }

 /*Checks for publish_status if load through edit*/
  handleSave = () => {
    if(this.state.publish_status) {
      this.handlePublish()
    } 
    else if(this.state._id !== undefined && this.state._id !== '') {
      Axios.post("/api/editedStory", this.state)
        .then(response => {
          console.log(response, "Story has been edited and saved to drafts")
          if(this.state.oldPhotoName !== '') {
            this.removeFromS3Bucket()
          }
          if(this.state.postPhotoName !== 'No Photo') {
            this.addToS3Bucket()
          }
          else {
            this.clearForm()
          }
        })
        .catch(err => {
          console.log(err, "Try again.")
        })
    } 
    else {
      Axios.post("/api/addDraft", this.state)
      .then(response => {
        console.log(response, "Story saved to drafts")
        if(this.state.oldPhotoName !== '') {
          this.removeFromS3Bucket()
        }
        if(this.state.postPhotoName !== 'No Photo') {
          this.addToS3Bucket()
        }
        else {
          this.clearForm()
        }
      })
      .catch(err => {
        console.log(err, "Try again.")
      })
    }
    this.handleCloseSave()
  }

  handleDelete = () => {
    console.log("Deleting draft with id: " + this.state._id)
    Axios.post('/api/deleteDraft', {deleteId: this.state._id})
      .then(res => {
         console.log(res.data);
      })
      .catch((err) => {
         console.log(err);
      })
  }

  clearForm = () => {
    this.setState({
      title: '',
      hook: '',
      content: '',
      publish_status: false,
      open: false,
      postPhotoName: 'No Photo',
      postPhoto: {},
      postImageData: '' 
    })
    this.handleCloseClear()
 }

  // Handles save confirm boolean
  handleOpenSave = () => this.setState({ openSave: true })
  handleCloseSave = () => this.setState({ openSave: false })

  // Handles open confirm boolean
  handleOpenPublish = () => this.setState({ openPublish: true })
  handleClosePublish = () => this.setState({ openPublish: false })

  // Handles clearform confirm boolean
  handleOpenClear = () => this.setState({ openClear: true })
  handleCloseClear = () => this.setState({ openClear: false })

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  // Image Modal Functions
  handleModalClose = () => this.setState({addModalOpen: false})
  handleModalOpen = () => this.setState({addModalOpen: true})
  
  // Alert modal for removing photo from post
  openRemovePhoto = () => this.setState({ openRemovePhoto: true })
  closeRemovePhoto = () => this.setState({ openRemovePhoto: false })

  // Add image to s3 bucket
  addToS3Bucket = () => {
    // Only add the photo if it hasn't already been added to s3
    // or if it has been changed
    let fileName = this.state.postImageData.split('/').pop()
    // If the keys are different, push new file.
    if(fileName !== this.state.postPhotoName) {
      Axios.post('/api/addImageIntoStories', {
        fileToAdd: this.state.postPhoto
        })
        .then(res => {
          console.log('Photo saved in s3')
          this.clearForm()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  // Removes old photos from s3 bucket that will not be used
  // for a blog post 
  removeFromS3Bucket = () => {
    Axios.post('/api/removeImageFromStories', {
      fileToRemove: this.state.oldPhotoName
    })
    .then(res => {
      this.setState({oldPhotoName: ''})
    })
    .catch(err => {
      console.log(err)
    })
  }
  // Retrieving an image from s3 to add to post
  getPhotoFromS3 = (fileKey) => {
    Axios.get('/api/getImageForStory', {
      params: {
        fileName: fileKey
      }
    })
    .then(res => {
      this.setState({postImageData: res.data})
    })
    .catch(err => {
      console.log(err)
    })
  }

  // Add Image to post
  addPhoto = (input) => {
    let reader = new FileReader()
    let name = input.value.toString().split(/(\\|\/)/g).pop().split('.')[0]
    let data = ''
    let newFile = {}
    let oldPhoto = ''
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
      // If there is an old photo, save the name to delete later
      if(this.state.postPhotoName !== 'No Photo') {
        oldPhoto = this.state.postPhotoName
      }
      this.setState({
        postImageData: data, 
        postPhotoName: newFileName,
        postPhoto: newFile, 
        oldPhotoName: oldPhoto
      })
    }
    reader.readAsDataURL(input.files[0])
    this.handleModalClose()
  }

  // Remove image from post
  removePhotoFromStory = () => {
    // If there was a photo, save to remove later
    let oldPhoto = this.state.postPhotoName
    this.setState({
      postPhotoName: 'No Photo',
      postPhoto: {},
      postImageData: '',
      oldPhotoName: oldPhoto,
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
                     disabled={!this.state.title || !this.state.hook || !this.state.content}
                     onClick={this.handleOpenSave}>Save</Button>
             <Confirm open={this.state.openSave}
                      content='Your Story will be saved as a draft'
                      onCancel={this.handleCloseSave}
                      onConfirm={this.handleSave}
             />
          </Grid.Column>
          <Grid.Column >
             <Button color="green"
                     fluid
                     disabled={!this.state.title || !this.state.hook || !this.state.content}
                     onClick={this.handleOpenPublish}>Publish</Button>
             <Confirm open={this.state.openPublish}
                      content='Your Story will be published'
                      onCancel={this.handleClosePublish}
                      onConfirm={this.handlePublish}
             />
          </Grid.Column>
          <Grid.Column>
            <Button color="red" fluid onClick={this.handleOpenClear}>Clear Form</Button>
            <Confirm open={this.state.openClear} onCancel={this.handleCloseClear} onConfirm={this.clearForm} />
          </Grid.Column>
          </Grid>
        </Form>
      </Segment>
    )
  }
}
