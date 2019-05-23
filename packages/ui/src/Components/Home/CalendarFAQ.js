import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'
import Axios from 'axios'

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

export default class CalendarFAQ extends Component {
  constructor(){
    super()
    this.state = {
      activeIndex: 0
    }
  }

  componentDidMount = async () => {
	  Axios.get('/api/getCalendarFAQ')
	    .then(res => {
	      let tempFAQs = JSON.parse(res.data.faq_info)
	      console.log(tempFAQs)
	      this.setState({
	        faqs : tempFAQs
        })
	    })
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state

    return (
      <div>
        <Accordion fluid styled>
          {this.state.faqs && this.state.faqs.map((faq, index) =>{
            return(
              <div key={index}>
                <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleClick} style={paragraphStyles}>
                  <Icon name='dropdown' />
                  {index+1}. {faq.question}
                </Accordion.Title>
                <Accordion.Content active={activeIndex === index} style={dropdownStyles}>
                  {faq.answer}
                </Accordion.Content>
              </div>
            )
          })}
        </Accordion>
      </div>
    )
  }
}