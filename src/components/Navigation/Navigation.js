import React from 'react'
import './Navigation.css'
import Logo from '../Logo/Logo'

/**
 * This component houses the signout link (if signed in) otherwise the sign in/register links when not signed in.
 */
const Navigation = ({ onRouteChange, isSignedIn }) => {
    if (isSignedIn) {
        return (
            <nav>
                <Logo />
                <p className='f3 link dim black underline pa3 pointer' onClick={ () => onRouteChange('signout') }>Sign Out</p>
            </nav>
        )
    } else {
        return (
            <nav>
                <Logo />
                <div className='mt4'>
                    <p className='f3 link dim black underline pa3 pointer' onClick={ () => onRouteChange('signin') }>Sign In</p>
                    <p className='f3 link dim black underline pa3 pointer' onClick={ () => onRouteChange('register') }>Register</p>
                </div>
            </nav>
        )
    }
}

export default Navigation;