import React, { Component } from 'react'
import { Card, Button, Icon, Modal, Header, Form } from 'semantic-ui-react'
import Axios from 'axios'

export default class EditCarouselImages extends Component {
    state = {
      images: [],
      imagesNotOnFrontPage: [],
      removeModalOpen: false,
      addNewModalOpen: false,
      addFromUploadModalOpen: false,
    }

    // Modal remove functions
    handleClose = () => {this.setState({removeModalOpen: false})}
    handleOpen = () => {this.setState({removeModalOpen: true})}

    // Modal add functions
    handleAddModalClose = () => {this.setState({addNewModalOpen: false})}
    handleAddModalOpen = () => {this.setState({addNewModalOpen: true})}

    // Modal add from uploaded functions
    handleAddFromModalClose = () => {this.setState({addFromUploadModalOpen: false})}
    handleAddFromModalOpen = () => {this.setState({addFromUploadModalOpen: true})}

    // Serve images
    componentDidMount = () => {
      // Images from s3 container
      this.initializeImages()
      // Get images specifically NOT being displayed on the front page
      this.initializeNotFrontImages()
    }

    // Remove images from storage and unmount
    componentWillUnmount = () => {
      this.setState({
        images: [],
        imagesNotOnFrontPAge: []
      })
    }

    // Initialize images to display
    initializeImages = () => {
      console.log('initializeImages')
      let urls = []
      Axios.get('/api/getImages/', {
        params: {
          isFrontPage: true,
          needNotOnFront: false
        }
      })
        .then((res) => {
          urls = res.data
          console.log(urls)
          let imagesToDisplay = []
          urls.forEach(url => {
            let newImage = {
              imageUrl: url,
              checked: false
            }
            imagesToDisplay.push(newImage)
          })
          this.setState({
            images: imagesToDisplay,
          })
        })
        .catch((err) => {
          // handle error
          console.log(err)
        })
    }

    // Initialize images not on front page
    initializeNotFrontImages = () => {
      console.log('initializeNotImages')
      Axios.get('/api/getImages/', {
        params: {
          isFrontPage: true,
          needNotOnFront: true
        }
      })
        .then((res) => {
          let urls = res.data
          let imagesToDisplay = []
          if(urls.length === 0) {
            this.setState({
              imagesNotOnFrontPage: []
            })
          }
          else {
            console.log(urls)
            urls.forEach(url => {
              let newImage = {
                imageUrl: url,
                checked: false
              }
              imagesToDisplay.push(newImage)
            })
            this.setState({
              imagesNotOnFrontPage: imagesToDisplay,
            })
          }
        })
        .catch((err) => {
          // handle error
          console.log(err)
        })
    }

    // Handles clicking a photo in the photoview
    // When photo is clicked, flip boolean
    handlePhotoClick = (item) => {
      let tempImages = [...this.state.images]
      let index = tempImages.indexOf(item)
      let isClicked = tempImages[index].checked 
      isClicked = isClicked ? false : true
      tempImages[index].checked = isClicked
      this.setState({
        images: tempImages
      })
    }

    // Handles clicking a photo in the "Add from Uploaded" modal
    handlePhotoClickInModal = (item) => {
      let tempImages = [...this.state.imagesNotOnFrontPage]
      let index = tempImages.indexOf(item)
      let isClicked = tempImages[index].checked 
      isClicked = isClicked ? false : true
      tempImages[index].checked = isClicked
      this.setState({
        imagesNotOnFrontPage: tempImages
      })
    }

    // Adding photos to s3 bucket
    addPhotos = (input) => {
      if(input.files.length > 0) {
        for(let i = 0; i < input.files.length; ++i) {
          let reader = new FileReader()
          reader.onerror = () => {
            reader.abort()
            console.log('Problem parsing input file')
          }
          reader.onload = e => {
            let data = e.target.result
            let file = {
              'fileData': data,
              'fileName': input.files[i].name
            }
            Axios.post('/api/addImagesToBucket', {
              filesToAdd: file,
              isFrontPage: true
            })
              .then(res => {
                if(i === (input.files.length - 1)) {
                  this.initializeImages()
                  this.setState({
                    addNewModalOpen: false
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
          reader.readAsDataURL(input.files[i])
        }
      }
    }

    // Removing photos
    // Parses through to remove multiple. If one or
    // more images to remove, send API call to backend
    removePhotosFromFrontPage = () => {
      let imagesToDelete = []
      let tempImages = [...this.state.images]
      tempImages = tempImages.filter(image => {
        if(image.checked === true){
          imagesToDelete.push(image.imageUrl)
          return false
        }
        else {
          return true
        }
      })
      this.setState({
        images: tempImages,
        removeModalOpen: false
      })
      if(imagesToDelete.length > 0) {
        Axios.post('/api/removeImagesFromFrontPage', {
          urlsToRemove: imagesToDelete,
        })
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
        this.initializeNotFrontImages()
      }
    }

    // Add photos to s3 from already uploaded photos
    addPhotosFromUploaded = () => {
      let imagesToDelete = []
      let tempImages = [...this.state.imagesNotOnFrontPage]
      tempImages = tempImages.filter(image => {
        if(image.checked === true){
          imagesToDelete.push(image.imageUrl)
          return false
        }
        else {
          return true
        }
      })
      console.log(tempImages)
      this.setState({
        imagesNotOnFrontPage: tempImages,
        addFromUploadModalOpen: false
      })
      if(imagesToDelete.length > 0) {
        Axios.post('/api/addImageFromUploaded', {
          urlsToRemove: imagesToDelete
        })
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
        this.initializeImages()
      }
    }

    render() {
      return (
        <div className="photoView">
          <Modal  trigger= {
            <Button className='addNewPhotos' icon labelPosition='left' size="medium" onClick={this.handleAddModalOpen}>
              <Icon name='add' />
                            Add New Photos
            </Button>
          }
          open= {this.state.addNewModalOpen}
          onClose={this.handleAddModalClose}>
            <Modal.Content>
              <h3> Add photos </h3>
              <Form>
                <input type='file' id="files" name="files[]" multiple accept="image/png, image/jpeg"></input>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' inverted onClick={this.handleAddModalClose}>
                <Icon name='remove' /> 
                            Cancel
              </Button>
              <Button color='green' inverted onClick={e => this.addPhotos(document.getElementById('files'))}>
                <Icon name='checkmark' /> 
                            Upload Photo
              </Button>
            </Modal.Actions> 
          </Modal>
          <Modal  trigger= {
            <Button className='addFromUploaded' icon labelPosition='left' size="medium" onClick={this.handleAddFromModalOpen}>
              <Icon name='add' />
                            Add Photos From Uploaded
            </Button>
          }
          open= {this.state.addFromUploadModalOpen}
          onClose={this.handleAddFromModalClose}>
            <Modal.Content>
              <h3> Choose Photos </h3>
              <Card.Group className="cardGroup" itemsPerRow = {5}>
                {
                  this.state.imagesNotOnFrontPage.length > 0 && this.state.imagesNotOnFrontPage.map(item => (
                    <Card 
                      image={item.imageUrl} 
                      onClick={e => {this.handlePhotoClickInModal(item)}}
                      className={item.checked ? 'clicked' : 'notClicked'} 
                    />
                  ))
                }
              </Card.Group>       
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' inverted onClick={this.handleAddFromModalClose}>
                <Icon name='remove' /> 
                            Cancel
              </Button>
              <Button color='green' inverted onClick={this.addPhotosFromUploaded}>
                <Icon name='checkmark' /> 
                            Add Photos
              </Button>
            </Modal.Actions> 
          </Modal>
          <Modal  trigger={
            <Button className='deletePhotos' icon labelPosition='left' size="medium" onClick={this.handleOpen}>
              <Icon name='trash' />
                                Remove Photos from Front Page
            </Button>
          } 
          open={this.state.removeModalOpen}
          onClose={this.handleClose}
          basic 
          size='small'
          >
            <Header icon='trash' content='Remove Photos' />
            <Modal.Content>
              <p>
                            Are you sure you want to remove these photos from the front page?
              </p>
            </Modal.Content>
            <Modal.Actions>
              <Button basic color='red' inverted onClick={this.handleClose}>
                <Icon name='remove' /> No
              </Button>
              <Button color='green' inverted onClick={this.removePhotosFromFrontPage}>
                <Icon name='checkmark' /> Yes
              </Button>
            </Modal.Actions>
          </Modal>
          <Card.Group className="cardGroup" itemsPerRow = {5}>
            {
              this.state.images.length > 0 && this.state.images.map(item => (
                <Card 
                  image={item.imageUrl} 
                  onClick={e => {this.handlePhotoClick(item)}}
                  className={item.checked ? 'clicked' : 'notClicked'} 
                />
              ))
            }
          </Card.Group>
        </div>
      )
    }
}