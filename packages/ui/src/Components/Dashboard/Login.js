import React, { Component } from 'react'
import { Container, Button, Icon } from 'semantic-ui-react'
require ('dotenv').config()

export default class Login extends Component {
  render() {
	  	let callbackHost = process.env.REACT_APP_API_ENDPOINT || ''
		return (
			<div style={{position:"absolute",top:"50%",left:"40%"}}>
				<Container>
					<a href={"http://localhost:5000/auth/google"} style={{color:"white"}}>
						<Button size='massive' color='google plus'><Icon name='google' />Admin Login</Button>
					</a>
				</Container>
			</div>
		)
	}
}