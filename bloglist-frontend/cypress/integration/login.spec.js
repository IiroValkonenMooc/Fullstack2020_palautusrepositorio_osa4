describe('login', function() {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testFunctions/resetDb')

    const newUser = {
      name: 'testman',
      username: 'E2EtestUser',
      password: 'secretPW'
    }
    cy.request('POST', 'http://localhost:3001/api/users', newUser)

    cy.visit('http://localhost:3000/')
  })

  it('login can be found', function () {
    cy.contains('Login').click()
    cy.get('#usernameField')
    cy.get('#passwordField')
    cy.get('#loginbutton')
  })

  it('succeeds with correct credentials', function () {
    cy.contains('Login').click()
    cy.get('#usernameField').clear().type('E2EtestUser')
    cy.get('#passwordField').clear().type('secretPW')
    cy.get('#loginbutton').click()

    cy.contains('Logged in as E2EtestUser')
  })

  it('fails with wrong credentials', function () {
    cy.contains('Login').click()
    cy.get('#usernameField').clear().type('E2EtestUser')
    cy.get('#passwordField').clear().type('screcPW')
    cy.get('#loginbutton').click()

    cy.get('.Message-red')
      .should('have.css', 'color', 'rgb(220, 20, 60)')

    cy.get('.Message-red')
      .should('have.css', 'border')
      .and('contain', 'rgb(255, 0, 0)')

    cy.contains('Logged in as E2EtestUser').should('not.exist')
  })
})