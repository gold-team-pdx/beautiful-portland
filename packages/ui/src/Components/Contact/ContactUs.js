import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import HomeLayout from '../Layouts/HomeLayout'

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

export default class ContactUs extends Component {
  render() {
    return (
      <HomeLayout>
        <div style={{marginTop: '10%', paddingBottom: '10%'}}>
          <Grid textAlign="center">
            <Grid.Row centered >
              <Header as="h1" style={headerStyles}>CONTACT US</Header>
            </Grid.Row>
            <Grid.Row centered>
              <Header as="h2" style={paragraphStyles}>Email: adbeautifulpdx@gmail.com</Header>
            </Grid.Row>
            <Grid.Row centered>
              <Header as="h2" style={paragraphStyles}>Phone: (503) 673-2290 </Header>
            </Grid.Row>
          </Grid>
        </div>
      </HomeLayout>
    )
  }
}
