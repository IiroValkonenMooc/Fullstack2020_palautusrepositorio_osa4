describe('login', function() {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testFunctions/resetDb')
  })

  it('login can be found', function () {
    cy.visit('http://localhost:3000/')
    cy.contains('Login')
  })
})