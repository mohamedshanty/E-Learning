export const fetchYouTubePlaylist = async (playlistId) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
  );

  const data = await response.json();

  return data.items.map(async (item, index) => ({
    id: index + 1,
    title: item.snippet.title,
    videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
    description: item.snippet.description,
    duration: await getVideoDuration(item.snippet.resourceId.videoId),
    isCompleted: false,
    thumbnail: item.snippet.thumbnails.default.url,
  }));
};

const getVideoDuration = async (videoId) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
  );
  const data = await response.json();
  return convertISOToDuration(data.items[0].contentDetails.duration);
};

function convertISOToDuration(isoDuration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);
  const hours = parseInt(matches[1] || 0, 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const seconds = parseInt(matches[3] || 0, 10);
  return hours * 3600 + minutes * 60 + seconds;
}
