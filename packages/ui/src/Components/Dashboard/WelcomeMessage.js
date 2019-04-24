import React,{ Component } from 'react'
import {Header} from 'semantic-ui-react'

export default class WelcomeMessage extends Component {
  render() {
    return (
      <div className="dashWelcome">
       <Header as="h1">Welcome Back</Header>
       </div>
     )
  }
}
