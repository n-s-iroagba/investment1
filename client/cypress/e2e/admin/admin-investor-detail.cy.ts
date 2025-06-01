describe("Admin Investor Detail", () => {
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

  it("should display investor details", () => {
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
        managedPortfolio: {
          id: 1,
          amount: 5000,
          amountDeposited: 3000,
          earnings: 150,
          payments: [],
        },
        verificationFees: [],
      },
    }).as("getInvestor")

    cy.visit("/admin/investors/1")
    cy.wait("@getMe")
    cy.wait("@getInvestor")

    cy.contains("John Doe").should("be.visible")
    cy.contains("nnamdisolomon1@gmail.com").should("be.visible")
    cy.contains("Country of Residence : USA").should("be.visible")
  })

  it("should display KYC information", () => {
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
        managedPortfolio: null,
        verificationFees: [],
      },
    }).as("getInvestor")

    cy.visit("/admin/investors/1")
    cy.wait("@getMe")
    cy.wait("@getInvestor")

    cy.contains("KYC").should("be.visible")
    cy.contains("not yet verified").should("be.visible")
    cy.contains("Kyc Type: passport").should("be.visible")
    cy.contains("View Document").should("be.visible")
    cy.contains("Verify Kyc").should("be.visible")
  })

  it("should verify KYC", () => {
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
        managedPortfolio: null,
        verificationFees: [],
      },
    }).as("getInvestor")

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

  it("should display managed portfolio", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        countryOfResidence: "USA",
        user: { email: "john@test.com" },
        kyc: null,
        managedPortfolio: {
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
            },
          ],
        },
        verificationFees: [],
      },
    }).as("getInvestor")

    cy.visit("/admin/investors/1")
    cy.wait("@getMe")
    cy.wait("@getInvestor")

    cy.contains("Managed Portfolios").should("be.visible")
    cy.contains("Intended Amount").should("be.visible")
    cy.contains("$5000").should("be.visible")
    cy.contains("Amount Deposited").should("be.visible")
    cy.contains("$3000").should("be.visible")
    cy.contains("Earnings").should("be.visible")
    cy.contains("$150").should("be.visible")
    cy.contains("Credit Earnings").should("be.visible")
    cy.contains("Credit Amount").should("be.visible")
  })

  it("should open credit earnings modal", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        countryOfResidence: "USA",
        user: { email: "john@test.com" },
        kyc: null,
        managedPortfolio: {
          id: 1,
          amount: 5000,
          amountDeposited: 3000,
          earnings: 150,
          payments: [],
        },
        verificationFees: [],
      },
    }).as("getInvestor")

    cy.visit("/admin/investors/1")
    cy.wait("@getMe")
    cy.wait("@getInvestor")

    cy.contains("Credit Earnings").click()
    cy.get(".fixed").should("be.visible")
  })

  it("should display verification fees", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        countryOfResidence: "USA",
        user: { email: "john@test.com" },
        kyc: null,
        managedPortfolio: null,
        verificationFees: [
          {
            id: 1,
            name: "KYC Fee",
            amount: 50,
            isPaid: false,
            payments: [],
          },
        ],
      },
    }).as("getInvestor")

    cy.visit("/admin/investors/1")
    cy.wait("@getMe")
    cy.wait("@getInvestor")

    cy.contains("Verification Fees").should("be.visible")
    cy.contains("Create Fee").should("be.visible")
    cy.contains("KYC Fee").should("be.visible")
    cy.contains("$50").should("be.visible")
    cy.contains("Unpaid").should("be.visible")
  })

  it("should open create verification fee modal", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        countryOfResidence: "USA",
        user: { email: "john@test.com" },
        kyc: null,
        managedPortfolio: null,
        verificationFees: [],
      },
    }).as("getInvestor")

    cy.visit("/admin/investors/1")
    cy.wait("@getMe")
    cy.wait("@getInvestor")

    cy.contains("Create Fee").click()
    cy.get(".fixed").should("be.visible")
  })

  it("should open send email modal", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        countryOfResidence: "USA",
        user: { email: "john@test.com" },
        kyc: null,
        managedPortfolio: null,
        verificationFees: [],
      },
    }).as("getInvestor")

    cy.visit("/admin/investors/1")
    cy.wait("@getMe")
    cy.wait("@getInvestor")

    cy.contains("Send Mail").click()
    cy.get(".fixed").should("be.visible")
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

  it("should navigate back to investors list", () => {
    cy.intercept("GET", "/investments/1", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        countryOfResidence: "USA",
        user: { email: "john@test.com" },
        kyc: null,
        managedPortfolio: null,
        verificationFees: [],
      },
    }).as("getInvestor")

    cy.visit("/admin/investors/1")
    cy.wait("@getMe")
    cy.wait("@getInvestor")

    cy.contains("Back to Investors").click()
    cy.url().should("include", "/admin/investors")
  })

  it("should display loading state", () => {
    cy.intercept("GET", "/investments/1", { delay: 1000, statusCode: 200, body: {} })

    cy.visit("/admin/investors/1")
    cy.wait("@getMe")

    cy.get(".animate-spin").should("be.visible")
  })
})
