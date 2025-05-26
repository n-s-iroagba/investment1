describe("Home Page", () => {
  it("should display home page", () => {
    cy.visit("/")

    // Add assertions based on your home page content
    cy.get("body").should("be.visible")
  })

  it("should be accessible without authentication", () => {
    cy.visit("/")

    // Should not redirect to login
    cy.url().should("eq", Cypress.config().baseUrl + "/")
  })
})
