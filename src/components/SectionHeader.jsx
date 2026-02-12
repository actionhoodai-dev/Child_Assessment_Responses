const SectionHeader = ({ title, description }) => {
    return (
        <div style={{ marginBottom: '32px', borderLeft: '4px solid var(--color-primary)', paddingLeft: '16px' }}>
            <h2 style={{
                margin: '0 0 8px 0',
                color: 'var(--color-primary)',
                fontSize: '24px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {title}
            </h2>
            {description && (
                <p style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '18px',
                    margin: 0
                }}>
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeader;
