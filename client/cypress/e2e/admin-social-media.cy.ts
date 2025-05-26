describe("Admin Social Media Management", () => {
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

    cy.intercept("GET", "/social-media", {
      statusCode: 200,
      body: [
        {
          id: 1,
          platform: "Twitter",
          url: "https://twitter.com/test",
          isActive: true,
        },
      ],
    }).as("getSocialMedia")
  })

  it("should display social media accounts", () => {
    cy.visit("/admin/social-media")
    cy.wait("@getMe")
    cy.wait("@getSocialMedia")

    cy.contains("Social Media Accounts").should("be.visible")
    cy.contains("Twitter").should("be.visible")
    cy.contains("Add New").should("be.visible")
  })
})
