describe("Investor Referrals", () => {
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

  it("should display empty referrals state", () => {
    cy.intercept("GET", "/investors/1/referrals", {
      statusCode: 200,
      body: [],
    }).as("getReferrals")

    cy.visit("/investor/referrals")
    cy.wait("@getMe")
    cy.wait("@getReferrals")

    cy.contains("My Referrals").should("be.visible")
    cy.contains("No referrals yet").should("be.visible")
  })

  it("should display referrals with stats", () => {
    cy.intercept("GET", "/investors/1/referrals", {
      statusCode: 200,
      body: [
        {
          id: 1,
          amount: 50,
          settled: true,
          createdAt: "2025-01-01",
          referred: {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@test.com",
          },
        },
        {
          id: 2,
          amount: 25,
          settled: false,
          createdAt: "2025-01-15",
          referred: {
            firstName: "Bob",
            lastName: "Johnson",
            email: "bob@test.com",
          },
        },
      ],
    }).as("getReferrals")

    cy.visit("/investor/referrals")
    cy.wait("@getMe")
    cy.wait("@getReferrals")

    cy.contains("Total Referrals").should("be.visible")
    cy.contains("2").should("be.visible")
    cy.contains("Total Earned").should("be.visible")
    cy.contains("$50.00").should("be.visible")
    cy.contains("Pending").should("be.visible")
    cy.contains("$25.00").should("be.visible")
  })

  it("should filter referrals by status", () => {
    cy.intercept("GET", "/investors/1/referrals", {
      statusCode: 200,
      body: [
        {
          id: 1,
          amount: 50,
          settled: true,
          createdAt: "2025-01-01",
          referred: { firstName: "Jane", lastName: "Smith", email: "jane@test.com" },
        },
        {
          id: 2,
          amount: 25,
          settled: false,
          createdAt: "2025-01-15",
          referred: { firstName: "Bob", lastName: "Johnson", email: "bob@test.com" },
        },
      ],
    }).as("getAllReferrals")

    cy.intercept("GET", "/investors/1/referrals/settled", {
      statusCode: 200,
      body: [
        {
          id: 1,
          amount: 50,
          settled: true,
          createdAt: "2025-01-01",
          referred: { firstName: "Jane", lastName: "Smith", email: "jane@test.com" },
        },
      ],
    }).as("getSettledReferrals")

    cy.visit("/investor/referrals")
    cy.wait("@getMe")
    cy.wait("@getAllReferrals")

    cy.contains("Settled (1)").click()
    cy.wait("@getSettledReferrals")

    cy.contains("Jane Smith").should("be.visible")
    cy.contains("Bob Johnson").should("not.exist")
  })
})
