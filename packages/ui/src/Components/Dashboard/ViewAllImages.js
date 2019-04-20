import React, { Component } from 'react'
import { Card, Button, Image, Icon } from 'semantic-ui-react'
import Axios from 'axios'
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
            this.setState({
                images: urls,
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
    removePhoto = (item) => {
        let imageToDelete = this.state.images.indexOf(item)
        console.log(item)
        let resetImages = this.state.images.slice(imageToDelete + 1)
        resetImages = this.state.images.slice(0, imageToDelete).concat(resetImages)
        console.log(resetImages)
        this.setState({
            images: resetImages
        })
        Axios.post('/api/removeImageFromBucket', {
            urlToRemove: item
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
            <div id="photoView">
                <Button className='addPhotos' icon size='massive' labelPosition='left' fluid>
                    <Icon name='add' />
                    Add Photos
                </Button>
                <Card.Group className="cardGroup" itemsPerRow = {5}>
                    {
                        this.state.images.length && this.state.images.map(item => (
                            <Card raised>
                                <Card.Content>
                                    <Image key={item} src={item}></Image>
                                </Card.Content>
                                <Card.Content extra className="removeButton">
                                    <Button size='mini' color='red' fluid attached="bottom" onClick={e => this.removePhoto(item)}>
                                        Remove
                                    </Button>
                                </Card.Content>
                            </Card>
                        ))
                    }
                </Card.Group>
            </div>
        )
    }
}