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
    cy.contains("USA").should("be.visible")
  })

  it("should allow editing profile", () => {
    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.contains("Edit Profile").click()
    cy.get('input[name="firstName"]').should("not.be.disabled")
    cy.get('input[name="lastName"]').should("not.be.disabled")
    cy.get('input[name="countryOfResidence"]').should("not.be.disabled")
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

    cy.contains("Edit Profile").click()
    cy.get('input[name="firstName"]').clear().type("Johnny")
    cy.contains("Save Changes").click()

    cy.wait("@updateProfile")
    cy.contains("Johnny Doe").should("be.visible")
  })

  it("should cancel profile editing", () => {
    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.contains("Edit Profile").click()
    cy.get('input[name="firstName"]').clear().type("Changed")
    cy.contains("Cancel").click()

    cy.contains("John Doe").should("be.visible")
    cy.contains("Changed").should("not.exist")
  })

  it("should display KYC verification section", () => {
    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.contains("KYC Verification").should("be.visible")
    cy.contains("Verification Required").should("be.visible")
    cy.contains("Upload Document").should("be.visible")
  })

  it("should display verified KYC status", () => {
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
        kyc: {
          id: 1,
          type: "passport",
          image: "test.jpg",
          isVerified: true,
        },
      },
    }).as("getProfileWithKyc")

    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfileWithKyc")

    cy.contains("Verified").should("be.visible")
    cy.contains("Your identity has been verified").should("be.visible")
  })

  it("should allow KYC document upload", () => {
    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.contains("Upload Document").click()
    cy.get(".fixed").should("be.visible")
    cy.contains("Upload KYC Document").should("be.visible")
  })

  it("should validate profile form", () => {
    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.contains("Edit Profile").click()
    cy.get('input[name="firstName"]').clear()
    cy.get('input[name="lastName"]').clear()
    cy.contains("Save Changes").click()

    cy.get('input[name="firstName"]:invalid').should("exist")
    cy.get('input[name="lastName"]:invalid').should("exist")
  })

  it("should handle profile update error", () => {
    cy.intercept("PATCH", "/investors/me", {
      statusCode: 400,
      body: { message: "Invalid data" },
    }).as("updateProfileError")

    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.contains("Edit Profile").click()
    cy.get('input[name="firstName"]').clear().type("Updated")
    cy.contains("Save Changes").click()

    cy.wait("@updateProfileError")
    cy.contains("Error updating profile").should("be.visible")
  })

  it("should display loading state", () => {
    cy.intercept("GET", "/investors/me", { delay: 1000, statusCode: 200, body: {} })

    cy.visit("/investor/profile")
    cy.wait("@getMe")

    cy.get(".animate-spin").should("be.visible")
  })

  it("should handle error state", () => {
    cy.intercept("GET", "/investors/me", {
      statusCode: 500,
      body: { message: "Server error" },
    })

    cy.visit("/investor/profile")
    cy.wait("@getMe")

    cy.contains("Error loading profile").should("be.visible")
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

    cy.visit("/investor/profile")
    cy.url().should("include", "/login")
  })

  it("should display date of birth correctly", () => {
    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.contains("Date of Birth").should("be.visible")
    cy.contains("1990-01-01").should("be.visible")
  })

  it("should display gender correctly", () => {
    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.contains("Gender").should("be.visible")
    cy.contains("Male").should("be.visible")
  })

  it("should be responsive on mobile", () => {
    cy.viewport(375, 667)
    cy.visit("/investor/profile")
    cy.wait("@getMe")
    cy.wait("@getProfile")

    cy.contains("My Profile").should("be.visible")
    cy.contains("John Doe").should("be.visible")
  })
})
