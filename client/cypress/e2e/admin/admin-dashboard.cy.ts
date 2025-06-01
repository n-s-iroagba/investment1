describe("Admin Dashboard", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("authToken", "mock-admin-token")
    })

    cy.intercept("GET", "**/auth/me", {
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

    cy.intercept("GET", "**/admin-wallets", { statusCode: 200, body: [] }).as("getWallets")
    cy.intercept("GET", "**/managers", { statusCode: 200, body: [] }).as("getManagers")
    cy.intercept("GET", "**/kyc/unverified", { statusCode: 200, body: [] }).as("getUnverifiedKyc")
    cy.intercept("GET", "**/payments/unverified", { statusCode: 200, body: [] }).as("getUnverifiedPayments")
    cy.intercept("GET", "**/social-media", { statusCode: 200, body: [] }).as("getSocialMedia")
  })

  it("should display admin dashboard", () => {
    cy.visit("/admin/dashboard")
    cy.wait("@getMe")

    cy.contains("Welcome back").should("be.visible")
    cy.contains("Admin Tasks").should("be.visible")
  })

  it("should display todo alerts when resources are missing", () => {
    cy.visit("/admin/dashboard")
    cy.wait("@getMe")

    cy.contains("You do not have any managers").should("be.visible")
    cy.contains("You do not have any wallets").should("be.visible")
    cy.contains("You do not have any social media links").should("be.visible")
  })

  it("should redirect unauthenticated users", () => {
    cy.window().then((win) => {
      win.localStorage.removeItem("authToken")
    })

    cy.intercept("GET", "**/auth/me", { statusCode: 401 })
    cy.visit("/admin/dashboard")
    cy.url().should("include", "/login")
  })
})
