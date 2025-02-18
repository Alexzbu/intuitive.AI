import loginPage from "../support/page_objects/loginPage"

describe('Login page and create course', () => {
  it('Opening', () => {
    loginPage.checkOpening()
  })
  it('Wrong auth', () => {
    loginPage.checkWrongAuthorization()
  })

  it('Correct auth', () => {
    loginPage.checkCorrectAuthorization()
  })

  it('Course page', () => {
    coursePage.checkOpeningCreateCoursePage()
  })
})
