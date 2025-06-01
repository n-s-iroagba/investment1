describe("Reset Password", () => {
  it("should display reset password form", () => {
    cy.visit("/auth/reset-password/test-token")

    cy.contains("Reset Password").should("be.visible")
    cy.get('input[type="password"]').should("have.length", 2)
  })

  it("should submit valid reset password", () => {
    cy.intercept("POST", "**/auth/reset-password/test-token", {
      statusCode: 200,
      body: { success: true },
    }).as("resetPassword")

    cy.visit("/auth/reset-password/test-token")

    cy.get('input[type="password"]').first().type("newpassword123")
    cy.get('input[type="password"]').last().type("newpassword123")
    cy.get('button[type="submit"]').click()

    cy.wait("@resetPassword")
    cy.url().should("include", "/login")
  })
})
