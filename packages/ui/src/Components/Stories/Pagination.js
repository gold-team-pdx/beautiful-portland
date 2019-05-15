import React, { Component } from 'react'
import { Grid, Form, Pagination, Segment, Icon } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export default class PaginationExampleCustomization extends Component {
  state = {
    activePage: 5,
    boundaryRange: 1,
    siblingRange: 1,
    totalPages: 50,
  }

  handleCheckboxChange = (e, { checked, name }) => this.setState({ [name]: checked })

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value })

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

  render() {
    const {
      activePage,
      boundaryRange,
      siblingRange,
      totalPages,
    } = this.state

    return (
      <div style={{textAlign:'center'}}>
        <Grid columns={1}>
          <Grid.Column>
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
          </Grid.Column>

          <Grid.Column>
            <Form as={Segment}>
              <Form.Group widths={2}>
                <Form.Input
                  label='Active page'
                  name='activePage'
                  min={1}
                  onChange={this.handleInputChange}
                  type='number'
                  value={activePage}
                />
                <Form.Input
                  label='Total pages'
                  name='totalPages'
                  min={1}
                  onChange={this.handleInputChange}
                  type='number'
                  value={totalPages}
                />
              </Form.Group>
              <Form.Group widths={2}>
                <Form.Input
                  label='Boundary pages range'
                  name='boundaryRange'
                  min={0}
                  onChange={this.handleInputChange}
                  type='number'
                  value={boundaryRange}
                />
                <Form.Input
                  label='Sibling pages range'
                  name='siblingRange'
                  min={0}
                  onChange={this.handleInputChange}
                  type='number'
                  value={siblingRange}
                />
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}