describe("Admin Managers Management", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("authToken", "mock-admin-token")
    })

    cy.intercept("GET", "/auth/me", {
      statusCode: 200,
      body: {
        id: 1,
        email: "admin@test.com",
        role: "ADMIN",
        admin: { id: 1, username: "testadmin" },
      },
    }).as("getMe")

    cy.intercept("GET", "/managers", {
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
  })

  it("should display managers list", () => {
    cy.visit("/admin/managers")
    cy.wait("@getMe")
    cy.wait("@getManagers")

    cy.contains("Investment Managers").should("be.visible")
    cy.contains("Jane Smith").should("be.visible")
    cy.contains("Add New Manager").should("be.visible")
  })

  it("should open manager creation form", () => {
    cy.visit("/admin/managers")
    cy.wait("@getMe")
    cy.wait("@getManagers")

    cy.get('button[name="addNewManager"]').click()
    cy.get('[data-testid="manager-form"]').should("be.visible")
  })

  it("should allow editing a manager", () => {
    cy.visit("/admin/managers")
    cy.wait("@getMe")
    cy.wait("@getManagers")

    cy.contains("Edit").click()
    cy.get('[data-testid="manager-form"]').should("be.visible")
  })

  it("should allow deleting a manager", () => {
    cy.intercept("DELETE", "/managers/1", {
      statusCode: 200,
      body: { success: true },
    }).as("deleteManager")

    cy.visit("/admin/managers")
    cy.wait("@getMe")
    cy.wait("@getManagers")

    cy.contains("Delete").click()
    cy.get('[data-testid="delete-modal"]').should("be.visible")
    cy.contains("Confirm Delete").click()

    cy.wait("@deleteManager")
  })
})
