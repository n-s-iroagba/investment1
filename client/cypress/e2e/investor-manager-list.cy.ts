describe("Investor Manager List", () => {
  beforeEach(() => {
    cy.intercept("GET", "/managers", {
      statusCode: 200,
      body: [
        {
          id: 1,
          firstName: "Jane",
          lastName: "Smith",
          image: "/test-image.jpg",
          minimumInvestmentAmount: 1000,
          percentageYield: 8.5,
          duration: 12,
          qualification: "CFA Charterholder",
        },
        {
          id: 2,
          firstName: "John",
          lastName: "Doe",
          image: "/test-image2.jpg",
          minimumInvestmentAmount: 5000,
          percentageYield: 10.2,
          duration: 24,
          qualification: "MBA Finance",
        },
      ],
    }).as("getManagers")
  })

  it("should display list of managers", () => {
    cy.visit("/investor/manager-list")
    cy.wait("@getManagers")

    cy.contains("Jane Smith").should("be.visible")
    cy.contains("8.5%").should("be.visible")
    cy.contains("CFA Charterholder").should("be.visible")
  })

  it("should handle loading state", () => {
    cy.intercept("GET", "/managers", { delay: 1000, statusCode: 200, body: [] })

    cy.visit("/investor/manager-list")
    cy.contains("Loading...").should("be.visible")
  })

  it("should handle error state", () => {
    cy.intercept("GET", "/managers", { statusCode: 500, body: { message: "Server error" } })

    cy.visit("/investor/manager-list")
    cy.contains("Error fetching managers").should("be.visible")
  })
})
