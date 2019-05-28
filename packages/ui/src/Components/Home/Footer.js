import React, { Component } from 'react'
import { Button, List, Segment } from 'semantic-ui-react'

class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <Segment
          inverted
          textAlign="center"
          style={{
            flexShrink: 100000, //don't allow flexbox to shrink it
            borderRadius: 0, //clear semantic-ui style
            margin: 0
          }}
        >
          <Segment.Group>
            <a
              href="https://www.facebook.com/BeautifulPortland/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button circular color="facebook" icon="facebook" aria-label="Facebook"/>
            </a>
            <a
              href="https://www.instagram.com/beautifulportlandnonprofit/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button circular color="instagram" icon="instagram" aria-label="Instagram"/>
            </a>
            <a
              href="https://twitter.com/BeautifulPortl3"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button circular color="twitter" icon="twitter" aria-label="Twitter"/>
            </a>
          </Segment.Group>
          <Segment.Group>
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="/about">
                About
              </List.Item>
              <List.Item as="a" href="/ContactUs">
                Contact
              </List.Item>
              <List.Item as="a" href="/about">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="about">
                Privacy Policy
              </List.Item>
            </List>
          </Segment.Group>
          <Segment.Group>
            <p>{'\u00A9'} Beautiful Portland, All rights reserved</p>
          </Segment.Group>
        </Segment>
      </div>
    )
  }
}

export default Footer
