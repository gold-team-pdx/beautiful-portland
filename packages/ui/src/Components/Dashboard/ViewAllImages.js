import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'
import Axios from 'axios'

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
    render() {
        return (
            <div>
                <Card.Group itemsPerRow = {5}>
                    {
                        this.state.images.length && this.state.images.map(item => (
                            <Card raised image={item} />
                        ))
                    }
                </Card.Group>
            </div>
        )
    }
}