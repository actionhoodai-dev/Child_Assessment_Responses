const SectionHeader = ({ title, description }) => {
    return (
        <div style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--color-surface)',
            paddingBottom: '16px',
            paddingTop: '16px',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '24px',
            zIndex: 10
        }}>
            <h2 style={{ margin: 0, color: 'var(--color-text)' }}>{title}</h2>
            {description && <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)' }}>{description}</p>}
        </div>
    );
};

export default SectionHeader;
