import React from 'react';
import { Link } from 'react-router-dom';

interface WeekInfo {
  week: number;
  postseasonInd?: string | boolean;
}

interface Props {
  weeks: WeekInfo[];
  sport: string;
}

const SeasonDates: React.FC<Props> = ({ weeks, sport }) => {
  if (!weeks || weeks.length === 0) {
    return <p>No weeks available for this season.</p>;
  }

  return (
    <div className="season-dates">
      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', listStyle: 'none', padding: 0 }}>
        {weeks.map((week) => (
          <li key={week.week}>
            <Link
              to={`/schedule/${sport}/${week.week}`}
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                backgroundColor: week.postseasonInd ? '#ff9800' : '#2196f3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {week.postseasonInd ? `${sport === 'basketball' ? 'Postseason' : 'Bowl'}` : `Week ${week.week}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeasonDates;
