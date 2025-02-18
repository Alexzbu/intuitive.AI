import coursePage from "../support/page_objects/coursePage"

describe('Create course', () => {

  it('Course page', () => {
    coursePage.checkOpeningCreateCoursePage()
    coursePage.fillOverviewInInputs()
    coursePage.fillCurriculumInputs()
    coursePage.fillQuizInputs()
  })
})
