import React from 'react';
import './Timestamp.css';

export default function TimestampList({ rows = [], onJump, activeSeconds }) {
  if (!rows.length) {
    return <p className="tt-ts__empty">No timestamps yet.</p>;
  }

  return (
    <ol className="tt-ts">
      {rows.map((row, i) => {
        const active = activeSeconds != null && activeSeconds === row.seconds;
        return (
          <li key={`${row.seconds}-${i}`} className={`tt-ts__row ${active ? 'is-active' : ''}`}>
            <button
              type="button"
              className="tt-ts__stamp"
              onClick={() => onJump && onJump(row.seconds)}
              aria-label={`Jump to ${row.stamp}`}
            >
              {row.stamp}
            </button>
            <div className="tt-ts__body">
              <div className="tt-ts__title">{row.title}</div>
              {row.note && <div className="tt-ts__note">{row.note}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
