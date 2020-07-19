import React from 'react'

const LoggedInMessage = ({ loggedInUserName, loggedInName, handleLogout }) => {
  const padLeft = { marginLeft: '10px' }

  return (
    <div className='Padded-element'>
      <h2>Logged in as {loggedInUserName}</h2>
      {'Hello'} {loggedInName}
      <button style={padLeft}  onClick={handleLogout} >
              logout
      </button>
    </div>
  )
}

export default LoggedInMessage