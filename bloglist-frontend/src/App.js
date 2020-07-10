import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [loginName, setLoginName] = useState('')
  const [loginPw, setLoginPw] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLoginNameChange = (event) => {
    setLoginName(event.target.value)
  }

  const handleLoginPwChange = (event) => {
    setLoginPw(event.target.value)
  }

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
        <button name='loginbutton'>
          Login
        </button>
      </div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App