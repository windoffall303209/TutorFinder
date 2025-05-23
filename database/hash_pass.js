const bcrypt = require("bcrypt");

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(plainPassword, saltRounds);
  return hashed;
}

// Ví dụ sử dụng
hashPassword("admin").then((hash) => {
  console.log("Hashed password:", hash);
});
