import React from 'react';

const ToggleSwitch = ({ value, onChange, id }) => {
    // value can be "Yes", "No", or "" (unselected)

    const isYes = value === "Yes";
    const isNo = value === "No";

    const baseStyle = {
        flex: 1,
        padding: '16px 8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const containerStyle = {
        display: 'flex',
        backgroundColor: '#e0e0e0', // Neutral grey track
        borderRadius: '30px', // Large rounded pill shape
        padding: '4px',
        width: '100%',
        maxWidth: '300px', // Reasonable max width
        margin: '0 auto', // Center if needed
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
    };

    const yesStyle = {
        ...baseStyle,
        backgroundColor: isYes ? 'var(--toggle-yes)' : 'transparent',
        color: isYes ? '#fff' : 'var(--color-text-muted)',
        borderRadius: '24px',
        boxShadow: isYes ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
        transform: isYes ? 'scale(1.02)' : 'scale(1)',
    };

    const noStyle = {
        ...baseStyle,
        backgroundColor: isNo ? 'var(--toggle-no)' : 'transparent',
        color: isNo ? '#fff' : 'var(--color-text-muted)',
        borderRadius: '24px',
        boxShadow: isNo ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
        transform: isNo ? 'scale(1.02)' : 'scale(1)',
    };

    return (
        <div style={containerStyle} role="group" aria-labelledby={id}>
            <button
                type="button"
                onClick={() => onChange("No")}
                style={noStyle}
                aria-pressed={isNo}
            >
                {isNo && <span>✕</span>} No
            </button>
            <button
                type="button"
                onClick={() => onChange("Yes")}
                style={yesStyle}
                aria-pressed={isYes}
            >
                {isYes && <span>✓</span>} Yes
            </button>
        </div>
    );
};

export default ToggleSwitch;
