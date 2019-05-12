import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'
import '../Stylesheets/contact.css'
import 'semantic-ui-css/semantic.min.css'
import HomeLayout from '../Layouts/HomeLayout'
export default class ContactUs extends Component {
  render() {
    return (
      <HomeLayout>
        <div className="outer">
          <Grid textAlign="center" style={{ height: '100vh' }}>
            <Grid.Column verticalAlign="middle" width={6} className="smallGrid">
              <Grid.Row className="smallRow" />
              <Grid.Row className="smallRow">
                <Header as="h1" color="blue" className="con">
                  CONTACT
                </Header>
                <Header as="h1" color="blue" className="us">
                  US
                </Header>
              </Grid.Row>
              <Grid.Row className="smallRow" />
            </Grid.Column>

            <Grid.Column width={10} className="bigGrid">
              <Header />
              <Header
                verticalAlign="middle"
                as="h1"
                color="blue"
                className="email"
              >
                EMAIL
              </Header>
              <Header as="h1" color="blue" className="address">
                beautifulportland@gmail.com
              </Header>
              <Header as="h1" color="blue" className="email">
                PHONE
              </Header>
              <Header as="h1" color="blue" className="address">
                555-555-5555
              </Header>
            </Grid.Column>
          </Grid>
        </div>
      </HomeLayout>
    )
  }
}
