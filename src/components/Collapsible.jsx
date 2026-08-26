import { useState } from 'react';

function Collapsible({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'none',
          color: '#14181f',
          border: 'none',
          borderBottom: '1.5px solid',
          borderImage: 'linear-gradient(90deg, #12a3e6, #2f9e44) 1',
          padding: '0 0 10px 0',
          fontSize: '1.15rem',
          fontWeight: 500,
          borderRadius: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        {title}
        <span style={{ color: '#12a3e6', fontSize: '0.8rem' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && <div style={{ marginTop: '12px' }}>{children}</div>}
    </div>
  );
}

export default Collapsible;