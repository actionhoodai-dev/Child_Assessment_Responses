import { useState, useEffect, useMemo } from 'react';
import { fetchAssessments } from '../services/api';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';

const PatientDashboard = ({ onBack }) => {
    const [allRecords, setAllRecords] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedPatientRecords, setSelectedPatientRecords] = useState([]);

    useEffect(() => {
        const loadRecords = async () => {
            setLoading(true);
            const data = await fetchAssessments();
            setAllRecords(data);
            setLoading(false);
        };
        loadRecords();
    }, []);

    const handleSearch = () => {
        const query = searchId.toLowerCase();
        const filtered = allRecords.filter(r => {
            const pId = String(r.patientId || r.patient_id || "").toLowerCase();
            const pName = String(r.childName || r.child_name || "").toLowerCase();
            return pId === query || pName.includes(query);
        });

        // Sort by date descending
        const sorted = filtered.sort((a, b) => new Date(b.assessmentDate || b.assessment_date) - new Date(a.assessmentDate || a.assessment_date));
        setSelectedPatientRecords(sorted);
    };

    const calculateStats = (records) => {
        if (!records.length) return null;

        // Example stats: % of "Yes" answers across categories over time
        const categories = ['gross', 'fine', 'language', 'communication', 'social', 'adl', 'cognitive'];

        return records.map(record => {
            let totalYes = 0;
            let totalQuestions = 0;

            categories.forEach(cat => {
                const skills = record[cat] || {};
                Object.values(skills).forEach(skill => {
                    if (skill.value === 'Yes') totalYes++;
                    totalQuestions++;
                });
            });

            return {
                date: record.assessmentDate || record.assessment_date,
                score: totalQuestions > 0 ? (totalYes / totalQuestions) * 100 : 0,
                totalYes,
                totalQuestions
            };
        }).reverse(); // Chronological for chart
    };

    const stats = useMemo(() => calculateStats(selectedPatientRecords), [selectedPatientRecords]);

    const downloadCSV = () => {
        if (!selectedPatientRecords.length) return;

        const headers = ["Date", "Patient ID", "Name", "Score (%)"];
        const rows = selectedPatientRecords.map(r => {
            const stat = calculateStats([r])[0];
            return [
                r.assessmentDate || r.assessment_date,
                r.patientId || r.patient_id,
                r.childName || r.child_name,
                stat.score.toFixed(2)
            ];
        });

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `patient_${searchId}_history.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="patient-dashboard">
            <SectionHeader
                title="Patient Cumulative Record"
                description="Analyze patient progress over time and download records."
            />

            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                <input
                    type="text"
                    placeholder="Search by Patient ID (e.g. OTF100) or Name"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        fontSize: '18px',
                        borderRadius: '8px',
                        border: '2px solid var(--color-border)'
                    }}
                />
                <Button onClick={handleSearch} disabled={loading}>
                    {loading ? 'Loading...' : 'Search'}
                </Button>
            </div>

            {selectedPatientRecords.length > 0 ? (
                <div className="results">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ color: 'var(--color-primary)' }}>
                            History for {selectedPatientRecords[0].childName || selectedPatientRecords[0].child_name}
                        </h2>
                        <Button variant="secondary" onClick={downloadCSV}>Download CSV</Button>
                    </div>

                    {/* Simple Progress Chart */}
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '24px',
                        borderRadius: '12px',
                        marginBottom: '32px',
                        border: '1px solid #e9ecef'
                    }}>
                        <h3 style={{ marginTop: 0, fontSize: '18px' }}>Improvement Trend (% Yes Responses)</h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            height: '200px',
                            gap: '20px',
                            marginTop: '20px',
                            borderBottom: '2px solid #dee2e6',
                            paddingBottom: '10px',
                            overflowX: 'auto'
                        }}>
                            {stats.map((s, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
                                    <div style={{
                                        width: '100%',
                                        height: `${s.score * 1.5}px`,
                                        backgroundColor: 'var(--color-primary)',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 0.5s ease',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            top: '-25px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {Math.round(s.score)}%
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '10px', marginTop: '8px', textAlign: 'center' }}>
                                        {new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '12px' }}>Date</th>
                                    <th style={{ padding: '12px' }}>Assessor</th>
                                    <th style={{ padding: '12px' }}>Score</th>
                                    <th style={{ padding: '12px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedPatientRecords.map((r, i) => {
                                    const s = calculateStats([r])[0];
                                    const prevS = i < selectedPatientRecords.length - 1 ? calculateStats([selectedPatientRecords[i + 1]])[0] : null;
                                    const improvement = prevS ? s.score - prevS.score : 0;

                                    return (
                                        <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px' }}>{r.assessmentDate || r.assessment_date}</td>
                                            <td style={{ padding: '12px' }}>{r.assessorName || r.assessor_name}</td>
                                            <td style={{ padding: '12px' }}>{Math.round(s.score)}%</td>
                                            <td style={{ padding: '12px' }}>
                                                {improvement > 0 ? (
                                                    <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>↑ +{Math.round(improvement)}%</span>
                                                ) : improvement < 0 ? (
                                                    <span style={{ color: 'var(--color-error)', fontWeight: 'bold' }}>↓ {Math.round(improvement)}%</span>
                                                ) : (
                                                    <span style={{ color: '#666' }}>stable</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                searchId && !loading && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        No records found for this Patient ID.
                    </div>
                )
            )}

            <div style={{ marginTop: '40px' }}>
                <Button variant="secondary" onClick={onBack}>Back to Assessment</Button>
            </div>
        </div>
    );
};

export default PatientDashboard;
