import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

class VolunteerList extends Component {
    state = {
        volunteers: [
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Bill Nye', 
                email: 'thescienceguy@example.com',
                phone: '503-555-5555'
            }, 
            {
                name: 'Neil DeGrasse Tyson',
                email: 'cosmos@example.com',
                phone: '333-333-3333'
            }
        ]
    }
    componentDidMount = () => {
        //Need to generate and fill volunteer list
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
                        this.state.volunteers.map(item =>
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