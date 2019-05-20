import React, { Component } from 'react'
import { Segment, Form, Grid, Button, Confirm, Menu } from 'semantic-ui-react'
import Axios from 'axios'
import RichTextEditor from 'react-rte'
import '../Stylesheets/EditContent.css'

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN'],
  INLINE_STYLE_BUTTONS: [
    {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'}
  ],
  BLOCK_TYPE_DROPDOWN: [
    {label: 'Normal', style: 'unstyled'},
    {label: 'Heading Large', style: 'header-one'},
    {label: 'Heading Medium', style: 'header-two'},
    {label: 'Heading Small', style: 'header-three'}
  ],
  BLOCK_TYPE_BUTTONS: [
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'}
  ]
}

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
      value: RichTextEditor.createValueFromString(temp.content, 'html'),
      current_type: temp.type
    })
  }

  onSaveOpen = () => { this.setState({saveOpen: true})}
  onSaveClose = () => { this.setState({saveOpen: false}) }

  onClearOpen = () => { this.setState({clearOpen: true})}
  onClearClose = () => { this.setState({clearOpen: false}) }

  handleSave = () => {
    Axios.post('/api/editContent', { type: this.state.current_type, content: this.state.value.toString('html') }).then(res => {
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
                toolbarConfig={toolbarConfig}
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