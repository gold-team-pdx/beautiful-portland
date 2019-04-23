import React, { Component } from 'react'
import { Container, Button, Icon } from 'semantic-ui-react'

export default class Login extends Component {
  render() {
		return (
			<div style={{position:"absolute",top:"50%",left:"40%"}}>
				<Container>
					<a href="/auth/google" style={{color:"white"}}>
						<Button size='massive' color='google plus'><Icon name='google' />Admin Login</Button>
					</a>
				</Container>
			</div>
		)
	}
}