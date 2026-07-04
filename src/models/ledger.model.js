const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
    {
        accountId: {
            type: String,
            required: true,
            index: true
        },

        transactionId: {
            type: String,
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        balance: {
            type: Number,
            required: true
        },

        timestamp: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("LedgerEntry", ledgerSchema);