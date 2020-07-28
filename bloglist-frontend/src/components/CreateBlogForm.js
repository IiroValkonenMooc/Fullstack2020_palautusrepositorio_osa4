import React, { useState } from 'react'



const CreateBlogForm = ({ submitNewBlogToDb }) => {

  const [title, setTitle] = useState('title')
  const [author, setAuthor] = useState('author')
  const [url, setUrl] = useState('urli')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    submitNewBlogToDb(
      {
        title: title,
        author: author,
        url: url
      }
    )

  }


  return (
    <form onSubmit={handleSubmit} id='blogForm' className='Padded-element'>
      <div>
        {'title:'}
        <input id='titleTextBox' type='text' value={title} onChange={handleTitleChange} />
      </div>
      <div>
        {'author:'}
        <input id='authorTextBox' type='text' value={author} onChange={handleAuthorChange} ></input>
      </div>
      <div>
        {'url:'}
        <input id='urlTextBox' type='text' value={url} onChange={handleUrlChange} ></input>
      </div>
      <div>
        <button id='submitBlogButton' type='submit' >
                        create
        </button>
      </div>
    </form>
  )
}

export default CreateBlogForm