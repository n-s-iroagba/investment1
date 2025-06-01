describe("Investor Dashboard", () => {
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

  it("should display investor dashboard", () => {
    cy.intercept("GET", "**/investors/me", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        managedPortfolio: null,
      },
    }).as("getInvestorProfile")

    cy.visit("/investor/dashboard")
    cy.wait("@getMe")
    cy.wait("@getInvestorProfile")

    cy.contains("Welcome back, John").should("be.visible")
  })

  it("should display no portfolio state", () => {
    cy.intercept("GET", "**/investors/me", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        managedPortfolio: null,
      },
    }).as("getInvestorProfile")

    cy.visit("/investor/dashboard")
    cy.wait("@getMe")
    cy.wait("@getInvestorProfile")

    cy.contains("No Active Portfolio").should("be.visible")
    cy.contains("Browse Managers").should("be.visible")
  })

  it("should navigate to manager list", () => {
    cy.intercept("GET", "**/investors/me", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        managedPortfolio: null,
      },
    }).as("getInvestorProfile")

    cy.visit("/investor/dashboard")
    cy.wait("@getMe")
    cy.wait("@getInvestorProfile")

    cy.contains("Browse Managers").click()
    cy.url().should("include", "/investor/manager-list")
  })
})
