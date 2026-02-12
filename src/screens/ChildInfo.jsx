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

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await fetchAssessments();
            setAllRecords(data);

            // Auto-generate ID if it's a new patient and no ID is set yet
            if (isNewPatient && !state.patientId) {
                const nextId = generateNextId(data);
                updateInfo('patientId', nextId);
            }
            setLoading(false);
        };
        load();
    }, []);

    const generateNextId = (records) => {
        const otfIds = records
            .map(r => String(r.patientId || r.patient_id || ""))
            .filter(id => id.startsWith("OTF"))
            .map(id => parseInt(id.replace("OTF", "")))
            .filter(num => !isNaN(num));

        const maxId = otfIds.length > 0 ? Math.max(...otfIds) : 99;
        return `OTF${maxId + 1}`;
    };

    const handlePatientTypeChange = (isNew) => {
        setIsNewPatient(isNew);
        if (isNew) {
            const nextId = generateNextId(allRecords);
            updateInfo('patientId', nextId);
            // Don't reset other fields as user might be toggling, 
            // but usually a new patient starts fresh
        } else {
            updateInfo('patientId', ""); // Clear for search
        }
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (val.length > 1) {
            const filtered = allRecords.filter(r =>
                String(r.patientId || r.patient_id || "").toLowerCase().includes(val.toLowerCase()) ||
                String(r.childName || r.child_name || "").toLowerCase().includes(val.toLowerCase())
            );
            // Get unique patients by ID
            const unique = [];
            const map = new Map();
            for (const item of filtered) {
                const id = item.patientId || item.patient_id;
                if (!map.has(id)) {
                    map.set(id, true);
                    unique.push(item);
                }
            }
            setSuggestions(unique.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const selectPatient = (patient) => {
        updateInfo('patientId', patient.patientId || patient.patient_id);
        updateInfo('childName', patient.childName || patient.child_name);
        updateInfo('dob', patient.dob || patient.dob_date);
        updateInfo('age', patient.age);
        updateInfo('gender', patient.gender);
        setSuggestions([]);
        setSearchTerm("");
    };

    const handleChange = (e) => {
        updateInfo(e.target.name, e.target.value);
    };

    const isValid = state.patientId && state.childName && state.dob && state.age && state.gender && state.assessorName;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid) onNext();
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
                                    <strong>{p.patientId || p.patient_id}</strong> - {p.childName || p.child_name}
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
                    readOnly={isNewPatient} // IDs are managed by system for professionalism
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
                    {loading ? 'Validating ID...' : 'Next: Gross Motor Skills'}
                </Button>
            </div>
        </form>
    );
};

export default ChildInfo;
