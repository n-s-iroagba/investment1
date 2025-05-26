describe("Mock Withdrawal", () => {
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

  it("should display withdrawal form", () => {
    cy.visit("/admin/mock-withdrawal")
    cy.wait("@getMe")

    cy.contains("Withdraw Funds").should("be.visible")
    cy.contains("Secure & Fast Withdrawals").should("be.visible")
    cy.get('input[type="text"]').should("be.visible") // Account name
    cy.get('input[type="number"]').should("be.visible") // Amount
  })

  it("should validate required fields", () => {
    cy.visit("/admin/mock-withdrawal")
    cy.wait("@getMe")

    cy.get('button[type="submit"]').click()
    cy.contains("Please fill all fields").should("be.visible")
  })

  it("should validate amount is numeric", () => {
    cy.visit("/admin/mock-withdrawal")
    cy.wait("@getMe")

    cy.get('input[type="text"]').type("John Doe")
    cy.get('input[type="number"]').type("invalid")
    cy.get('button[type="submit"]').click()

    cy.contains("Invalid amount").should("be.visible")
  })

  it("should submit withdrawal successfully", () => {
    cy.visit("/admin/mock-withdrawal")
    cy.wait("@getMe")

    cy.get('input[type="text"]').type("John Doe")
    cy.get('input[type="number"]').type("1000")
    cy.get('button[type="submit"]').click()

    cy.contains("Withdrawal Successful!").should("be.visible")
    cy.contains("John Doe, your withdrawal of $1000").should("be.visible")
  })

  it("should allow closing success modal", () => {
    cy.visit("/admin/mock-withdrawal")
    cy.wait("@getMe")

    cy.get('input[type="text"]').type("John Doe")
    cy.get('input[type="number"]').type("1000")
    cy.get('button[type="submit"]').click()

    cy.contains("Close").click()
    cy.contains("Withdrawal Successful!").should("not.exist")

    // Form should be reset
    cy.get('input[type="text"]').should("have.value", "")
    cy.get('input[type="number"]').should("have.value", "")
  })
})
