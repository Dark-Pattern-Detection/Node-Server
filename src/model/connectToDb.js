const mongoose = require('mongoose')

// Connect to MongoDB
const connectToDb = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to mongoose')
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

module.exports = connectToDb
