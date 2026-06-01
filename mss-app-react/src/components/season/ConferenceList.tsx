import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  sport: string;
  year: string;
}

const ConferenceList: React.FC<Props> = ({ sport, year }) => {
  const getConferencesForYear = (year: string): string[] => {
    const y = parseInt(year);
    if (y >= 2024) {
      return ['ACC', 'Big 12', 'Big Ten', 'Pac-12', 'SEC', 'Independents'];
    } else if (y >= 2023) {
      return ['ACC', 'Big Ten', 'Big 12', 'Pac-12', 'SEC', 'Independents'];
    } else if (y >= 2022) {
      return ['ACC', 'Big Ten', 'Big 12', 'Pac-12', 'SEC', 'Independents'];
    } else {
      return ['ACC', 'Big Ten', 'Big 12', 'PAC-12', 'SEC', 'American', 'Independents'];
    }
  };

  const conferences = getConferencesForYear(year);

  return (
    <div className="conference-list">
      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', listStyle: 'none', padding: 0 }}>
        {conferences.map((conf) => (
          <li key={conf}>
            <Link
              to={`/conference/${conf.toLowerCase()}/${year}`}
              style={{
                display: 'block',
                padding: '12px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                textDecoration: 'none',
                color: '#333',
                fontWeight: 'bold',
                textAlign: 'center',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            >
              {conf}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConferenceList;
