const mongoose = require('mongoose');
const { config } = require("../config/secret")

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.jbcrcxu.mongodb.net/TOYS`);
  console.log("mongo connect");
}