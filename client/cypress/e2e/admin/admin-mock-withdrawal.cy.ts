describe("Admin Mock Withdrawal", () => {
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

  it("should display withdrawal form", () => {
    cy.visit("/admin/mock-withdrawal")

    cy.contains("Withdraw Funds").should("be.visible")
    cy.get('input[type="text"]').should("be.visible")
    cy.get('input[type="number"]').should("be.visible")
    cy.contains("Process Withdrawal").should("be.visible")
  })

  it("should submit valid withdrawal", () => {
    cy.visit("/admin/mock-withdrawal")

    cy.get('input[type="text"]').type("John Doe")
    cy.get('input[type="number"]').type("500")
    cy.contains("Process Withdrawal").click()

    cy.contains("Withdrawal Successful!").should("be.visible")
  })
})
