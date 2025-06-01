describe("Investor Payments", () => {
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

  it("should display payment details for portfolio", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        amount: 5000,
        amountDeposited: 3000,
        earnings: 150,
        payments: [
          {
            id: 1,
            amount: 1000,
            isVerified: true,
            createdAt: "2024-01-01T00:00:00Z",
            receiptUrl: "test-receipt.jpg",
          },
          {
            id: 2,
            amount: 2000,
            isVerified: false,
            createdAt: "2024-01-02T00:00:00Z",
            receiptUrl: "test-receipt2.jpg",
          },
        ],
      },
    }).as("getPortfolio")

    cy.intercept("GET", "/admin-wallets", {
      statusCode: 200,
      body: [
        { id: 1, currency: "BTC", address: "bc1qtest123", network: "Bitcoin" },
        { id: 2, currency: "ETH", address: "0xtest123", network: "Ethereum" },
      ],
    }).as("getWallets")

    cy.intercept("GET", "/social-media", {
      statusCode: 200,
      body: [{ id: 1, platform: "Twitter", url: "https://twitter.com/test", isActive: true }],
    }).as("getSocialMedia")

    cy.visit("/investor/payments/1")
    cy.wait("@getMe")
    cy.wait("@getPortfolio")
    cy.wait("@getWallets")
    cy.wait("@getSocialMedia")

    cy.contains("Payment Instructions").should("be.visible")
    cy.contains("BTC").should("be.visible")
    cy.contains("ETH").should("be.visible")
    cy.contains("bc1qtest123").should("be.visible")
    cy.contains("0xtest123").should("be.visible")
  })

  it("should display payment list", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        amount: 5000,
        amountDeposited: 3000,
        earnings: 150,
        payments: [
          {
            id: 1,
            amount: 1000,
            isVerified: true,
            createdAt: "2024-01-01T00:00:00Z",
            receiptUrl: "test-receipt.jpg",
          },
          {
            id: 2,
            amount: 2000,
            isVerified: false,
            createdAt: "2024-01-02T00:00:00Z",
            receiptUrl: "test-receipt2.jpg",
          },
        ],
      },
    }).as("getPortfolio")

    cy.intercept("GET", "/admin-wallets", { statusCode: 200, body: [] })
    cy.intercept("GET", "/social-media", { statusCode: 200, body: [] })

    cy.visit("/investor/payments/1")
    cy.wait("@getMe")
    cy.wait("@getPortfolio")

    cy.contains("Your Payments").should("be.visible")
    cy.contains("$1,000").should("be.visible")
    cy.contains("$2,000").should("be.visible")
    cy.contains("Verified").should("be.visible")
    cy.contains("Pending").should("be.visible")
  })

  it("should allow uploading payment proof", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        amount: 5000,
        amountDeposited: 3000,
        earnings: 150,
        payments: [],
      },
    }).as("getPortfolio")

    cy.intercept("GET", "/admin-wallets", { statusCode: 200, body: [] })
    cy.intercept("GET", "/social-media", { statusCode: 200, body: [] })

    cy.visit("/investor/payments/1")
    cy.wait("@getMe")
    cy.wait("@getPortfolio")

    cy.contains("Upload Payment Proof").click()
    cy.get(".fixed").should("be.visible")
  })

  it("should allow viewing payment receipt", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        amount: 5000,
        amountDeposited: 3000,
        earnings: 150,
        payments: [
          {
            id: 1,
            amount: 1000,
            isVerified: true,
            createdAt: "2024-01-01T00:00:00Z",
            receiptUrl: "test-receipt.jpg",
          },
        ],
      },
    }).as("getPortfolio")

    cy.intercept("GET", "/admin-wallets", { statusCode: 200, body: [] })
    cy.intercept("GET", "/social-media", { statusCode: 200, body: [] })

    cy.visit("/investor/payments/1")
    cy.wait("@getMe")
    cy.wait("@getPortfolio")

    cy.contains("View Receipt").click()
    cy.get(".fixed").should("be.visible")
  })

  it("should display social media links", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        amount: 5000,
        amountDeposited: 3000,
        earnings: 150,
        payments: [],
      },
    }).as("getPortfolio")

    cy.intercept("GET", "/admin-wallets", { statusCode: 200, body: [] })
    cy.intercept("GET", "/social-media", {
      statusCode: 200,
      body: [
        { id: 1, platform: "Twitter", url: "https://twitter.com/test", isActive: true },
        { id: 2, platform: "Facebook", url: "https://facebook.com/test", isActive: true },
      ],
    }).as("getSocialMedia")

    cy.visit("/investor/payments/1")
    cy.wait("@getMe")
    cy.wait("@getPortfolio")
    cy.wait("@getSocialMedia")

    cy.contains("Follow Us").should("be.visible")
    cy.get('a[href="https://twitter.com/test"]').should("be.visible")
    cy.get('a[href="https://facebook.com/test"]').should("be.visible")
  })

  it("should handle empty payments state", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        amount: 5000,
        amountDeposited: 0,
        earnings: 0,
        payments: [],
      },
    }).as("getPortfolio")

    cy.intercept("GET", "/admin-wallets", { statusCode: 200, body: [] })
    cy.intercept("GET", "/social-media", { statusCode: 200, body: [] })

    cy.visit("/investor/payments/1")
    cy.wait("@getMe")
    cy.wait("@getPortfolio")

    cy.contains("No payments yet").should("be.visible")
  })

  it("should handle loading state", () => {
    cy.intercept("GET", "/investments/1", { delay: 1000, statusCode: 200, body: {} })

    cy.visit("/investor/payments/1")
    cy.wait("@getMe")

    cy.get(".animate-spin").should("be.visible")
  })

  it("should handle error state", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 500,
      body: { message: "Server error" },
    })

    cy.visit("/investor/payments/1")
    cy.wait("@getMe")

    cy.contains("Error loading portfolio").should("be.visible")
  })

  it("should handle portfolio not found", () => {
    cy.intercept("GET", "/investments/999", {
      statusCode: 404,
      body: { message: "Portfolio not found" },
    })

    cy.visit("/investor/payments/999")
    cy.wait("@getMe")

    cy.contains("Portfolio not found").should("be.visible")
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

    cy.visit("/investor/payments/1")
    cy.url().should("include", "/login")
  })

  it("should be responsive on mobile", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        amount: 5000,
        amountDeposited: 3000,
        earnings: 150,
        payments: [],
      },
    }).as("getPortfolio")

    cy.intercept("GET", "/admin-wallets", { statusCode: 200, body: [] })
    cy.intercept("GET", "/social-media", { statusCode: 200, body: [] })

    cy.viewport(375, 667)
    cy.visit("/investor/payments/1")
    cy.wait("@getMe")
    cy.wait("@getPortfolio")

    cy.contains("Payment Instructions").should("be.visible")
  })
})
