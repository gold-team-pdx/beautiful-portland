import React, { Component } from 'react'
import { Card, Pagination, Icon } from 'semantic-ui-react'
import HomeLayout from '../Layouts/HomeLayout'
import Story from './Story'
import Axios from 'axios'
import 'semantic-ui-css/semantic.min.css'
import '../Stylesheets/Home.css'
import { Grid } from 'semantic-ui-react'

export default class Stories extends Component {
  constructor(props) {
    super(props)

    this.state = {
      publishStory: [],
      activePage: 1,
      pageCount: 1,
      totalPages: 1,
      boundaryRange: 1,
      siblingRange: 1,
    }
  }

	handlePaginationChange = async (e, { activePage }) => {
	  await this.setState({ activePage })
	  this.componentDidMount()
	  window.scrollTo(0,0)
	}

	componentDidMount = async () => {
	  Axios.get('/api/countStory')
	    .then(async(res) => {
	      let tempCount = JSON.parse(res.data.count_info)
	      await this.setState({pageCount: tempCount[0].publishCount})
	      await this.setState({totalPages: Math.ceil(this.state.pageCount/12)})
	    })

	  if(!(((this.state.publishCount) / this.state.publishPage * 12) < 1)) {
	    this.getStory()
	  }
	}

	getStory = () => {
	  Axios.get('/api/displayStory', {
	    params: { page: this.state.activePage }
	  })
	    .then(res => {
	      if(res.data.status !== 'FAILURE') {
	        let tempPubStory = JSON.parse(res.data.published_info)
	        this.setState({
	          publishStory : tempPubStory
	        })
	      }
	    })
	}

	render() {
	  const {
	    activePage,
	    boundaryRange,
	    siblingRange,
	    totalPages,
	  } = this.state
	  return (
	    <HomeLayout>
	      <div style={{width: '80%', margin: 'auto'/*, display: 'flex', flexDirection: 'row'*/}}>
	        <Card.Group itemsPerRow={3}>
	          {this.state.publishStory && this.state.publishStory.map((publish) =>{
	            return(
	              <Story
	                key={publish.edited_timestamp}
	                publish={publish}
	                version={this.state.version}
	                url={publish.title}
	                image={publish.imageUrl}
	              />
	            )
	          })}
	        </Card.Group>
	      </div>

	      <br/>
	      <div>
	        <Grid centered>
	          <Pagination
	            activePage={activePage}
	            ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
	            firstItem={{ content: <Icon name='chevron left' />, icon: true }}
	            lastItem={{ content: <Icon name='chevron right' />, icon: true }}
	            prevItem={{ content: <Icon name='angle left' />, icon: true }}
	            nextItem={{ content: <Icon name='angle right' />, icon: true }}
	            boundaryRange={boundaryRange}
	            onPageChange={this.handlePaginationChange}
	            siblingRange={siblingRange}
	            totalPages={totalPages}
	          />
	        </Grid>
	      </div>
	    </HomeLayout>
	  )
	}
}
