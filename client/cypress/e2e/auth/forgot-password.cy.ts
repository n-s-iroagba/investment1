describe("Forgot Password", () => {
  it("should display forgot password form", () => {
    cy.visit("/auth/forgot-password")

    cy.contains("Forgot Password").should("be.visible")
    cy.get('input[type="email"]').should("be.visible")
    cy.contains("Send Reset Link").should("be.visible")
  })

  it("should submit forgot password request", () => {
    cy.intercept("POST", "**/auth/forgot-password", {
      statusCode: 200,
      body: { resetPasswordToken: "reset-token-123" },
    }).as("forgotPassword")

    cy.visit("/auth/forgot-password")

    cy.get('input[type="email"]').type("user@test.com")
    cy.get('button[type="submit"]').click()

    cy.wait("@forgotPassword")
    cy.contains("password reset email has been sent").should("be.visible")
  })
})
