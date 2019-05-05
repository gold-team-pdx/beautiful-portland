import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

class NoMatch extends Component {
  render() {
    return (
      <div>
        <Container>
          <h1>Error 404 Not Found</h1>
        </Container>
      </div>
    )
  }
}

export default NoMatch
