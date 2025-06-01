describe("Investor Manager List", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("authToken", "mock-investor-token")
    })

    cy.intercept("GET", "**/auth/me", {
      statusCode: 200,
      body: {
        id: 1,
        email: "investor@test.com",
        role: "INVESTOR",
        investor: { id: 1, firstName: "John" },
      },
    }).as("getMe")
  })

  it("should display list of managers", () => {
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
          qualification: "CFA Charterholder",
        },
      ],
    }).as("getManagers")

    cy.visit("/investor/manager-list")
    cy.wait("@getMe")
    cy.wait("@getManagers")

    cy.contains("Jane Smith").should("be.visible")
    cy.contains("8.5%").should("be.visible")
    cy.contains("CFA Charterholder").should("be.visible")
  })

  it("should navigate to investment creation", () => {
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

    cy.visit("/investor/manager-list")
    cy.wait("@getMe")
    cy.wait("@getManagers")

    cy.contains("Invest Now").click()
    cy.url().should("include", "/investment/new/1")
  })
})
