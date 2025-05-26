describe("Login Page", () => {
  it("should display login form", () => {
    cy.visit("/login")

    cy.contains("Login").should("be.visible")
    cy.get('input[name="email"]').should("be.visible")
    cy.get('input[name="password"]').should("be.visible")
    cy.contains("Forgot password?").should("be.visible")
  })

  it("should validate required fields", () => {
    cy.visit("/login")

    cy.get('button[type="submit"]').click()

    cy.get('input[name="email"]:invalid').should("exist")
    cy.get('input[name="password"]:invalid').should("exist")
  })

  it("should login admin user successfully", () => {
    cy.intercept("POST", "/auth/login", {
      statusCode: 200,
      body: { role: "ADMIN" },
    }).as("login")

    cy.visit("/login")

    cy.get('input[name="email"]').type("admin@test.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('button[type="submit"]').click()

    cy.wait("@login")
    cy.url().should("include", "/admin/dashboard")
  })

  it("should login investor user successfully", () => {
    cy.intercept("POST", "/auth/login", {
      statusCode: 200,
      body: { role: "INVESTOR" },
    }).as("login")

    cy.visit("/login")

    cy.get('input[name="email"]').type("investor@test.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('button[type="submit"]').click()

    cy.wait("@login")
    cy.url().should("include", "/investor/dashboard")
  })

  it("should handle unverified email", () => {
    cy.intercept("POST", "/auth/login", {
      statusCode: 200,
      body: { verificationToken: "token-123" },
    }).as("login")

    cy.visit("/login")

    cy.get('input[name="email"]').type("unverified@test.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('button[type="submit"]').click()

    cy.wait("@login")
    cy.url().should("include", "/auth/verify-email/token-123")
  })

  it("should display error for invalid credentials", () => {
    cy.intercept("POST", "/auth/login", {
      statusCode: 401,
      body: { message: "Invalid credentials" },
    }).as("loginError")

    cy.visit("/login")

    cy.get('input[name="email"]').type("wrong@test.com")
    cy.get('input[name="password"]').type("wrongpassword")
    cy.get('button[type="submit"]').click()

    cy.wait("@loginError")
    cy.contains("Invalid credentials").should("be.visible")
  })
})
