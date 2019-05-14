import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'
import '../Stylesheets/contact.css'
import 'semantic-ui-css/semantic.min.css'
import HomeLayout from '../Layouts/HomeLayout'
export default class ContactUs extends Component {
  render() {
    return (
      <HomeLayout>
        <div style={{marginTop: "15%"}}>
          <Grid textAlign="center">
            <Grid.Row centered >
              <Header as="h1" color="blue">CONTACT US</Header>
            </Grid.Row>
            <Grid.Row centered>
              <Header as="h2" color="blue">Email: beautifulportland@gmail.com</Header>
            </Grid.Row>
            <Grid.Row centered>
              <Header as="h2" color="blue">Phone: (530)444-4444</Header>
            </Grid.Row>
          </Grid>
        </div>
      </HomeLayout>
    )
  }
}
