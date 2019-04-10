import React, { Component } from "react"
import { Table, Container, Header } from "semantic-ui-react"

class VolunteerList extends Component {
  constructor(props){
    super(props)
  }
  render() {
      console.log(this.props.volunteers)
      return(
      <div>
        <Container>
          <h1>Volunteers</h1>
          <h2>Date:{this.props.date}</h2>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Volunteer</Table.HeaderCell>
                <Table.HeaderCell>Desc</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Servings</Table.HeaderCell>
                <Table.HeaderCell>Vegan</Table.HeaderCell>
                <Table.HeaderCell>Vegetarian</Table.HeaderCell>
                <Table.HeaderCell>Gluten</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.volunteers && this.props.volunteers.map(volunteer => (
                <Table.Row>
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
                  <Table.Cell>{volunteer['gluten_Free'].toString()}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>
      </div>
      )
  }
}

export default VolunteerList
