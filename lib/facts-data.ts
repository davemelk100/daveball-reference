// Daily baseball facts for Major League Numbers

export interface BaseballFact {
  fact: string
  category: "history" | "records" | "players" | "teams" | "rules" | "stadium"
}

export const baseballFacts: BaseballFact[] = [
  // History
  {
    fact: "The first professional baseball team was the Cincinnati Red Stockings, formed in 1869.",
    category: "history",
  },
  { fact: "The World Series has been played every year since 1903, except for 1904 and 1994.", category: "history" },
  {
    fact: "Jackie Robinson broke the color barrier on April 15, 1947, with the Brooklyn Dodgers.",
    category: "history",
  },
  { fact: "The designated hitter rule was adopted by the American League in 1973.", category: "history" },
  { fact: "The first night game in MLB history was played on May 24, 1935, in Cincinnati.", category: "history" },
  { fact: "The New York Yankees have won 27 World Series titles, more than any other team.", category: "history" },
  { fact: "The first MLB All-Star Game was played in 1933 at Comiskey Park in Chicago.", category: "history" },
  { fact: "Babe Ruth was sold from the Red Sox to the Yankees for $100,000 in 1920.", category: "history" },
  {
    fact: "The National League was founded in 1876, making it the oldest major professional sports league in the US.",
    category: "history",
  },
  { fact: "The last player to hit .400 in a season was Ted Williams in 1941 (.406).", category: "history" },

  // Records
  { fact: "Nolan Ryan holds the record for most career strikeouts with 5,714.", category: "records" },
  { fact: "Barry Bonds holds the single-season home run record with 73 in 2001.", category: "records" },
  { fact: "Cal Ripken Jr. played in 2,632 consecutive games, an MLB record.", category: "records" },
  { fact: "Rickey Henderson stole 1,406 bases in his career, the all-time record.", category: "records" },
  { fact: "Cy Young won 511 games, a record that will likely never be broken.", category: "records" },
  { fact: "Joe DiMaggio's 56-game hitting streak in 1941 remains unbroken.", category: "records" },
  { fact: "Pete Rose has the most career hits with 4,256.", category: "records" },
  { fact: "Johnny Vander Meer is the only pitcher to throw back-to-back no-hitters (1938).", category: "records" },
  {
    fact: "Hank Aaron held the career home run record (755) for 33 years until Barry Bonds broke it.",
    category: "records",
  },
  { fact: "The longest game in MLB history lasted 25 innings (Brewers vs White Sox, 1984).", category: "records" },

  // Players
  { fact: "Babe Ruth began his career as a pitcher and had a 94-46 record with a 2.28 ERA.", category: "players" },
  {
    fact: "Shohei Ohtani is the first player since Babe Ruth to excel as both a pitcher and hitter.",
    category: "players",
  },
  {
    fact: "Willie Mays made 'The Catch' in the 1954 World Series, one of baseball's most iconic plays.",
    category: "players",
  },
  {
    fact: "Lou Gehrig's farewell speech calling himself 'the luckiest man' is one of sports' most famous moments.",
    category: "players",
  },
  { fact: "Mariano Rivera is the only player to be unanimously inducted into the Hall of Fame.", category: "players" },
  { fact: "Ichiro Suzuki had 262 hits in 2004, the single-season record.", category: "players" },
  {
    fact: "Sandy Koufax retired at age 30 due to arthritis, despite being at the peak of his career.",
    category: "players",
  },
  {
    fact: "Ken Griffey Jr. was the first player selected first overall to be inducted into the Hall of Fame.",
    category: "players",
  },
  { fact: "Derek Jeter had 3,465 career hits, 6th most in MLB history.", category: "players" },
  { fact: "Mike Trout has won 3 MVP awards, tied for most among active players.", category: "players" },

  // Teams
  {
    fact: "The Seattle Mariners have never appeared in a World Series despite making the playoffs 5 times.",
    category: "teams",
  },
  { fact: "The Chicago Cubs went 108 years between World Series wins (1908-2016).", category: "teams" },
  {
    fact: "The Oakland Athletics have moved cities three times: Philadelphia, Kansas City, and Oakland.",
    category: "teams",
  },
  { fact: "The Tampa Bay Rays had the lowest payroll in MLB in 2023 but made the playoffs.", category: "teams" },
  {
    fact: "The Houston Astros started in the National League and moved to the American League in 2013.",
    category: "teams",
  },
  { fact: "The Los Angeles Dodgers have had the highest payroll in MLB for multiple years.", category: "teams" },
  { fact: "The Cleveland Guardians changed their name from Indians in 2022.", category: "teams" },
  { fact: "The Milwaukee Brewers are the only team to switch from AL to NL (1998).", category: "teams" },
  { fact: "The St. Louis Cardinals have won 11 World Series, second most behind the Yankees.", category: "teams" },
  { fact: "The Baltimore Orioles were originally the St. Louis Browns before moving in 1954.", category: "teams" },

  // Rules
  {
    fact: "A baseball must weigh between 5 and 5.25 ounces and measure 9 to 9.25 inches in circumference.",
    category: "rules",
  },
  { fact: "The pitcher's mound is exactly 60 feet, 6 inches from home plate.", category: "rules" },
  { fact: "A batter is allowed to take first base if hit by a pitch, unless they swing at it.", category: "rules" },
  { fact: "The infield fly rule was adopted in 1895 to prevent defensive trickery.", category: "rules" },
  {
    fact: "MLB introduced a pitch clock in 2023, limiting pitchers to 15 seconds with bases empty.",
    category: "rules",
  },
  { fact: "A balk can only be called when there are runners on base.", category: "rules" },
  {
    fact: "The strike zone extends from the midpoint of a batter's torso to just below their knee.",
    category: "rules",
  },
  { fact: "Batters must keep one foot in the batter's box between pitches under current rules.", category: "rules" },
  { fact: "Teams are limited to 5 mound visits per game without making a pitching change.", category: "rules" },
  { fact: "The designated hitter was adopted by both leagues starting in 2022.", category: "rules" },

  // Stadiums
  { fact: "Fenway Park, built in 1912, is the oldest MLB stadium still in use.", category: "stadium" },
  { fact: "The Green Monster at Fenway Park is 37 feet, 2 inches tall.", category: "stadium" },
  {
    fact: "Coors Field in Denver is called 'Coors Field' because balls travel farther in thin air.",
    category: "stadium",
  },
  { fact: "The original Yankee Stadium was known as 'The House That Ruth Built.'", category: "stadium" },
  {
    fact: "Oracle Park in San Francisco has 'McCovey Cove' where fans catch home runs in kayaks.",
    category: "stadium",
  },
  { fact: "The Houston Astrodome, opened in 1965, was the first domed stadium.", category: "stadium" },
  { fact: "Wrigley Field's ivy-covered outfield walls were planted in 1937.", category: "stadium" },
  { fact: "Chase Field in Arizona has a retractable roof and a swimming pool in center field.", category: "stadium" },
  {
    fact: "PNC Park in Pittsburgh is consistently rated as one of the most beautiful MLB stadiums.",
    category: "stadium",
  },
  { fact: "Dodger Stadium is the largest MLB stadium by seating capacity (56,000).", category: "stadium" },

  // More history
  {
    fact: "The 'Curse of the Bambino' referred to the Red Sox not winning a World Series after trading Babe Ruth.",
    category: "history",
  },
  {
    fact: "The 1919 Black Sox scandal saw 8 White Sox players banned for fixing the World Series.",
    category: "history",
  },
  {
    fact: "Roberto Clemente died in a plane crash while delivering aid to earthquake victims in Nicaragua.",
    category: "history",
  },
  { fact: "The MLB draft was first held in 1965, with Rick Monday as the first pick.", category: "history" },
  {
    fact: "Free agency began in 1976 after the Seitz decision changed baseball economics forever.",
    category: "history",
  },

  // More records
  { fact: "The fastest pitch ever recorded was 105.8 mph by Aroldis Chapman.", category: "records" },
  { fact: "The longest home run in recorded history was 575 feet by Mickey Mantle in 1953.", category: "records" },
  { fact: "Craig Biggio was hit by 285 pitches, the modern era record.", category: "records" },
  {
    fact: "Fernando Tatis Jr. hit 2 grand slams in one inning in 1999 - the only player to do so.",
    category: "records",
  },
  { fact: "Mark Buehrle threw the fastest perfect game in history at just 2 hours, 3 minutes.", category: "records" },

  // More players
  { fact: "Satchel Paige debuted in MLB at age 42 and pitched until he was 59.", category: "players" },
  {
    fact: "Randy Johnson once exploded a bird with a pitch during a spring training game in 2001.",
    category: "players",
  },
  { fact: "Bo Jackson was an All-Star in both MLB and the NFL.", category: "players" },
  { fact: "Greg Maddux won 4 consecutive Cy Young Awards from 1992-1995.", category: "players" },
  {
    fact: "Albert Pujols hit his 700th home run in 2022, only the 4th player ever to reach that milestone.",
    category: "players",
  },

  // More teams
  { fact: "The Florida Marlins won 2 World Series despite never winning a division title.", category: "teams" },
  { fact: "The New York Mets were founded in 1962 and lost 120 games in their first season.", category: "teams" },
  { fact: "The Minnesota Twins started as the Washington Senators before moving in 1961.", category: "teams" },
  {
    fact: "The Arizona Diamondbacks won the World Series in just their 4th year of existence (2001).",
    category: "teams",
  },
  { fact: "The Pittsburgh Pirates had 20 consecutive losing seasons from 1993-2012.", category: "teams" },

  // More rules/gameplay
  { fact: "A perfect game requires retiring all 27 batters without anyone reaching base.", category: "rules" },
  {
    fact: "The 'neighborhood play' at second base was eliminated after video review was expanded in 2016.",
    category: "rules",
  },
  { fact: "Umpires must rub 90-120 baseballs with special mud before each game.", category: "rules" },
  { fact: "A regulation baseball has exactly 108 stitches.", category: "rules" },
  {
    fact: "MLB banned the spitball in 1920, but grandfathered in 17 pitchers who could continue using it.",
    category: "rules",
  },

  // More stadiums
  { fact: "Camden Yards, opened in 1992, started the trend of 'retro' baseball stadium design.", category: "stadium" },
  { fact: "Target Field in Minnesota was the first open-air stadium in the region since 1981.", category: "stadium" },
  {
    fact: "Tropicana Field's catwalks have caused some of the strangest plays in baseball history.",
    category: "stadium",
  },
  { fact: "The old Polo Grounds had center field fences over 480 feet from home plate.", category: "stadium" },
  {
    fact: "T-Mobile Park in Seattle has a retractable roof that doesn't fully enclose the stadium.",
    category: "stadium",
  },
]

// Get today's fact using a date-based seed for consistency
export function getDailyFact(): BaseballFact {
  const today = new Date()
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

  // Create a simple hash from the date string
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  const index = Math.abs(hash) % baseballFacts.length
  return baseballFacts[index]
}
