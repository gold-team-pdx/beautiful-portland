import React, { Component } from 'react'
import { Header, Form, Button, Dropdown, Segment } from 'semantic-ui-react'
import '../Stylesheets/Item.css'

export default class Item extends Component {
	constructor(props) {
		super(props)
		this.onChange = this.onChange.bind(this)
		this.onCategoryChange = this.onCategoryChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.validateField = this.validateField.bind(this)
		this.errorClass = this.errorClass.bind(this)

		this.state = {
			cat_info: {},
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
			messageNeeded: false,
			message: '',
			disableAll: false,
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
			messageNeeded: false,
			message: '',
			disableAll: false,
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
		this.setState({ [data.name]: data.checked }, this.validateForm)
	}

	onChange = (event, data) => {
		this.setState({ [data.name]: data.value }, () => {
			this.validateField(data.name, data.value)
		})
	}

	onCategoryChange = (event, data) => {
		this.clearForm()
		let temp = data.options.find((elem) => { return elem.key === data.value})
		this.validateField(data.name, data.value)
		this.setState({type: data.value, cat_info: temp.data}, this.validateForm)
	}

	validateField(fieldName, value) {
		let errors = this.state.errors
		let typeValid = this.state.typeValid
		let servingsValid = this.state.servingsValid
		let volunteer_nameValid = this.state.volunteer_nameValid
		let volunteer_phoneValid = this.state.volunteer_phoneValid
		let volunteer_emailValid = this.state.volunteer_emailValid
		let descriptionValid = this.state.descriptionValid

		let min_servings = this.state.vegan ? this.state.cat_info.min_vegan_servings : this.state.cat_info.min_servings

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
				servingsValid = value >= min_servings && value <= this.props.max_servings
				errors.servings = servingsValid ? '' : ' ✗ Please enter a vaild number between ' + min_servings + '~' + this.props.max_servings + '.'
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
		let numVeganNeeded = this.state.cat_info.food ? this.state.cat_info.min_vegan - this.state.cat_info.real_vegan : 0
		let formValid = this.state.typeValid &&
										this.state.servingsValid &&
										this.state.volunteer_nameValid &&
										this.state.volunteer_phoneValid &&
										this.state.volunteer_emailValid &&
										this.state.descriptionValid

		if(this.state.cat_info.food && this.state.cat_info.real_signups >= this.state.cat_info.max_signups) {
			this.setState({
				formValid,
				message: 'Sorry, but this course is full up on signups. Please consider volunteering for another category!\n',
				messageNeeded: true,
				disableAll: true
			})
		} else if(this.state.cat_info.food && this.state.cat_info.real_signups + numVeganNeeded === this.state.cat_info.max_signups && !this.state.vegan) {
			this.setState({
				formValid,
				message: 'Signups for this category are limited to Vegan options only.\n',
				messageNeeded: true
			})
		} else {
			this.setState({
				formValid,
				messageNeeded:false
			})
		}
	}

	errorClass(error) {
		return error.length === 0 ? '' : 'has-error'
	}

	render() {
		let options = this.props.event_info.map(category => {
			return {
				key: category.type,
				text: category.type,
				value: category.type,
				data: category
			}
		})

		let disableSubmit = this.state.messageNeeded

		return (

			<div>
				{this.state.messageNeeded && 
					<Header as="h3">{this.state.message}</Header>
				}
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
										onChange={this.onCategoryChange}
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
									disabled={this.state.disableAll}
								/>
								<div>
									<span>{this.state.errors.description || ' ✓'}</span>
								</div>
							</Form.Group>
						</div>
						<br />
						{this.state.cat_info.food && 
							<div>
								<Form.Group>
									<Form.Checkbox
										onChange={this.updateCheckbox}
										checked={this.state.vegan}
										name="vegan"
										label="Vegan"
										disabled={this.state.disableAll}
									/>
									<Form.Checkbox
										onChange={this.updateCheckbox}
										checked={this.state.vegetarian}
										name="vegetarian"
										label="Vegetarian"
										disabled={this.state.disableAll}
									/>
									<Form.Checkbox
										onChange={this.updateCheckbox}
										checked={this.state.gluten_free}
										name="gluten_free"
										label="Gluten-free"
										disabled={this.state.disableAll}
									/>
								</Form.Group>
								<br />
							</div>
						}

						<Form.Group inline>
							<div className={`input-wrapper ${this.errorClass(this.state.errors.servings)}`}>
								<Form.Group inline>
									<Form.Input
										name="servings"
										value={this.state.servings}
										onChange={this.onChange}
										inline
										label="Servings"
										disabled={this.state.disableAll}
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
									disabled={this.state.disableAll}
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
									disabled={this.state.disableAll}
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
									disabled={this.state.disableAll}
								/>
								<span>{this.state.errors.volunteer_phone || ' ✓'}</span>
							</div>
						</Form.Group>
						{/* {console.log(!this.state.formValid)}
						{console.log(disableSubmit)}
						{console.log(this.state.disableAll)} */}
						<Button color="green" disabled={!this.state.formValid || disableSubmit || this.state.disableAll}>
							Submit
						</Button>
					</Form>
				</Segment>
			</div>
		)
	}
}
