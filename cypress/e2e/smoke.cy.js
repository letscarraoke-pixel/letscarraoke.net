describe('Smoke Tests - Landing Page', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
  });

  it('should load the homepage and display main content', () => {
    // Test 1: Verify page loads and key elements are present
    cy.get('body').should('be.visible');
    cy.get('header').should('be.visible');
    cy.get('main').should('be.visible');
    cy.get('footer').should('be.visible');
    
    // Check for logo
    cy.get('header img[alt="Let\'s Car\'raoke logo"]').should('be.visible');
    
    // Check for main heading - use more flexible text matching
    cy.get('h1').should('be.visible');
    cy.get('h1').should('contain.text', 'vacation to feel alive');
  });

  it('should have working navigation links', () => {
    // Test 2: Verify navigation functionality
    cy.get('nav a[href="#how"]').should('be.visible');
    cy.get('nav a[href="#gallery"]').should('be.visible');
    cy.get('nav a[href="#contact"]').should('be.visible');
    
    // Test navigation scroll to "How it works" section
    cy.get('nav a[href="#how"]').click();
    cy.get('#how').should('be.visible');
    
    // Verify "How it works" section content
    cy.contains('h3', 'Pick a Time').should('be.visible');
    cy.contains('h3', 'Gather Your People').should('be.visible');
    cy.contains('h3', 'Roll & Sing').should('be.visible');
  });

  it('should display call-to-action buttons and key sections', () => {
    // Test 3: Verify CTA buttons and important sections are present
    cy.get('button.cta').should('have.length.at.least', 1);
    
    // Check for "Book Now" buttons
    cy.contains('button', 'Book Now').should('be.visible');
    
    // Verify hero section content
    cy.contains('Staycation energy').should('be.visible');
    
    // Verify benefits section
    cy.contains('h2', 'Show up and shine').should('be.visible');
    cy.contains('h3', 'We Come to You').should('be.visible');
    cy.contains('h3', 'Pro Sound & Lights').should('be.visible');
    cy.contains('h3', 'Massive Song Library').should('be.visible');
    
    // Verify testimonials section
    cy.contains('p.quote', /.*/).should('have.length.at.least', 1);
  });

  it('should have responsive layout elements', () => {
    // Test 4: Additional smoke test for layout integrity
    cy.get('header .container').should('be.visible');
    cy.get('main section').should('have.length.at.least', 3);
    
    // Verify footer - use more flexible text matching
    cy.get('footer').should('be.visible');
    cy.get('footer').should('contain.text', 'Car');
    cy.get('footer').should('contain.text', 'San Diego');
  });

  it('should display sticky CTA button', () => {
    // Test 5: Verify sticky CTA functionality
    cy.get('.sticky-cta').should('be.visible');
    cy.get('.sticky-cta').should('contain', 'Book Now');
    
    // Scroll down to ensure sticky button remains visible
    cy.scrollTo('bottom');
    cy.get('.sticky-cta').should('be.visible');
  });
});

