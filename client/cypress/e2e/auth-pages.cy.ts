describe("Authentication Pages", () => {
  describe("Forgot Password", () => {
    it("should display forgot password form", () => {
      cy.visit("/auth/forgot-password")

      cy.contains("Enter your email").should("be.visible")
      cy.get('input[name="email"]').should("be.visible")
    })

    it("should submit forgot password request", () => {
      cy.intercept("POST", "/auth/forgot-password", {
        statusCode: 200,
        body: { resetPasswordToken: "reset-token-123" },
      }).as("forgotPassword")

      cy.visit("/auth/forgot-password")

      cy.get('input[name="email"]').type("user@test.com")
      cy.get('button[type="submit"]').click()

      cy.wait("@forgotPassword")
      cy.contains("A password reset email has been sent").should("be.visible")
    })
  })

  describe("Reset Password", () => {
    it("should display reset password form", () => {
      cy.visit("/auth/reset-password/test-token")

      cy.contains("New Password").should("be.visible")
      cy.get('input[name="password"]').should("be.visible")
      cy.get('input[name="confirmPassword"]').should("be.visible")
    })

    it("should validate password confirmation", () => {
      cy.visit("/auth/reset-password/test-token")

      cy.get('input[name="password"]').type("newpassword123")
      cy.get('input[name="confirmPassword"]').type("differentpassword")

      cy.get('button[type="submit"]').click()
      cy.contains("Passwords don't match").should("be.visible")
    })
  })

  describe("Email Verification", () => {
    it("should display verification form", () => {
      cy.visit("/auth/verify-email/test-token")

      cy.contains("Verify Your Email").should("be.visible")
      cy.get('input[maxlength="1"]').should("have.length", 6)
    })

    it("should allow entering verification code", () => {
      cy.visit("/auth/verify-email/test-token")

      const code = "123456"
      code.split("").forEach((digit, index) => {
        cy.get('input[maxlength="1"]').eq(index).type(digit)
      })

      cy.get('input[maxlength="1"]').eq(5).should("have.value", "6")
    })
  })
})
