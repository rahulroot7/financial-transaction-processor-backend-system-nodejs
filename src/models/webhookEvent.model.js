const mongoose = require("mongoose");

const webhookEventSchema = new mongoose.Schema(
    {
        eventHash: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        eventId: {
            type: String,
            required: true
        },

        accountId: {
            type: String,
            required: true
        },

        payload: {
            type: Object,
            required: true
        },

        status: {
            type: String,
            enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("WebhookEvent", webhookEventSchema);