import React from 'react'


const CreateBlogForm = ({createBlogTitle, createBlogAuthor, createBlogUrl,
         handleCreateTitleChange, handleCreateAuthorChange, handleCreateUrlChange, handleSubmitBlog}) => {
    return(
        <form onSubmit={handleSubmitBlog}>
            <div>
                <div>
                    {'title:'}
                    <input type='text' value={createBlogTitle} onChange={handleCreateTitleChange} />
                </div>
                <div>
                    {'author:'}
                    <input type='text' value={createBlogAuthor} onChange={handleCreateAuthorChange} ></input>
                </div>
                <div>
                    {'url:'}
                    <input type='text' value={createBlogUrl} onChange={handleCreateUrlChange} ></input>
                </div>
                <div>
                    <button type='submit' >
                        create
                    </button>
                </div>
            </div>
        </form>
    )
}

export default CreateBlogForm