import React, { Component } from 'react'
import Slide from './Slide'
import Axios from 'axios'
import './Stylesheets/Slider.css'

export default class Slider extends Component {
    constructor(props) {
      super(props)
      this.state = {
        // Current Images come from a public S3 container
        images: [],
        currentImageIndex: 0,
        // Timer for transitions
        timer: null,
        counter: 0,
      }
    }

    componentDidMount = () => {
        let timer = setInterval(this.tick, 1000)
        let storage = window.localStorage
        let urls = []
        Axios.get('/api/getImages')
        .then(function (res) {
            // Add pre-signed url strings to local storage
            storage.setItem('urls', res.data)
        })
        .catch(function (err) {
            // handle error
            console.log(err)
        })
        urls = storage.getItem('urls').toString().split(',')
        this.setState({
            images: urls,
            timer: timer
        })
    }

    componentWillUnmount = () => {
        clearInterval(this.state.timer)
        this.setState({
            images: []
        })
        let storage = window.localStorage
        storage.removeItem('urls')
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
                        this.state.images.length && this.state.images.map((image, i) => (
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

