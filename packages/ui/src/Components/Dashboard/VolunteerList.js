import React, { Component } from 'react'
import Axios from 'axios'
import { Table } from 'semantic-ui-react'

class VolunteerList extends Component {
    state = {
        // Default list of volunteers (TESTING ONLY)
        // remove when backend is complete
        volunteers: []
    }

    componentDidMount = () => {
        //Need to generate and fill volunteer list from databases
        Axios.get('/api/volunteerList')
        .then(res => {
            console.log(res.data.volunteer_info)
            let tempVolunteers = JSON.parse(res.data.volunteer_info)
            console.log(tempVolunteers)
            this.setState({
                volunteers: tempVolunteers
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render() {
        return (
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell> Name  </Table.HeaderCell>  
                      <Table.HeaderCell> Email </Table.HeaderCell> 
                      <Table.HeaderCell> Phone </Table.HeaderCell> 
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        // If not volunteers is not empty, go ahead and map it to table
                        this.state.volunteers && this.state.volunteers.map(item =>
                            <Table.Row>
                                <Table.Cell>{item.name}</Table.Cell>
                                <Table.Cell>{item.email}</Table.Cell>
                                <Table.Cell>{item.phone}</Table.Cell>
                            </Table.Row>
                        )
                    }
                </Table.Body>
            </Table>    
        )
    }
}

export default VolunteerList
