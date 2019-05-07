import React, { Component } from 'react'
import { Card, Button} from 'semantic-ui-react'
import Header from '../Home/Header'
import Pagination from './Pagination'
import PublishStories from './PublishStories'
import PublishStories2 from './PublishStories2'
import PublishStories3 from './PublishStories3'
import Axios from 'axios'
import 'semantic-ui-css/semantic.min.css'
import '../Stylesheets/Home.css'

export default class Home extends Component {
	constructor(props) {
		super(props)

		this.state = {
			publishStory: [],
			version: '1'
		}
	}

	componentDidMount = async () => {
		Axios.get('/api/displayStory')
        .then(res => {
			let tempPubStory = JSON.parse(res.data.published_info)
			console.log(tempPubStory)
			this.setState({
				publishStory : tempPubStory
			})
        })
	}

	handleVersion = () => {
		// const newVersion = this.state.version === false ? true : false
		var newVersion = 0;
		if (this.state.version === '1'){
			newVersion = '2';
		}else if (this.state.version === '2'){
			newVersion = '3';
		}else if (this.state.version === '3'){
			newVersion = '4';
		}else{
			newVersion = '1';
		}
		this.setState({
			version: newVersion
		})
	}

	render() {
		if(this.state.version==='1'){
			return (
				<div className="Story">
					<div style={{ flex: 1, top: 0, width: '100%', margin:"auto" }}>
						<Header />
					</div>

					<br/> <div style={{ float: "left"}}><Button primary onClick={this.handleVersion}>Version {this.state.version}</Button></div>
					<div style={{width: '80%', margin: 'auto'}}>
						<Card.Group centered itemsPerRow={3}>
							{this.state.publishStory && this.state.publishStory.map((publish) =>{
								return(
									<PublishStories
										key={publish.edited_timestamp}
										publish={publish}
										version={this.state.version}
									/>
								)
							})}
						</Card.Group>
					</div>

					<br/>
					<div style={{margin: 'auto'}}>
						<Pagination/>
					</div>
				</div>
			)
		}
		else if(this.state.version==='2'){
			return (
				<div className="Story">
					<div style={{ flex: 1, top: 0, width: '100%', margin:"auto" }}>
						<Header />
					</div>

					<br/> <div style={{ float: "left"}}><Button primary onClick={this.handleVersion}>Version {this.state.version}</Button></div>
					<div style={{width: '80%', margin: 'auto'}}>
						{this.state.publishStory && this.state.publishStory.map((publish) =>{
							return(
								<PublishStories2
									key={publish.edited_timestamp}
									publish={publish}
									version={this.state.version}
								/>
							)
						})}
					</div>

					<br/>
					<div style={{margin: 'auto'}}>
						<Pagination/>
					</div>
				</div>
			)
		}
		else if(this.state.version==='3'){
			return (
				<div className="Story">
					<div style={{ flex: 1, top: 0, width: '100%', margin:"auto" }}>
						<Header />
					</div>

					<br/> <div style={{ float: "left"}}><Button primary onClick={this.handleVersion}>Version {this.state.version}</Button></div>
					<div style={{width: '80%', margin: 'auto'}}>
						{this.state.publishStory && this.state.publishStory.map((publish) =>{
							return(
								<PublishStories3
									key={publish.edited_timestamp}
									publish={publish}
									version={this.state.version}
								/>
							)
						})}
					</div>

					<br/>
					<div style={{margin: 'auto'}}>
						<Pagination/>
					</div>
				</div>
			)
		}
		else{
			return (
				<div className="Story">
					<div style={{ flex: 1, top: 0, width: '100%', margin:"auto" }}>
						<Header />
					</div>

					<br/> <div style={{ float: "left"}}><Button primary onClick={this.handleVersion}>Version {this.state.version}</Button></div>
					<div style={{width: '80%', margin: 'auto'}}>
						{this.state.publishStory && this.state.publishStory.map((publish) =>{
							return(
								<PublishStories2
									key={publish.edited_timestamp}
									publish={publish}
									version={this.state.version}
								/>
							)
						})}
					</div>

					<br/>
					<div style={{margin: 'auto'}}>
						<Pagination/>
					</div>
				</div>
			)
		}
	}
}
