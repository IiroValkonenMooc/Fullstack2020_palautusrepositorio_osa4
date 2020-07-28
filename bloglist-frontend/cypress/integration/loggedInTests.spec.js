describe('loggedIntests', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testFunctions/resetDb')

    const newUser = {
      name: 'testman',
      username: 'E2EtestUser',
      password: 'secretPW'
    }
    cy.request('POST', 'http://localhost:3001/api/users', newUser)

    const newUser2 = {
      name: 'testmanWrong',
      username: 'E2EtestUserWrong',
      password: 'secretPWWrong'
    }
    cy.request('POST', 'http://localhost:3001/api/users', newUser2)

    cy.request('POST', 'http://localhost:3001/api/login', { username: 'E2EtestUser', password: 'secretPW' })
      .then((response) => {
        console.log('response :>> ', response)
        localStorage.setItem('name', response.body.name)
        localStorage.setItem('username', response.body.username)
        localStorage.setItem('token', 'bearer '+ response.body.token)
      })

    cy.visit('http://localhost:3000/')
  })

  it('UserIsLoggedIn', function () {
    cy.contains('Logged in as E2EtestUser')
  })

  it('Blog can be added', function () {
    cy.contains('send new blog').click()
    cy.get('#titleTextBox').clear().type('Profecy')
    cy.get('#authorTextBox').clear().type('Q')
    cy.get('#urlTextBox').clear().type('www.mystery.org')
    cy.get('#submitBlogButton').click()

    cy.contains('Profecy, Q')
  })

  it('Blog can be liked', function () {
    cy.contains('send new blog').click()
    cy.get('#titleTextBox').clear().type('Profecy')
    cy.get('#authorTextBox').clear().type('Q')
    cy.get('#urlTextBox').clear().type('www.mystery.org')
    cy.get('#submitBlogButton').click()

    cy.contains('Profecy, Q')
      .find('.Blog-info-button')
      .click()

    cy.contains('Title: Profecy, Author: Q')
      .parent()
      .find('.Blog-like-button')
      .click()

    cy.contains('Likes: 1')
  })

  it('Blog can be deleted', function () {
    cy.contains('send new blog').click()
    cy.get('#titleTextBox').clear().type('Profecy')
    cy.get('#authorTextBox').clear().type('Q')
    cy.get('#urlTextBox').clear().type('www.mystery.org')
    cy.get('#submitBlogButton').click()

    cy.contains('Profecy, Q')
      .find('.Blog-info-button')
      .click()

    cy.contains('Title: Profecy, Author: Q')
      .parent()
      .parent()
      .find('.Blog-delete-button')
      .click()

    cy.contains('Profecy, Q').should('not.exist')
    cy.contains('Title: Profecy, Author: Q').should('not.exist')
  })

  it('Wrong user cant delete blog', function () {
    cy.contains('send new blog').click()
    cy.get('#titleTextBox').clear().type('Profecy')
    cy.get('#authorTextBox').clear().type('Q')
    cy.get('#urlTextBox').clear().type('www.mystery.org')
    cy.get('#submitBlogButton').click()
    cy.wait(1000)

    cy.contains('logout').click()
    cy.wait(1000)
    cy.contains('Login').click()
    cy.get('#usernameField').clear().type('E2EtestUserWrong')
    cy.get('#passwordField').clear().type('secretPWWrong')
    cy.get('#loginbutton').click()

    cy.contains('Logged in as E2EtestUser')

    cy.contains('Profecy, Q')
      .find('.Blog-info-button')
      .click()

    cy.contains('Title: Profecy, Author: Q')
      .parent()
      .parent()
      .find('.Blog-delete-button')
      .click()

    cy.contains('Failed to delete blog: invalid user')
  })

  it('Blogs are in order by likes', function () {
    cy.contains('send new blog').click()
    cy.get('#titleTextBox').clear().type('Profecy')
    cy.get('#authorTextBox').clear().type('Q')
    cy.get('#urlTextBox').clear().type('www.mystery.org')
    cy.get('#submitBlogButton').click()

    cy.contains('send new blog').click()
    cy.get('#titleTextBox').clear().type('I keep getting away with this!')
    cy.get('#authorTextBox').clear().type('Sam Hyde')
    cy.get('#urlTextBox').clear().type('www.mde.org')
    cy.get('#submitBlogButton').click()

    cy.contains('send new blog').click()
    cy.get('#titleTextBox').clear().type('Occult, ep 1227')
    cy.get('#authorTextBox').clear().type('Styxenhammer')
    cy.get('#urlTextBox').clear().type('www.bitchute.com')
    cy.get('#submitBlogButton').click()

    cy.contains('Profecy, Q')
      .find('.Blog-info-button')
      .click()
    cy.contains('Title: Profecy, Author: Q')
      .parent()
      .find('.Blog-like-button')
      .click()

    cy.contains('I keep getting away with this!, Sam Hyde')
      .find('.Blog-info-button')
      .click()
    cy.contains('Title: I keep getting away with this!, Author: Sam Hyde')
      .parent()
      .find('.Blog-like-button')
      .click()
      .wait(150)
      .click()

    cy.contains('Occult, ep 1227, Styxenhammer')
      .find('.Blog-info-button')
      .click()
    cy.contains('Title: Occult, ep 1227, Author: Styxenhammer')
      .parent()
      .find('.Blog-like-button')
      .click()
      .wait(150)
      .click()
      .wait(150)
      .click()

    cy.wait(1000)

    cy.get('.Blog-expanded-styling').first()
      .contains('Title: Occult, ep 1227, Author: Styxenhammer')
      .should('exist')
    cy.get('.Blog-expanded-styling').first().next()
      .contains('Title: I keep getting away with this!, Author: Sam Hyde')
      .should('exist')
    cy.get('.Blog-expanded-styling').first().next().next()
      .contains('Title: Profecy, Author: Q')
      .should('exist')
  })
})