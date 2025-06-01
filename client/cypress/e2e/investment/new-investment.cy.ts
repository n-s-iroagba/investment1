describe("New Investment", () => {
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

    cy.intercept("GET", "/managers/1", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "Jane",
        lastName: "Smith",
        minimumInvestmentAmount: 1000,
        percentageYield: 8.5,
        duration: 12,
        qualification: "CFA",
        image: "/test-image.jpg",
      },
    }).as("getManager")

    cy.intercept("GET", "/admin-wallets", {
      statusCode: 200,
      body: [
        { id: 1, currency: "BTC", address: "bc1qtest123", network: "Bitcoin" },
        { id: 2, currency: "ETH", address: "0xtest123", network: "Ethereum" },
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
    cy.get("select").should("be.visible")
  })

  it("should display manager information", () => {
    cy.visit("/investment/new/1")
    cy.wait("@getMe")
    cy.wait("@getManager")
    cy.wait("@getWallets")

    cy.contains("Jane Smith").should("be.visible")
    cy.contains("8.5%").should("be.visible")
    cy.contains("12 months").should("be.visible")
    cy.contains("CFA").should("be.visible")
    cy.contains("Minimum: $1,000").should("be.visible")
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

  it("should display available crypto wallets", () => {
    cy.visit("/investment/new/1")
    cy.wait("@getMe")
    cy.wait("@getManager")
    cy.wait("@getWallets")

    cy.get("select").first().select("CRYPTO")
    cy.get("select").eq(1).select("BTC")
    cy.contains("bc1qtest123").should("be.visible")
  })

  it("should submit investment form with fiat", () => {
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

  it("should submit investment form with crypto", () => {
    cy.intercept("POST", "/investments/new/1", {
      statusCode: 200,
      body: { investmentId: 123 },
    }).as("createInvestment")

    cy.visit("/investment/new/1")
    cy.wait("@getMe")
    cy.wait("@getManager")
    cy.wait("@getWallets")

    cy.get('input[type="number"]').type("5000")
    cy.get("select").first().select("CRYPTO")
    cy.get("select").eq(1).select("BTC")
    cy.get('button[type="submit"]').click()

    cy.wait("@createInvestment")
    cy.url().should("include", "/investment/123")
  })

  it("should validate form submission", () => {
    cy.visit("/investment/new/1")
    cy.wait("@getMe")
    cy.wait("@getManager")
    cy.wait("@getWallets")

    cy.get('button[type="submit"]').click()
    cy.get('input[type="number"]:invalid').should("exist")
  })

  it("should handle manager not found", () => {
    cy.intercept("GET", "/managers/999", {
      statusCode: 404,
      body: { message: "Manager not found" },
    })

    cy.visit("/investment/new/999")
    cy.wait("@getMe")

    cy.contains("Manager not found").should("be.visible")
  })

  it("should handle investment creation error", () => {
    cy.intercept("POST", "/investments/new/1", {
      statusCode: 400,
      body: { message: "Invalid investment data" },
    }).as("createInvestmentError")

    cy.visit("/investment/new/1")
    cy.wait("@getMe")
    cy.wait("@getManager")
    cy.wait("@getWallets")

    cy.get('input[type="number"]').type("5000")
    cy.get("select").first().select("FIAT")
    cy.get('button[type="submit"]').click()

    cy.wait("@createInvestmentError")
    cy.contains("Error creating investment").should("be.visible")
  })

  it("should navigate back to manager list", () => {
    cy.visit("/investment/new/1")
    cy.wait("@getMe")
    cy.wait("@getManager")
    cy.wait("@getWallets")

    cy.contains("Back to Managers").click()
    cy.url().should("include", "/investor/manager-list")
  })

  it("should display loading state", () => {
    cy.intercept("GET", "/managers/1", { delay: 1000, statusCode: 200, body: {} })

    cy.visit("/investment/new/1")
    cy.wait("@getMe")

    cy.get(".animate-spin").should("be.visible")
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

    cy.visit("/investment/new/1")
    cy.url().should("include", "/login")
  })

  it("should be responsive on mobile", () => {
    cy.viewport(375, 667)
    cy.visit("/investment/new/1")
    cy.wait("@getMe")
    cy.wait("@getManager")
    cy.wait("@getWallets")

    cy.contains("Create Managed Portfolio").should("be.visible")
    cy.contains("Jane Smith").should("be.visible")
  })

  it("should calculate expected returns", () => {
    cy.visit("/investment/new/1")
    cy.wait("@getMe")
    cy.wait("@getManager")
    cy.wait("@getWallets")

    cy.get('input[type="number"]').type("10000")
    cy.contains("Expected Returns").should("be.visible")
    cy.contains("$850").should("be.visible") // 8.5% of 10000
  })
})
