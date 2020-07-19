import React, { useState } from 'react'
import PropTypes from 'prop-types';

const LoginForm = ({ handleLogin }) => {
  const[username, setUsername]=useState('Test')
  const[password,setPassword]= useState('testpass')

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    handleLogin(
      {
        username: username,
        password: password
      }
    )
  }

  return (
    <div className='Padded-element' >
      <h2>Log into application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {'Username'} <br></br>
          <input type="text" name='username' value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          {'Password'} <br></br>
          <input type="text" name='password' value={password} onChange={handlePasswordChange} />
        </div>
        <div>
          <button type='submit' name='loginbutton'>
                        Login
          </button>
        </div>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm