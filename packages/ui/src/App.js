import React, { Component } from 'react';
import Footer from "./components/Footer";

class App extends Component {
	render() {
		return (
			<div className="App" style={{ display:"flex", minHeight:"100vh", flexDirection:"column" }}>
				<h1>Beautiful Portland</h1>
				<p>Welcome to our site</p>
				<div style={{ flex:1 }}></div>
				<Footer />
			</div>
		);
	}
}

export default App;
