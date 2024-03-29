import React from 'react'

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    onNameChange = (event) => {
        this.setState({name: event.target.value});
    }

    onSubmitRegister = () => {
        if (this.state.email) { // Making sure that at least an email address was entered before submitting form
            fetch('https://faiz-face-recognition-brain.herokuapp.com/register', { // Register API call
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body:   JSON.stringify({
                            email: this.state.email.toLowerCase(),
                            password: this.state.password,
                            name: this.state.name
                        })
            })
            .then(response => response.json())
            .then(user => {
                if (user.id) { // Making sure an actual user object was returned
                    /** Loads user into state and then redirects to home (if registration was successful) */
                    this.props.loadUser(user);
                    this.props.onRouteChange('home');
                } else {
                    document.querySelector('#registerError').innerHTML = 'Unable to register';
                }
            })
        } else {
            document.querySelector('#registerError').innerHTML = 'Please enter an email address';
        }
    }

    render() {
        return (
            <div className='center'>
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5">
                    <main className="pa4 black-80">
                        <div className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                <input
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={ this.onNameChange }
                                />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="email"
                                    name="email-address"
                                    id="email-address"
                                    onChange={ this.onEmailChange }
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={ this.onPasswordChange }
                                />
                            </div>
                            </fieldset>
                            <div className="">
                            <input
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit"
                                value="Register"
                                onClick={ this.onSubmitRegister }
                            />
                            </div>
                            <p id="registerError" className="dark-red"></p>
                        </div>
                    </main>
                </article>
            </div>
        )
    }
}

export default Register;