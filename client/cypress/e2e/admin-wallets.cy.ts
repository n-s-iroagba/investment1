describe("Admin Wallets Management", () => {
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

    cy.intercept("GET", "/admin-wallets", {
      statusCode: 200,
      body: [
        {
          id: 1,
          currency: "BTC",
          address: "bc1qtest123",
          network: "Bitcoin",
        },
      ],
    }).as("getWallets")
  })

  it("should display wallets list", () => {
    cy.visit("/admin/wallets")
    cy.wait("@getMe")
    cy.wait("@getWallets")

    cy.contains("Admin Wallets").should("be.visible")
    cy.contains("BTC").should("be.visible")
    cy.contains("bc1qtest123").should("be.visible")
    cy.contains("Add New Wallet").should("be.visible")
  })

  it("should open wallet creation form", () => {
    cy.visit("/admin/wallets")
    cy.wait("@getMe")
    cy.wait("@getWallets")

    cy.contains("Add New Wallet").click()
    cy.get('[data-testid="wallet-form"]').should("be.visible")
  })
})
