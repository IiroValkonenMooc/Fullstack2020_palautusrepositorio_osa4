import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import CreateBlogForm from './CreateBlogForm'

describe('<CreateBlogForm />', () => {
  let component
  let mockSendBlogToDb

  beforeEach(() => {
    mockSendBlogToDb = jest.fn()

    component = render(
      <CreateBlogForm  submitNewBlogToDb={mockSendBlogToDb} />
    )
  })

  test('Form renders', async () => {
    expect(component.container.querySelector('#blogForm')).toBeDefined()
  })

  test('asd', async () => {
    const inputTitle = component.container.querySelector('#titleTextBox')
    const inputAuthor = component.container.querySelector('#authorTextBox')
    const inputUrl = component.container.querySelector('#urlTextBox')
    const blogForm = component.container.querySelector('#blogForm')

    fireEvent.change(inputTitle, {
      target: { value: 'Interesting title' }
    })
    fireEvent.change(inputAuthor, {
      target: { value: 'Mysterious fellow' }
    })
    fireEvent.change(inputUrl, {
      target: { value: 'some cryptic site' }
    })
    fireEvent.submit(blogForm)

    fireEvent.change(inputTitle, {
      target: { value: 'asd' }
    })
    fireEvent.change(inputAuthor, {
      target: { value: 'sad' }
    })
    fireEvent.change(inputUrl, {
      target: { value: 'sadsad' }
    })
    fireEvent.submit(blogForm)

    // console.log('form submit result :>> ', mockSendBlogToDb.mock.calls[0][0])
    // console.log('form submit result type :>> ', typeof(mockSendBlogToDb.mock.calls[0][0]))

    expect(mockSendBlogToDb.mock.calls[0][0]).toEqual(
      {
        title: 'Interesting title',
        author: 'Mysterious fellow',
        url: 'some cryptic site'
      }
    )
  })

})