const bcrypt = require('bcrypt') // or whatever hashing library you use

async function generateHash() {
  const password = 'Hanin@123' // Change this to your desired password
  const saltRounds = 10 // Adjust based on your middleware settings

  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('Original Password:', password)
    console.log('Hashed Password:', hash)
  } catch (error) {
    console.error('Error:', error)
  }
}

generateHash()
