# 🎬 CineShelf – Movie Collection Angular App

A sleek and modular Angular application that lets you **search for movies**, **view detailed information**, and **manage personal movie collections** using [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs/getting-started). Built with modern Angular features like standalone components, lazy-loaded routes, and RxJS-powered services, CineShelf is perfect for showcasing clean architecture and frontend skills. Users can effortlessly explore movies and organize their favorites in custom collections.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Project Structure](#project-structure)
* [Routes Configuration](#routes-configuration)
* [Features](#features)
* [Core Services](#core-services)
* [Data Storage](#data-storage)
* [Getting Started](#getting-started)
* [Testing Routes](#testing-routes)
* [Validation Rules](#validation-rules)

-------------------------------

## Project Overview

This Angular app provides:

* A **Search Page** to find movies with pagination and selection for collections.
* A **Movie Details Page** that opens as a popup with movie info and rating support.
* A **Movies Collections Page** to create, view, and manage personal movie collections stored locally.


## Project Structure

```
src/
└───app
    ├───core
    │   ├───components
    │   │   └───header
    │   ├───environment
    │   └───services
    │       ├───collections
    │       └───tmdb
    ├───directives
    │   └───alphanumeric-validator
    ├───features
    │   ├───collections
    │   │   ├───add-to-collection-modal
    │   │   ├───collection-details
    │   │   ├───create-collection
    │   │   └───movies-collections
    │   ├───movie-details-modal
    │   └───search
    └───models  
```

---

## 🛠️ Technologies Used

- **Angular 18** — with standalone components, route-level lazy loading, and strong typing
- **Angular Material** — UI components (e.g., paginator, modal dialogs)
- **Bootstrap 5** — layout and responsive styling
- **RxJS** — reactive programming for API/data handling
- **TMDB API** — for movie data, search, and rating endpoints
- **localStorage** — for persisting collections client-side

---

## Routes Configuration

```typescript
const routes: Routes = [
  { path: '', component: SearchComponent },

  { 
    path: 'collections', 
    loadComponent: () => import('./features/collections/movies-collections/movies-collections.component').then(m => m.MoviesCollectionsComponent)
  },

  { 
    path: 'collections/create', 
    loadComponent: () => import('./features/collections/create-collection/create-collection.component').then(m => m.CreateCollectionComponent)
  },

  { 
    path: 'collections/:id', 
    loadComponent: () => import('./features/collections/collection-details/collection-details.component').then(m => m.CollectionDetailsComponent)
  },
  {
    path: 'movie/:id',
    outlet: 'popup',
    loadComponent: () => import('./features/movie-details-modal/movie-details-modal.component').then(m => m.MovieDetailsModalComponent)
  },
];
```

## Features

### 1. Search Page (`/`)

* Search movies with minimum 3 characters input validation (alphanumeric only).
* Pagination support with Angular Material Paginator.
* Select movies to add to collections.
* Displays movie poster, title, vote average.
* Opens Movie Details modal on movie click.
* Adds movies in collections using the button "Add to collection". Can't add duplicate movies in a collection.

### 2. Movie Details Page (`/movie/:id`)

* Shows movie details popup.
* Displays title, overview, poster, budget, release date, revenue, vote average/count, languages.
* Guest user rating feature integrated with TMDB guest sessions.

### 3. Movies Collections Pages

* Lists all collections (`/collections`).
* Create new collection with title and description (`/collections/create`).
* View individual collection details (`/collections/:id`).
* Remove movies from collections. 
* The movies are added from the search page using the AddToCollectionModal component.
* Persist collections in browser localStorage.

---

## Core Services

* **CollectionsService** — Manage movie collections.
* **TmdbService** — Handle TMDB API calls (search, details, guest session, rating).

---

## Data Storage

* **Movie Collections**: Stored in browser `localStorage`.
* **TMDB Data**: Fetched live via API; not persisted locally.
* **User Ratings**: Submitted to TMDB through guest session API.

---

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/download/) (version 16 or later recommended)
* [Angular CLI](https://angular.io/cli) installed globally:

  ```bash
  npm install -g @angular/cli
  ```

### Installation

1. Navigate to the project:

   ```bash
   cd movies-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure TMDB API key:

* Open `src/app/core/environment/environment.ts`
* Replace `API_KEY` placeholder with your TMDB API key. Get your own TMDB API key at https://developer.themoviedb.org/docs/getting-started to run this project.

4. Run development server:

   ```bash
   ng serve
   ```

5. Open browser at `http://localhost:4200`.

---

## Testing Routes

| Route                 | Description              |
| --------------------- | ------------------------ |
| `/`                   | Search page (home)       |
| `/collections`        | Collections page         |
| `/collections/create` | Create new collection    |
| `/collections/:id`    | View collection details  |
| `/(popup:/movie/:id)` | Movie details page/modal |

---

## Validation Rules

* **Search Input**: Minimum 3 characters, alphanumeric only.
* **Collection Title**: Required, 2-100 characters.
* **Collection Description**: Optional, max 500 characters.
* **Movie Rating**: Allowed values 1-10.
