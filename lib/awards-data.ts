// Historical MVP and Cy Young Award Winners
// Data sourced from MLB official records with correct player IDs

export interface AwardWinner {
  playerId: number
  playerName: string
  season: number
  team: {
    id: number
    name: string
  }
}

// American League MVP Winners (recent years)
export const alMvpWinners: AwardWinner[] = [
  { playerId: 592450, playerName: "Aaron Judge", season: 2024, team: { id: 147, name: "New York Yankees" } },
  { playerId: 660271, playerName: "Shohei Ohtani", season: 2023, team: { id: 108, name: "Los Angeles Angels" } },
  { playerId: 592450, playerName: "Aaron Judge", season: 2022, team: { id: 147, name: "New York Yankees" } },
  { playerId: 660271, playerName: "Shohei Ohtani", season: 2021, team: { id: 108, name: "Los Angeles Angels" } },
  { playerId: 547989, playerName: "José Abreu", season: 2020, team: { id: 145, name: "Chicago White Sox" } },
  { playerId: 545361, playerName: "Mike Trout", season: 2019, team: { id: 108, name: "Los Angeles Angels" } },
  { playerId: 605141, playerName: "Mookie Betts", season: 2018, team: { id: 111, name: "Boston Red Sox" } },
  { playerId: 514888, playerName: "José Altuve", season: 2017, team: { id: 117, name: "Houston Astros" } },
  { playerId: 545361, playerName: "Mike Trout", season: 2016, team: { id: 108, name: "Los Angeles Angels" } },
  { playerId: 572816, playerName: "Josh Donaldson", season: 2015, team: { id: 141, name: "Toronto Blue Jays" } },
  { playerId: 545361, playerName: "Mike Trout", season: 2014, team: { id: 108, name: "Los Angeles Angels" } },
  { playerId: 408234, playerName: "Miguel Cabrera", season: 2013, team: { id: 116, name: "Detroit Tigers" } },
  { playerId: 408234, playerName: "Miguel Cabrera", season: 2012, team: { id: 116, name: "Detroit Tigers" } },
]

// National League MVP Winners (recent years)
export const nlMvpWinners: AwardWinner[] = [
  { playerId: 660271, playerName: "Shohei Ohtani", season: 2024, team: { id: 119, name: "Los Angeles Dodgers" } },
  { playerId: 660670, playerName: "Ronald Acuña Jr.", season: 2023, team: { id: 144, name: "Atlanta Braves" } },
  { playerId: 502671, playerName: "Paul Goldschmidt", season: 2022, team: { id: 138, name: "St. Louis Cardinals" } },
  { playerId: 547180, playerName: "Bryce Harper", season: 2021, team: { id: 143, name: "Philadelphia Phillies" } },
  { playerId: 518692, playerName: "Freddie Freeman", season: 2020, team: { id: 144, name: "Atlanta Braves" } },
  { playerId: 571448, playerName: "Cody Bellinger", season: 2019, team: { id: 119, name: "Los Angeles Dodgers" } },
  { playerId: 592885, playerName: "Christian Yelich", season: 2018, team: { id: 158, name: "Milwaukee Brewers" } },
  { playerId: 519317, playerName: "Giancarlo Stanton", season: 2017, team: { id: 146, name: "Miami Marlins" } },
  { playerId: 592178, playerName: "Kris Bryant", season: 2016, team: { id: 112, name: "Chicago Cubs" } },
  { playerId: 547180, playerName: "Bryce Harper", season: 2015, team: { id: 120, name: "Washington Nationals" } },
  { playerId: 477132, playerName: "Clayton Kershaw", season: 2014, team: { id: 119, name: "Los Angeles Dodgers" } },
  { playerId: 457705, playerName: "Andrew McCutchen", season: 2013, team: { id: 134, name: "Pittsburgh Pirates" } },
  { playerId: 457763, playerName: "Buster Posey", season: 2012, team: { id: 137, name: "San Francisco Giants" } },
]

// American League Cy Young Winners (recent years)
export const alCyYoungWinners: AwardWinner[] = [
  { playerId: 669373, playerName: "Tarik Skubal", season: 2024, team: { id: 116, name: "Detroit Tigers" } },
  { playerId: 543037, playerName: "Gerrit Cole", season: 2023, team: { id: 147, name: "New York Yankees" } },
  { playerId: 434378, playerName: "Justin Verlander", season: 2022, team: { id: 117, name: "Houston Astros" } },
  { playerId: 596129, playerName: "Robbie Ray", season: 2021, team: { id: 141, name: "Toronto Blue Jays" } },
  { playerId: 669456, playerName: "Shane Bieber", season: 2020, team: { id: 114, name: "Cleveland Guardians" } },
  { playerId: 434378, playerName: "Justin Verlander", season: 2019, team: { id: 117, name: "Houston Astros" } },
  { playerId: 605483, playerName: "Blake Snell", season: 2018, team: { id: 139, name: "Tampa Bay Rays" } },
  { playerId: 446372, playerName: "Corey Kluber", season: 2017, team: { id: 114, name: "Cleveland Guardians" } },
  { playerId: 519144, playerName: "Rick Porcello", season: 2016, team: { id: 111, name: "Boston Red Sox" } },
  { playerId: 521230, playerName: "Dallas Keuchel", season: 2015, team: { id: 117, name: "Houston Astros" } },
  { playerId: 446372, playerName: "Corey Kluber", season: 2014, team: { id: 114, name: "Cleveland Guardians" } },
  { playerId: 453286, playerName: "Max Scherzer", season: 2013, team: { id: 116, name: "Detroit Tigers" } },
  { playerId: 456034, playerName: "David Price", season: 2012, team: { id: 139, name: "Tampa Bay Rays" } },
]

// National League Cy Young Winners (recent years)
export const nlCyYoungWinners: AwardWinner[] = [
  { playerId: 519242, playerName: "Chris Sale", season: 2024, team: { id: 144, name: "Atlanta Braves" } },
  { playerId: 605483, playerName: "Blake Snell", season: 2023, team: { id: 135, name: "San Diego Padres" } },
  { playerId: 645261, playerName: "Sandy Alcantara", season: 2022, team: { id: 146, name: "Miami Marlins" } },
  { playerId: 669203, playerName: "Corbin Burnes", season: 2021, team: { id: 158, name: "Milwaukee Brewers" } },
  { playerId: 545333, playerName: "Trevor Bauer", season: 2020, team: { id: 113, name: "Cincinnati Reds" } },
  { playerId: 594798, playerName: "Jacob deGrom", season: 2019, team: { id: 121, name: "New York Mets" } },
  { playerId: 594798, playerName: "Jacob deGrom", season: 2018, team: { id: 121, name: "New York Mets" } },
  { playerId: 453286, playerName: "Max Scherzer", season: 2017, team: { id: 120, name: "Washington Nationals" } },
  { playerId: 453286, playerName: "Max Scherzer", season: 2016, team: { id: 120, name: "Washington Nationals" } },
  { playerId: 453562, playerName: "Jake Arrieta", season: 2015, team: { id: 112, name: "Chicago Cubs" } },
  { playerId: 477132, playerName: "Clayton Kershaw", season: 2014, team: { id: 119, name: "Los Angeles Dodgers" } },
  { playerId: 477132, playerName: "Clayton Kershaw", season: 2013, team: { id: 119, name: "Los Angeles Dodgers" } },
  { playerId: 285079, playerName: "R.A. Dickey", season: 2012, team: { id: 121, name: "New York Mets" } },
]

export function getMVPWinnersStatic(): { al: AwardWinner[]; nl: AwardWinner[] } {
  return {
    al: alMvpWinners,
    nl: nlMvpWinners,
  }
}

export function getCyYoungWinnersStatic(): { al: AwardWinner[]; nl: AwardWinner[] } {
  return {
    al: alCyYoungWinners,
    nl: nlCyYoungWinners,
  }
}
