async function consumeEmails() {
  setInterval(async () => {
    console.log("Waiting for emailxxxxxxxxxxxxxxxxxxxx tasks...vc");
  }, 10000);
}

consumeEmails().catch((error) => console.error("Worker Error:", error));
module.exports = consumeEmails;
