export const API_URL = "https://script.google.com/macros/s/AKfycbxWTwuz3X4YXvVP1VM3EvEDEKEBX0TRLgGaAz57JES3D274lGFPNHbkkE0Ud3x7EP_OeA/exec";

/**
 * Submits the assessment data to the backend.
 * @param {Object} data - The complete assessment data following the data contract.
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
        // Clear cache so the next dashboard view is fresh
        assessmentsCache = null;
        return result;
    } catch (error) {
        console.error("Submission failed:", error);
        throw error;
    }
};

let assessmentsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Normalizes flat data from Google Sheets into the structure expected by the app.
 * Mapping headers based on USER screenshot: Patient_ID, Child_Name, Date_of_Assess, etc.
 */
export const normalizeRecord = (raw) => {
    if (!raw) return null;

    // Support variations in header naming (user changed to Patient_ID/Child_Name)
    const getVal = (keys) => {
        for (const key of keys) {
            if (raw[key] !== undefined) return raw[key];
        }
        return "";
    };

    const normalized = {
        patientId: getVal(['Patient_ID', 'patientId', 'patient_id', 'Patient ID']),
        childName: getVal(['Child_Name', 'childName', 'child_name', 'Child Name']),
        dob: getVal(['DOB', 'dob_date', 'Date of Birth']),
        age: getVal(['Age', 'age']),
        gender: getVal(['Gender', 'gender']),
        assessmentDate: getVal(['Date_of_Assess', 'assessmentDate', 'assessment_date']),
        assessorName: getVal(['Assessor_Name', 'assessorName', 'assessor_name']),
    };

    // Keep the rest of the raw data for category scoring (skills)
    // We'll merge raw into normalized so that categories/flat keys are accessible
    return { ...raw, ...normalized };
};

/**
 * Fetches all assessments from Google Sheets.
 * @param {boolean} forceFresh - If true, bypasses the cache.
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
