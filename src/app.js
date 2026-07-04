const express = require("express");

const webhookRoutes = require("./routes/webhook.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend System Running"
    });
});

app.use("/api/webhooks", webhookRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message
    });
});

module.exports = app;