import React, { Component } from 'react'
import { List } from 'semantic-ui-react'




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
              <List.Header>What if I can't make my scheduled volunteer shift</List.Header>
              <List.Description>Text/call the volunteer coordinatoor for that event</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Should I bring something other than my scheduled food item?</List.Header>
              <List.Description>Please dress warm and bring anything you may need to serve your dish</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>What else can I do to support Beautiful Portland if I can't make a volunteer shift?</List.Header>
              <List.Description>You can make a tax deductible donation from our homepage.</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>How or when can I make a non-food item donation?</List.Header>
              <List.Description>You can select a Hot soup event that works for you and choose the type: Miscellaneous</List.Description>
            </List.Content>
          </List.Item>
        </List>
      </div>  
    )
  }
}