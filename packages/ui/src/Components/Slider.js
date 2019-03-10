import React, { Component } from 'react'
import Slide from './Slide'
import Axios from 'axios'
import './Stylesheets/Slider.css'

export default class Slider extends Component {
    constructor(props) {
      super(props)
      this.state = {
        // Current Images come from a public S3 container
        images: [
            "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/aurora.jpg",
            "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/canyon.jpg",
            "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/city.jpg",
            "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/desert.jpg",
            "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/mountains.jpg",
            "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/redsky.jpg",
            "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/sandy-shores.jpg",
            "https://s3.us-east-2.amazonaws.com/dzuz14/thumbnails/tree-of-life.jpg"
        ],
        currentImageIndex: 0,
        // Timer for transitions
        timer: null,
        counter: 0,
      }
    }

    componentDidMount = () => {
        let timer = setInterval(this.tick, 1000);
        this.setState({timer});

        // TODO:
        // Get photos from S3 bucket. Need to add to endpoint 
        // to backend to grab them, then get them somehow to front end.
        Axios.get('/api/getImages')
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    }

    componentWillUnmount = () => {
        this.clearInterval(this.state.timer);
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
                        this.state.images.map((image, i) => (
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

