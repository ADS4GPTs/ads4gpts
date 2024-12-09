/**
 * Retrieve the API key from environment variables once at module load time.
 * Fail fast if not found.
 */
const ADS4GPTS_API_KEY: string = (() => {
    const apiKey = process.env.ADS4GPTS_API_KEY;
    if (!apiKey) {
        throw new Error('Missing ADS4GPTS_API_KEY environment variable.');
    }
    return apiKey;
})();

export { ADS4GPTS_API_KEY };
