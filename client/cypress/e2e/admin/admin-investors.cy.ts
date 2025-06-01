describe("Admin Investors List", () => {
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

  it("should display empty state when no investors", () => {
    cy.intercept("GET", "**/investors", { statusCode: 200, body: [] }).as("getInvestors")

    cy.visit("/admin/investors")
    cy.wait("@getMe")
    cy.wait("@getInvestors")

    cy.contains("No Investors Yet").should("be.visible")
  })

  it("should display investors list", () => {
    cy.intercept("GET", "**/investors", {
      statusCode: 200,
      body: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          countryOfResidence: "USA",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ],
    }).as("getInvestors")

    cy.visit("/admin/investors")
    cy.wait("@getMe")
    cy.wait("@getInvestors")

    cy.contains("John Doe").should("be.visible")
    cy.contains("USA").should("be.visible")
  })

  it("should navigate to investor detail", () => {
    cy.intercept("GET", "**/investors", {
      statusCode: 200,
      body: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          countryOfResidence: "USA",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ],
    }).as("getInvestors")

    cy.visit("/admin/investors")
    cy.wait("@getMe")
    cy.wait("@getInvestors")

    cy.contains("View Details").click()
    cy.url().should("include", "/admin/investors/1")
  })
})
