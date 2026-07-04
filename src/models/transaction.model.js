const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true
        },

        accountId: {
            type: String,
            required: true,
            index: true
        },

        webhookEventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WebhookEvent",
            required: true,
            index: true
        },

        amount: {
            type: Number,
            required: true
        },

        type: {
            type: String,
            enum: ["CREDIT", "DEBIT"],
            required: true
        },

        timestamp: {
            type: Date,
            required: true
        },

        enriched: {
            type: Boolean,
            default: false
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);