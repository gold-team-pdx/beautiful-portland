import React, { Component } from 'react'
import { Container, Button, Icon } from 'semantic-ui-react'

export default class Login extends Component {
  render() {
		return (
			<div style={{position:"relative",top:"50%"}}>
				<Container textAlign='center'>
					<a href="http://localhost:5000/auth/google" style={{color:"white"}}>
						<Button size='massive' color='google plus'><Icon name='google' />Admin Login</Button>
					</a>
				</Container>
			</div>
		)
	}
}