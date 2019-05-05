import React, { Component } from 'react'
import { Header, Icon, Table } from 'semantic-ui-react'

class VolunteerSubmissions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submissions: [
        {
          date: '06-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '02-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '09-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '01-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '05-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '09-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '06-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '06-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '06-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '06-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '06-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '06-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '06-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '06-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        },
        {
          date: '06-10-19',
          name: 'Pablo Escobar',
          email: 'pablito@gmail.com',
          type: 'Main',
          desc: 'Pizza',
          servings: 100,
          vegan: false,
          vegetarian: false,
          gluten_free: true
        }
      ]
    }
  }

  renderIcon = value => {
    if (value) {
      return <Icon color="green" name="checkmark" size="small" />
    } else {
      return <Icon color="red" name="times" size="small" />
    }
  }

  render() {
    return (
      <div>
        <Header as="h3">Pablo Escobar</Header>
        <Table celled textAlign={'center'} selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Servings</Table.HeaderCell>
              <Table.HeaderCell>Vegan</Table.HeaderCell>
              <Table.HeaderCell>Vegetarian</Table.HeaderCell>
              <Table.HeaderCell>Gluten-Free</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.submissions &&
              this.state.submissions.map(volunteer => (
                <Table.Row key={volunteer.email + volunteer.desc}>
                  <Table.Cell>{volunteer.date}</Table.Cell>
                  <Table.Cell>{volunteer.name}</Table.Cell>
                  <Table.Cell>{volunteer.email}</Table.Cell>
                  <Table.Cell>{volunteer.type}</Table.Cell>
                  <Table.Cell>{volunteer.desc}</Table.Cell>
                  <Table.Cell>{volunteer.servings}</Table.Cell>
                  <Table.Cell>{this.renderIcon(volunteer.vegan)}</Table.Cell>
                  <Table.Cell>
                    {this.renderIcon(volunteer.vegetarian)}
                  </Table.Cell>
                  <Table.Cell>
                    {this.renderIcon(volunteer['gluten_free'])}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default VolunteerSubmissions
