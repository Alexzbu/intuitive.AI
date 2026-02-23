Parse.Cloud.define('register', async (req) => {
  const {
    salutation,
    firstName,
    lastName,
    organization,
    email,
    password,
    position,
  } = req.params

  const user = new Parse.User()
  user.set('username', email)
  user.set('email', email)
  user.set('password', password)
  user.set('salutation', salutation)
  user.set('firstName', firstName)
  user.set('lastName', lastName)
  user.set('organization', organization)
  user.set('position', position)

  try {
    const saved = await user.save(null, { useMasterKey: true })
    if (!saved.id) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'User could not be created.')
    }
    return {
      objectId: saved.id,
      sessionToken: saved.getSessionToken() ?? null,
    }
  } catch (error) {
    throw new Parse.Error(error.code || Parse.Error.SCRIPT_FAILED, error.message)
  }
})

Parse.Cloud.define('login', async (req) => {
  const { email, password } = req.params

  try {
    const user = await Parse.User.logIn(email, password)
    return {
      objectId: user.id,
      sessionToken: user.getSessionToken(),
      position: user.get('position'),
      firstName: user.get('firstName'),
    }
  } catch (error) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Invalid email or password.')
  }
})
