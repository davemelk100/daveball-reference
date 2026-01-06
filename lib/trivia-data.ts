export interface TriviaQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: "history" | "records" | "players" | "teams" | "rules"
}

export const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: "Who holds the record for most career home runs?",
    options: ["Babe Ruth", "Hank Aaron", "Barry Bonds", "Willie Mays"],
    correctAnswer: 2,
    explanation: "Barry Bonds hit 762 career home runs, surpassing Hank Aaron's 755 in 2007.",
    category: "records",
  },
  {
    id: 2,
    question: "Which team won the first World Series in 1903?",
    options: ["New York Yankees", "Boston Americans", "Chicago Cubs", "Pittsburgh Pirates"],
    correctAnswer: 1,
    explanation: "The Boston Americans (later Red Sox) defeated the Pittsburgh Pirates 5 games to 3.",
    category: "history",
  },
  {
    id: 3,
    question: "What is the minimum distance for a home run in MLB?",
    options: ["300 feet", "325 feet", "350 feet", "375 feet"],
    correctAnswer: 1,
    explanation: "MLB rules require a minimum distance of 325 feet down the foul lines and 400 feet to center field.",
    category: "rules",
  },
  {
    id: 4,
    question: "Who threw the only perfect game in World Series history?",
    options: ["Sandy Koufax", "Don Larsen", "Nolan Ryan", "Randy Johnson"],
    correctAnswer: 1,
    explanation:
      "Don Larsen pitched a perfect game for the Yankees against the Dodgers in Game 5 of the 1956 World Series.",
    category: "history",
  },
  {
    id: 5,
    question: "Which player has the most career stolen bases?",
    options: ["Ty Cobb", "Lou Brock", "Rickey Henderson", "Tim Raines"],
    correctAnswer: 2,
    explanation: "Rickey Henderson stole 1,406 bases during his career, far surpassing Lou Brock's 938.",
    category: "records",
  },
  {
    id: 6,
    question: "What year did Jackie Robinson break the color barrier?",
    options: ["1945", "1947", "1949", "1951"],
    correctAnswer: 1,
    explanation: "Jackie Robinson debuted for the Brooklyn Dodgers on April 15, 1947.",
    category: "history",
  },
  {
    id: 7,
    question: "Which pitcher holds the record for most career strikeouts?",
    options: ["Randy Johnson", "Roger Clemens", "Nolan Ryan", "Steve Carlton"],
    correctAnswer: 2,
    explanation: "Nolan Ryan struck out 5,714 batters during his 27-year career.",
    category: "records",
  },
  {
    id: 8,
    question: "How many stitches are on a regulation MLB baseball?",
    options: ["88", "108", "128", "148"],
    correctAnswer: 1,
    explanation: "Every MLB baseball has exactly 108 double stitches (216 individual stitches).",
    category: "rules",
  },
  {
    id: 9,
    question: "Which team has won the most World Series titles?",
    options: ["St. Louis Cardinals", "Boston Red Sox", "New York Yankees", "San Francisco Giants"],
    correctAnswer: 2,
    explanation: "The New York Yankees have won 27 World Series championships.",
    category: "teams",
  },
  {
    id: 10,
    question: "Who hit the 'Shot Heard Round the World' in 1951?",
    options: ["Willie Mays", "Bobby Thomson", "Jackie Robinson", "Duke Snider"],
    correctAnswer: 1,
    explanation: "Bobby Thomson's walk-off home run won the pennant for the Giants against the Dodgers.",
    category: "history",
  },
  {
    id: 11,
    question: "What is the highest single-season batting average since 1900?",
    options: [".406", ".424", ".426", ".440"],
    correctAnswer: 2,
    explanation: "Rogers Hornsby hit .424 for the Cardinals in 1924, the highest since 1900.",
    category: "records",
  },
  {
    id: 12,
    question: "Which stadium is known as 'The House That Ruth Built'?",
    options: ["Fenway Park", "Wrigley Field", "Old Yankee Stadium", "Polo Grounds"],
    correctAnswer: 2,
    explanation: "The original Yankee Stadium (1923-2008) earned this nickname due to Babe Ruth's star power.",
    category: "teams",
  },
  {
    id: 13,
    question: "Who was the first player to earn $1 million per year?",
    options: ["Reggie Jackson", "Pete Rose", "Nolan Ryan", "Mike Schmidt"],
    correctAnswer: 2,
    explanation: "Nolan Ryan became MLB's first $1 million per year player when he signed with the Astros in 1980.",
    category: "players",
  },
  {
    id: 14,
    question: "What is the longest game in MLB history by innings?",
    options: ["22 innings", "25 innings", "26 innings", "33 innings"],
    correctAnswer: 2,
    explanation: "The Dodgers and Red Sox played 26 innings on October 27, 2018 (World Series).",
    category: "history",
  },
  {
    id: 15,
    question: "Which player has the most Gold Glove awards?",
    options: ["Ozzie Smith", "Roberto Clemente", "Greg Maddux", "Brooks Robinson"],
    correctAnswer: 2,
    explanation: "Greg Maddux won 18 Gold Glove awards during his career as a pitcher.",
    category: "players",
  },
  {
    id: 16,
    question: "What is a 'cycle' in baseball?",
    options: [
      "Pitching 9 innings",
      "Hitting single, double, triple, and HR in one game",
      "Turning a triple play",
      "Stealing all four bases",
    ],
    correctAnswer: 1,
    explanation: "Hitting for the cycle means getting a single, double, triple, and home run in the same game.",
    category: "rules",
  },
  {
    id: 17,
    question: "Who was the youngest player to reach 3,000 hits?",
    options: ["Ty Cobb", "Pete Rose", "Hank Aaron", "Robin Yount"],
    correctAnswer: 0,
    explanation: "Ty Cobb reached 3,000 hits at age 34 years and 244 days in 1921.",
    category: "records",
  },
  {
    id: 18,
    question: "Which franchise moved from Milwaukee to Atlanta?",
    options: ["Brewers", "Braves", "Twins", "Orioles"],
    correctAnswer: 1,
    explanation: "The Braves played in Milwaukee from 1953-1965 before moving to Atlanta in 1966.",
    category: "teams",
  },
  {
    id: 19,
    question: "What is the 'Mendoza Line' named after?",
    options: ["A famous umpire", "A light-hitting shortstop", "A stadium", "A rule change"],
    correctAnswer: 1,
    explanation: "Named after Mario Mendoza, it represents a .200 batting average—the threshold of poor hitting.",
    category: "players",
  },
  {
    id: 20,
    question: "How many players are on the field for the defensive team?",
    options: ["8", "9", "10", "11"],
    correctAnswer: 1,
    explanation:
      "Nine players: pitcher, catcher, first baseman, second baseman, shortstop, third baseman, and three outfielders.",
    category: "rules",
  },
  {
    id: 21,
    question: "Who holds the record for most consecutive games played?",
    options: ["Lou Gehrig", "Cal Ripken Jr.", "Pete Rose", "Steve Garvey"],
    correctAnswer: 1,
    explanation: "Cal Ripken Jr. played 2,632 consecutive games from 1982 to 1998.",
    category: "records",
  },
  {
    id: 22,
    question: "What year was the designated hitter rule introduced in the AL?",
    options: ["1969", "1973", "1977", "1981"],
    correctAnswer: 1,
    explanation: "The American League adopted the DH rule in 1973. The NL followed in 2022.",
    category: "rules",
  },
  {
    id: 23,
    question: "Which brothers both won MVP awards?",
    options: ["Alou brothers", "DiMaggio brothers", "Aaron brothers", "Molina brothers"],
    correctAnswer: 1,
    explanation:
      "Joe DiMaggio won 3 MVPs and his brother Dom was a 7-time All-Star (though Dom never won MVP, Joe did).",
    category: "players",
  },
  {
    id: 24,
    question: "What is the oldest MLB stadium still in use?",
    options: ["Wrigley Field", "Fenway Park", "Dodger Stadium", "Oakland Coliseum"],
    correctAnswer: 1,
    explanation: "Fenway Park opened on April 20, 1912, making it the oldest active MLB stadium.",
    category: "teams",
  },
  {
    id: 25,
    question: "Who pitched the most no-hitters in MLB history?",
    options: ["Sandy Koufax", "Bob Feller", "Nolan Ryan", "Randy Johnson"],
    correctAnswer: 2,
    explanation: "Nolan Ryan threw 7 career no-hitters, 3 more than any other pitcher.",
    category: "records",
  },
  {
    id: 26,
    question: "What is a 'walk-off' hit?",
    options: [
      "A hit that ends an inning",
      "A game-winning hit by the home team in their final at-bat",
      "A hit that clears the bases",
      "A hit during a pitching change",
    ],
    correctAnswer: 1,
    explanation: "A walk-off hit ends the game immediately when the home team takes the lead in their last at-bat.",
    category: "rules",
  },
  {
    id: 27,
    question: "Which player won the Triple Crown most recently before 2012?",
    options: ["Ted Williams", "Mickey Mantle", "Frank Robinson", "Carl Yastrzemski"],
    correctAnswer: 3,
    explanation: "Carl Yastrzemski won the Triple Crown in 1967. Miguel Cabrera ended the 45-year drought in 2012.",
    category: "history",
  },
  {
    id: 28,
    question: "What is the 'Green Monster'?",
    options: ["Oakland's mascot", "Fenway Park's left field wall", "A type of curveball", "Chicago's ivy walls"],
    correctAnswer: 1,
    explanation: "The Green Monster is Fenway Park's famous 37-foot left field wall, painted green since 1947.",
    category: "teams",
  },
  {
    id: 29,
    question: "Who was the first African American manager in MLB?",
    options: ["Jackie Robinson", "Frank Robinson", "Dusty Baker", "Cito Gaston"],
    correctAnswer: 1,
    explanation: "Frank Robinson became MLB's first Black manager when he was hired by the Indians in 1975.",
    category: "history",
  },
  {
    id: 30,
    question: "What is the most runs scored in a single MLB game by one team?",
    options: ["27", "30", "33", "36"],
    correctAnswer: 1,
    explanation: "The Texas Rangers scored 30 runs against the Baltimore Orioles on August 22, 2007.",
    category: "records",
  },
]

export function getTriviaForTimePeriod(): TriviaQuestion {
  // Get current date and calculate which 12-hour period we're in
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const msIntoYear = now.getTime() - startOfYear.getTime()
  const hoursIntoYear = msIntoYear / (1000 * 60 * 60)
  const twelvePeriod = Math.floor(hoursIntoYear / 12)

  // Use the period to select a question (cycles through all questions)
  const questionIndex = twelvePeriod % triviaQuestions.length
  return triviaQuestions[questionIndex]
}

export function getNextTriviaTime(): Date {
  const now = new Date()
  const hours = now.getHours()
  const nextPeriod = hours < 12 ? 12 : 24
  const next = new Date(now)
  next.setHours(nextPeriod, 0, 0, 0)
  if (nextPeriod === 24) {
    next.setDate(next.getDate() + 1)
    next.setHours(0, 0, 0, 0)
  }
  return next
}
