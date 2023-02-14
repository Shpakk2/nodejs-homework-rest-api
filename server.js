const app = require('./app')

const mongoose = require('mongoose')

const {PORT=3000, DB_HOST} = process.env;

mongoose.set('strictQuery', true)

mongoose.connect(DB_HOST)
  .then(() => app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`)
})
)
  .catch(error => {
    console.log(error.message);
    process.exit(1)
  })

