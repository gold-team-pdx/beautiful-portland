import React, {Component} from 'react';
import { Grid, Header} from 'semantic-ui-react';
import '../Stylesheets/contact.css'
import 'semantic-ui-css/semantic.min.css';

export default class ContactUs extends Component {
  render () {
    return (
      <div className="outer">
       <Grid  textAlign='center' style={{height: '102vh'}}>
         <Grid.Column verticalAlign="middle" width={6}  className="smallGrid">
          <Grid.Row className="smallRow"></Grid.Row>
          <Grid.Row className="smallRow">
          <Header as="h1" color="blue" className="con">CONTACT</Header>
          <Header as="h1" color="blue" className="us">US</Header></Grid.Row>
          <Grid.Row className="smallRow"></Grid.Row>
       </Grid.Column>

        <Grid.Column  width={10} className="bigGrid">
         <div verticalAlign="middle" class="ui hidden divider"></div>
         <Header  as="h1" color="blue" className="email" >EMAIL</Header>
         <Header as="h1" color="blue" className="address">beautifulportland@gmail.com</Header>
         <Header as="h1" color="blue" className="email">PHONE</Header>
         <Header as="h1" color="blue" className="address">555-555-5555</Header>
         </Grid.Column>
      </Grid>
    </div>


    )
  }
}