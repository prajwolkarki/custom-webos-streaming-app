# VidSrc Streaming App for LG webOS TV

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Lint](https://img.shields.io/badge/lint-eslint-4B32C3?logo=eslint)](https://eslint.org)
[![Type Check](https://img.shields.io/badge/type_check-tsc-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Deploy](https://img.shields.io/badge/deploy-webOS%20CLI-green?logo=webos)](https://webostv.developer.lge.com/develop/app-test)

A streaming application built for LG webOS Smart TVs using the VidSrc embed API.

## Features

- Browse latest movies, TV shows, and episodes
- Watch content via embedded VidSrc player
- TV-optimized navigation with LG remote
- Search functionality
- Continue watching & favorites

## API Endpoints Used

- Movies: `https://vsembed.ru/embed/movie/{imdb|tmdb}`
- TV Shows: `https://vsembed.ru/embed/tv/{imdb|tmdb}`
- Episodes: `https://vsembed.ru/embed/tv/{imdb|tmdb}/{season}-{episode}`
- Latest Movies: `https://vsembed.ru/movies/latest/page-{PAGE}.json`
- Latest TV Shows: `https://vsembed.ru/tvshows/latest/page-{PAGE}.json`
- Latest Episodes: `https://vsembed.ru/episodes/latest/page-{PAGE}.json`

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
