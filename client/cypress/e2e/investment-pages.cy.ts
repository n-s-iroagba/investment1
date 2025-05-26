describe("Investment Pages", () => {
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

  describe("New Investment", () => {
    beforeEach(() => {
      cy.intercept("GET", "/managers/1", {
        statusCode: 200,
        body: {
          id: 1,
          firstName: "Jane",
          lastName: "Smith",
          minimumInvestmentAmount: 1000,
          percentageYield: 8.5,
        },
      }).as("getManager")

      cy.intercept("GET", "/admin-wallets", {
        statusCode: 200,
        body: [
          { id: 1, currency: "BTC", address: "bc1qtest123" },
          { id: 2, currency: "ETH", address: "0xtest123" },
        ],
      }).as("getWallets")
    })

    it("should display new investment form", () => {
      cy.visit("/investment/new/1")
      cy.wait("@getMe")
      cy.wait("@getManager")
      cy.wait("@getWallets")

      cy.contains("Create Managed Portfolio").should("be.visible")
      cy.contains("Jane Smith").should("be.visible")
      cy.get('input[type="number"]').should("be.visible")
    })

    it("should validate minimum investment amount", () => {
      cy.visit("/investment/new/1")
      cy.wait("@getMe")
      cy.wait("@getManager")
      cy.wait("@getWallets")

      cy.get('input[type="number"]').type("500")
      cy.contains("Minimum amount must be at least 1000 USD").should("be.visible")
    })

    it("should show crypto fields when crypto is selected", () => {
      cy.visit("/investment/new/1")
      cy.wait("@getMe")
      cy.wait("@getManager")
      cy.wait("@getWallets")

      cy.get("select").first().select("CRYPTO")
      cy.contains("Select Currency").should("be.visible")
      cy.contains("Wallet Address").should("be.visible")
    })

    it("should submit investment form", () => {
      cy.intercept("POST", "/investments/new/1", {
        statusCode: 200,
        body: { investmentId: 123 },
      }).as("createInvestment")

      cy.visit("/investment/new/1")
      cy.wait("@getMe")
      cy.wait("@getManager")
      cy.wait("@getWallets")

      cy.get('input[type="number"]').type("5000")
      cy.get("select").first().select("FIAT")
      cy.get('button[type="submit"]').click()

      cy.wait("@createInvestment")
      cy.url().should("include", "/investment/123")
    })
  })
})
