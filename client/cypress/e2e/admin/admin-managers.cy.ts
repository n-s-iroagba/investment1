describe("Admin Managers Management", () => {
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
        admin: { id: 1, username: "testadmin" },
      },
    }).as("getMe")
  })

  it("should display empty state when no managers", () => {
    cy.intercept("GET", "**/managers", { statusCode: 200, body: [] }).as("getManagers")

    cy.visit("/admin/managers")
    cy.wait("@getMe")
    cy.wait("@getManagers")

    cy.contains("No Managers Yet").should("be.visible")
  })

  it("should display managers list", () => {
    cy.intercept("GET", "**/managers", {
      statusCode: 200,
      body: [
        {
          id: 1,
          firstName: "Jane",
          lastName: "Smith",
          minimumInvestmentAmount: 1000,
          percentageYield: 8.5,
          duration: 12,
          qualification: "CFA",
        },
      ],
    }).as("getManagers")

    cy.visit("/admin/managers")
    cy.wait("@getMe")
    cy.wait("@getManagers")

    cy.contains("Jane Smith").should("be.visible")
    cy.contains("Add New Manager").should("be.visible")
  })

  it("should open manager creation form", () => {
    cy.intercept("GET", "**/managers", { statusCode: 200, body: [] }).as("getManagers")

    cy.visit("/admin/managers")
    cy.wait("@getMe")
    cy.wait("@getManagers")

    cy.contains("Add New Manager").click()
    cy.contains("Create Manager").should("be.visible")
  })
})
