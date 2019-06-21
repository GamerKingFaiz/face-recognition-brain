import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js' // Background effect component
import Navigation from './components/Navigation/Navigation'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'

/* Configuration options for react-particles-js */
const particleOptions = {
  "particles": {
    "number": {
      "value": 100,
      "density": {
        "enable": true,
        "value_area": 800
      }
    }
  }
}

/* Variable that holds the intial page values and allows for resetting when user signs out and back in */
const initialState = {
	input: '',
	imageUrl: '',
	boxes: [],
	route: 'signin',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
	}
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  /* Used after succesful registeration or signin.
  	 Loads the user data into state. */
  loadUser = (data) => {
    this.setState({
		user: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined
		}
    })
  }

  /* Takes the response data from Clarifai and converts it into 4 corners to draw a box with */
  calculateFaceLocation = (data) => {
    const image = document.querySelector('#inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    const clarifaiFaces = data.outputs[0].data.regions.map(region => {
      return {
        leftCol: region.region_info.bounding_box.left_col * width,
        topRow: region.region_info.bounding_box.top_row * height,
        rightCol: width - (region.region_info.bounding_box.right_col * width),
        bottomRow: height - (region.region_info.bounding_box.bottom_row * height)
      }
    })
    return clarifaiFaces;
  }

  displayFaceBoxes = (boxes) => {
    this.setState({ boxes: boxes })
  }

  /** Detects when a new URL is entered and updates the input variable
   *  Used in ImageLinkForm
   */
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  /**
   * Displays the picture on the page and then hits the imageurl and image endpoints.
   * In the backend the Clarifai API is called and then the entries count is incremented
   */
  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    this.setState({ boxes: [] }) // Resetting boxes to nothing
    fetch('http://localhost:3000/imageurl', { // Clarifai API call
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body:   JSON.stringify({
							input: this.state.input
						})
			})
			.then(response => response.json())
	.then(response => {
		if (response) {
			fetch('http://localhost:3000/image', { // Entries count is incremented by 1
				method: 'put',
				headers: {'Content-Type': 'application/json'},
				body:   JSON.stringify({
							id: this.state.user.id
						})
			})
			.then(response => response.json())
			.then(count => {
				this.setState(Object.assign(this.state.user, { entries: count })) // Displaying new entries count on page
			})
			.catch(console.log);
		}
		this.displayFaceBoxes(this.calculateFaceLocation(response))
	})
    .catch(error => console.log(error))
  }

  /** Handles the routes for the page when clicking the links (i.e. sign in, register, sign out) */
  onRouteChange = (route) => {
    if (route === 'signout') {
	  this.setState(initialState); // Resetting page back to default
	  route = 'signin'; // On sign out, page goes to the sign in page
    } else if (route === 'home') {
      this.setState({isSignedIn: true}) // Changes the nav bar from "sign in/register" to "sign out"
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className="App">
        <Particles 
          className='particles'
          params={ particleOptions }
        />
        <Navigation isSignedIn={ isSignedIn } onRouteChange={ this.onRouteChange }/>
		{ (route === 'home')
		/** Homepage (i.e. signed in) */
        ? <div>
            <Rank name={ this.state.user.name } entries={ this.state.user.entries }/>
            <ImageLinkForm
              onInputChange={ this.onInputChange }
              onPictureSubmit={ this.onPictureSubmit }
            />
            <FaceRecognition imageUrl={ imageUrl } boxes={ boxes }/>
          </div>
		/** Signed out; shows SignIn or Register depending on route */
        : (
          route === 'signin'
          ? <SignIn loadUser={ this.loadUser } onRouteChange={ this.onRouteChange }/>
          : <Register loadUser={ this.loadUser } onRouteChange={ this.onRouteChange }/>
        )
        }
      </div>
    );
  }
}

export default App;
