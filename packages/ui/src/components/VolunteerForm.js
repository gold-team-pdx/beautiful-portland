import React, { Component } from 'react';
import Item from './Item';
import { Header } from 'semantic-ui-react';

export default class VolunteerForm extends Component {
	display = (data) => {
		console.log(JSON.stringify(data, null, 3));
	};
	render() {
		return (
			<div>
				<Header as="h2">Director Park Dinner Sign-Up:</Header>
				<Header as="h2">Name and Contact info of Volunteer Co-ordinator: Jessica</Header>
				<Item message="*Please bring your own utensil" submit={this.display} />
			</div>
		);
	}
}
