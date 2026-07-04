const Transaction = require("../models/transaction.model");
const LedgerEntry = require("../models/ledger.model");
const Account = require("../models/account.model");

const logger = require("../utils/logger");

const rebuildLedger = async (webhookEventId) => {

    const transactions = await Transaction
        .find({ webhookEventId })
        .sort({
            timestamp: 1,
            transactionId: 1
        });

    if (!transactions.length) {
        logger.info("No transactions found");
        return;
    }

    const accountId = transactions[0].accountId;

    await LedgerEntry.deleteMany({
        accountId
    });

    let balance = 0;

    const ledgerEntries = [];

    for (const transaction of transactions) {

        if (transaction.type === "CREDIT") {
            balance += transaction.amount;
        } else {
            balance -= transaction.amount;
        }

        ledgerEntries.push({
            accountId,
            transactionId: transaction.transactionId,
            amount: transaction.amount,
            balance,
            timestamp: transaction.timestamp
        });
    }

    await LedgerEntry.insertMany(ledgerEntries);

    await Account.findOneAndUpdate(
        { accountId },
        { balance },
        {
            upsert: true,
            returnDocument: "after"
        }
    );

    logger.info(
        `Ledger rebuilt for account ${accountId}`
    );
};

module.exports = {
    rebuildLedger
};