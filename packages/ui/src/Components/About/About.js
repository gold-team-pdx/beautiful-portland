import React, { Component } from 'react'
import { Accordion, Container, Header, Icon, Divider } from 'semantic-ui-react'
import HomeLayout from '../Layouts/HomeLayout'
import Axios from 'axios'
import RichTextEditor from 'react-rte'

// Sitewide Text Styles
const paragraphStyles = {
  fontFamily: 'Quicksand', 
  fontSize: 'calc(14px + (26 - 14) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
} 

const headerStyles = {
  fontFamily: 'Quicksand',
  fontSize: 'calc(20px + (42 - 20) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))}'
}

const dropdownStyles = {
  fontFamily: 'Quicksand', 
  fontSize: 'calc(12px + (20 - 12) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
}


class About extends Component {
  state = {
    activeIndex: -1,
    about: RichTextEditor.createEmptyValue(),
    privacyPolicy: RichTextEditor.createEmptyValue(),
    donationPolicy: RichTextEditor.createEmptyValue(),
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
            return e.type === 'Donation Policy'
          })
          let tempDonPol = RichTextEditor.createValueFromString(temp.content, 'html')

          temp = res.data.content.find(e => {
            return e.type === 'Terms and Conditions'
          })
          let tempTaC = RichTextEditor.createValueFromString(temp.content, 'html')

          this.setState({
            about: tempAbout,
            privacyPolicy: tempPrivPol,
            donationPolicy: tempDonPol,
            termsAndConditions: tempTaC
          })
        }
      }).catch(err => {
        console.log('Couldn\'t retrieve data from server')
      })
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
              style={paragraphStyles}
            />
            <Accordion>
              <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={this.handleClick}
                style={paragraphStyles}
              >
                <Icon name="dropdown" />
                Privacy Policy
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <RichTextEditor
                  value={this.state.privacyPolicy}
                  readOnly
                  style={dropdownStyles}
                />
              </Accordion.Content>

              <Accordion.Title
                active={activeIndex === 1}
                index={1}
                onClick={this.handleClick}
                style={paragraphStyles}
              >
                <Icon name="dropdown" />
                Donation Policy
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 1}>
                <RichTextEditor
                  value={this.state.donationPolicy}
                  readOnly
                  style={dropdownStyles}
                />
              </Accordion.Content>

              <Accordion.Title
                active={activeIndex === 2}
                index={2}
                onClick={this.handleClick}
                style={paragraphStyles}
              >
                <Icon name="dropdown" />
                Terms and Conditions
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 2}>
                <RichTextEditor
                  value={this.state.termsAndConditions}
                  readOnly
                  style={dropdownStyles}
                />
              </Accordion.Content>
            </Accordion>
          </Container>
        </div>
      </HomeLayout>
    )
  }
}
export default About
