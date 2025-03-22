export interface PlayerStats {
  ppg: number // Points Per Game
  rpg: number // Rebounds Per Game
  apg: number // Assists Per Game
  spg: number // Steals Per Game
  bpg: number // Blocks Per Game
  fg: string // Field Goal Percentage
  threeP: string // Three-Point Percentage
  ft: string // Free Throw Percentage
  mpg: number // Minutes Per Game
  ftm?: number // Free Throws Made
  fta?: number // Free Throws Attempted
  ftLeague?: string // League ranking in free throws
}

export interface SeasonStats extends PlayerStats {
  season: string
  team: string
  gamesPlayed: number
}

export interface Achievement {
  title: string
  year: string | number
  description?: string
}

export interface PodcastStats {
  totalEpisodes: number
  totalViews: number
  averageViewsPerEpisode: number
  topEpisode: string
  topEpisodeViews: number
}

export interface Artist {
  name: string
  fullName?: string
  imageUrl: string
  bio: string
  currentTeam?: string
  position?: string
  jerseyNumber?: string
  height?: string
  weight?: string
  birthDate?: string
  birthPlace?: string
  drafted?: string
  currentStats?: PlayerStats
  careerStats?: PlayerStats
  seasonStats?: SeasonStats[]
  achievements?: Achievement[]
  podcastStats?: PodcastStats
  albums: string[]
  singles: string[]
  featuredOn?: string[]
}

// IMPORTANT: Replace all placeholder media URLs with your own hosted content before using
// See README.md for instructions on setting up your media assets
export const artists: Artist[] = [
  {
    name: "LeBron James",
    fullName: "LeBron Raymone James Sr.",
    imageUrl: "/assets/artists/lebron-james.jpg",
    bio: "Basketball player known for his dominant play style and leadership both on and off the court.",
    currentTeam: "Los Angeles Lakers",
    position: "Small Forward / Power Forward",
    jerseyNumber: "23",
    height: "6'9\" (2.06 m)",
    weight: "250 lbs (113 kg)",
    birthDate: "December 30, 1984",
    birthPlace: "Akron, Ohio",
    drafted: "2003 NBA Draft, 1st overall by the Cleveland Cavaliers",
    currentStats: {
      ppg: 25.7,
      rpg: 7.3,
      apg: 8.3,
      spg: 1.1,
      bpg: 0.5,
      fg: "54.0%",
      threeP: "41.0%",
      ft: "73.5%",
      mpg: 35.7,
    },
    careerStats: {
      ppg: 27.1,
      rpg: 7.5,
      apg: 7.3,
      spg: 1.6,
      bpg: 0.8,
      fg: "50.7%",
      threeP: "34.8%",
      ft: "73.9%",
      mpg: 38.2,
    },
    seasonStats: [
      {
        season: "2022-23",
        team: "Los Angeles Lakers",
        gamesPlayed: 72,
        ppg: 28.9,
        rpg: 8.3,
        apg: 6.8,
        spg: 0.9,
        bpg: 0.6,
        fg: "50.0%",
        threeP: "32.1%",
        ft: "76.8%",
        mpg: 35.5,
      },
      {
        season: "2021-22",
        team: "Los Angeles Lakers",
        gamesPlayed: 56,
        ppg: 30.3,
        rpg: 8.2,
        apg: 6.2,
        spg: 1.3,
        bpg: 1.1,
        fg: "52.4%",
        threeP: "35.9%",
        ft: "75.6%",
        mpg: 37.2,
      },
      {
        season: "2020-21",
        team: "Los Angeles Lakers",
        gamesPlayed: 45,
        ppg: 25.0,
        rpg: 7.7,
        apg: 7.8,
        spg: 1.1,
        bpg: 0.6,
        fg: "51.3%",
        threeP: "36.5%",
        ft: "69.8%",
        mpg: 33.4,
      },
    ],
    achievements: [
      {
        title: "NBA Champion",
        year: "2020, 2016, 2013, 2012",
        description: "Won NBA championships with the Lakers, Cavaliers, and Heat",
      },
      {
        title: "NBA Finals MVP",
        year: "2020, 2016, 2013, 2012",
        description: "Named the most valuable player in the NBA Finals",
      },
      {
        title: "NBA Most Valuable Player",
        year: "2013, 2012, 2010, 2009",
        description: "Named the most valuable player in the NBA regular season",
      },
      {
        title: "NBA All-Star",
        year: "2005-2023",
        description: "Selected to the NBA All-Star team 19 consecutive times",
      },
      {
        title: "Olympic Gold Medalist",
        year: "2012, 2008",
        description: "Won gold medals with Team USA at the Olympics",
      },
    ],
    albums: [
      "Bron and Jerry",
      "LBJ",
      "LeBronaissance",
      "First Day Out",
      "Bronfoolery",
      "Raymone",
      "BRON",
      "DragonBron Z",
      "Bron no Basket",
    ],
    singles: [
      "First Day Out",
      "Like That ft. Kawhi Leonard",
      "Hooper ft. Caitlin Clark",
      "That's Our Ball Ain't It",
      "TV Off feat. James Harden",
      "Washed Anthem",
      "Slow Dancing with LeBron",
    ],
  },
  // Add more artists if needed with placeholder URLs
]

