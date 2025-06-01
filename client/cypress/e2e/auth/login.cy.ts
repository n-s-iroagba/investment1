describe("Login", () => {
  it("should display login form", () => {
    cy.visit("/login")

    cy.contains("Sign In").should("be.visible")
    cy.get('input[type="email"]').should("be.visible")
    cy.get('input[type="password"]').should("be.visible")
  })

  it.only("should login investor successfully", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        token: "investor-token",
        user: {
          role: "INVESTOR",
          investor: { id: 1, firstName: "John" },
        },
      },
    }).as("loginInvestor")

    cy.visit("/login")

    cy.get('input[type="email"]').type("nnamdisolomon1@gmail.com")
    cy.get('input[type="password"]').type("97chocho")
    cy.get('button[type="submit"]').click()

    cy.wait("@loginInvestor")
    cy.url().should("include", "/investor/dashboard")
  })

  it("should login admin successfully", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        token: "admin-token",
        user: {
          role: "ADMIN",
          admin: { id: 1, username: "admin" },
        },
      },
    }).as("loginAdmin")

    cy.visit("/login")

    cy.get('input[type="email"]').type("nnamdisolomon1@gmail.com")
    cy.get('input[type="password"]').type("97chocho")
    cy.get('button[type="submit"]').click()

    cy.wait("@loginAdmin")
    cy.url().should("include", "/admin/dashboard")
  })

  it("should handle invalid credentials", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: { message: "Invalid credentials" },
    }).as("loginError")

    cy.visit("/login")

    cy.get('input[type="email"]').type("wrong@test.com")
    cy.get('input[type="password"]').type("wrongpassword")
    cy.get('button[type="submit"]').click()

    cy.wait("@loginError")
    cy.contains("Invalid credentials").should("be.visible")
  })
})
