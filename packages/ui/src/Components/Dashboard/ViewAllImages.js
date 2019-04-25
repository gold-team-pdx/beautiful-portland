import React, { Component } from 'react'
import { Card, Button, Icon, Modal, Header, Form } from 'semantic-ui-react'
import Axios from 'axios'
// import FilePond from 'react-filepond'
import '../Stylesheets/ViewAllImages.css'

export default class ViewAllImages extends Component {
    state = {
        images: [],
        modalOpen: false,
        addModalOpen: false
    }

    // Modal remove functions
    handleClose = () => {this.setState({modalOpen: false})}
    handleOpen = () => {this.setState({modalOpen: true})}

    // Modal add functions
    handleAddModalClose = () => {this.setState({addModalOpen: false})}
    handleAddModalOpen = () => {this.setState({addModalOpen: true})}

    // Serve images
    componentDidMount = () => {
        // Images from s3 container
        let storage = window.sessionStorage
        let urls = []
        Axios.get('/api/getImages')
        .then((res) => {
            // Add pre-signed url strings to local storage
            if (res.data.length !== 0) {
                storage.setItem('urls', JSON.stringify(res.data))
            }
            // If successfully in local storage, set urls to the new images
            if(storage.length > 0) {
                urls = JSON.parse(storage.getItem('urls'))
            }
            let imagesToDisplay = []
            urls.forEach(url => {
                let newImage = {
                    imageUrl: url,
                    checked: false
                }
                imagesToDisplay.push(newImage)
            })
            console.log(imagesToDisplay)
            this.setState({
                images: imagesToDisplay,
            })
        })
        .catch((err) => {
            // handle error
            console.log(err)
        })
    }

    // Remove images from storage and unmount
    componentWillUnmount = () => {
        this.setState({
            images: []
        })
        let storage = window.localStorage
        storage.removeItem('urls')
    }

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

    // Adding photos brings in new component
    addPhotos = () => {
        console.log('add')
    }

    // Removing photos
    // Parses through to remove multiple. If one or
    // more images to remove, send API call to backend
    removePhotos = () => {
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
            modalOpen: false
        })
        if(imagesToDelete.length > 0) {
            Axios.post('/api/removeImageFromBucket', {
                urlsToRemove: imagesToDelete
            })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    render() {
        return (
            <div className="photoView">
                <Modal  trigger= {
                        <Button className='addPhotos' icon labelPosition='left' size="medium" onClick={this.handleAddModalOpen}>
                            <Icon name='add' />
                            Add Photos
                        </Button>
                        }
                        open= {this.state.addModalOpen}
                        onClose={this.handleAddModalClose}
                    >
                    <Modal.Content>
                        <p> Select the photos you would like to add </p>
                        <Form>
                            <input type='file'></input>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' inverted onClick={this.handleAddModalClose}>
                            <Icon name='remove' /> 
                            Cancel
                        </Button>
                        <Button color='green' inverted onClick={this.addPhotos}>
                            <Icon name='checkmark' /> 
                            Upload
                        </Button>
                    </Modal.Actions> 
                </Modal>
                <Modal  trigger={
                            <Button className='deletePhotos' icon labelPosition='left' size="medium" onClick={this.handleOpen}>
                                <Icon name='trash' />
                                Remove Photos
                            </Button>
                        } 
                        open={this.state.modalOpen}
                        onClose={this.handleClose}
                        basic 
                        size='small'
                >
                    <Header icon='trash' content='Remove Photos' />
                    <Modal.Content>
                        <p>
                            Are you sure you want to remove these photos?
                        </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='red' inverted onClick={this.handleClose}>
                            <Icon name='remove' /> No
                        </Button>
                        <Button color='green' inverted onClick={this.removePhotos}>
                            <Icon name='checkmark' /> Yes
                        </Button>
                    </Modal.Actions>
                </Modal>
                <Card.Group className="cardGroup" itemsPerRow = {5}>
                    {
                        this.state.images.length && this.state.images.map(item => (
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