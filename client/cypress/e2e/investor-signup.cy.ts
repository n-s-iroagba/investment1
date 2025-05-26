describe("Investor Signup", () => {
  it("should display signup form", () => {
    cy.visit("/investor/signup")

    cy.contains("Create Account").should("be.visible")
    cy.get('input[name="firstName"]').should("be.visible")
    cy.get('input[name="lastName"]').should("be.visible")
    cy.get('input[name="email"]').should("be.visible")
    cy.get('input[name="password"]').should("be.visible")
    cy.get('input[name="confirmPassword"]').should("be.visible")
    cy.get('input[name="countryOfResidence"]').should("be.visible")
    cy.get('input[name="dateOfBirth"]').should("be.visible")
    cy.get('input[name="referrerCode"]').should("be.visible")
  })

  it("should validate required fields", () => {
    cy.visit("/investor/signup")

    cy.get('button[type="submit"]').click()

    cy.get('input[name="firstName"]:invalid').should("exist")
    cy.get('input[name="email"]:invalid').should("exist")
  })

  it("should validate password confirmation", () => {
    cy.visit("/investor/signup")

    cy.get('input[name="firstName"]').type("John")
    cy.get('input[name="lastName"]').type("Doe")
    cy.get('input[name="email"]').type("john@test.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password456")
    cy.get('input[name="countryOfResidence"]').type("USA")
    cy.get('input[name="dateOfBirth"]').type("1990-01-01")
    cy.get('select[name="gender"]').select("male")

    cy.get('button[type="submit"]').click()
    cy.contains("Passwords don't match").should("be.visible")
  })

  it("should submit valid signup form", () => {
    cy.intercept("POST", "/auth/signup", {
      statusCode: 200,
      body: "verification-token-123",
    }).as("investorSignup")

    cy.visit("/investor/signup")

    cy.get('input[name="firstName"]').type("John")
    cy.get('input[name="lastName"]').type("Doe")
    cy.get('input[name="email"]').type("john@test.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password123")
    cy.get('input[name="countryOfResidence"]').type("USA")
    cy.get('input[name="dateOfBirth"]').type("1990-01-01")
    cy.get('select[name="gender"]').select("male")
    cy.get('input[name="referrerCode"]').type("12345")

    cy.get('button[type="submit"]').click()
    cy.wait("@investorSignup")

    cy.url().should("include", "/auth/verify-email/verification-token-123")
  })
})
