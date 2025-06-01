describe("Admin Signup", () => {
  it("should display signup form", () => {
    cy.visit("/admin/signup")

    cy.contains("Admin Registration").should("be.visible")
    cy.get('input[type="text"]').should("be.visible")
    cy.get('input[type="email"]').should("be.visible")
    cy.get('input[type="password"]').should("have.length.at.least", 1)
  })

  it("should submit valid signup", () => {
    cy.intercept("POST", "**/auth/admin-signup", {
      statusCode: 200,
    }).as("adminSignup")

    cy.visit("/admin/signup")

    cy.get('input[type="text"]').first().type("testadmin")
    cy.get('input[type="email"]').type("netlylogistic@gmail.com")
    cy.get('input[type="password"]').first().type("97chocho")
    cy.get('input[type="password"]').last().type("97chocho")
    cy.get('button[type="submit"]').click()

    cy.wait("@adminSignup")
    cy.url().should("include", "/auth/verify-email")
  })
})
