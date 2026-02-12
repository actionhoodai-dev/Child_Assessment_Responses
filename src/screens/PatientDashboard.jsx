import { useState, useEffect, useMemo } from 'react';
import { fetchAssessments } from '../services/api';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';

const PatientDashboard = ({ onBack }) => {
    const [allRecords, setAllRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedPatientRecords, setSelectedPatientRecords] = useState([]);

    useEffect(() => {
        const loadRecords = async () => {
            setLoading(true);
            try {
                const data = await fetchAssessments(true); // Bypass cache for up-to-date analytics
                setAllRecords(data);
            } catch (err) {
                console.error("Dashboard fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        loadRecords();
    }, []);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;

        const q = searchQuery.toLowerCase().trim();
        const filtered = allRecords.filter(r => {
            const pId = (r.patientId || "").toLowerCase();
            const pName = (r.childName || "").toLowerCase();
            return pId === q || pName.includes(q);
        });

        const sorted = [...filtered].sort((a, b) =>
            new Date(b.assessmentDate) - new Date(a.assessmentDate)
        );
        setSelectedPatientRecords(sorted);
    };

    const calculateStats = (records) => {
        if (!records || records.length === 0) return [];

        const categories = ['gross', 'fine', 'language', 'communication', 'social', 'adl', 'cognitive'];

        return records.map(record => {
            let totalYes = 0;
            let totalQuestions = 0;

            // 1. Try nested structure (standard app state)
            categories.forEach(cat => {
                const categoryData = record[cat];
                if (categoryData && typeof categoryData === 'object' && !Array.isArray(categoryData) && Object.keys(categoryData).length > 0) {
                    Object.values(categoryData).forEach(skill => {
                        const val = (typeof skill === 'object' && skill !== null) ? skill.value : skill;
                        if (val === 'Yes') totalYes++;
                        if (val === 'Yes' || val === 'No' || val === 'Sometimes') totalQuestions++;
                    });
                }
            });

            // 2. Try flat structure (direct from Sheet headers like Gross_Walks_In)
            if (totalQuestions === 0) {
                Object.entries(record).forEach(([key, value]) => {
                    const k = key.toLowerCase();
                    // Match any key that starts with a category name followed by an underscore
                    const isSkillKey = categories.some(cat => k.startsWith(cat + '_'));

                    if (isSkillKey) {
                        if (value === 'Yes') totalYes++;
                        if (value === 'Yes' || value === 'No' || value === 'Sometimes') totalQuestions++;
                    }
                });
            }

            // 3. Last fallback: scan everything for Yes/No if still 0 (very loose)
            if (totalQuestions === 0) {
                Object.entries(record).forEach(([key, value]) => {
                    if (value === 'Yes') totalYes++;
                    if (value === 'Yes' || value === 'No') totalQuestions++;
                });
            }

            return {
                date: record.assessmentDate,
                score: totalQuestions > 0 ? (totalYes / totalQuestions) * 100 : 0,
                totalYes,
                totalQuestions,
                assessor: record.assessorName
            };
        }).reverse();
    };

    const stats = useMemo(() => calculateStats(selectedPatientRecords), [selectedPatientRecords]);

    const downloadCSV = () => {
        if (!selectedPatientRecords.length) return;

        const headers = ["Date", "Patient ID", "Name", "Score (%)", "Assessor"];
        const rows = selectedPatientRecords.map(r => {
            const individualStat = calculateStats([r])[0];
            return [
                r.assessmentDate,
                r.patientId,
                r.childName,
                individualStat.score.toFixed(1),
                r.assessorName
            ];
        });

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `OTF_Analytics_${(selectedPatientRecords[0].childName || "Patient").replace(/\s/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="patient-dashboard" style={{ padding: '20px' }}>
            <SectionHeader
                title="Intelligent Patient Records & Analytics"
                description="Power BI-style longitudinal tracking for Occupational Therapy Foundation."
            />

            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '40px',
                backgroundColor: '#fff',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <input
                    type="text"
                    placeholder="Search by Patient ID (e.g. OTF100) or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    style={{
                        flex: 1,
                        padding: '14px 20px',
                        fontSize: '18px',
                        borderRadius: '8px',
                        border: '2px solid var(--color-border)',
                        outline: 'none'
                    }}
                />
                <Button onClick={handleSearch} disabled={loading} style={{ minWidth: '140px' }}>
                    {loading ? 'Fetching...' : 'View Analytics'}
                </Button>
            </div>

            {selectedPatientRecords.length > 0 ? (
                <div className="analytics-view">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '32px',
                        borderBottom: '2px solid #f0f0f0',
                        paddingBottom: '20px'
                    }}>
                        <div>
                            <h2 style={{ fontSize: '32px', color: 'var(--color-primary)', margin: 0 }}>
                                {selectedPatientRecords[0].childName}
                            </h2>
                            <p style={{ color: '#666', fontSize: '18px', marginTop: '8px' }}>
                                Clinical History for ID: <strong>{selectedPatientRecords[0].patientId}</strong> | DOB: {selectedPatientRecords[0].dob}
                            </p>
                        </div>
                        <Button variant="secondary" onClick={downloadCSV}>Export Clinical Data (CSV)</Button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ backgroundColor: '#e3f2fd', padding: '24px', borderRadius: '12px', borderLeft: '6px solid #2196f3' }}>
                            <span style={{ fontSize: '14px', color: '#1976d2', fontWeight: 'bold', textTransform: 'uppercase' }}>Current Level</span>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0d47a1' }}>{Math.round(stats[stats.length - 1].score)}%</div>
                            <span style={{ fontSize: '13px', color: '#1976d2' }}>Latest assessment score</span>
                        </div>
                        <div style={{ backgroundColor: '#e8f5e9', padding: '24px', borderRadius: '12px', borderLeft: '6px solid #4caf50' }}>
                            <span style={{ fontSize: '14px', color: '#2e7d32', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Assessments</span>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1b5e20' }}>{selectedPatientRecords.length}</div>
                            <span style={{ fontSize: '13px', color: '#2e7d32' }}>Records found in system</span>
                        </div>
                        <div style={{ backgroundColor: '#fff3e0', padding: '24px', borderRadius: '12px', borderLeft: '6px solid #ff9800' }}>
                            <span style={{ fontSize: '14px', color: '#ef6c00', fontWeight: 'bold', textTransform: 'uppercase' }}>Overall Progress</span>
                            {stats.length > 1 ? (
                                <>
                                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#e65100' }}>
                                        {stats[stats.length - 1].score - stats[0].score > 0 ? '+' : ''}
                                        {Math.round(stats[stats.length - 1].score - stats[0].score)}%
                                    </div>
                                    <span style={{ fontSize: '13px', color: '#ef6c00' }}>Since baseline assessment</span>
                                </>
                            ) : (
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef6c00', marginTop: '10px' }}>Baseline set</div>
                            )}
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#fff',
                        padding: '32px',
                        borderRadius: '16px',
                        marginBottom: '40px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--color-primary)' }}>📈</span> Performance Trend Analysis
                        </h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            height: '240px',
                            gap: '30px',
                            marginTop: '40px',
                            borderBottom: '2px solid #dee2e6',
                            paddingBottom: '10px',
                            paddingLeft: '20px',
                            overflowX: 'auto'
                        }}>
                            {stats.map((s, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', position: 'relative' }}>
                                    <div style={{
                                        width: '40px',
                                        height: `${s.score * 2}px`,
                                        backgroundColor: '#2196f3',
                                        borderRadius: '8px 8px 0 0',
                                        transition: 'height 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        boxShadow: '0 2px 6px rgba(33, 150, 243, 0.3)',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-32px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: '#333',
                                            color: '#fff',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {Math.round(s.score)}%
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        marginTop: '12px',
                                        textAlign: 'center',
                                        fontWeight: '600',
                                        color: '#666',
                                        lineHeight: '1.2'
                                    }}>
                                        {s.date ? new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }) : 'Unknown'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                    <th style={{ padding: '20px', textAlign: 'left' }}>Assessment Date</th>
                                    <th style={{ padding: '20px', textAlign: 'left' }}>Clinician</th>
                                    <th style={{ padding: '20px', textAlign: 'center' }}>Score</th>
                                    <th style={{ padding: '20px', textAlign: 'right' }}>Performance Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...selectedPatientRecords].map((r, i) => {
                                    const sArray = calculateStats([r]);
                                    const s = sArray[0];

                                    const nextIdx = i + 1;
                                    const prevRecord = nextIdx < selectedPatientRecords.length ? selectedPatientRecords[nextIdx] : null;
                                    const prevS = prevRecord ? calculateStats([prevRecord])[0] : null;
                                    const change = prevS ? s.score - prevS.score : 0;

                                    return (
                                        <tr key={i} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '20px', fontWeight: '600' }}>{r.assessmentDate ? new Date(r.assessmentDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}</td>
                                            <td style={{ padding: '20px', color: '#666' }}>{r.assessorName}</td>
                                            <td style={{ padding: '20px', textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    backgroundColor: s.score > 70 ? '#e8f5e9' : s.score > 40 ? '#fff3e0' : '#ffebee',
                                                    color: s.score > 70 ? '#2e7d32' : s.score > 40 ? '#ef6c00' : '#c62828',
                                                    fontWeight: 'bold',
                                                    fontSize: '14px'
                                                }}>
                                                    {Math.round(s.score)}%
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px', textAlign: 'right' }}>
                                                {prevS ? (
                                                    <span style={{
                                                        color: change > 0 ? '#4caf50' : change < 0 ? '#f44336' : '#9e9e9e',
                                                        fontWeight: 'bold',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        {change > 0 ? '▲' : change < 0 ? '▼' : '●'}
                                                        {Math.abs(Math.round(change))}%
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#9e9e9e', fontStyle: 'italic' }}>Baseline</span>
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
                searchQuery && !loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 40px',
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                        <h3 style={{ margin: 0, color: '#333' }}>No Records Found</h3>
                        <p style={{ color: '#666', marginTop: '10px' }}>We couldn't find any assessments for "{searchQuery}". <br />Please check the Patient ID or try searching by name.</p>
                    </div>
                )
            )}

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <Button variant="secondary" onClick={onBack}>Return to Assessment Form</Button>
            </div>
        </div>
    );
};

export default PatientDashboard;
