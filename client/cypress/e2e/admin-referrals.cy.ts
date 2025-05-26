describe("Admin Referrals Management", () => {
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
  })

  it("should display empty referrals state", () => {
    cy.intercept("GET", "/referrals/unpaid", {
      statusCode: 200,
      body: [],
    }).as("getUnpaidReferrals")

    cy.visit("/admin/referrals")
    cy.wait("@getMe")
    cy.wait("@getUnpaidReferrals")

    cy.contains("No Unpaid Referrals").should("be.visible")
    cy.contains("All referrals have been settled").should("be.visible")
  })

  it("should display unpaid referrals", () => {
    cy.intercept("GET", "/referrals/unpaid", {
      statusCode: 200,
      body: [
        {
          id: 1,
          amount: 50,
          createdAt: "2025-01-01",
          referrer: {
            firstName: "John",
            lastName: "Doe",
            email: "john@test.com",
          },
          referred: {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@test.com",
          },
        },
      ],
    }).as("getUnpaidReferrals")

    cy.visit("/admin/referrals")
    cy.wait("@getMe")
    cy.wait("@getUnpaidReferrals")

    cy.contains("Unpaid Referrals").should("be.visible")
    cy.contains("1 unpaid").should("be.visible")
    cy.contains("John Doe").should("be.visible")
    cy.contains("Jane Smith").should("be.visible")
    cy.contains("$50.00").should("be.visible")
  })

  it("should allow settling a referral", () => {
    cy.intercept("GET", "/referrals/unpaid", {
      statusCode: 200,
      body: [
        {
          id: 1,
          amount: 50,
          createdAt: "2025-01-01",
          referrer: { firstName: "John", lastName: "Doe", email: "john@test.com" },
          referred: { firstName: "Jane", lastName: "Smith", email: "jane@test.com" },
        },
      ],
    }).as("getUnpaidReferrals")

    cy.intercept("PATCH", "/referrals/1/settle", {
      statusCode: 200,
      body: { success: true },
    }).as("settleReferral")

    cy.visit("/admin/referrals")
    cy.wait("@getMe")
    cy.wait("@getUnpaidReferrals")

    cy.contains("Mark as Paid").click()
    cy.wait("@settleReferral")
  })
})
