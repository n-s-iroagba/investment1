describe("Admin Investors Management", () => {
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

  describe("Investors List", () => {
    it("should display investors list page", () => {
      cy.visit("/admin/investors")
      cy.wait("@getMe")

      cy.contains("No investors").should("be.visible")
    })

    it("should handle empty investors list", () => {
      cy.visit("/admin/investors")
      cy.contains("No investors").should("be.visible")
    })
  })

  describe("Investor Detail", () => {
    beforeEach(() => {
      cy.intercept("GET", "/investments/1", {
        statusCode: 200,
        body: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          countryOfResidence: "USA",
          user: { email: "john@test.com" },
          kyc: {
            id: 1,
            type: "passport",
            image: "test.jpg",
            isVerified: false,
          },
          managedPortfolios: [],
          verificationFees: [],
        },
      }).as("getInvestor")
    })

    it("should display investor details", () => {
      cy.visit("/admin/investors/1")
      cy.wait("@getMe")
      cy.wait("@getInvestor")

      cy.contains("John Doe").should("be.visible")
      cy.contains("john@test.com").should("be.visible")
      cy.contains("Country of Residence : USA").should("be.visible")
    })

    it("should allow sending email to investor", () => {
      cy.intercept("POST", "/email/send", {
        statusCode: 200,
        body: { success: true },
      }).as("sendEmail")

      cy.visit("/admin/investors/1")
      cy.wait("@getMe")
      cy.wait("@getInvestor")

      cy.contains("Send Mail").click()
      cy.get('[data-testid="email-modal"]').should("be.visible")

      cy.get('input[name="subject"]').type("Test Subject")
      cy.get('textarea[name="message"]').type("Test message")
      cy.get('button[type="submit"]').click()

      cy.wait("@sendEmail")
      cy.contains("Email sent successfully").should("be.visible")
    })

    it("should allow viewing KYC documents", () => {
      cy.visit("/admin/investors/1")
      cy.wait("@getMe")
      cy.wait("@getInvestor")

      cy.contains("View Document").click()
      cy.get('[data-testid="document-modal"]').should("be.visible")
    })

    it("should allow verifying KYC", () => {
      cy.intercept("GET", "/kyc/verify/1", {
        statusCode: 200,
        body: { success: true },
      }).as("verifyKyc")

      cy.visit("/admin/investors/1")
      cy.wait("@getMe")
      cy.wait("@getInvestor")

      cy.contains("Verify Kyc").click()
      cy.wait("@verifyKyc")
    })

    it("should handle investor not found", () => {
      cy.intercept("GET", "/investments/999", {
        statusCode: 404,
        body: { message: "Investor not found" },
      })

      cy.visit("/admin/investors/999")
      cy.wait("@getMe")

      cy.contains("Investor not found").should("be.visible")
      cy.contains("Back to Investors").should("be.visible")
    })
  })
})
