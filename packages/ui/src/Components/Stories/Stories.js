import React, { Component } from 'react'
import { Card, Button} from 'semantic-ui-react'
import Header from '../Home/Header'
import Pagination from './Pagination'
import PublishStories from './PublishStories'
import PublishStories2 from './PublishStories2'
import Axios from 'axios'
import 'semantic-ui-css/semantic.min.css'
import '../Stylesheets/Home.css'

export default class Home extends Component {
	constructor(props) {
		super(props)

		this.state = {
			publishStory: [],
			version: false
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
		const newVersion = this.state.version=== false ? true : false
		this.setState({
			version: newVersion
		})
	}

	render() {
		if(this.state.version===true){
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
