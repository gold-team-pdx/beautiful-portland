import React, { Component } from 'react'
import { Accordion, Container, Header, Icon, Divider } from 'semantic-ui-react'
import HomeLayout from '../Layouts/HomeLayout'
import Axios from 'axios'
import RichTextEditor from 'react-rte'
import '../Stylesheets/About.css'

// Sitewide Text Styles
const paragraphStyles = {
  fontFamily: 'Quicksand', 
  fontSize: 'calc(14px + (26 - 14) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
} 

const headerStyles = {
  fontFamily: 'Quicksand',
  fontSize: 'calc(20px + (42 - 20) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
}


class About extends Component {
  state = {
    activeIndex: -1,
    about: RichTextEditor.createEmptyValue(),
    privacyPolicy: RichTextEditor.createEmptyValue(),
    antiDiscPolicy: RichTextEditor.createEmptyValue(),
    termsAndConditions : RichTextEditor.createEmptyValue()
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  componentDidMount() {
    Axios.get('/api/content', {params: {type: 'all'}})
      .then(res  => {
        if(res.data.content) {
          let temp = res.data.content.find(e => {
            return e.type === 'About'
          })
          let tempAbout = RichTextEditor.createValueFromString(temp.content, 'html')

          temp = res.data.content.find(e => {
            return e.type === 'Privacy Policy'
          })
          let tempPrivPol = RichTextEditor.createValueFromString(temp.content, 'html')

          temp = res.data.content.find(e => {
            return e.type === 'Anti-discrimination Policy'
          })
          let tempDonPol = RichTextEditor.createValueFromString(temp.content, 'html')

          temp = res.data.content.find(e => {
            return e.type === 'Terms and Conditions'
          })
          let tempTaC = RichTextEditor.createValueFromString(temp.content, 'html')

          this.setState({
            about: tempAbout,
            privacyPolicy: tempPrivPol,
            antiDiscPolicy: tempDonPol,
            termsAndConditions: tempTaC
          })
        }
      }).catch(err => {

      })
    document.querySelector('div.public-DraftEditor-content').removeAttribute('aria-describedby')
  }

  render() {
    const { activeIndex } = this.state
    return (
      <HomeLayout>
        <div className="About">
          <Container>
            <div style={{ marginTop: '20px' }}>
              <Header as="h1" style={headerStyles}>
                About Us
              </Header>
            </div>
            <Divider />
            <RichTextEditor
              value={this.state.about}
              readOnly
              editorClassName='dropDownContent'
            />
            <Accordion>
              <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={this.handleClick}
                style={paragraphStyles}
              >
                <Icon name="dropdown" />
                Terms and Conditions
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <RichTextEditor
                  value={this.state.termsAndConditions}
                  readOnly
                  editorClassName='dropDownContent'
                />
              </Accordion.Content>

              <Accordion.Title
                active={activeIndex === 1}
                index={1}
                onClick={this.handleClick}
                style={paragraphStyles}
              >
                <Icon name="dropdown" />
                Privacy Policy
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 1}>
                <RichTextEditor
                  value={this.state.privacyPolicy}
                  readOnly
                  editorClassName='dropDownContent'
                />
              </Accordion.Content>

              <Accordion.Title
                active={activeIndex === 2}
                index={2}
                onClick={this.handleClick}
                style={paragraphStyles}
              >
                <Icon name="dropdown" />
                Anti-discrimination Polcy
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 2}>
                <RichTextEditor
                  value={this.state.antiDiscPolicy}
                  readOnly
                  editorClassName='dropDownContent'
                />
              </Accordion.Content>
              
              {/* UNCOMMENT WHEN FINANCIALS DROPBOX SETUP
              <Accordion.Title
                active={activeIndex === 3}
                index={3}
                onClick={this.handleClick}
                style={paragraphStyles}
              >
                <Icon name="dropdown" />
                Financials
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 3}>
                <RichTextEditor
                  value={RichTextEditor.createValueFromString('<p>Beautiful Portland\'s tax documents can be found <a href=\'https://www.dropbox.com/sh/4v1zrrwu3bnlzmx/AAD-x1bog72OGLef7ID28eAMa?dl=0\'> here</a></p>', 'html')}
                  readOnly
                  editorClassName='dropDownContent'
                />
              </Accordion.Content> */}
            </Accordion>
          </Container>
        </div>
      </HomeLayout>
    )
  }
}
export default About
