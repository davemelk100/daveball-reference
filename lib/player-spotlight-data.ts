// Player spotlight data for Major League Numbers
// Features legendary and notable MLB players with interesting facts

export interface SpotlightPlayer {
  id: number
  name: string
  position: string
  team: string
  years: string
  fact: string
}

export const spotlightPlayers: SpotlightPlayer[] = [
  {
    id: 121578,
    name: "Babe Ruth",
    position: "OF/P",
    team: "Yankees",
    years: "1914-1935",
    fact: "Started his career as a dominant pitcher before becoming baseball's greatest slugger, hitting 714 home runs.",
  },
  {
    id: 114680,
    name: "Lou Gehrig",
    position: "1B",
    team: "Yankees",
    years: "1923-1939",
    fact: "Played 2,130 consecutive games, a record that stood for 56 years until Cal Ripken Jr. broke it.",
  },
  {
    id: 121314,
    name: "Jackie Robinson",
    position: "2B",
    team: "Dodgers",
    years: "1947-1956",
    fact: "Broke baseball's color barrier on April 15, 1947, and his #42 is retired across all of MLB.",
  },
  {
    id: 118495,
    name: "Willie Mays",
    position: "CF",
    team: "Giants",
    years: "1951-1973",
    fact: "Made 'The Catch' in the 1954 World Series, widely considered the greatest defensive play ever.",
  },
  {
    id: 110001,
    name: "Hank Aaron",
    position: "OF",
    team: "Braves",
    years: "1954-1976",
    fact: "Held the career home run record (755) for 33 years and never struck out 100 times in a season.",
  },
  {
    id: 124341,
    name: "Ted Williams",
    position: "LF",
    team: "Red Sox",
    years: "1939-1960",
    fact: "Last player to hit .400 in a season (.406 in 1941) and lost nearly 5 prime years to military service.",
  },
  {
    id: 112391,
    name: "Roberto Clemente",
    position: "RF",
    team: "Pirates",
    years: "1955-1972",
    fact: "Got his 3,000th hit in his final at-bat before tragically dying in a plane crash delivering humanitarian aid.",
  },
  {
    id: 117277,
    name: "Sandy Koufax",
    position: "P",
    team: "Dodgers",
    years: "1955-1966",
    fact: "Retired at 30 due to arthritis after winning 3 Cy Youngs and throwing 4 no-hitters including a perfect game.",
  },
  {
    id: 114756,
    name: "Bob Gibson",
    position: "P",
    team: "Cardinals",
    years: "1959-1975",
    fact: "Posted a 1.12 ERA in 1968, so dominant that MLB lowered the mound the following year.",
  },
  {
    id: 118258,
    name: "Mickey Mantle",
    position: "CF",
    team: "Yankees",
    years: "1951-1968",
    fact: "Hit the longest measured home run (565 feet) and won the Triple Crown in 1956.",
  },
  {
    id: 119602,
    name: "Stan Musial",
    position: "OF/1B",
    team: "Cardinals",
    years: "1941-1963",
    fact: "Had exactly 1,815 hits at home and 1,815 hits on the road - perfect symmetry over 22 seasons.",
  },
  {
    id: 121597,
    name: "Nolan Ryan",
    position: "P",
    team: "Multiple",
    years: "1966-1993",
    fact: "Threw an MLB record 7 no-hitters and struck out 5,714 batters - nearly 1,000 more than second place.",
  },
  {
    id: 121222,
    name: "Cal Ripken Jr.",
    position: "SS",
    team: "Orioles",
    years: "1981-2001",
    fact: "Played 2,632 consecutive games, breaking Lou Gehrig's 'unbreakable' record.",
  },
  {
    id: 115009,
    name: "Rickey Henderson",
    position: "LF",
    team: "Multiple",
    years: "1979-2003",
    fact: "Stole 1,406 bases - 468 more than second place, making it perhaps the most unbreakable record.",
  },
  {
    id: 111432,
    name: "George Brett",
    position: "3B",
    team: "Royals",
    years: "1973-1993",
    fact: "Hit .390 in 1980, the closest anyone has come to .400 since Ted Williams.",
  },
  {
    id: 115270,
    name: "Tony Gwynn",
    position: "RF",
    team: "Padres",
    years: "1982-2001",
    fact: "Won 8 batting titles and struck out only 434 times in 20 seasons - less than some players in 2 years.",
  },
  {
    id: 118120,
    name: "Greg Maddux",
    position: "P",
    team: "Multiple",
    years: "1986-2008",
    fact: "Won 4 consecutive Cy Young Awards (1992-1995) with pinpoint control and baseball intelligence.",
  },
  {
    id: 116615,
    name: "Randy Johnson",
    position: "P",
    team: "Multiple",
    years: "1988-2009",
    fact: "At 6'10\", he was the tallest player in MLB history and struck out 4,875 batters.",
  },
  {
    id: 112388,
    name: "Roger Clemens",
    position: "P",
    team: "Multiple",
    years: "1984-2007",
    fact: "Won 7 Cy Young Awards - more than any other pitcher in MLB history.",
  },
  {
    id: 118377,
    name: "Pedro Martinez",
    position: "P",
    team: "Multiple",
    years: "1992-2009",
    fact: "In 2000, had a 1.74 ERA in the peak steroid era when league average was 4.77.",
  },
  {
    id: 115135,
    name: "Ken Griffey Jr.",
    position: "CF",
    team: "Multiple",
    years: "1989-2010",
    fact: "Had one of the sweetest swings in baseball history and hit 630 home runs.",
  },
  {
    id: 111188,
    name: "Barry Bonds",
    position: "LF",
    team: "Multiple",
    years: "1986-2007",
    fact: "Hit 73 home runs in 2001 and holds career records for home runs (762) and walks (2,558).",
  },
  {
    id: 116539,
    name: "Derek Jeter",
    position: "SS",
    team: "Yankees",
    years: "1995-2014",
    fact: "Collected 3,465 hits and won 5 World Series titles, all with the Yankees.",
  },
  {
    id: 121250,
    name: "Mariano Rivera",
    position: "P",
    team: "Yankees",
    years: "1995-2013",
    fact: "First player unanimously elected to the Hall of Fame, saved 652 games with his legendary cutter.",
  },
  {
    id: 425844,
    name: "Albert Pujols",
    position: "1B",
    team: "Multiple",
    years: "2001-2022",
    fact: "Won 3 MVPs in his first decade and finished with 703 home runs, 4th all-time.",
  },
  {
    id: 429665,
    name: "Miguel Cabrera",
    position: "1B",
    team: "Multiple",
    years: "2003-2023",
    fact: "Won the Triple Crown in 2012, the first player to do so since Carl Yastrzemski in 1967.",
  },
  {
    id: 477132,
    name: "Clayton Kershaw",
    position: "P",
    team: "Dodgers",
    years: "2008-present",
    fact: "Won 3 Cy Young Awards and is considered the best pitcher of his generation.",
  },
  {
    id: 545361,
    name: "Mike Trout",
    position: "CF",
    team: "Angels",
    years: "2011-present",
    fact: "Won 3 MVPs before turning 30 and is often called the best player of his generation.",
  },
  {
    id: 660271,
    name: "Shohei Ohtani",
    position: "P/DH",
    team: "Dodgers",
    years: "2018-present",
    fact: "First player since Babe Ruth to excel as both a pitcher and hitter, winning back-to-back MVPs.",
  },
  {
    id: 592450,
    name: "Aaron Judge",
    position: "RF",
    team: "Yankees",
    years: "2016-present",
    fact: "Set the AL single-season home run record with 62 in 2022, breaking Roger Maris's 61-year-old mark.",
  },
]

export function getDailyPlayer(): SpotlightPlayer {
  const today = new Date()
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

  // Create a hash from the date string
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  const index = Math.abs(hash) % spotlightPlayers.length
  return spotlightPlayers[index]
}
