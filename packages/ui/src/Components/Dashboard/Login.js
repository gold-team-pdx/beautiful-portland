import React, { Component } from 'react'
import { Container, Button, Icon } from 'semantic-ui-react'

export default class Login extends Component {
  render() {
		return (
			<div style={{position:"absolute",top:"50%",left:"40%"}}>
				<Container>
					<Button size='massive' color='google plus'><Icon name='google' /><a href="http://localhost:5000/auth/google" style={{color:"white"}}>Admin Login</a></Button>
				</Container>
			</div>
		)
	}
}