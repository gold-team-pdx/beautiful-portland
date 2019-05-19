import React, { Component } from 'react'
import { Segment, Form, Grid, Button, Confirm, Menu } from 'semantic-ui-react'
import Axios from 'axios'
import RichTextEditor from 'react-rte'
import '../Stylesheets/EditContent.css'

class EditContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: RichTextEditor.createEmptyValue(),
      all_content: [],
      current_type: '',
      saveOpen: false,
      clearOpen: false
    }
  }

  onChange = (value) => {
    this.setState({value})
  }

  clearForm = () => {
    window.location.reload()
  }

  componentDidMount() {
    Axios.get('/api/content', {params: {type: 'all'}})
      .then(res => {
        if(res.data.content) {
          this.setState({
            all_content: res.data.content
          })
        }
      }).catch(err => {

      })
  }

  typeChange = (e, { name }) => {
    let temp = this.state.all_content.find(e => {
      return name === e.type
    })
    this.setState({
      value: RichTextEditor.createValueFromString(temp.content, 'markdown'),
      current_type: temp.type
    })
  }

  onSaveOpen = () => { this.setState({saveOpen: true})}
  onSaveClose = () => { this.setState({saveOpen: false}) }

  onClearOpen = () => { this.setState({clearOpen: true})}
  onClearClose = () => { this.setState({clearOpen: false}) }

  handleSave = () => {
    Axios.post('/api/editContent', { type: this.state.current_type, content: this.state.value.toString('markdown') }).then(res => {
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
              <Menu>
                {this.state.all_content.map(e => {
                  return (
                    <Menu.Item
                      key={e.type}
                      name={e.type}
                      text={e.type}
                      active={this.state.current_type === e.type}
                      onClick={this.typeChange}
                    />
                  )
                })}
              </Menu>
            </Form.Field>
                      
            <Form.Field>
              <label>Edit Content: </label>
              <RichTextEditor
                value={this.state.value}
                onChange={this.onChange}
              />
            </Form.Field>
            
            <Grid stackable columns={2}>
              <Grid.Column>
                <Button color="blue" fluid disabled={this.state.current_type === ''} onClick={this.onSaveOpen}>Save</Button>
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