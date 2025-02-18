class LoginChecker {
  checkOpening() {
    cy.visit(Cypress.env('BASE_URL') + '/login')
    cy.get('.css-16bt6r').should('exist')
  }

  checkWrongAuthorization() {
    cy.visit(Cypress.env('BASE_URL') + '/login')
    cy.get('.css-16bt6r').should('exist')

    cy.get('#email').type('wrong-test@test')
    cy.get('#password').type('wrong-pass')
    cy.get('button[type=submit]').click()

    cy.get('.chakra-alert.css-12t4pi7').should('be.visible')
    cy.get('.css-16bt6r').should('exist')
  }

  checkCorrectAuthorization() {
    cy.visit(Cypress.env('BASE_URL') + '/login')
    cy.get('.css-16bt6r').should('exist')

    cy.get('#email').type(Cypress.env('USER_NAME'))
    cy.get('#password').type(Cypress.env('USER_PASSWORD'))

    cy.get('button[type=submit]').click()

    cy.get('.css-16bt6r').should('not.exist')
  }
}

export default new LoginChecker()
