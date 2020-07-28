import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import LoggedInMessage from './components/loggedInMessage'
import CreateBlogForm from './components/CreateBlogForm'
import Message from './components/Message'
import blogService from './services/blogs'
import loginService from './services/login'
import Toggleable from './components/Toggleable'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [token, setToken] = useState(null)
  const [loggedInName, setLoggedInName] = useState(null)
  const [loggedInUserName, setloggedInUsername] = useState(null)
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState(false)
  const [messageRed, setMessageRed] = useState(false)
  const blogFormRef = useRef()

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

  const handleUserLogin = async (login) => {
    console.log('login :>> ', login)
    const tokenData = await loginService.login(login.username, login.password)

    if(tokenData.err ===  null){
      handleMessageChange('Login successful')
      setLoggedInName(tokenData.login.name)
      localStorage.setItem('name', tokenData.login.name)
      setloggedInUsername(tokenData.login.username)
      localStorage.setItem('username', tokenData.login.username)
      setToken('bearer '+tokenData.login.token)
      localStorage.setItem('token', 'bearer '+tokenData.login.token)
    } else {
      handleMessageChange('Status:'+tokenData.err.status+' '+tokenData.err.statusText+', '+
        tokenData.err.data.error, true, 4000)
    }
  }

  const handleLogout = () => {
    setLoggedInName(null)
    setloggedInUsername(null)
    setToken(null)

    handleMessageChange('logged out')

    localStorage.clear()
  }

  const submitNewBlogToDb = async (newBlog) => {
    console.log('newBlog :>> ', newBlog)
    const response = await blogService.submitBlog(token, newBlog.title, newBlog.author, newBlog.url)

    if (response.err === null) {
      handleMessageChange('New blog added: ' + newBlog.title)
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)

      blogFormRef.current.toggleVisibility()
    } else {
      handleMessageChange('Blog to add new blog: ' + response.err.data.error)
    }
  }

  const handleMessageChange = async (text, red, timeoutDur) => {
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

  const handleBlogLike = async (blog) => {
    const response = await blogService.likeBlog(token, blog)
    // console.log('blog :>> ', blog)
    // console.log('blog liked')

    if (response.err === null) {
      handleMessageChange(`Blog: ${blog.title} liked`)
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)

    } else {
      handleMessageChange('Failed to add new blog: ' + response.err.response.data.error, true)
    }
  }

  const handleBlogDelete = async (blog) => {
    console.log('deleting blog')
    const confirmResult = window.confirm(`Really delete blog: ${blog.title}`)

    if (confirmResult) {

      const response = await blogService.deleteBlog(token, blog)

      if (response.err === null) {
        handleMessageChange(`Blog: ${blog.title} deleted`, false, 6000)
        const newBlogs = await blogService.getAll()
        setBlogs(newBlogs)
      } else {
        handleMessageChange('Failed to delete blog: ' + response.err.response.data.error, true, 6000)
        const newBlogs = await blogService.getAll()
        setBlogs(newBlogs)
      }

    }
  }

  return (
    <div>
      <div className='Padded-element'>
        <h2>blogs</h2>
      </div>
      <Message show={showMessage} message={messageText} red={messageRed} />
      {
        loggedInUserName === null
          ? <Toggleable buttonLabel={'Login'} >
            < LoginForm
              handleLogin={handleUserLogin}
            />
          </Toggleable>
          :
          < LoggedInMessage
            loggedInUserName={loggedInUserName}
            loggedInName={loggedInName}
            handleLogout={handleLogout}
          />
      }

      {loggedInUserName !== null
        ? <Toggleable buttonLabel={'send new blog'} ref={blogFormRef} >
          < CreateBlogForm
            submitNewBlogToDb={submitNewBlogToDb}
          />
        </Toggleable>
        : null
      }
      <div className='Padded-element'>
        {blogs
          .sort( (a,b) => b.likes-a.likes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} likeBlog={handleBlogLike} deleteBlog={handleBlogDelete}/>
          )}
      </div>
    </div>
  )
}

export default App