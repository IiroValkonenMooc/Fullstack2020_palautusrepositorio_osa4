import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import LoggedInMessage from './components/loggedInMessage'
import CreateBlogForm from './components/CreateBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [loginName, setLoginName] = useState('Test')
  const [loginPw, setLoginPw] = useState('testpass')
  const [token, setToken] = useState(null)
  const [loggedInName, setLoggedInName] = useState(null)
  const [loggedInUserName, setloggedInUsername] = useState(null)
  const [createBlogTitle, setCreateBlogTitle] = useState('tit')
  const [createBlogAuthor, setCreateBlogAuthor] = useState('auth')
  const [createBlogUrl, setCreateBlogUrl] = useState('url') 

  useEffect(() => {
    const lsName = localStorage.getItem('name')
    const lsUsername = localStorage.getItem('username')
    const lsToken = localStorage.getItem('token')

    if( lsName && lsUsername && lsToken){
      setLoggedInName(lsName)
      setloggedInUsername(lsUsername)
      setToken(lsToken)
    }
  }, [])


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

  const handleCreateTitleChange = (event) => {
    setCreateBlogTitle(event.target.value)
  }
 
  const handleCreateAuthorChange = (event) => {
    setCreateBlogAuthor(event.target.value)
  }

  const handleCreateUrlChange = (event) => {
    setCreateBlogUrl(event.target.value)
  }


  const handleLogin = async () => {
    const tokenData = await loginService.login(loginName, loginPw)
    console.log('login :>> ', tokenData);
    if(tokenData.err ===  null){
      setLoggedInName(tokenData.login.name)
      localStorage.setItem('name', tokenData.login.name)
      setloggedInUsername(tokenData.login.username)
      localStorage.setItem('username', tokenData.login.username)
      setToken(tokenData.login.token)
      localStorage.setItem('token', tokenData.login.token)
    }
  }

  const handleLogout = () => {
      setLoggedInName(null)
      setloggedInUsername(null)
      setToken(null)

      localStorage.clear()
  }

  const handleSubmitBlog = () =>{
    
  }

  return (
    <div>
      <h2>blogs</h2>
      {
        loggedInUserName === null 
          ? < LoginForm
              loginName={loginName}
              handleLoginNameChange={handleLoginNameChange}
              loginPw={loginPw} handleLoginPwChange={handleLoginPwChange}
              handleLogin={handleLogin} 
            />
          : 
            < LoggedInMessage 
              loggedInUserName={loggedInUserName}
              loggedInName={loggedInName}
              handleLogout={handleLogout}
            />
      }

      {loggedInUserName !== null
        ? < CreateBlogForm createBlogTitle={createBlogTitle}
          createBlogAuthor={createBlogAuthor}
          createBlogUrl = {createBlogUrl}
          handleCreateTitleChange={handleCreateTitleChange}
          handleCreateAuthorChange={handleCreateAuthorChange}
          handleCreateUrlChange={handleCreateUrlChange}
        />
        : null
      }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App