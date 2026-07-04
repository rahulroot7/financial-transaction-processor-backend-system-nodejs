const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const retry = async (
    operation,
    retries = 3,
    delay = 500
) => {

    let attempt = 0;

    while (attempt < retries) {

        try {

            return await operation();

        } catch (error) {

            attempt++;

            if (attempt === retries) {
                throw error;
            }

            await sleep(delay);

            delay *= 2;
        }
    }
};

module.exports = retry;