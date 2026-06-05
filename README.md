# VidSrc Streaming App for LG webOS TV

A streaming application built for LG webOS Smart TVs using the VidSrc embed API.

## Features

- Browse latest movies, TV shows, and episodes
- Watch content via embedded VidSrc player
- TV-optimized navigation with LG remote
- Search functionality
- Continue watching & favorites

## API Endpoints Used

- Movies: `https://vidsrc-embed.ru/embed/movie/{imdb|tmdb}`
- TV Shows: `https://vidsrc-embed.ru/embed/tv/{imdb|tmdb}`
- Episodes: `https://vidsrc-embed.ru/embed/tv/{imdb|tmdb}/{season}-{episode}`
- Latest Movies: `https://vidsrc-embed.ru/movies/latest/page-{PAGE}.json`
- Latest TV Shows: `https://vidsrc-embed.ru/tvshows/latest/page-{PAGE}.json`
- Latest Episodes: `https://vidsrc-embed.ru/episodes/latest/page-{PAGE}.json`

## Installation on webOS

1. Package the app using the webOS CLI
2. Install via webOS Device Manager or Developer Mode
3. Launch from the TV's app launcher

## Folder Structure

```
vidsrc-streaming-app/
├── appinfo.json
├── index.html
├── src/
│   ├── app.js
│   ├── api/
│   ├── components/
│   ├── navigation/
│   ├── styles/
│   └── utils/
└── assets/
```

## License

MIT
