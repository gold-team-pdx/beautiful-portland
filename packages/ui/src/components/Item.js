import React, { Component } from 'react';
import { Form, Button, Select } from 'semantic-ui-react';

export default class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			description: '',
			type: 'main',
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
			type: 'main',
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

	updateCheckbox = (e) => {
		this.setState({ [e.target.name]: e.target.checked });
	};

	updateSelect = (e) => {
		console.log(e);
		//this.setState({ type: e.target.value });
	};

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
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
						<Select placeholder="type" options={options} />
					</Form.Input>
					<Form.Input
						name="description"
						value={this.state.description}
						onChange={(e) => this.onChange(e)}
						style={{ width: '370px' }}
						label="Item"
						placeholder="description"
					/>
					<Form.Group>
						<Form.Checkbox
							onChange={(e) => this.updateCheckbox(e)}
							checked={this.state.vegan}
							name="vegan"
							id="vegan"
							label="vegan"
						/>
						<Form.Checkbox
							onChange={(e) => this.updateCheckbox(e)}
							checked={this.state.vegetarian}
							name="vegetarian"
							id="vegetarian"
							label="Vegetarian"
						/>
						<Form.Checkbox
							onChange={(e) => this.updateCheckbox(e)}
							checked={this.state.glutenFree}
							name="glutenFree"
							id="glutenFree"
							label="Gluten-free"
						/>
					</Form.Group>
					<Form.Group>
						<Form.Input
							name="servings"
							value={this.state.servings}
							onChange={(e) => this.onChange(e)}
							inline
							label="Servings"
						/>
					</Form.Group>
					<Form.Group widths="equal">
						<Form.Input
							name="volunteer_name"
							value={this.state.volunteer_name}
							onChange={(e) => this.onChange(e)}
							style={{ width: '370px' }}
							label="Name"
							placeholder="name"
						/>
						<Form.Input
							name="volunteer_email"
							value={this.state.volunteer_email}
							onChange={(e) => this.onChange(e)}
							style={{ width: '370px' }}
							label="Email"
							placeholder="email"
						/>
						<Form.Input
							name="volunteer_phone"
							value={this.state.volunteer_phone}
							onChange={(e) => this.onChange(e)}
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
