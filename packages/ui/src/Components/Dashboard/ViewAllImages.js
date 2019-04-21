import React, { Component } from 'react'
import { Card, Button, Icon } from 'semantic-ui-react'
import Axios from 'axios'
import AddPhotos from './AddPhotos'
import '../Stylesheets/ViewAllImages.css'

export default class ViewAllImages extends Component {
    state = {
        images: []
    }
    componentDidMount = () => {
        // Current Images come from a public S3 container. If any images 
        // are in minio instance, they will be served instead.
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

    componentWillUnmount = () => {
        this.setState({
            images: []
        })
        let storage = window.localStorage
        storage.removeItem('urls')
    }

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

    addPhotos = () => {
        return (<AddPhotos />)
    }

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
            images: tempImages
        })
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

    render() {
        return (
            <div className="photoView">
                <Button className='addPhotos' icon labelPosition='left' size="medium" onClick={this.addPhotos}>
                    <Icon name='add' />
                    Add Photos
                </Button>
                <Button className='deletePhotos' icon labelPosition='left' size="medium" onClick={this.removePhotos}>
                    <Icon name='trash' />
                    Remove Photos
                </Button>
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