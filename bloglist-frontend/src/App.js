import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import LoggedInMessage from './components/loggedInMessage'
import CreateBlogForm from './components/CreateBlogForm'
import Message from './components/Message';
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [loginName, setLoginName] = useState('Test')
  const [loginPw, setLoginPw] = useState('testpass')
  const [token, setToken] = useState(null)
  const [loggedInName, setLoggedInName] = useState(null)
  const [loggedInUserName, setloggedInUsername] = useState(null)
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState(false)
  const [messageRed, setMessageRed] = useState(false)

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

  const handleLogin = async () => {
    const tokenData = await loginService.login(loginName, loginPw)
    //console.log('login :>> ', tokenData);
    if(tokenData.err ===  null){
      handleMessaheChange('Login successful')
      setLoggedInName(tokenData.login.name)
      localStorage.setItem('name', tokenData.login.name)
      setloggedInUsername(tokenData.login.username)
      localStorage.setItem('username', tokenData.login.username)
      setToken('bearer '+tokenData.login.token)
      localStorage.setItem('token', 'bearer '+tokenData.login.token)
    } else {
      handleMessaheChange('Status:'+tokenData.err.status+' '+tokenData.err.statusText+', '+
        tokenData.err.data.error, true, 2000)
    }
  }

  const handleLogout = () => {
    setLoggedInName(null)
    setloggedInUsername(null)
    setToken(null)

    handleMessaheChange('logged out')

    localStorage.clear()
  }

  const submitNewBlogToDb = async (newBlog) =>{
    console.log('newBlog :>> ', newBlog);
    const response = await blogService.submitBlog(token, newBlog.title, newBlog.author, newBlog.url)

    if (response.err === null) {
      handleMessaheChange('New blog added: ' + newBlog.title)
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
    } else {
      handleMessaheChange('Blog to add new blog: ' + response.err.data.error)
    }
  }

  const handleMessaheChange = async (text, red, timeoutDur) => {
    let timeout
    if (timeoutDur) {
      timeout = timeoutDur
    } else {
      timeout = 800
    }

    //console.log('message päälle');

    red ? setMessageRed(true) : setMessageRed(false)
    setMessageText(text)
    setShowMessage(true)
     
    setTimeout(() => {
      setShowMessage(false)
      //console.log('message pois');
    }, timeout)
  }

  return (
    <div>
      <h2>blogs</h2>
      <Message show={showMessage} message={messageText} red={messageRed} />
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
        ? < CreateBlogForm 
            submitNewBlogToDb={submitNewBlogToDb}
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