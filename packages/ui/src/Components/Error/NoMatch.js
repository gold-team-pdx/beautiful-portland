import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import HomeLayout from '../Layouts/HomeLayout'
import '../Stylesheets/Error.css'

class NoMatch extends Component {
  render() {
    return (
      <HomeLayout>
        <div className="NoMatch">
          <Container textAlign="center">
            <h1>Error 404 Not Found</h1>
          </Container>
        </div>
      </HomeLayout>
    )
  }
}

export default NoMatch
