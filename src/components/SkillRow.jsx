import { useState } from 'react';

const SkillRow = ({ label, value, comment, onUpdate }) => {
    const [showComment, setShowComment] = useState(false || !!comment);

    const toggleStyle = (isActive) => ({
        flex: 1,
        padding: '12px',
        fontSize: '18px',
        fontWeight: '600',
        border: '2px solid',
        borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
        backgroundColor: isActive ? 'var(--color-primary)' : '#fff',
        color: isActive ? '#fff' : 'var(--color-text)',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s'
    });

    return (
        <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '500' }}>
                {label}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <button
                    type="button"
                    onClick={() => onUpdate('value', 'Yes')}
                    style={{ ...toggleStyle(value === 'Yes'), borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
                    aria-pressed={value === 'Yes'}
                >
                    Yes
                </button>
                <button
                    type="button"
                    onClick={() => onUpdate('value', 'No')}
                    style={{ ...toggleStyle(value === 'No'), borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                    aria-pressed={value === 'No'}
                >
                    No
                </button>
            </div>

            <div>
                <button
                    type="button"
                    onClick={() => setShowComment(!showComment)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        textDecoration: 'underline',
                        fontSize: '16px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        padding: 0
                    }}
                >
                    {showComment ? '- Hide Comment' : '+ Add Comment (Optional)'}
                </button>

                {showComment && (
                    <textarea
                        value={comment || ''}
                        onChange={(e) => onUpdate('comment', e.target.value)}
                        placeholder="Add observations..."
                        rows={2}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            border: '2px solid var(--color-border)',
                            marginTop: '8px',
                            resize: 'vertical'
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default SkillRow;
