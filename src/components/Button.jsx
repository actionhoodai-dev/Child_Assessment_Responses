const Button = ({ children, onClick, disabled, variant = 'primary', type = 'button', style = {} }) => {
    const baseStyle = {
        padding: '16px 32px',
        fontSize: '18px',
        fontWeight: '600',
        borderRadius: '8px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: '100%',
        transition: 'background-color 0.2s',
        opacity: disabled ? 0.6 : 1,
        ...style
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
        },
        secondary: {
            backgroundColor: '#fff',
            color: 'var(--color-primary)',
            border: '2px solid var(--color-primary)',
        },
        danger: {
            backgroundColor: 'var(--color-error)',
            color: '#fff',
        }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{ ...baseStyle, ...variants[variant] }}
        >
            {children}
        </button>
    );
};

export default Button;
