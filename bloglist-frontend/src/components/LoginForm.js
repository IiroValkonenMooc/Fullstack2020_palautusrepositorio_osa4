import React from 'react'

const LoginForm = ({loginName, handleLoginNameChange, loginPw, handleLoginPwChange, handleLogin}) => {
    return ( 
    <div>
        <h2>Log into application</h2>
        <div>
            {'Username'} <br></br>
            <input type="text" name='username' value={loginName} onChange={handleLoginNameChange} />
        </div>
        <div>
            {'Password'} <br></br>
            <input type="text" name='password' value={loginPw} onChange={handleLoginPwChange} />
        </div>
        <div>
            <button name='loginbutton' onClick={handleLogin}>
                Login
            </button>
        </div>
    </div>
    )
}

export default LoginForm