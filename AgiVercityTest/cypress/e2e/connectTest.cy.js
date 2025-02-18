

describe('connect test', () => {
  it('home page', () => {
    cy.visit(Cypress.env('BASE_URL'))

    cy.get('.chakra-input.css-6b7gm6').should('exist')
  })
})

