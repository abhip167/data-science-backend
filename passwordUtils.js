import bcrypt from "bcrypt"

 function hashPassword(plaintextPassword) {
    const hash =  bcrypt.hashSync(plaintextPassword, 10);
    return hash
}

async function  comparePassword(plaintextPassword, hash) {
    const result =  await bcrypt.compare(plaintextPassword, hash);
    return result;
}

console.log(process.env.DEFAULT_USER_PASSWORD)

export {hashPassword, comparePassword}