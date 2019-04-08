import React, { Component } from "react"

export const MyContext = React.createContext()

export default class MyProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthorized: true //Shared state for entire app
    }
  }

  render() {
    return (
      <MyContext.Provider
        value={{
          state: this.state
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    )
  }
}
