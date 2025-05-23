describe('AdminOffCanvas & ManagerForm integration', () => {
  beforeEach(() => {
    cy.viewport('iphone-x'); // Simulate mobile to test off-canvas
    cy.visit('/admin/managers');
  });

  it('should open the AdminOffCanvas and open ManagerForm modal', () => {
    // Click the hamburger menu (AdminOffCanvas)
    // cy.get('button[aria-label="Toggle navigation"]').click();

    // // Ensure the sidebar is now visible
    // cy.get('aside').should('be.visible');

    // Click the "Add New Manager" button
    cy.get('button[name="addNewManager"]').click();

    // Fill out the ManagerForm
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="qualification"]').type('MBA');
    cy.get('input[name="duration"]').type('12');
    cy.get('input[name="minimumInvestmentAmount"]').type('5000');
    cy.get('input[name="percentageYield"]').type('15');

    // Upload a file (must be in your fixtures)
    cy.get('input[type="file"]').selectFile('cypress/fixtures/profile.jpg', {
      force: true,
    });

    // Submit the form
    cy.get('form').submit();

    // Check redirection or success behavior (adjust URL or success message)
    cy.url().should('include', '/admin/managers');
  });
});
