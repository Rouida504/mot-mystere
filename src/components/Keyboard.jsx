const KEYBOARD_ROWS = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'DELETE']
];

export default function Keyboard({ onKeyPress, letterStatuses }) {
  return (
    <div className="keyboard" style={{ marginTop: '20px' }}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row" style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '5px' }}>
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`key ${letterStatuses[key] || ''}`}
              style={{
                padding: key.length > 1 ? '10px 12px' : '10px 15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderRadius: '4px',
                border: 'none'
              }}
            >
              {key === 'DELETE' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}