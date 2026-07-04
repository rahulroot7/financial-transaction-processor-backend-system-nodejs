const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const fetchTransactionMetadata = async (transactionId) => {

    await sleep(100);

    return {
        merchant: "Amazon",
        category: "Shopping",
        referenceId: `REF-${transactionId}`
    };
};

module.exports = {
    fetchTransactionMetadata
};