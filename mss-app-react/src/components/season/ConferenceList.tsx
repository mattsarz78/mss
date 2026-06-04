import conferenceCasingData from '#data/conferenceCasing.json' with { type: 'json' }; // Type attributes usually aren't needed in React build systems
import type { ConferenceCasing } from '#data/exportTypes.mjs';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface ConferenceListProps {
  conferenceList: string;
  year: string;
}

// Explicit type for our computed structural array
interface ConferenceLinkItem {
  key: string;
  link: ConferenceCasing | undefined;
}

const ConferenceList: React.FC<ConferenceListProps> = ({ conferenceList, year }) => {
  // Helper to locate individual configurations
  const getConferenceCasing = (conference: string) =>
    (conferenceCasingData as ConferenceCasing[]).find((x) => x.id === conference);

  // Parity logic: Replacing Vue's computed() with useMemo
  const conferenceLinks = useMemo(() => {
    const links: ConferenceLinkItem[] = [
      { key: 'acc', link: getConferenceCasing('acc') },
      { key: 'b12', link: getConferenceCasing('b12') },
      { key: 'b1g', link: getConferenceCasing('b1g') },
      { key: 'cusa', link: getConferenceCasing('cusa') },
      { key: 'ind', link: getConferenceCasing('ind') },
      { key: 'mac', link: getConferenceCasing('mac') },
      { key: 'mw', link: getConferenceCasing('mw') },
      {
        key: 'pac',
        link: conferenceList === 'ListBase1' ? getConferenceCasing('p10') : getConferenceCasing('p12'),
      },
      { key: 'sec', link: getConferenceCasing('sec') },
      { key: 'sbc', link: getConferenceCasing('sbc') },
    ];

    // Splice conditional insertions matching Vue's mutation strategy
    if (conferenceList === 'ListBase3') {
      links.splice(1, 0, { key: 'aac', link: getConferenceCasing('aac') });
    } else {
      links.splice(1, 0, { key: 'beast', link: getConferenceCasing('beast') });
    }

    if (conferenceList === 'ListBase1' || conferenceList === 'ListBase2') {
      links.push({ key: 'wac', link: getConferenceCasing('wac') });
    }

    return links;
  }, [conferenceList]); // Re-compute only if the structural base changes

  return (
    <div id="Conference" className="DONTPrint">
      <p>
        <span>By Conference</span>
      </p>
      {conferenceLinks.map((conference) => {
        // Safe guard check just in case lookup returns undefined
        if (!conference.link) return null;

        return (
          <div key={conference.key}>
            <Link to={`/contract/${conference.link.slug}/${year}`}>{conference.link.cased}</Link>
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default ConferenceList;
