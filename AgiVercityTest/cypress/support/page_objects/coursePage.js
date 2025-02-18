class CourseChecker {
  checkOpeningCreateCoursePage() {
    cy.visit(Cypress.env('BASE_URL') + '/digital-academy/entry/new')
    cy.get('#email').type(Cypress.env('USER_NAME'))
    cy.get('#password').type(Cypress.env('USER_PASSWORD'))
    cy.get('button[type=submit]').click()
    cy.get('#title').should('exist')
  }

  fillOverviewInInputs() {
    cy.get('#title').type('automatically created course')
    cy.get('#subtitle').type('automatically created course')
    cy.get('#Objective').type('automatically created course')
    cy.get('#targetGroup').type('automatically created course')
    cy.get('#entryRequirements').type('automatically created course').type('{enter}')
    cy.get('#selfAssestment').type('automatically created course').type('{enter}')
    cy.get('#targetProfile').type('automatically created course').type('{enter}')
    cy.get('#participantsCount').type('automatically created course')
    cy.get('#recommendImplementation').type('automatically created course')
    cy.get('#trainerCriteria').type('automatically created course').type('{enter}')
    cy.get('.tiptap.ProseMirror').type('automatically created course')
    cy.get('#learningOutcome').type('automatically created course').type('{enter}')
    cy.get('#category2-select').type('{enter}')
    cy.get('#category-select').type('{enter}')
    cy.get('#languages-select').type('{enter}')
    cy.get('#tags').type('automatically created course').type('{enter}')
    cy.contains('button[type=submit]', 'Speichern').click()
  }

  fillCurriculumInputs() {
    cy.contains('button[type=button]', 'Lehrplan').click()
    cy.contains('button[type=button]', 'Neue Lektion').click()
    cy.get('#sectionName').type('automatically created lesson')
    cy.contains('button[type=button]', 'Lektion anlegen').click()
    cy.contains('p', 'Video Hinzufügen').click()
    cy.get('#videoTitle').type('automatically added video')
    cy.get('#videoLink').type('<iframe width="560" height="315" src=" https://www.youtube.com/embed/w_3L1Bf2P_g?start=71" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>')
    cy.contains('button[type=submit]', 'Video speichern').click()
    cy.contains('p', 'Dokument Hinzufügen').click()
    cy.get('input[placeholder="Titel des Dokuments"]').type('automatically added file')
    cy.get('input[type="file"][name="fileUpload"].filepond--browser')
      .attachFile('test.pdf', { subjectType: 'input' }).wait(1000)
    cy.contains('button[type=submit]', 'Dokument speichern').click()

  }

  fillQuizInputs() {
    cy.contains('p', 'Quiz Hinzufügen').click()
    cy.get('#quizTitle').type('automatically created quiz')
    cy.get('.chakra-input.css-33g67r').type('a question')
    cy.get('.chakra-textarea.css-1j6p4a1').type('wrong answer1')
    cy.contains('button[type=button]', 'Nächste Antwort').click()
    cy.get('.chakra-textarea.css-1j6p4a1').type('wrong answer2')
    cy.contains('button[type=button]', 'Nächste Antwort').click()
    cy.get('.chakra-textarea.css-1j6p4a1').type('correct answer')
    cy.contains('p', 'Korrekte Antwort').click()
    cy.contains('button[type=button]', 'Nächste Antwort').click()
    cy.get('.chakra-textarea.css-1j6p4a1').type('wrong answer3')
    cy.contains('button[type=button]', 'Nächste Antwort').click()
    cy.contains('button[type=button]', 'Frage speichern').click()
    cy.contains('button[type=submit]', 'Quiz speichern').click()
    cy.contains('button[type=submit]', 'Lektionen Aktualisieren ').click()
    cy.contains('button[type=button]', 'Kurs Veröffentlichen ').click()
  }
}

export default new CourseChecker()
