/* eslint-disable no-undef */
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'testaaja1',
      username: 'test1',
      password: 'password'
    }

    const user2 = {
      name: 'testaaja2',
      username: 'test2',
      password: 'password'
    }

    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('test1')
      cy.get('#password').type('password')
      cy.get('#login-button').click()
      cy.contains('testaaja1 logged in')
    })
    it('fails with wrong credentials', function() {
      cy.get('#username').type('asdf')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error').contains('Wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('test1')
      cy.get('#password').type('password')
      cy.get('#login-button').click()
      cy.contains('testaaja1 logged in')
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('test title')
      cy.get('#author').type('test author')
      cy.get('#url').type('http://testurl.com')
      cy.get('#create-button').click({ force: true })
      cy.contains('test title test author')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.contains('create new blog').click()
        cy.get('#title').type('test title')
        cy.get('#author').type('test author')
        cy.get('#url').type('http://testurl.com')
        cy.get('#create-button').click({ force: true })
        cy.contains('test title test author')
      })

      it('user can add likes', function () {
        cy.contains('view').click()
        cy.contains('0')
          .contains('like')
          .click()

        cy.contains('1')
      })

      it('user can delete their blogs', function () {
        cy.contains('view').click()
        cy.get('#remove-button').click()
        cy.contains('remove').should('not.exist')
      })
    })

    describe('when there are more than one users', function () {
      beforeEach(function () {
        cy.contains('logout').click()

        cy.get('#username').type('test2')
        cy.get('#password').type('password')
        cy.get('#login-button').click()
        cy.contains('testaaja2 logged in')
      })

      it('only user who created the blog can delete it', function () {
        cy.contains('create new blog').click()
        cy.get('#title').type('test title two')
        cy.get('#author').type('test author two')
        cy.get('#url').type('http://testurltwo.com')
        cy.get('#create-button').click({ force: true })
        cy.contains('test title two test author two')

        cy.contains('logout').click()
        cy.get('#username').type('test1')
        cy.get('#password').type('password')
        cy.get('#login-button').click()
        cy.contains('testaaja1 logged in')

        cy.contains('view').click()
        cy.contains('remove').should('not.exist')
      })

      it('blogs are ordered by likes', function () {
        cy.contains('create new blog').click()
        cy.get('#title').type('Most likes')
        cy.get('#author').type('testi1')
        cy.get('#url').type('https://www.testi1.com')
        cy.get('#create-button').click({ force: true })

        cy.contains('create new blog').click()
        cy.get('#title').type('The second most likes')
        cy.get('#author').type('testi2')
        cy.get('#url').type('https://www.testi2.com')
        cy.get('#create-button').click({ force: true })

        cy.contains('Most likes').contains('view').click()
        cy.get('button').contains('like').click()

        cy.get('.blog').eq(0).should('contain', 'Most likes')
        cy.get('.blog').eq(1).should('contain', 'The second most likes')
      })
    })
  })
})