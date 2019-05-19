import React, { Component } from 'react'
import { List, Accordion, Icon } from 'semantic-ui-react'
import Axios from 'axios'

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
                <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  {index+1}. {faq.question}
                </Accordion.Title>
                <Accordion.Content active={activeIndex === index}>
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