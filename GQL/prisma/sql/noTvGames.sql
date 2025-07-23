SELECT fb.gametitle, fb.visitingteam, fb.hometeam, fb.location, fb.conference, at.tvoptions, fb.timewithoffset, fb.fcs
        FROM mattsarzsports.football fb, mattsarzsports.availabletv at
        WHERE fb.week = $1
          AND fb.season = $2
          AND fb.conference = at.conference
          AND fb.season = at.season
          AND fb.week = at.week
          AND fb.mediaindicator = 'N'
        ORDER BY CAST(fb.time AS DATE), fb.conference;