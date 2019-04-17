import React, { Component } from "react"
import { Table, Container, Header } from "semantic-ui-react"
import Axios from "axios"

class EventList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      volunteers: [{
        name:'n/a',
        desc:'n/a',
        phone:'n/a',
        email:'n/a',
        type:'n/a',
        servings: 0,
        vegan: false,
        vegetarian:false,
        gluten_free:false
      }]
    }
  }

  async componentDidMount() {
    let path = "/api/volunteerInformation?date=" + this.props.date
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
      return(
      <div>
        <Container>
          <h1>Volunteers</h1>
          <h2>Date: {this.props.date}</h2>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Volunteer</Table.HeaderCell>
                <Table.HeaderCell>Desc</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Servings</Table.HeaderCell>
                <Table.HeaderCell>Vegan</Table.HeaderCell>
                <Table.HeaderCell>Vegetarian</Table.HeaderCell>
                <Table.HeaderCell>Gluten-Free</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.volunteers.map(volunteer => (
                <Table.Row key={volunteer.email + volunteer.desc}>
                  <Table.Cell>
                    <Header as="h4">
                      <Header.Content>
                        {volunteer.name}
                        <Header.Subheader>{volunteer.phone}</Header.Subheader>
                        <Header.Subheader>{volunteer.email}</Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{volunteer.type}</Table.Cell>
                  <Table.Cell>{volunteer.desc}</Table.Cell>
                  <Table.Cell>{volunteer.servings}</Table.Cell>
                  <Table.Cell>{volunteer.vegan.toString()}</Table.Cell>
                  <Table.Cell>{volunteer.vegetarian.toString()}</Table.Cell>
                  <Table.Cell>{volunteer['gluten_free'].toString()}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>
      </div>
      )
  }
}

export default EventList
