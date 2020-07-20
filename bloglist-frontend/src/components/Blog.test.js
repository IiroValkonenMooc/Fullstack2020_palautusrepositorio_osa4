import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let mockLike
  let mockDelete

  beforeEach(() => {
    const testBlog = {
      title: 'Blog on testing components',
      author: 'Testman',
      url: 'www.nothere.org/asd',
      likes: 200,
      user: {
        name: 'Qanon',
        username: 'Q',
      }
    }

    mockLike = jest.fn()
    mockDelete = jest.fn()

    component = render(
      <Blog blog={testBlog} likeBlog={ mockLike }  deleteBlog={ mockDelete } />
    )
  })

  test('Blog preview is defined', async () => {
    //console.log('pretty :>> ', prettyDOM(component.container))

    expect(
      component.container.querySelector('.Blog-styling')
    ).toBeDefined()
  })

  test('Blog has right content when not expanded', async () => {
    // expect(
    //   component.container.querySelector('.Blog-styling')
    // ).toHaveTextContent('Blog on testing components, Testman')

    const element = component.getByText('Blog on testing components, Testman')
    expect(element).toHaveTextContent('Blog on testing components')
    expect(element).toHaveTextContent('Testman')
    expect(element).not.toHaveTextContent('www.nothere.org/asd')
    expect(element).not.toHaveTextContent('Likes')
  })

  test('Blog can be expanded', () => {
    const button = component.container.querySelector('.Blog-info-button')
    fireEvent.click(button)

    expect(
      component.container.querySelector('.Blog-styling')
    ).toBeFalsy()

    expect(
      component.container.querySelector('.Blog-expanded-styling')
    ).toBeDefined()
  })

  test('Blog can be expanded', () => {
    const button = component.container.querySelector('.Blog-info-button')
    fireEvent.click(button)

    const authorElement = component.getByText('Title: Blog on testing components, Author: Testman')
    expect(authorElement).toBeDefined()
    const urlElement = component.getByText('Url: www.nothere.org/asd')
    expect(urlElement).toBeDefined()
    const likesElement = component.getByText('Likes: 200')
    expect(likesElement).toBeDefined()
    const userElement = component.getByText('Added by: Q')
    expect(userElement).toBeDefined()
  })

  test('Like-button call like-event', () => {
    const expandInfoButton = component.container.querySelector('.Blog-info-button')
    fireEvent.click(expandInfoButton)

    expect(mockLike.mock.calls).toHaveLength(0)

    const likeButton = component.container.querySelector('.Blog-like-button')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})