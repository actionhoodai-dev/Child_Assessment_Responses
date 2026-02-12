export const API_URL = "https://script.google.com/macros/s/AKfycbznu6wWbtTqlPbBLvF8jBLbA-7aEmVv3fHVDNISl38tKHibVUkGKtwvEEvU2kX0sCHZ7g/exec";

/**
 * Submits the assessment data to the backend.
 * @param {Object} data - The complete assessment data following the data contract.
 * @returns {Promise<Object>} - The response from the server.
 */
export const saveAssessment = async (data) => {
    try {
        // Google Apps Script Web Apps often require specifically formatted requests
        // Using fetch with 'no-cors' is common locally but for getting response we need normal cors.
        // However, the prompt says "Accepts POST requests... Writes directly to Google Sheets"
        // We will assume standard JSON POST.

        const response = await fetch(API_URL, {
            method: "POST",
            // Use text/plain to avoid CORS preflight (typical GAS hack), or standard json if server handles OPTIONS
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Submission failed:", error);
        throw error;
    }
};

let assessmentsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches all assessments from Google Sheets.
 * @returns {Promise<Array>} - List of assessment records.
 */
export const fetchAssessments = async () => {
    const now = Date.now();
    if (assessmentsCache && (now - lastFetchTime < CACHE_DURATION)) {
        return assessmentsCache;
    }

    try {
        const response = await fetch(API_URL, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const result = await response.json();
        const data = Array.isArray(result) ? result : (result.data || []);

        assessmentsCache = data;
        lastFetchTime = now;

        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        return assessmentsCache || []; // Return cache if available, else empty
    }
};
