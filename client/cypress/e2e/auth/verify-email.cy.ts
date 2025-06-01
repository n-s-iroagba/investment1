describe("Email Verification", () => {
  it("should display verification form", () => {
    cy.visit("/auth/verify-email/test-token")

    cy.contains("Verify Your Email").should("be.visible")
    cy.get('input[maxlength="1"]').should("have.length", 6)
  })

  it("should submit verification code", () => {
    cy.intercept("POST", "**/auth/verify-email/test-token", {
      statusCode: 200,
      body: {
        success: true,
        user: { role: "INVESTOR", investor: { id: 1 } },
      },
    }).as("verifyEmail")

    cy.visit("/auth/verify-email/test-token")

    const code = "123456"
    code.split("").forEach((digit, index) => {
      cy.get('input[maxlength="1"]').eq(index).type(digit)
    })

    cy.get('button[type="submit"]').click()
    cy.wait("@verifyEmail")

    cy.url().should("include", "/investor/dashboard")
  })
})
