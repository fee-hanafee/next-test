function generate() {
  let randomNumber = Math.floor(Math.random() * 1e10);

  let randomString = randomNumber.toString().padStart(10, "0");

  return randomString;
}

module.exports = generate;
