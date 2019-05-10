import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js'
import Clarifai from 'clarifai'
import Navigation from './components/Navigation/Navigation'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'

const app = new Clarifai.App({
  apiKey: '6677827165814360bf99b8300fdce055'
 });

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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false,
    }
  }

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

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    this.setState({ boxes: [] })
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBoxes(this.calculateFaceLocation(response)))
    .catch(error => console.log(error))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
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
        ? <div>
            <Rank />
            <ImageLinkForm
              onInputChange={ this.onInputChange }
              onButtonSubmit={ this.onButtonSubmit }
            />
            <FaceRecognition imageUrl={ imageUrl } boxes={ boxes }/>
          </div>
        : (
          route === 'signin'
          ? <SignIn onRouteChange={ this.onRouteChange }/>
          : <Register onRouteChange={ this.onRouteChange }/>
        )
        }
      </div>
    );
  }
}

export default App;
