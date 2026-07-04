require("dotenv").config();

const connectDB = require("./config/db");

require("./models/webhookEvent.model");
require("./models/transaction.model");
require("./models/ledger.model");
require("./models/account.model");

(async () => {
    await connectDB();

    console.log("All models loaded successfully.");

    process.exit();
})();