// Import all the data from the original data files
import {
  tracks,
  playlists,
  lebronImages,
  videoEdits,
  videoCategories,
  trendingVideos,
  recentlyViewed,
  topLebrons,
} from "@/lib/data"
import { artists } from "@/lib/artist-data"

// Export everything in a single object for easy access
const staticData = {
  tracks,
  playlists,
  lebronImages,
  videoEdits,
  videoCategories,
  trendingVideos,
  recentlyViewed,
  topLebrons,
  artists,
}

export default staticData

