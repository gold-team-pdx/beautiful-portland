import React, { Component } from "react"
import Item from "./Item"
import { Header, Container } from "semantic-ui-react"
import { MyContext } from "./MyProvider"
import EventList from "./EventList"
import Axios from "axios"
import Moment from "moment"

export default class VolunteerForm extends Component {
  constructor(props) {
    super(props)
    let params = new URLSearchParams(this.props.location.search)
    if (params.get("date") === null) {
      params.append("date", new Moment().format("MM-DD-YY"))
    }
    this.state = {
      date: params.get("date"),
      volunteers: [
        {
          name: "n/a",
          desc: "n/a",
          phone: "n/a",
          email: "n/a",
          type: "n/a",
          servings: 0,
          vegan: false,
          vegetarian: false,
          gluten_free: false
        }
      ]
    }
  }

  onSubmit = data => {
    data.date = this.state.date
    Axios.post("/api/form", data)
      .then(response => {
        console.log(response, "Form Submitted")
      })
      .catch(err => {
        console.log(err, "Try again.")
      })
  }

  async componentDidMount() {
    let path = "/api/volunteerInformation?date=" + this.state.date
    Axios.get(path)
      .then(res => {
        let persons = []
        if (res.data["event_info"]) {
          let data = JSON.parse(res.data["event_info"])
          data.map(person => persons.push(person))
          this.setState({ volunteers: persons })
        }
      })
      .catch(err => {
        console.log(err, "Error Retrieving List")
      })
  }

  render() {
    return (
      <MyContext.Consumer>
        {context => {
          if (context.state.isAuthorized) {
            return (
              <EventList
                date={this.state.date}
                volunteers={this.state.volunteers}
              />
            )
          }
          return (
            <div>
              <Container>
                <Header as="h2" style={{ marginTop: "20px" }}>Director Park Dinner Sign-Up:{" "}</Header>
                <Header as="h2">Name and Contact info of Volunteer Coordinator:{" "}</Header>
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
