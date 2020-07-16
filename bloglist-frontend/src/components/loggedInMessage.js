import React from 'react'

const LoggedInMessage = ({loggedInUserName, loggedInName, handleLogout}) => {
    return (
        <div className='Padded-element'>
            <h2>Logged in as {loggedInUserName}</h2>
            {'Hello'} {loggedInName}
            <button onClick={handleLogout} >
              logout
            </button>
        </div>
    )
}

export default LoggedInMessage