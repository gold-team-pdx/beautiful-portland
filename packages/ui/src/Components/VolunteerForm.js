import React, { Component } from 'react'
import Item from './Item'
import { Header, Container, Table} from 'semantic-ui-react'
import Axios from 'axios'
import { MyContext } from './MyProvider';

export default class VolunteerForm extends Component {
	onSubmit = (data) => {
		//console.log(JSON.stringify(data, null, 3))
		data.date = '03-07-19'
		Axios.post('/api/form', data)
		.then((response) => {
			console.log(response, 'Form Submitted')
		})
		.catch((err) => {
			console.log(err, 'Try again.')
		})
	}

	componentDidMount() {
		let path = '/api/event?date=03-08-19'
		Axios.get(path).then((response) => {
			console.log(response.data.data)
		})
	}

	render() {
		const users = [
			{
				name: "Eduardo Robles",
				email: "eduardo@gmail.com",
				phone: "503-123-4567",
				type: "Main",
				item: "Pizza",
				servings: 30,
				vegan: true,
				veggie: true,
				gluten: true
			},
			{
				name: "Will Schmid",
				email: "will@gmail.com",
				phone: "503-123-4567",
				type: "Main",
				item: "Pasta",
				servings: 20,
				vegan: true,
				veggie: false,
				gluten: true
			},	
			{
				name: "Ronnie Song",
				email: "Ronnie@gmail.com",
				phone: "503-123-4567",
				type: "Main",
				item: "Hot Dogs",
				servings: 10,
				vegan: false,
				veggie: false,
				gluten: false
			},
			{
				name: "Peyton Holbert",
				email: "peytongmail.com",
				phone: "503-123-4567",
				type: "Side",
				item: "Breadsticks",
				servings: 100,
				vegan: true,
				veggie: true,
				gluten: false
			},
			{
				name: "David Gilmore",
				email: "david@gmail.com",
				phone: "503-123-4567",
				type: "Side",
				item: "Salad",
				servings: 30,
				vegan: true,
				veggie: true,
				gluten: true
			},
			{
				name: "Bailee Johnstone",
				email: "bailee@gmail.com",
				phone: "503-123-4567",
				type: "Main",
				item: "Spaghetti",
				servings: 20,
				vegan: false,
				veggie: true,
				gluten: false
			},
			{
				name: "Colin McCoy",
				email: "colin@gmail.com",
				phone: "503-123-4567",
				type: "Main",
				item: "Burgers",
				servings: 15,
				vegan: true,
				veggie: true,
				gluten: true
			},
		]
		return (
			<MyContext.Consumer>
				{
					(context) => {
						if(context.state.isAuthorized) {
							return(
								<div>
									<Container>
									<h1>Volunteers</h1>
									<h2>Date: 04/07/2019</h2>
									<Table celled>
									<Table.Header>
      									<Table.Row>
        									<Table.HeaderCell>Volunteer</Table.HeaderCell>
        									<Table.HeaderCell>Item</Table.HeaderCell>
        									<Table.HeaderCell>Type</Table.HeaderCell>
        									<Table.HeaderCell>Servings</Table.HeaderCell>
        									<Table.HeaderCell>Vegan</Table.HeaderCell>
        									<Table.HeaderCell>Veggie</Table.HeaderCell>
        									<Table.HeaderCell>Gluten</Table.HeaderCell>
      										</Table.Row>
    									</Table.Header>
										<Table.Body>
									{users.map(user =>(
										<Table.Row>
											<Table.Cell>
												<Header as="h4">
												<Header.Content>
													{user.name}
													<Header.Subheader>{user.phone}</Header.Subheader>
													<Header.Subheader>{user.email}</Header.Subheader>
												</Header.Content>
												</Header>
											</Table.Cell>
        									<Table.Cell>{user.type}</Table.Cell>
        									<Table.Cell>{user.item}</Table.Cell>
        								    <Table.Cell>{user.servings}</Table.Cell>
        									<Table.Cell>{user.vegan.toString()}</Table.Cell>
        									<Table.Cell>{user.veggie.toString()}</Table.Cell>
        									<Table.Cell>{user.gluten.toString()}</Table.Cell>
										</Table.Row>
									))}
									</Table.Body>
									</Table>
									</Container>
								</div>
							)
						}
						return(
							<div>
							<Container>
								<Header as="h2" style={{marginTop: '20px'}}>Director Park Dinner Sign-Up:</Header>
								<Header as="h2">Name and Contact info of Volunteer Co-ordinator: </Header>
								<Item onSubmit={this.onSubmit} />
							</Container>
						</div>
						)
					}
				}
			</MyContext.Consumer>
		)
	}
}
