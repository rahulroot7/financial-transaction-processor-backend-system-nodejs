const webhookService = require("../services/webhook.service");

const receiveWebhook = async (req, res, next) => {
    try {
        const result = await webhookService.processWebhook(req.body);

        if (result.duplicate) {
            return res.status(200).json({
                success: true,
                message: "Duplicate webhook ignored"
            });
        }

        return res.status(202).json({
            success: true,
            message: "Webhook accepted for processing"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    receiveWebhook
};