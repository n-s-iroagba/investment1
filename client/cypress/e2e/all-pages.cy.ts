describe("All Pages Accessibility", () => {
  const adminPages = [
    "/admin/dashboard",
    "/admin/investors",
    "/admin/managers",
    "/admin/referrals",
    "/admin/wallets",
    "/admin/social-media",
    "/admin/mock-withdrawal",
  ]

  const investorPages = ["/investor/dashboard", "/investor/profile", "/investor/referrals", "/investor/manager-list"]

  const publicPages = ["/", "/login", "/admin/signup", "/investor/signup", "/auth/forgot-password"]

  beforeEach(() => {
    // Mock admin auth for admin pages
    cy.intercept("GET", "/auth/me", (req) => {
      if (req.url.includes("admin")) {
        req.reply({
          statusCode: 200,
          body: {
            id: 1,
            email: "admin@test.com",
            role: "ADMIN",
            admin: { id: 1, username: "testadmin" },
          },
        })
      } else {
        req.reply({
          statusCode: 200,
          body: {
            id: 1,
            email: "investor@test.com",
            role: "INVESTOR",
            investor: { id: 1, firstName: "John" },
          },
        })
      }
    }).as("getMe")
  })

  adminPages.forEach((page) => {
    it(`should load admin page: ${page}`, () => {
      cy.window().then((win) => {
        win.localStorage.setItem("authToken", "mock-admin-token")
      })

      cy.visit(page)
      cy.wait("@getMe")

      // Should not show error page
      cy.contains("404").should("not.exist")
      cy.contains("Error").should("not.exist")

      // Should have basic page structure
      cy.get("body").should("be.visible")
    })
  })

  investorPages.forEach((page) => {
    it(`should load investor page: ${page}`, () => {
      cy.window().then((win) => {
        win.localStorage.setItem("authToken", "mock-investor-token")
      })

      cy.visit(page)
      cy.wait("@getMe")

      // Should not show error page
      cy.contains("404").should("not.exist")
      cy.contains("Error").should("not.exist")

      // Should have basic page structure
      cy.get("body").should("be.visible")
    })
  })

  publicPages.forEach((page) => {
    it(`should load public page: ${page}`, () => {
      cy.visit(page)

      // Should not show error page
      cy.contains("404").should("not.exist")
      cy.contains("Error").should("not.exist")

      // Should have basic page structure
      cy.get("body").should("be.visible")
    })
  })
})
