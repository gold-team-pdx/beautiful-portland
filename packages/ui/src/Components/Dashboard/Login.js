import React, { Component } from 'react'
import { Grid, Button, Icon } from 'semantic-ui-react'
require ('dotenv').config()

export default class Login extends Component {
  render() {
	  	let callbackHost = process.env.REACT_APP_API_ENDPOINT || ''
    return (
      <Grid centered>
        <div style={{position:'absolute',top:'50%'}}>
          <a href={`${callbackHost}/auth/google`} style={{color:'white'}}>
            <Button size='massive' color='google plus'><Icon name='google' />Admin Login</Button>
          </a>
        </div>
      </Grid>
    )
  }
}
