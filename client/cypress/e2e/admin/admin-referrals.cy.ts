describe("Admin Referrals Management", () => {
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

  it("should display empty referrals state", () => {
    cy.intercept("GET", "**/referrals/unpaid", { statusCode: 200, body: [] }).as("getUnpaidReferrals")

    cy.visit("/admin/referrals")
    cy.wait("@getUnpaidReferrals")

    cy.contains("No Unpaid Referrals").should("be.visible")
  })

  it("should display unpaid referrals", () => {
    cy.intercept("GET", "**/referrals/unpaid", {
      statusCode: 200,
      body: [
        {
          id: 1,
          amount: 50,
          referrer: { firstName: "John", lastName: "Doe" },
          referred: { firstName: "Jane", lastName: "Smith" },
        },
      ],
    }).as("getUnpaidReferrals")

    cy.visit("/admin/referrals")
    cy.wait("@getUnpaidReferrals")

    cy.contains("John Doe").should("be.visible")
    cy.contains("Jane Smith").should("be.visible")
    cy.contains("$50").should("be.visible")
  })
})
