import React, { Component } from 'react'
import { List } from 'semantic-ui-react'


// Sitewide Text Styles
const paragraphStyles = {
  fontFamily: 'Nunito',
  color: '#000b91', 
  fontSize: 'calc(14px + (26 - 14) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
} 

const dropdownStyles = {
  fontFamily: 'Nunito', 
  color: '#000b91', 
  fontSize: 'calc(12px + (20 - 12) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
}

export default class CalednarFAQ extends Component {
  constructor(){
    super()
    this.state = {}
  }

  render() {
    return (
      <div>
        <List>
          <List.Item>
            <List.Content>
              <List.Header style={paragraphStyles}>What if I can't make my scheduled volunteer shift</List.Header>
              <List.Description style={dropdownStyles}>Text/call the volunteer coordinatoor for that event</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header style={paragraphStyles}>Should I bring something other than my scheduled food item?</List.Header>
              <List.Description style={dropdownStyles}>Please dress warm and bring anything you may need to serve your dish</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header style={paragraphStyles}>What else can I do to support Beautiful Portland if I can't make a volunteer shift?</List.Header>
              <List.Description style={dropdownStyles}>You can make a tax deductible donation from our homepage.</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header style={paragraphStyles}>How or when can I make a non-food item donation?</List.Header>
              <List.Description style={dropdownStyles}>You can select a Hot soup event that works for you and choose the type: Miscellaneous</List.Description>
            </List.Content>
          </List.Item>
        </List>
      </div>  
    )
  }
}