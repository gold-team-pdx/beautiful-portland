import React, { Component } from 'react'
import { Segment, Button } from 'semantic-ui-react'
import Axios from 'axios'
import LoadPublished from './LoadPublished'
import LoadDrafts from './LoadDrafts'
import '../../Stylesheets/AdminDashboard.css'

export default class ViewStories extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeItem: 'loadPublished',
      passEdit: false,
      publishedPage: 1,
      draftPage: 1,
      draftCount: 1,
      publishCount: 1,
      maxDraft: 1,
      maxPublish:1,
      draftStory : [],
      publishStory: []
    }
  }

  componentDidMount = async () => {
    Axios.get('/api/StoriesCount')
     .then(async(res) => {
        let tempCount = JSON.parse(res.data.count_info)
        await this.setState({draftCount: tempCount[0].draftCount})
        await this.setState({publishCount: tempCount[0].publishCount})
        await this.setState({maxPublish: Math.ceil(this.state.publishCount/5)})
        await this.setState({maxDraft: Math.ceil(this.state.draftCount/5)})
        console.log(res)
     })
     
     if(!(((this.state.draftCount) / this.state.draftPage * 5) < 1)) {
       this.getDraft()
     }
     
     if(!(((this.state.publishCount) / this.state.publishPage * 5) < 1)) {
        this.getPublished() 
     }
  }
          
  getDraft = () => {
    Axios.get('/api/draftStories', {
      params: { page: this.state.draftPage }
     })
      .then(res => {
        if(res.data.status !== 'FAILURE') {
          let tempDraftStory = JSON.parse(res.data.draft_info)
          // console.log(tempDraftStory)
          this.setState({
          draftStory : tempDraftStory
        })
        } 
      })
  }

  getPublished = () => {
    Axios.get('/api/publishedStories', {
      params: { page: this.state.publishedPage }
    })
      .then(res => {
        if(res.data.status !== 'FAILURE'){
          let tempPubStory = JSON.parse(res.data.published_info)
          // console.log(tempPubStory)
          this.setState({
          publishStory : tempPubStory
        })
        } 
      })
  }
  
  handleEditClick = async () => await this.setState({passEdit: true})
  handlePublishClick = async () => await this.setState({activeItem: 'loadPublished'})
  handleDraftClick = async() => await this.setState({activeItem: 'loadDrafts'})
  updateParent = (e) => this.props.updateGrandparent()

  updateParentID = (value) => {
     this.props.updateGrandparentID(value)
    //  console.log(value)
   }

   handleMoreStories = async () => {
     if(this.state.activeItem === 'loadPublished'){
       this.setState({draftPage: 1})
       await this.setState({publishedPage: this.state.publishedPage + 1 })
       this.componentDidMount()
     } else {
         this.setState({publishedPage: 1})
         await this.setState({draftPage: this.state.draftPage + 1})
         this.componentDidMount()
     }
     
   }

   handleLessStories = async () => {
     if(this.state.activeItem === 'loadPublished') {
       this.setState({draftPage: 1})
       if(this.state.publishedPage > 1) {
         await this.setState({publishedPage: this.state.publishedPage - 1})
         this.componentDidMount()
       }
     } else {
         this.setState({publishedPage: 1})
         if(this.state.draftPage > 1) {
           await this.setState({draftPage: this.state.draftPage - 1})
           this.componentDidMount()
         }
     }
   }


  render () {

    let activeItem  = this.state.activeItem
    
    let chooseRender;
    if(activeItem === 'loadPublished'){
      chooseRender = (
        this.state.publishStory && this.state.publishStory.map(sPublish =>
          <LoadPublished key={sPublish.edited_timestamp}
                         sPublish={sPublish}
                         updateParent={this.updateParent}
                         edit={this.props.activeItem}
                         editId={this.props.editId}
                         updateParentID={this.updateParentID}/> )
      )
    } else if(activeItem === 'loadDrafts'){
      chooseRender = (
        this.state.draftStory && this.state.draftStory.map(sDraft =>
          <LoadDrafts key={sDraft.edited_timestamp}
                      sDraft={sDraft}
                      updateParent={this.updateParent}
                      edit={this.props.activeItem}
                      editId={this.props.editId}
                      updateParentID={this.updateParentID}/> )
      )
    }

    return (
       <div>
        <Segment>
        <div className="storyButtons">
          <Button.Group widths={2}>
            <Button name='loadPublished'
                    active={activeItem === 'loadPublished'}
                    onClick={this.handlePublishClick}>Published</Button>
            <Button name='loadDrafts'
                    active={activeItem === 'loadDrafts'}
                    onClick={this.handleDraftClick}>Drafts</Button>
          </Button.Group>     
        </div>
           { chooseRender }
        </Segment>
        <div>
        <Button.Group widths={2}>
          <Button labelPosition='left' 
                  icon='left chevron' 
                  content='Back' 
                  onClick={this.handleLessStories}
                  />
          <Button labelPosition='right' 
                  icon='right chevron' 
                  content='Forward' 
                  disabled={(this.state.activeItem === 'loadPublished' &&
                    this.state.maxPublish === this.state.publishedPage) || 
                    (this.state.activeItem === 'loadDrafts' &&
                    this.state.maxDraft === this.state.draftPage)}
                  onClick={this.handleMoreStories}
                  />
       </Button.Group>
       </div>
     </div>
    )
  }
}
