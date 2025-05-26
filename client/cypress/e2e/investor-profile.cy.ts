describe("Investor Profile", () => {
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

    cy.intercept("GET", "/investors/me", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        gender: "male",
        countryOfResidence: "USA",
        user: { email: "john@test.com" },
        kyc: null,
      },
    }).as("getProfile")
  })

  it("should display profile information", () => {
    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.contains("My Profile").should("be.visible")
    cy.contains("John Doe").should("be.visible")
    cy.contains("john@test.com").should("be.visible")
  })

  it("should allow editing profile", () => {
    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.get('[data-testid="edit-profile"]').click()
    cy.get('input[name="firstName"]').should("not.be.disabled")
    cy.get('input[name="lastName"]').should("not.be.disabled")
  })

  it("should save profile changes", () => {
    cy.intercept("PATCH", "/investors/me", {
      statusCode: 200,
      body: {
        id: 1,
        firstName: "Johnny",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        gender: "male",
        countryOfResidence: "USA",
        user: { email: "john@test.com" },
      },
    }).as("updateProfile")

    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.get('[data-testid="edit-profile"]').click()
    cy.get('input[name="firstName"]').clear().type("Johnny")
    cy.contains("Save Changes").click()

    cy.wait("@updateProfile")
    cy.contains("Johnny Doe").should("be.visible")
  })

  it("should display KYC verification section", () => {
    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.contains("KYC Verification").should("be.visible")
    cy.contains("Verification Required").should("be.visible")
  })
})
