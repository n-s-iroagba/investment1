describe("Admin Signup", () => {
  it("should display signup form", () => {
    cy.visit("/admin/signup")

    cy.contains("Admin Registration").should("be.visible")
    cy.get('input[name="username"]').should("be.visible")
    cy.get('input[name="email"]').should("be.visible")
    cy.get('input[name="password"]').should("be.visible")
    cy.get('input[name="confirmPassword"]').should("be.visible")
  })

  it("should validate password confirmation", () => {
    cy.visit("/admin/signup")

    cy.get('input[name="username"]').type("testadmin")
    cy.get('input[name="email"]').type("admin@test.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password456")

    cy.get('button[type="submit"]').click()
    cy.contains("Passwords don't match").should("be.visible")
  })

  it("should submit valid signup form", () => {
    cy.intercept("POST", "/auth/admin-signup", {
      statusCode: 200,
      body: "verification-token-123",
    }).as("adminSignup")

    cy.visit("/admin/signup")

    cy.get('input[name="username"]').type("testadmin")
    cy.get('input[name="email"]').type("admin@test.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password123")

    cy.get('button[type="submit"]').click()
    cy.wait("@adminSignup")

    cy.url().should("include", "/auth/verify-email/verification-token-123")
  })
})
