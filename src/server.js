const app = require('./app')

init()

async function init() {
  try {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`Express App Listening on Port ${PORT}`)
    })
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`)
    process.exit(1)
  }
}
