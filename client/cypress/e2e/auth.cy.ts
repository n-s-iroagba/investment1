describe('auth spec', () => {
  it('signs up investor and redirects to email verification', () => {
    cy.visit('/investor/signup');

    // Fill registration form
    cy.get('input[name="firstName"]').type('Nnamdi');
    cy.get('input[name="lastName"]').type('Iroagba');
    cy.get('input[name="countryOfResidence"]').type('Nigeria');
    cy.get('input[name="dateOfBirth"]').type('1995-07-01');
    cy.get('select[name="gender"]').select('Male');
    cy.get('input[name="email"]').type('nnamdisolomon1@gmail.com');
    cy.get('input[name="password"]').type('97chocho');
    cy.get('input[name="confirmPassword"]').type('97chocho');
    // Optional field
    cy.get('input[name="referrerCode"]').type('12345');

    // Submit form
    cy.get('button[type="submit"]').click();
cy.wait(7000);
    // Verify redirection to email token verification page
    cy.url().should('include', '/auth/verify-email');
     cy.get('button[name="resendCode"]').click();
cy.wait(3000);
    const digits = ["1", "2", "3", "4", "5", "6"];
    digits.forEach((digit, index) => {
      cy.get("input").eq(index).type(digit);
    });

    cy.get("input").each(($input, index) => {
      cy.wrap($input).should("have.value", digits[index]);
    });
     cy.get('button[type="submit"]').click();
  });
  });
