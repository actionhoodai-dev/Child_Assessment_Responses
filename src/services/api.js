export const API_URL = "https://script.google.com/macros/s/AKfycbznu6wWbtTqlPbBLvF8jBLbA-7aEmVv3fHVDNISl38tKHibVUkGKtwvEEvU2kX0sCHZ7g/exec";

/**
 * Submits the assessment data to the backend.
 * @param {Object} data - The complete assessment data following the data contract.
 * @returns {Promise<Object>} - The response from the server.
 */
export const saveAssessment = async (data) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const result = await response.json();
        // Clear cache on new save to ensure next fetch is fresh
        assessmentsCache = null;
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
 * Normalizes flat data from Google Sheets into the nested structure expected by the app.
 */
export const normalizeRecord = (raw) => {
    if (!raw) return null;

    // Support both camelCase and snake_case or Spaced Headers from GAS
    const getVal = (keys) => {
        for (const key of keys) {
            if (raw[key] !== undefined) return raw[key];
        }
        return "";
    };

    const normalized = {
        patientId: getVal(['patientId', 'patient_id', 'Patient ID', 'patientid']),
        childName: getVal(['childName', 'child_name', 'Child Name', 'childname']),
        dob: getVal(['dob', 'dob_date', 'Date of Birth', 'dobdate']),
        age: getVal(['age', 'Age']),
        gender: getVal(['gender', 'Gender']),
        assessmentDate: getVal(['assessmentDate', 'assessment_date', 'Date of Assessment', 'assessmentdate']),
        assessorName: getVal(['assessorName', 'assessor_name', 'Assessor Name', 'assessorname']),
    };

    const categories = ['gross', 'fine', 'language', 'communication', 'social', 'adl', 'cognitive'];
    categories.forEach(cat => {
        // If it's already a nested object (e.g. from local state)
        if (raw[cat] && typeof raw[cat] === 'object' && !Array.isArray(raw[cat])) {
            normalized[cat] = raw[cat];
        } else {
            normalized[cat] = {};
            // If the data is flat, the skill values are likely in the top-level keys
            // This will be handled by the screens/dashboard which can check both
        }
    });

    return normalized;
};

/**
 * Fetches all assessments from Google Sheets.
 * @param {boolean} forceFresh - If true, bypasses the cache.
 * @returns {Promise<Array>} - List of assessment records.
 */
export const fetchAssessments = async (forceFresh = false) => {
    const now = Date.now();
    if (!forceFresh && assessmentsCache && (now - lastFetchTime < CACHE_DURATION)) {
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

        const records = (Array.isArray(data) ? data : []).map(normalizeRecord);

        assessmentsCache = records;
        lastFetchTime = now;

        return records;
    } catch (error) {
        console.error("Fetch failed:", error);
        return assessmentsCache || [];
    }
};
