import React, { Component } from 'react'
import { Button, Container, Form, Grid, Header, Icon, Table } from 'semantic-ui-react'
import '../Stylesheets/EditEvent.css'

class EditEvent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			location: '',
			coordinator_name: '',
			coordinator_phone: '',
			volunteers: [
				{
					description: 'Pizza',
					type: 'Main',
					servings: 17,
					vegetarian: false,
					vegan: true,
					gluten_free: false,
					volunteer_name: 'Eduardo',
					volunteer_phone: '503-232-1202',
					volunteer_email: 'eduardo@gmail.com'
				}
			],
			errors: {
				location: '',
				coordinator_name: '',
				coordinator_phone: ''
			},
			locationValid: false,
			coordinatorValid: false,
			phoneValid: false,
			formValid: false
		}
	}

	clearForm = () => {
		this.setState({
			location: '',
			coordinator_name: '',
			coordinator_phone: '',
			volunteers: [],
			errors: {
				location: '',
				coordinator_name: '',
				coordinator_phone: ''
			},
			locationValid: false,
			coordinatorValid: false,
			phoneValid: false,
			formValid: false
		})
	}

	cancelUpdate = () => {
		this.setState({
			location: '',
			coordinator_name: '',
			coordinator_phone: ''
		})
	}

	onSubmit = (e) => {
		e.preventDefault()
		console.log(this.state)
	}

	onChange = (event, data) => {
		this.setState({ [data.name]: data.value }, () => {
			this.validateField(data.name, data.value)
		})
	}

	validateField = (fieldName, value) => {
		let errors = this.state.errors
		let locationValid = this.state.locationValid
		let coordinatorValid = this.state.coordinatorValid
		let phoneValid = this.state.phoneValid

		switch (fieldName) {
			case 'location':
				locationValid = value.length > 2
				errors.location = locationValid ? '' : ' ✗ Please enter a vaild location.'
				break
			case 'coordinator_name':
				coordinatorValid = value.length > 2
				errors.coordinator_name = coordinatorValid ? '' : ' ✗ Please enter a vaild name.'
				break
			case 'coordinator_phone':
				phoneValid = value.match(/^[(]?[0-9]{3}[)]?[-]?[0-9]{3}[-]?[0-9]{4}$/i)
				errors.coordinator_phone = phoneValid ? '' : ' ✗ Please enter a vaild phone number.'
				break
			default:
				break
		}

		this.setState(
			{
				errors,
				locationValid,
				coordinatorValid,
				phoneValid
			},
			this.validateForm
		)
	}

	validateForm = () => {
		if (this.state.locationValid && this.state.coordinator_name && this.state.phoneValid) {
			this.setState({ formValid: true })
		} else {
			this.setState({ formValid: false })
		}
	}

	errorClass(error) {
		return error.length === 0 ? '' : 'has-error'
	}

	renderIcon = (value) => {
		if (value) {
			return <Icon color="green" name="checkmark" size="small" />
		} else {
			return <Icon color="red" name="times" size="small" />
		}
	}

	render() {
		return (
			<div>
				<Container>
					<Header as="h3">Date: 04-25-19</Header>
					<Grid>
						<Grid.Row>
							<Grid.Column width={4}>
								<h4>Location: {this.state.location && this.state.location}</h4>
							</Grid.Column>
							<Grid.Column width={4}>
								<h4>Coordinator: {this.state.coordinator_name && this.state.coordinator_name}</h4>
							</Grid.Column>
							<Grid.Column width={4}>
								<h4>Phone: {this.state.coordinator_phone && this.state.coordinator_phone}</h4>
							</Grid.Column>
						</Grid.Row>
					</Grid>
					<Table celled textAlign={'center'} selectable>
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
							{this.state.volunteers &&
								this.state.volunteers.map((volunteer) => (
									<Table.Row key={volunteer['volunteer_email'] + volunteer.desc}>
										<Table.Cell>
											<Header as="h4">
												<Header.Content>
													{volunteer['volunteer_name']}
													<Header.Subheader>{volunteer['volunteer_phone']}</Header.Subheader>
													<Header.Subheader>{volunteer['volunteer_email']}</Header.Subheader>
												</Header.Content>
											</Header>
										</Table.Cell>
										<Table.Cell>{volunteer.description}</Table.Cell>
										<Table.Cell>{volunteer.type}</Table.Cell>
										<Table.Cell>{volunteer.servings}</Table.Cell>
										<Table.Cell>{this.renderIcon(volunteer.vegan)}</Table.Cell>
										<Table.Cell>{this.renderIcon(volunteer.vegetarian)}</Table.Cell>
										<Table.Cell>{this.renderIcon(volunteer['gluten_free'])}</Table.Cell>
									</Table.Row>
								))}
						</Table.Body>
					</Table>
					<Form onSubmit={this.onSubmit}>
						<Form.Group>
							<div className={`input-wrapper ${this.errorClass(this.state.errors.location)}`}>
								<Form.Input
									name="location"
									onChange={this.onChange}
									value={this.state.location}
									label="Location"
									placeholder="Park Blocs"
								/>
								<span>{this.state.errors.location || ' ✓'}</span>
							</div>
							<div className={`input-wrapper ${this.errorClass(this.state.errors.coordinator_name)}`}>
								<Form.Input
									name="coordinator_name"
									value={this.state.coordinator_name}
									onChange={this.onChange}
									label="Coordinator"
									placeholder="Julie"
								/>
								<span>{this.state.errors.coordinator_name || ' ✓'}</span>
							</div>
							<div className={`input-wrapper ${this.errorClass(this.state.errors.coordinator_phone)}`}>
								<Form.Input
									name="coordinator_phone"
									value={this.state.coordinator_phone}
									onChange={this.onChange}
									label="Phone"
									placeholder="xxx-xxx-xxx"
								/>
								<span>{this.state.errors.coordinator_phone || ' ✓'}</span>
							</div>
						</Form.Group>
						<br />
						<Form.Group inline>
							<Button color="teal" disabled={!this.state.formValid}>
								Update
							</Button>
						</Form.Group>
					</Form>
				</Container>
			</div>
		)
	}
}

export default EditEvent
