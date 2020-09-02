describe('basic user journey', () => {
  it('can make a query, select a location from the suggestion list, and display marker', () => {
    cy.server()
    cy.visit('http://localhost:3000')
    cy.get('input').type('new york')
    cy.contains('New York City').click()
    cy.get('.mapboxgl-marker').should('exist')
  })
})
