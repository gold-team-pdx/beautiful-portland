import React, { Component } from "react"
import Item from "./Item"
import { Header, Container } from "semantic-ui-react"
import Axios from "axios"
import Moment from "moment"
import { MyContext } from "./MyProvider"
import VolunteerList from "./VolunteerList"

export default class VolunteerForm extends Component {
  constructor(props) {
    super(props)
    let params = new URLSearchParams(this.props.location.search)
    if (params.get("date") === null) {
      params.append("date", new Moment().format("MM-DD-YY"))
    }
    this.state = {
      date: params.get("date"),
      volunteers: [{
          name:'',
          desc:'',
          phone:'',
          email:'',
          type:'',
          servings: 0,
          vegan: false,
          vegetarian:false,
          gluten_free:false
      }]
    }
  }

  onSubmit = data => {
    data.date = this.state.date
    Axios.post("/api/form", data)
      .then(response => {
        console.log(response, "Form Submitted")
      })
      .catch(err => {
        console.log(err, "Try again.")
      })
  }
 
 
  async componentDidMount() {
    let path = '/api/volunteerInformation?date=03-08-19'
    const res = await Axios.get(path)
    let dummy = []
    let persons = JSON.parse(res.data['event_info'])
    persons.map( person => (
      dummy.push(person)
    ))

    this.setState({volunteers: dummy})
    //console.log(dummy)
    //console.log(responseData)
    //this.setState({volunteers: res.data['event_info']})
    //console.log(res.data['event_info'])
    //this.setState({volunteers:dummy})
    //console.log(this.state.volunteers)
    //console.log(res.data['event_info'])
  }

  render() {
    return (
      <MyContext.Consumer>
        {context => {
          if (context.state.isAuthorized) {
            return(
                      <VolunteerList date={this.state.date} volunteers={this.state.volunteers}/>
            )
          }
          return (
            <div>
              <Container>
                <Header as="h2" style={{ marginTop: "20px" }}> Director Park Dinner Sign-Up:</Header>
                <Header as="h2">Name and Contact info of Volunteer Coordinator:{" "}</Header>
                <Header as="h2">Date: {this.state.date} </Header>
                <Item onSubmit={this.onSubmit} />
              </Container>
            </div>
          )
        }}
      </MyContext.Consumer>
    )
  }
}
