import type { WeekInfo } from '#/graphQl.mjs';
import React from 'react';
import { Link } from 'react-router-dom';

interface WeekLinkProps {
  content: WeekInfo;
  sport: string;
  linkText: string;
  year: string;
}

const WeekLink: React.FC<WeekLinkProps> = ({ content, sport, linkText, year }) => {
  return (
    <>
      <Link to={`/schedule/${sport}/${year}/${content.week}`}>{linkText}</Link>
      <br />
    </>
  );
};

export default WeekLink;
