import React, { Component } from 'react';
import { Form, Button, Dropdown } from 'semantic-ui-react';

export default class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			description: '',
			type: '',
			servings: 0,
			vegetarian: false,
			vegan: false,
			glutenFree: false,
			volunteer_name: '',
			volunteer_phone: '',
			volunteer_email: ''
		};
	}
	clearForm = () => {
		this.setState({
			description: '',
			type: '',
			servings: 0,
			vegetarian: false,
			vegan: false,
			glutenFree: false,
			volunteer_name: '',
			volunteer_phone: '',
			volunteer_email: ''
		});
	};

	onSubmit = () => {
		this.props.submit(this.state);
		this.clearForm();
	};

	updateCheckbox = (event, data) => {
		this.setState({ [data.name]: data.checked });
	};

	onChange = (event, data) => {
		this.setState({ [data.name]: data.value });
	};

	render() {
		const options = [
			{ key: 'main', text: 'Main Course', value: 'main' },
			{ key: 'side', text: 'Side Dish', value: 'side' },
			{ key: 'dessert', text: 'Dessert', value: 'dessert' },
			{ key: 'takeAway', text: 'Take-Away', value: 'takeAway' },
			{ key: 'beverage', text: 'Beverages', value: 'beverage' },
			{ key: 'supplies', text: 'Serving Supplies', value: 'supplies' },
			{ key: 'donation', text: 'Donation', value: 'donation' }
		];
		return (
			<div>
				<Form onSubmit={this.onSubmit}>
					<br />
					<Form.Input>
						<Dropdown
							name="type"
							value={this.state.type}
							onChange={this.onChange}
							placeholder="type"
							fluid
							selection
							options={options}
						/>
					</Form.Input>
					<Form.Input
						name="description"
						value={this.state.description}
						onChange={this.onChange}
						style={{ width: '370px' }}
						label="Item"
						placeholder="description"
					/>
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
							checked={this.state.glutenFree}
							name="glutenFree"
							label="Gluten-free"
						/>
					</Form.Group>
					<Form.Group>
						<Form.Input
							name="servings"
							value={this.state.servings}
							onChange={this.onChange}
							inline
							label="Servings"
						/>
					</Form.Group>
					<Form.Group widths="equal">
						<Form.Input
							name="volunteer_name"
							value={this.state.volunteer_name}
							onChange={this.onChange}
							style={{ width: '370px' }}
							label="Name"
							placeholder="name"
						/>
						<Form.Input
							name="volunteer_email"
							value={this.state.volunteer_email}
							onChange={this.onChange}
							style={{ width: '370px' }}
							label="Email"
							placeholder="email"
						/>
						<Form.Input
							name="volunteer_phone"
							value={this.state.volunteer_phone}
							onChange={this.onChange}
							style={{ width: '370px' }}
							label="Phone"
							placeholder="phone"
						/>
					</Form.Group>
					<p>{this.props.message}</p>
					<Button color="green">Submit</Button>
				</Form>
			</div>
		);
	}
}
