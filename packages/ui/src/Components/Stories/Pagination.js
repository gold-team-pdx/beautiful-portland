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
    )
  }
}