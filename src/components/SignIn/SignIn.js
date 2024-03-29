import React from 'react'

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value});
    }

    onSubmitSignIn = () => {
        fetch('https://faiz-face-recognition-brain.herokuapp.com/signin', { // Sign in API call
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body:   JSON.stringify({
                        email: this.state.signInEmail.toLowerCase(),
                        password: this.state.signInPassword
                    })
        })
        .then(response => response.json())
        .then(user => {
            if (user.id) { // Making sure an actual user object was returned
                /** Loads user into state and then redirects to home (if registration was successful) */
                this.props.loadUser(user);
                this.props.onRouteChange('home');
            } else {
                document.querySelector("#loginError").innerHTML = 'Invalid email/password';
            }
        })
    }

    render() {
        const { onRouteChange } = this.props;
        return (
            <div className='center'>
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5">
                    <main className="pa4 black-80">
                        <div className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
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
                                value="Sign in"
                                onClick={ this.onSubmitSignIn }
                            />
                            </div>
                            <div className="lh-copy mt3">
                            <p className="f6 link dim black db pointer" onClick={ () => onRouteChange('register') }>Register</p>
                            </div>
                            <div id="loginError" className="dark-red"></div>
                        </div>
                    </main>
                </article>
            </div>
        )
    }   
}

export default SignIn;