import React, { Component } from 'react'
import { Header, Modal, Image, Container, Icon } from 'semantic-ui-react'
import Moment from 'moment'
import Axios from 'axios'
import RichTextEditor from 'react-rte'
import LogoPlaceHolder from './../../logoPhotos/bpdx_story_place_holder.png'
import '../Stylesheets/PublishStories.css'

// Sitewide Text Styles
const paragraphStyles = {
  fontFamily: 'Quicksand',
  fontSize: 'calc(14px + (26 - 14) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
}

const dropdownStyles = {
  fontFamily: 'Quicksand',
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
    document.querySelector('div.public-DraftEditor-content').removeAttribute('aria-describedby')
  }

  close = () => this.setState({ open: false })

  render () {
    const imageUrl = this.state.publishStory.imageUrl
    return (
      <div>
        <Modal.Content>
          <Modal.Description>
            {imageUrl==='notFound' ? (
              <Image fluid size='massive' src={LogoPlaceHolder} alt="Beautiful Portland Logo"/>
            ):(
              <Image fluid size='massive' src={this.state.publishStory.imageUrl} alt={'Photo for story: ' + this.state.title} />
            )}<br/>
            <Container text style={{paddingBottom: '10px'}}>
              <Header as='h1' style= {paragraphStyles}><div className='capitalize'>{this.state.title}</div>
                <Header.Subheader style={dropdownStyles}><Icon name='calendar'/>Last Edited: {this.state.date}</Header.Subheader>
              </Header>
              <Header as='h3' style={paragraphStyles}><i>{this.state.publishStory.hook}</i></Header>
              <RichTextEditor
                value={RichTextEditor.createValueFromString(this.state.publishStory.content, 'html')}
                editorClassName="story-content"
                readOnly
              />
            </Container>
          </Modal.Description>
        </Modal.Content>
      </div>
    )
  }
}
