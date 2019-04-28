import React, { Component } from 'react'
import Slide from './Slide'
import Axios from 'axios'
import '../Stylesheets/Slider.css'

const defaultImages = [
    "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/aurora.jpg",
    "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/canyon.jpg",
    "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/city.jpg",
    "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/desert.jpg",
    "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/mountains.jpg",
    "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/redsky.jpg",
    "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/sandy-shores.jpg",
    "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/tree-of-life.jpg"
]

export default class Slider extends Component {
    constructor(props) {
      super(props)
      this.state = {
        images: [],
        currentImageIndex: 0,
        // Timer for transitions
        timer: null,
        counter: 0,
      }
    }

    componentDidMount = () => {
        let timer = setInterval(this.tick, 1000)
        let urls = []
        Axios.get('/api/getImages/', {
            params: {
                isFrontPage: true
            }
        })
        .then((res) => {
            urls = res.data
            console.log(urls)
            console.log(urls.length)
            // Else, set the urls to the default image urls given (TESTING ONLY)
            if(urls.length === 0) {
                urls = defaultImages
            }
            this.setState({
                images: urls,
                timer: timer
            })
        })
        .catch((err) => {
            // handle error
            console.log(err)
        })
    }

    componentWillUnmount = () => {
        clearInterval(this.state.timer)
        this.setState({
            images: []
        })
    }

    tick = () => {
        this.setState(prevState => ({
          counter: prevState.counter + 1
        }));
        if(this.state.counter % 5 === 0) {
            this.nextSlide()
        }
    }

    nextSlide = () => {
        // This makes the carousel infinite. Consistently
        // changes the index of the rest of the images
        let [first, ...rest] = this.state.images;
        let images = [...rest, first];
        return this.setState({
            images: images,
            currentImageIndex: 0,
            counter: 0
        })
    }

    render() {
        return (
            <div className="slider">
                <div className="slider-wrapper" onClick= {this.nextSlide}>
                    {
                        this.state.images.length > 0 && this.state.images.map((image, i) => (
                            <Slide
                                key={i}
                                image={image}
                            />
                        ))
                    }
                </div>
            </div>
        );
    }
  }

