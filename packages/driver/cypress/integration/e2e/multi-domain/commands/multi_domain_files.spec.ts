context('cy.origin files', () => {
  beforeEach(() => {
    cy.visit('/fixtures/multi-domain.html')
    cy.get('a[data-cy="cross-origin-secondary-link"]').click()
  })

  it('.fixture()', () => {
    cy.origin('http://foobar.com:3500', () => {
      cy.fixture('example.json').then((json) => {
        expect(json).to.be.an('object')
        expect(json.example).to.be.true
      })
    })
  })

  it('.readFile()', () => {
    cy.origin('http://foobar.com:3500', () => {
      cy.readFile('cypress/fixtures/example.json').then((json) => {
        expect(json).to.be.an('object')
        expect(json.example).to.be.true
      })
    })
  })

  it('.writeFile()', () => {
    cy.origin('http://foobar.com:3500', () => {
      const contents = JSON.stringify({ foo: 'bar' })

      cy.stub(Cypress, 'backend').resolves({
        contents,
        filePath: 'foo.json',
      })

      cy.writeFile('foo.json', contents).then(() => {
        expect(Cypress.backend).to.be.calledWith(
          'write:file',
          'foo.json',
          contents,
          {
            encoding: 'utf8',
            flag: 'w',
          },
        )
      })
    })
  })
})