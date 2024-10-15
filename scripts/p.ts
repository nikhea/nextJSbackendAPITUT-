async function c() {
  console.log(".....");
}

c().catch((error) => console.error("Worker Error:", error));

module.exports = c;
// "start": "concurrently \"next start\" \"ts-node scripts/emailWorker.ts\"",
// "dev": "concurrently \"next dev\" \"nodemon --watch scripts --ext ts --exec ts-node ./scripts/index.ts\"",
