const getProfile = async (req, res, next) => {
  const ProfileRepository = require('../repositories/profile')
  const profileId = req.get('profile_id')
  const profile = await ProfileRepository.getById(profileId)

  if (!profile) return res.status(401).json({ message: 'Profile not found' })
  else {
    req.app.set('profile', profile.dataValues)
    next()
  }
}
module.exports = { getProfile }
