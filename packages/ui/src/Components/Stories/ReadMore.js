import React, { Component } from 'react'
import { Header, Modal, Image, Container, Icon } from 'semantic-ui-react'
import Moment from 'moment'
import Axios from 'axios'
import LogoPlaceHolder from './../../logoPhotos/bpdx_story_place_holder.png'
import '../Stylesheets/PublishStories.css'

// Sitewide Text Styles
const paragraphStyles = {
  fontFamily: 'Nunito',
  color: '#000b91',
  fontSize: 'calc(14px + (26 - 14) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
}

// const headerStyles = {
//   fontFamily: 'Nunito',
//   color: '#000b91',
//   fontSize: 'calc(20px + (42 - 20) * ((100vw - 300px) / (1300)))',
//   lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))}'
// }

const dropdownStyles = {
  fontFamily: 'Nunito',
  color: '#000b91',
  fontSize: 'calc(12px + (20 - 12) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
}

export default class PublishStories extends Component {
  constructor(props){
    super(props)
    this.state = {
      publishStory: [],
      date: '',
      title: this.props.title
    }
  }

  componentDidMount() {
    let path = '/api/getOneStory?title=' + this.props.title
    Axios.get(path)
      .then((response) => {
        let tempPubStory = JSON.parse(response.data.published_info)
        this.setState({
          publishStory: tempPubStory[0],
          date: Moment(tempPubStory[0].edited_timestamp).format('YYYY/MM/D, HH:mm A')
        })
      })
      .catch((err) => {
        console.log(err, 'Try again.')
      })
  }

  close = () => this.setState({ open: false })

  render () {
    const imageUrl = this.state.publishStory.imageUrl
    return (
      <div>
        <Modal.Content>
          <Modal.Description>
            {imageUrl==='notFound' ? (
              <Image fluid size='massive' src={LogoPlaceHolder} />
            ):(
              <Image fluid size='massive' src={this.state.publishStory.imageUrl} />
            )}<br/>
            <Container text>
              <Header as='h1' style= {paragraphStyles}><div className='capitalize'>{this.state.title}</div>
                <Header.Subheader style={dropdownStyles}><Icon name='calendar'/>Last Edited: {this.state.date}</Header.Subheader>
              </Header>
              <Header as='h3' style={paragraphStyles}><i>{this.state.publishStory.hook}</i></Header>
              <p style={paragraphStyles}>{this.state.publishStory.content}</p>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /><br/>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /><br/>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /><br/>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
            </Container>
          </Modal.Description>
        </Modal.Content>
      </div>
    )
  }
}
