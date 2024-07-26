const ProfileRepository = require('../repositories/profiles.repository')

const getProfileMiddleware = async (req, res, next) => {
  const profileId = req.get('profile_id')
  if (!profileId) return res.status(400).json({ error: 'Profile id missing' })

  const profile = await ProfileRepository.findById(profileId)
  if (!profile) return res.status(401).json({ error: 'Profile not found' })
  else {
    req.app.set('profile', profile.dataValues)
    next()
  }
}
module.exports = { getProfileMiddleware }
