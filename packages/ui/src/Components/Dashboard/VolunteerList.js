import React, { Component } from 'react'
import Axios from 'axios'
import _ from 'lodash'
import { Table, Search } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import '../Stylesheets/VolunteerList.css'

class VolunteerList extends Component {
  state = {
    // Default list of volunteers (TESTING ONLY)
    // remove when backend is complete
    volunteers: [],
    filteredVolunteers: [],
    isLoading: false,
    keyword: ''
  }

  componentDidMount = () => {
    //Need to generate and fill volunteer list from databases
    Axios.get('/api/volunteerList')
      .then(res => {
        let tempVolunteers = JSON.parse(res.data.volunteer_info)
        this.setState({
          volunteers: tempVolunteers
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleSearchChange = (event, { value }) => {
    this.setState({ keyword: value.toLowerCase() })
  }

  render() {
    let filteredVolunteers =
      this.state.volunteers &&
      this.state.volunteers.filter(volunteer => {
        return (
          volunteer.name.toLowerCase().indexOf(this.state.keyword) !== -1 ||
          volunteer.phone.toLowerCase().indexOf(this.state.keyword) !== -1 ||
          volunteer.email.toLowerCase().indexOf(this.state.keyword) !== -1
        )
      })

    return (
      <div>
        <Search
          loading={this.state.isLoading}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true
          })}
          showNoResults={false}
        />
        <Table singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell> Name </Table.HeaderCell>
              <Table.HeaderCell> Email </Table.HeaderCell>
              <Table.HeaderCell> Phone </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {// If not volunteers is not empty, go ahead and map it to table
              filteredVolunteers &&
              filteredVolunteers.map(item => (
                <Table.Row key={item.email}>
                  <Table.Cell>
                    <Button
                      as={Link}
                      to="/VolunteerSubmissions"
                      onClick={() => {
                        this.props.updateActiveEmail(item.name)
                      }}
                      className="volunteer"
                    >
                      {item.name}
                    </Button>
                  </Table.Cell>
                  <Table.Cell>{item.email}</Table.Cell>
                  <Table.Cell>{item.phone}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default VolunteerList
