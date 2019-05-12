import React, { Component } from 'react'
import { Header, Icon, Table } from 'semantic-ui-react'
import Axios from 'axios'
import moment from 'moment'

class VolunteerSubmissions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submissions: []
    }
  }

  componentDidMount() {
    Axios.post('/api/volunteerHistory', {email: this.props.email})
    .then(res => {
      let tempSubs = res.data.sub_info

      tempSubs.forEach(e => {
        e.sortDate = moment(e.date, 'MM-DD-YY')
      })

      tempSubs.sort((older, newer) => {
        if(moment(older.sortDate).isBefore(moment(newer.sortDate))) {
          return 1
        } else {
          return -1
        }
      })

      this.setState({
        submissions: tempSubs
      })
    }).catch(err => {
      console.log('Error retrieving volunteer history', err)
    })
  }

  renderIcon = value => {
    if (value) {
      return <Icon color="green" name="checkmark" size="small" />
    } else {
      return <Icon color="red" name="times" size="small" />
    }
  }

  render() {
    let stats = {
      name: null,
      events: 0,
      categories: [],
      avg_servings: 0,
      vegan_pct: 0.0,
      vegetarian_pct: 0.0,
      gf_pct: 0.0,
      counts: {}
    }

    this.state.submissions.forEach(e => {
      if(!stats.name)  {
        stats.name = e.name
      }
      stats.events++
      stats.avg_servings += e.servings
      if(e.vegan) {
        stats.vegan_pct++
      }
      if(e.vegetarian) {
        stats.vegetarian_pct++
      }
      if(e.gluten_free) {
        stats.gf_pct++
      }
      if(!stats.categories.includes(e.type)) {
        stats.categories.push(e.type)
        stats.counts[e.type] = 1
      } else {
        stats.counts[e.type]++
      }
    })

    stats.avg_servings = stats.avg_servings / this.state.submissions.length
    stats.vegan_pct = 100 * (stats.vegan_pct / this.state.submissions.length)
    stats.vegetarian_pct = 100* (stats.vegetarian_pct / this.state.submissions.length)
    stats.gf_pct = 100 * (stats.gf_pct / this.state.submissions.length)

    stats.categories.sort((a, b) => {
      return stats.counts[b] - stats.counts[a]
    })


    return (
      <div>
        <Header as="h2">{stats.name}</Header>
        <div>
          <Header as="h3">Stats</Header>
        <Table celled textAlign={'center'} selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Total Events</Table.HeaderCell>
              <Table.HeaderCell>Top 3 Categories</Table.HeaderCell>
              <Table.HeaderCell>Avgerage Servings</Table.HeaderCell>
              <Table.HeaderCell>% Vegan</Table.HeaderCell>
              <Table.HeaderCell>% Vegetarian</Table.HeaderCell>
              <Table.HeaderCell>% Gluten-Free</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {stats.events > 0 &&
              <Table.Row>
                <Table.Cell>{stats.events}</Table.Cell>
                <Table.Cell>
                  <ol>
                    {stats.categories[0] && <li>{stats.categories[0]}</li>}
                    {stats.categories[1] && <li>{stats.categories[1]}</li>}
                    {stats.categories[2] && <li>{stats.categories[2]}</li>}
                  </ol>
                </Table.Cell>
                <Table.Cell>{stats.avg_servings}</Table.Cell>
                <Table.Cell>{stats.vegan_pct}</Table.Cell>
                <Table.Cell>{stats.vegetarian_pct}</Table.Cell>
                <Table.Cell>{stats.gf_pct}</Table.Cell>
              </Table.Row>
            }
          </Table.Body>
        </Table>
        </div>
        <hr></hr>
        <div>
        <Header as="h3">Signup History</Header>
        <Table celled textAlign={'center'} selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Servings</Table.HeaderCell>
              <Table.HeaderCell>Vegan</Table.HeaderCell>
              <Table.HeaderCell>Vegetarian</Table.HeaderCell>
              <Table.HeaderCell>Gluten-Free</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.submissions &&
              this.state.submissions.map(volunteer => (
                <Table.Row key={volunteer.date + volunteer.desc}>
                  <Table.Cell>{volunteer.date}</Table.Cell>
                  <Table.Cell>{volunteer.name}</Table.Cell>
                  <Table.Cell>{volunteer.email}</Table.Cell>
                  <Table.Cell>{volunteer.type}</Table.Cell>
                  <Table.Cell>{volunteer.desc}</Table.Cell>
                  <Table.Cell>{volunteer.servings}</Table.Cell>
                  <Table.Cell>{this.renderIcon(volunteer.vegan)}</Table.Cell>
                  <Table.Cell>
                    {this.renderIcon(volunteer.vegetarian)}
                  </Table.Cell>
                  <Table.Cell>
                    {this.renderIcon(volunteer['gluten_free'])}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        </div>
      </div>
    )
  }
}

export default VolunteerSubmissions
