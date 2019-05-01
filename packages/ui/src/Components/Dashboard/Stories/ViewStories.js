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
      activeItem: 'loadDrafts',
      passEdit: false,
      shouldRerender: false,
      draftStory : [],
      publishStory: []
    }
  }

  componentDidMount = async () => {
    Axios.get('/api/draftStories')
      .then(res => {
        let tempDraftStory = JSON.parse(res.data.draft_info)
        console.log(tempDraftStory)
        this.setState({
          draftStory : tempDraftStory
        })
      })

      Axios.get('/api/publishedStories')
        .then(res => {
          let tempPubStory = JSON.parse(res.data.published_info)
          console.log(tempPubStory)
          this.setState({
            publishStory : tempPubStory
          })
        })
        this.setState({shouldRerender : false})
    }

  handleEditClick = async () => await this.setState({passEdit: true})
  handlePublishClick = async () => await this.setState({activeItem: 'loadPublished'})
  handleDraftClick = async() => await this.setState({activeItem: 'loadDrafts'})
  updateParent = (e) =>
    this.props.updateGrandparent((this.props.activeItem: 'editStory'))

  updateParentID = (value) => {
     this.props.updateGrandparentID(value)
     console.log(value)
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
     </div>
    )
  }
}