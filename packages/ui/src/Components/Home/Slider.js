import React, { Component } from 'react'
import Slide from './Slide'
import Axios from 'axios'
import '../Stylesheets/Slider.css'

export default class Slider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      currentImageIndex: 0,
      // If less than 3 images on the front page, this is false (changes the way images display on page)
      lessThan3: false,
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
          isFrontPage: true,
          needNotOnFront: false
        }
      })
        .then((res) => {
          urls = res.data
          let isLessThan3 = false
          if(urls.length < 3) {
            isLessThan3 = true
            if(urls[1] === undefined) {
              urls[1] = urls[0]
            }
          }
          this.setState({
            images: urls,
            lessThan3: isLessThan3,
            timer: timer
          })
        })
        .catch((err) => {
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
      }))
      if(this.state.counter % 5 === 0) {
        this.nextSlide()
      }
      // If images are ready to expire, 15 minutes is the default, reload them.
      if(this.state.counter === (60*15)) {
        window.location.reload()
      }
    }

    nextSlide = () => {
      // This makes the carousel infinite. Consistently
      // changes the index of the rest of the images
      let [first, ...rest] = this.state.images
      let images = [...rest, first]
      this.setState({
        images: images,
        currentImageIndex: 0,
        counter: 0
      })
    }

    render() {
      return (
        <div className="slider">
          <div className="slider-wrapper">
            {
              this.state.images.length > 0 && this.state.images.map((image, i) => (
                <Slide
                  slideNum={i}
                  image={image}
                  isLessThan3={this.state.lessThan3}
                />
              ))
            }
          </div>
        </div>
      )
    }
}

