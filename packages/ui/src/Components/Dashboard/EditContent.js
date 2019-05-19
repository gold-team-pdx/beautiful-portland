import React, { Component } from 'react'
import { Segment, Form, TextArea, Grid, Button, Confirm } from 'semantic-ui-react'
import Axios from 'axios'
import '../Stylesheets/EditContent.css'

class EditContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      all_content: [],
      current_type: '',
      content: '',
      saveOpen: false,
      clearOpen: false
    }
  }

    clearForm = () => {
      window.location.reload()
    }

    componentDidMount() {
      Axios.get('/api/content', {params: {type: 'all'}})
        .then(res => {
          if(res.data.content) {
            let data = res.data.content.map(e => {
              let r = {}
              r.key = e.type
              r.text = e.type
              r.value = e.type
              r.data = e.content
              return r
            })
            this.setState({
              all_content: data 
            })
          }
        }).catch(err => {

        })
    }

    typeChange = (e, { value, options }) => {
      let temp = options.find(e => {
        return value === e.value
      })
      this.setState({
        content: temp.data,
        current_type: temp.value
      })
    }

    contentChange = (e, { value }) => {
      this.setState({
        content: value
      })
    }

    onSaveOpen = () => { this.setState({saveOpen: true})}
    onSaveClose = () => { this.setState({saveOpen: false}) }

    onClearOpen = () => { this.setState({clearOpen: true})}
    onClearClose = () => { this.setState({clearOpen: false}) }

    handleSave = () => {
      Axios.post('/api/editContent', { type: this.state.current_type, content: this.state.content }).then(res => {
        window.location.reload()
      }).catch(err => {

      })
    }

    render() {
      return (
        <div>
          <Segment>
            <Form className="editContent">
              <Form.Field>
                <label>Content Type: </label>
                <Form.Dropdown
                  onChange={this.typeChange}
                  options={this.state.all_content}
                  selection
                />
              </Form.Field>
                        
              <Form.Field>
                <label>Edit Content: </label>
                <TextArea
                  value={this.state.content}
                  onChange={this.contentChange}
                  rows='30'
                />
              </Form.Field>
              <Grid stackable columns={2}>
                <Grid.Column>
                  <Button color="blue" fluid disabled={!this.state.content} onClick={this.onSaveOpen}>Save</Button>
                  <Confirm 
                    open={this.state.saveOpen}
                    content={'Save changes made to ' + this.state.current_type + '?'}
                    onConfirm={this.handleSave}
                    onCancel={this.onSaveClose}
                  />
                </Grid.Column>
                        
                <Grid.Column>
                  <Button color="red" fluid onClick={this.onClearOpen}>Clear Form</Button>
                  <Confirm 
                    open={this.state.clearOpen}
                    onConfirm={this.clearForm}
                    onCancel={this.onClearClose} 
                  />
                </Grid.Column>
              </Grid>
            </Form>
          </Segment>
        </div>
      )
    }
}

export default EditContent