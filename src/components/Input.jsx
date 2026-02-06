const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, name, max }) => {
    return (
        <div style={{ marginBottom: '24px' }}>
            <label
                style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--color-text)'
                }}
            >
                {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                max={max}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    border: '2px solid var(--color-border)',
                    backgroundColor: '#fff',
                    color: 'var(--color-text)'
                }}
            />
        </div>
    );
};

export default Input;
