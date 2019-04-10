import React, { Component } from 'react'
import { Form, Button, Dropdown, Segment } from 'semantic-ui-react'
import './Stylesheets/Item.css'

export default class Item extends Component {
	constructor(props) {
		super(props)
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.validateField = this.validateField.bind(this)
		this.errorClass = this.errorClass.bind(this)
		this.state = {
			description: '',
			type: '',
			servings: 0,
			vegetarian: false,
			vegan: false,
			gluten_free: false,
			volunteer_name: '',
			volunteer_phone: '',
			volunteer_email: '',
			errors: {
				type: '',
				description: '',
				servings: '',
				volunteer_name: '',
				volunteer_phone: '',
				volunteer_email: ''
			},
			typeValid: false,
			descriptionValid: false,
			servingsValid: false,
			volunteer_nameValid: false,
			volunteer_phoneValid: false,
			volunteer_emailValid: false,
			formValid: false
		}
	}

	clearForm = () => {
		this.setState({
			description: '',
			type: '',
			servings: 0,
			vegetarian: false,
			vegan: false,
			gluten_free: false,
			volunteer_name: '',
			volunteer_phone: '',
			volunteer_email: '',
			errors: {
				type: '',
				description: '',
				servings: '',
				volunteer_name: '',
				volunteer_phone: '',
				volunteer_email: ''
			},
			typeValid: false,
			descriptionValid: false,
			servingsValid: false,
			volunteer_nameValid: false,
			volunteer_phoneValid: false,
			volunteer_emailValid: false,
			formValid: false
		})
	}

	onSubmit = (e) => {
		e.preventDefault()
		this.props.onSubmit(this.state)
		this.clearForm()
	}

	updateCheckbox = (event, data) => {
		this.setState({ [data.name]: data.checked })
	}

	onChange = (event, data) => {
		this.setState({ [data.name]: data.value }, () => {
			this.validateField(data.name, data.value)
		})
	}

	validateField(fieldName, value) {
		let errors = this.state.errors
		let typeValid = this.state.typeValid
		let servingsValid = this.state.servingsValid
		let volunteer_nameValid = this.state.volunteer_nameValid
		let volunteer_phoneValid = this.state.volunteer_phoneValid
		let volunteer_emailValid = this.state.volunteer_emailValid
		let descriptionValid = this.state.descriptionValid

		switch (fieldName) {
			case 'type':
				typeValid = value
				errors.type = typeValid ? '' : ' ✗ Please select a type'
				break
			case 'description':
				descriptionValid = value.length >= 5
				errors.description = descriptionValid ? '' : ' ✗ Message must be longer than five characters.'
				break
			case 'servings':
				servingsValid = value > 0 && value <= 150
				errors.servings = servingsValid ? '' : ' ✗ Please enter a vaild number between 0~150.'
				break
			case 'volunteer_name':
				volunteer_nameValid = value.length > 2
				errors.volunteer_name = volunteer_nameValid ? '' : ' ✗ Please enter a vaild Name.'
				break
			case 'volunteer_phone':
				volunteer_phoneValid = value.match(/^[(]?[0-9]{3}[)]?[-]?[0-9]{3}[-]?[0-9]{4}$/i)
				errors.volunteer_phone = volunteer_phoneValid ? '' : ' ✗ Please enter a vaild phone number.'
				break
			case 'volunteer_email':
				volunteer_emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
				errors.volunteer_email = volunteer_emailValid ? '' : ' ✗ Please enter a valid email.'
				break
			default:
				break
		}

		this.setState(
			{
				errors,
				typeValid,
				servingsValid,
				volunteer_nameValid,
				volunteer_phoneValid,
				volunteer_emailValid,
				descriptionValid
			},
			this.validateForm
		)
	}

	validateForm() {
		this.setState({
			formValid:
				this.state.typeValid &&
				this.state.servingsValid &&
				this.state.volunteer_nameValid &&
				this.state.volunteer_phoneValid &&
				this.state.volunteer_emailValid &&
				this.state.descriptionValid
		})
	}

	errorClass(error) {
		return error.length === 0 ? '' : 'has-error'
	}

	render() {
		const options = [
			{ key: '', text: '', value: '' },
			{ key: 'main', text: 'Main Course', value: 'main' },
			{ key: 'side', text: 'Side Dish', value: 'side' },
			{ key: 'dessert', text: 'Dessert', value: 'dessert' },
			{ key: 'takeAway', text: 'Take-Away', value: 'takeAway' },
			{ key: 'beverage', text: 'Beverages', value: 'beverage' },
			{ key: 'supplies', text: 'Serving Supplies', value: 'supplies' },
			{ key: 'donation', text: 'Donation', value: 'donation' }
		]
		return (
			<div>
				<Segment>
					<Form onSubmit={this.onSubmit}>
						<br />

						<div className={`input-wrapper ${this.errorClass(this.state.errors.type)}`}>
							<b>Please select a type:</b>
							<Form.Group inline>
								<Form.Input>
									<Dropdown
										name="type"
										value={this.state.type}
										onChange={this.onChange}
										placeholder="type"
										fluid
										selection
										style={{ width: '370px' }}
										options={options}
										label="Select a type:"
									/>
								</Form.Input>
								<div>
									<span>{this.state.errors.type || ' ✓'}</span>
								</div>
							</Form.Group>
						</div>
						<br />

						<div className={`input-wrapper ${this.errorClass(this.state.errors.description)}`}>
							<Form.Group inline>
								<Form.Input
									name="description"
									value={this.state.description}
									onChange={this.onChange}
									style={{ width: '370px' }}
									label="Item"
									placeholder="description"
								/>
								<div>
									<span>{this.state.errors.description || ' ✓'}</span>
								</div>
							</Form.Group>
						</div>
						<br />
						<Form.Group>
							<Form.Checkbox
								onChange={this.updateCheckbox}
								checked={this.state.vegan}
								name="vegan"
								label="Vegan"
							/>
							<Form.Checkbox
								onChange={this.updateCheckbox}
								checked={this.state.vegetarian}
								name="vegetarian"
								label="Vegetarian"
							/>
							<Form.Checkbox
								onChange={this.updateCheckbox}
								checked={this.state.gluten_free}
								name="gluten_free"
								label="Gluten-free"
							/>
						</Form.Group>
						<br />

						<Form.Group inline>
							<div className={`input-wrapper ${this.errorClass(this.state.errors.servings)}`}>
								<Form.Group inline>
									<Form.Input
										name="servings"
										value={this.state.servings}
										onChange={this.onChange}
										inline
										label="Servings"
									/>
									<div>
										<span>{this.state.errors.servings || ' ✓'}</span>
									</div>
								</Form.Group>
							</div>
						</Form.Group>

						<Form.Group widths="equal">
							<div className={`input-wrapper ${this.errorClass(this.state.errors.volunteer_name)}`}>
								<Form.Input
									name="volunteer_name"
									value={this.state.volunteer_name}
									onChange={this.onChange}
									label="Name"
									placeholder=" John"
								/>
								<span>{this.state.errors.volunteer_name || ' ✓'}</span>
							</div>

							<div className={`input-wrapper ${this.errorClass(this.state.errors.volunteer_email)}`}>
								<Form.Input
									name="volunteer_email"
									value={this.state.volunteer_email}
									onChange={this.onChange}
									label="Email"
									placeholder=" xxxx@gmail.com"
								/>
								<span>{this.state.errors.volunteer_email || ' ✓'}</span>
							</div>

							<div className={`input-wrapper ${this.errorClass(this.state.errors.volunteer_phone)}`}>
								<Form.Input
									name="volunteer_phone"
									value={this.state.volunteer_phone}
									onChange={this.onChange}
									label="Phone"
									placeholder=" xxx-xxx-xxxx"
								/>
								<span>{this.state.errors.volunteer_phone || ' ✓'}</span>
							</div>
						</Form.Group>
						<Button color="green" disabled={!this.state.formValid}>
							Submit
						</Button>
					</Form>
				</Segment>
			</div>
		)
	}
}
