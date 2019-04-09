import React, { Component } from "react"
import Item from "./Item"
import { Header, Container } from "semantic-ui-react"
import Axios from "axios"
import { MyContext } from "./MyProvider"
import VolunteerList from "./VolunteerList"

export default class VolunteerForm extends Component {
  onSubmit = data => {
    //console.log(JSON.stringify(data, null, 3))
    data.date = "03-07-19"
    Axios.post("/api/form", data)
      .then(response => {
        console.log(response, "Form Submitted")
      })
      .catch(err => {
        console.log(err, "Try again.")
      })
  }

  componentDidMount() {
    let path = "/api/event?date=03-08-19"
    Axios.get(path).then(response => {
      console.log(response.data.data)
    })
  }

  render() {
    return (
      <MyContext.Consumer>
        {context => {
          if (context.state.isAuthorized) {
            return <VolunteerList volunteers={users} />
          }
          return (
            <div>
              <Container>
                <Header as="h2" style={{marginTop: '20px'}}>Director Park Dinner Sign-Up:</Header>
					      <Header as="h2">Name and Contact info of Volunteer Coordinator: </Header>
					      <Header as="h2">Date: {this.state.date} </Header>
					      <Item onSubmit={this.onSubmit} />
              </Container>
            </div>
          )
        }}
      </MyContext.Consumer>
    )
  }
}
