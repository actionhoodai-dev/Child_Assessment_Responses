import { useState } from 'react';
import ToggleSwitch from './ToggleSwitch';

const SkillRow = ({ label, value, comment, onUpdate }) => {
    const [showComment, setShowComment] = useState(false || !!comment);

    return (
        <div style={{
            marginBottom: '24px',
            padding: '24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: '#ffffff' // Ensure it stands out against potentially grey bg
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    flex: '1 1 300px',
                    fontSize: '20px',
                    fontWeight: '500',
                    lineHeight: '1.4',
                    color: 'var(--color-text)'
                }}>
                    {label}
                </div>

                <div style={{ flex: '0 0 auto', minWidth: '200px' }}>
                    <ToggleSwitch
                        value={value}
                        onChange={(val) => onUpdate('value', val)}
                        id={`toggle-${label.replace(/\s+/g, '-').toLowerCase()}`}
                    />
                </div>
            </div>

            <div style={{ textAlign: 'right' }}>
                <button
                    type="button"
                    onClick={() => setShowComment(!showComment)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        padding: '8px 0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    {showComment ? 'Hide Comment' : 'Add Note / Observation'}
                    <span style={{ fontSize: '12px' }}>{showComment ? '▲' : '▼'}</span>
                </button>

                {showComment && (
                    <textarea
                        value={comment || ''}
                        onChange={(e) => onUpdate('comment', e.target.value)}
                        placeholder="Add specific observations..."
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            marginTop: '8px',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default SkillRow;
