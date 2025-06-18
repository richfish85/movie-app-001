# Component Overview

This document lists key UI components and notes their related API endpoints along with implementation tips.

| Component | UI Surface | API source | Dev tips |
|-----------|------------|------------|---------|
| Home / Discovery grid | Trending, Popular, Now Playing, Upcoming tabs. | `GET /trending/movie/day`, `GET /movie/now_playing`… | Simple tab UI + TanStack Query caches each list. |
