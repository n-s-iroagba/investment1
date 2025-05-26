describe("Investor Dashboard", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("authToken", "mock-investor-token")
    })

    cy.intercept("GET", "/auth/me", {
      statusCode: 200,
      body: {
        id: 1,
        email: "investor@test.com",
        role: "INVESTOR",
        investor: { id: 1, firstName: "John" },
      },
    }).as("getMe")
  })

  it("should display investor dashboard with welcome message", () => {
    cy.visit("/investor/dashboard")
    cy.wait("@getMe")

    cy.contains("Welcome back, John").should("be.visible")
    cy.contains("Your green investment journey").should("be.visible")
  })

  it("should display portfolio metrics", () => {
    cy.visit("/investor/dashboard")
    cy.wait("@getMe")

    cy.contains("Total Value").should("be.visible")
    cy.contains("Daily Returns").should("be.visible")
    cy.contains("Yield Rate").should("be.visible")
    cy.contains("Managed By").should("be.visible")
  })

  it("should display portfolio growth chart", () => {
    cy.visit("/investor/dashboard")
    cy.wait("@getMe")

    cy.contains("Portfolio Growth").should("be.visible")
    cy.get(".apexcharts-canvas").should("be.visible")
  })

  it("should allow uploading payment proof", () => {
    cy.visit("/investor/dashboard")
    cy.wait("@getMe")

    cy.contains("Upload Payment Proof").click()
    cy.get('[data-testid="upload-modal"]').should("be.visible")
  })

  it("should redirect non-investor users", () => {
    cy.intercept("GET", "/auth/me", {
      statusCode: 200,
      body: {
        id: 1,
        email: "admin@test.com",
        role: "ADMIN",
        admin: { id: 1, username: "testadmin" },
      },
    })

    cy.visit("/investor/dashboard")
    cy.url().should("include", "/login")
  })
})
