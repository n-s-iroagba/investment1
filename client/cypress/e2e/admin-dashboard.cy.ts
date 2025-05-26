describe("Admin Dashboard", () => {
  beforeEach(() => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem("authToken", "mock-admin-token")
    })

    // Mock API responses
    cy.intercept("GET", "/auth/me", {
      statusCode: 200,
      body: {
        id: 1,
        email: "admin@test.com",
        role: "ADMIN",
        admin: {
          id: 1,
          username: "testadmin",
        },
      },
    }).as("getMe")
  })

  it("should display admin dashboard with welcome message", () => {
    cy.visit("/admin/dashboard")
    cy.wait("@getMe")

    cy.contains("Welcome back, testadmin").should("be.visible")
    cy.contains("Admin Dashboard Overview").should("be.visible")
  })

  it("should redirect to login if not authenticated", () => {
    cy.window().then((win) => {
      win.localStorage.removeItem("authToken")
    })

    cy.intercept("GET", "/auth/me", {
      statusCode: 401,
      body: { message: "Unauthorized" },
    })

    cy.visit("/admin/dashboard")
    cy.url().should("include", "/login")
  })

  it("should redirect non-admin users", () => {
    cy.intercept("GET", "/auth/me", {
      statusCode: 200,
      body: {
        id: 1,
        email: "investor@test.com",
        role: "INVESTOR",
        investor: {
          id: 1,
          firstName: "John",
        },
      },
    })

    cy.visit("/admin/dashboard")
    cy.url().should("include", "/login")
  })
})
