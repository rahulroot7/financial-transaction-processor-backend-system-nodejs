const crypto = require("crypto");

const generateEventHash = ({ eventId, accountId, payload }) => {
    return crypto
        .createHash("sha256")
        .update(
            JSON.stringify({
                eventId,
                accountId,
                payload
            })
        )
        .digest("hex");
};

module.exports = {
    generateEventHash
};