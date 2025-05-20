
describe('Manager UI - Create and Update', () => {
  const manager = {
    name: 'Jane Doe',
    percentageYield: '120',
    qualification: 'MBA',
    imagePath: 'public/download2.jpeg', // put this file in your /public or fixtures folder
  };

//   const updatedManager = {
//     name: 'Jane Smith',
//     percentageYield: '150',
//     qualification: 'PhD',
//     imagePath: 'public/download1.jpeg',
//   };

  it('should create a new manager', () => {
  
    cy.visit('/admin/managers');

    // Fill registration form
    cy.get('button[name="addNewManager"]').click();

    cy.get('input[name="name"]').type(manager.name);
    cy.get('input[name="percentageYield"]').type(manager.percentageYield);
    cy.get('input[name="qualification"]').type(manager.qualification);

    cy.get('input[type="file"]').selectFile(manager.imagePath, { force: true });

    cy.contains('Submit').click();

    cy.url().should('include', '/admin/managers');
    cy.contains(manager.name).should('exist');
    cy.contains(manager.qualification).should('exist');
  });

//   it('should update the manager', () => {
//     cy.visit('/admin-dashboard/manager');

//     cy.contains(manager.name)
//       .parents('tr')
//       .within(() => {
//         cy.contains('Edit').click();
//       });

//     cy.get('input[name="name"]').clear().type(updatedManager.name);
//     cy.get('input[name="percentageYield"]').clear().type(updatedManager.percentageYield);
//     cy.get('input[name="qualification"]').clear().type(updatedManager.qualification);

//     cy.get('input[type="file"]').selectFile(updatedManager.imagePath, { force: true });

//     cy.contains('Submit').click();

//     cy.url().should('include', '/admin-dashboard/manager');
//     cy.contains(updatedManager.name).should('exist');
//     cy.contains(updatedManager.qualification).should('exist');
//   });
});
