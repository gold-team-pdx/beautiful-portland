import React, { Component } from 'react'
import { Card, Button, Pagination, Icon } from 'semantic-ui-react'
import Header from '../Home/Header'
import PublishStories from './PublishStories'
import PublishStories2 from './PublishStories2'
import PublishStories3 from './PublishStories3'
import PublishStories4 from './PublishStories4'
import Axios from 'axios'
import 'semantic-ui-css/semantic.min.css'
import '../Stylesheets/Home.css'

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      publishStory: [],
      version: '1',
      page: 1,
      pageCount: 1,
      maxPage: 1,

      activePage: 1,
      boundaryRange: 1,
      siblingRange: 1,
      totalPages: 50,
    }
  }

  // componentDidMount = async () => {
  //   Axios.get('/api/displayStory')
  //     .then(res => {
  //       let tempPubStory = JSON.parse(res.data.published_info)
  //       console.log(tempPubStory)
  //       this.setState({
  //         publishStory : tempPubStory
  //       })
  //     })
  // }

	handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

	componentDidMount = async () => {
	  Axios.get('/api/StoriesCount')
	    .then(async(res) => {
	      let tempCount = JSON.parse(res.data.count_info)
	      await this.setState({count: tempCount[0].publishCount})
	      await this.setState({pageMax: Math.ceil(this.state.count/5)})
	      console.log(res)
	    })

	  if(!(((this.state.publishCount) / this.state.publishPage * 5) < 1)) {
	    this.getStory()
	  }
	}

  getStory = () => {
    Axios.get('/api/displayStory', {
      params: { page: this.state.page }
    })
      .then(res => {
        if(res.data.status !== 'FAILURE') {
          let tempPubStory = JSON.parse(res.data.published_info)
          console.log(tempPubStory)
          this.setState({
            publishStory : tempPubStory
          })
        }
      })
  }

	handleVersion = () => {
	  // const newVersion = this.state.version === false ? true : false
	  var newVersion = 0
	  if (this.state.version === '1'){
	    newVersion = '2'
	  }else if (this.state.version === '2'){
	    newVersion = '3'
	  }else if (this.state.version === '3'){
	    newVersion = '4'
	  }else{
	    newVersion = '1'
	  }
	  this.setState({
	    version: newVersion
	  })
	}

	render() {
	  const {
	    activePage,
	    boundaryRange,
	    siblingRange,
	    totalPages,
	  } = this.state

	  if(this.state.version==='1'){
	    return (
	      <div className="Story">
	        <div style={{ flex: 1, top: 0, width: '100%', margin:'auto' }}>
	          <Header />
	        </div>

	        <br/> <div style={{ float: 'left'}}><Button primary onClick={this.handleVersion}>Version {this.state.version}</Button></div>
	        <div style={{width: '80%', margin: 'auto'}}>
	          <Card.Group centered itemsPerRow={3}>
	            {this.state.publishStory && this.state.publishStory.map((publish) =>{
	              return(
	                <PublishStories
	                  key={publish.edited_timestamp}
	                  publish={publish}
	                  version={this.state.version}
	                  url={publish.title}
	                />
	              )
	            })}
	          </Card.Group>
	        </div>

	        <br/>
	        <div>
	          <Pagination
	            activePage={activePage}
	            ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
	            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
	            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
	            prevItem={{ content: <Icon name='angle left' />, icon: true }}
	            nextItem={{ content: <Icon name='angle right' />, icon: true }}
	            boundaryRange={boundaryRange}
	            onPageChange={this.handlePaginationChange}
	            siblingRange={siblingRange}
	            totalPages={totalPages}
	          />
	        </div>
	      </div>
	    )
	  }
	  else if(this.state.version==='2'){
	    return (
	      <div className="Story">
	        <div style={{ flex: 1, top: 0, width: '100%', margin:'auto' }}>
	          <Header />
	        </div>

	        <br/> <div style={{ float: 'left'}}><Button primary onClick={this.handleVersion}>Version {this.state.version}</Button></div>
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
	        <div style={{ flex: 1, top: 0, width: '100%', margin:'auto' }}>
	          <Header />
	        </div>

	        <br/> <div style={{ float: 'left'}}><Button primary onClick={this.handleVersion}>Version {this.state.version}</Button></div>
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
	        <div style={{ flex: 1, top: 0, width: '100%', margin:'auto' }}>
	          <Header />
	        </div>

	        <br/> <div style={{ float: 'left'}}><Button primary onClick={this.handleVersion}>Version {this.state.version}</Button></div>
	        <div style={{width: '80%', margin: 'auto'}}>
	          {this.state.publishStory && this.state.publishStory.map((publish) =>{
	            return(
	              <PublishStories4
	                key={publish.edited_timestamp}
	                publish={publish}
	                version={this.state.version}
	              />
	            )
	          })}
	        </div>
	        <br/>
	      </div>
	    )
	  }
	}
}
