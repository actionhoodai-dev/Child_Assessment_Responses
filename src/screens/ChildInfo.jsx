import { useState, useEffect } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { fetchAssessments } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';

const ChildInfo = ({ onNext }) => {
    const { state, updateInfo } = useAssessment();
    const [isNewPatient, setIsNewPatient] = useState(true);
    const [allRecords, setAllRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Function to find the next sequential OTF ID
    const generateNextId = (records) => {
        if (!records || !Array.isArray(records) || records.length === 0) return "OTF100";

        const otfIds = records
            .map(r => {
                const rawId = r.patientId || r.patient_id || r["Patient ID"] || r["patientid"] || "";
                return String(rawId).trim().toUpperCase();
            })
            .filter(id => id.startsWith("OTF"))
            .map(id => {
                const numPart = id.replace("OTF", "");
                return parseInt(numPart);
            })
            .filter(num => !isNaN(num));

        if (otfIds.length === 0) return "OTF100";

        const maxId = Math.max(...otfIds);
        const nextNum = Math.max(maxId + 1, 100);
        return `OTF${nextNum}`;
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Force fresh fetch on screen load to avoid duplicate IDs
                const data = await fetchAssessments(true);
                setAllRecords(data);

                // If starting fresh and no ID is set, generate one
                if (isNewPatient && !state.patientId) {
                    const nextId = generateNextId(data);
                    updateInfo('patientId', nextId);
                }
            } catch (err) {
                console.error("Initialization fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handlePatientTypeChange = async (isNew) => {
        setIsNewPatient(isNew);
        if (isNew) {
            setLoading(true);
            const freshData = await fetchAssessments(true);
            setAllRecords(freshData);
            const nextId = generateNextId(freshData);
            updateInfo('patientId', nextId);
            setLoading(false);
        } else {
            updateInfo('patientId', "");
            setSearchTerm("");
        }
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (val.length > 1) {
            const filtered = allRecords.filter(r =>
                String(r.patientId || "").toLowerCase().includes(val.toLowerCase()) ||
                String(r.childName || "").toLowerCase().includes(val.toLowerCase())
            );

            // Uniquify suggestions by patientId
            const unique = [];
            const seen = new Set();
            for (const record of filtered) {
                if (record.patientId && !seen.has(record.patientId)) {
                    seen.add(record.patientId);
                    unique.push(record);
                }
            }
            setSuggestions(unique.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const selectPatient = (patient) => {
        updateInfo('patientId', patient.patientId);
        updateInfo('childName', patient.childName);
        updateInfo('dob', patient.dob);
        updateInfo('age', patient.age);
        updateInfo('gender', patient.gender);
        setSuggestions([]);
        setSearchTerm("");
    };

    const handleChange = (e) => {
        updateInfo(e.target.name, e.target.value);
    };

    const isValid = state.patientId && state.childName && state.dob && state.age && state.gender && state.assessorName;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;

        // Final verification for New Patient IDs
        if (isNewPatient) {
            setLoading(true);
            const freshData = await fetchAssessments(true);
            const idExists = freshData.some(r => r.patientId === state.patientId);

            if (idExists) {
                const trulyNextId = generateNextId(freshData);
                updateInfo('patientId', trulyNextId);
                alert(`Note: ID ${state.patientId} was recently taken. We have updated it to ${trulyNextId}. Please proceed.`);
                setLoading(false);
                return;
            }
            setLoading(false);
        }

        onNext();
    };

    return (
        <form onSubmit={handleSubmit}>
            <SectionHeader
                title="Child Information"
                description="Professional Assessment for Occupational Therapy Foundation Excellence."
            />

            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <button
                    type="button"
                    onClick={() => handlePatientTypeChange(true)}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: isNewPatient ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: isNewPatient ? 'rgba(74, 144, 226, 0.1)' : 'white',
                        color: isNewPatient ? 'var(--color-primary)' : '#666',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    New Patient
                </button>
                <button
                    type="button"
                    onClick={() => handlePatientTypeChange(false)}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: !isNewPatient ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: !isNewPatient ? 'rgba(74, 144, 226, 0.1)' : 'white',
                        color: !isNewPatient ? 'var(--color-primary)' : '#666',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Repeating Patient
                </button>
            </div>

            {!isNewPatient && (
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>
                        Search Patient (Name or ID)
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Type patient name or ID..."
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '18px',
                            borderRadius: '8px',
                            border: '2px solid var(--color-border)'
                        }}
                    />
                    {suggestions.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: 'white',
                            border: '1px solid var(--color-border)',
                            borderRadius: '0 0 8px 8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            zIndex: 10
                        }}>
                            {suggestions.map((p, i) => (
                                <div
                                    key={i}
                                    onClick={() => selectPatient(p)}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        borderBottom: i === suggestions.length - 1 ? 'none' : '1px solid #eee'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                                >
                                    <strong>{p.patientId}</strong> - {p.childName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Input
                    label="Patient ID"
                    name="patientId"
                    value={state.patientId}
                    onChange={handleChange}
                    readOnly={isNewPatient}
                    style={{ backgroundColor: isNewPatient ? '#f8f9fa' : 'white' }}
                />
                <Input
                    label="Child Name"
                    name="childName"
                    value={state.childName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Input
                    label="Date of Birth"
                    type="date"
                    name="dob"
                    value={state.dob}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Age"
                    name="age"
                    type="number"
                    value={state.age}
                    onChange={handleChange}
                    placeholder="Years"
                    required
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>
                        Gender <span style={{ color: 'var(--color-error)' }}>*</span>
                    </label>
                    <select
                        name="gender"
                        value={state.gender}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '18px',
                            borderRadius: '8px',
                            border: '2px solid var(--color-border)',
                            backgroundColor: '#fff'
                        }}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <Input
                    label="Assessment Date"
                    type="date"
                    name="assessmentDate"
                    value={state.assessmentDate}
                    onChange={handleChange}
                    required
                />
            </div>

            <Input
                label="Assessor Name"
                name="assessorName"
                value={state.assessorName}
                onChange={handleChange}
                placeholder="Name of Clinician"
                required
            />

            <div style={{ marginTop: '32px' }}>
                <Button type="submit" disabled={!isValid || loading}>
                    {loading ? 'Processing...' : 'Next: Gross Motor Skills'}
                </Button>
            </div>
        </form>
    );
};

export default ChildInfo;
