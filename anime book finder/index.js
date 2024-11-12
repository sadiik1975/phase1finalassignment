// DOM References
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const addButton = document.getElementById('addButton');
const deleteButton = document.getElementById('deleteButton');
const resetButton = document.getElementById('resetButton');
const searchResultsContainer = document.querySelector('#searchResults .movie-list');
const addedMoviesContainer = document.querySelector('#addedMovies .movie-list');

// Data Arrays
let searchResults = [];
let addedMovies = [];
let selectedCards = [];

// Fetch Anime Data from API
async function searchAnime() {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Please enter a search term');
        return;
    }

    const url = `https://api.jikan.moe/v4/anime?q=${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        searchResults = data.data; // Store search results
        displaySearchResults();
    } catch (error) {
        console.error('Error fetching anime data:', error);
        alert('Failed to fetch anime data. Please try again.');
    }
}

// Display Search Results
function displaySearchResults() {
    searchResultsContainer.innerHTML = ''; // Clear previous results
    searchResults.forEach(anime => {
        const movieCard = createMovieCard(anime, 'search');
        searchResultsContainer.appendChild(movieCard);
    });
}

// Display Added Movies
function displayAddedMovies() {
    addedMoviesContainer.innerHTML = ''; // Clear previous movies
    addedMovies.forEach(anime => {
        const movieCard = createMovieCard(anime, 'added');
        addedMoviesContainer.appendChild(movieCard);
    });
}

// Create Movie Card
function createMovieCard(anime, type) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-item');
    movieCard.setAttribute('data-title', anime.title);

    const movieImage = document.createElement('img');
    movieImage.src = anime.images.jpg.image_url;
    movieImage.alt = anime.title;

    const movieTitle = document.createElement('div');
    movieTitle.classList.add('movie-title');
    movieTitle.textContent = anime.title;

    const movieLink = document.createElement('a');
    movieLink.href = anime.url;
    movieLink.target = '_blank';
    movieLink.textContent = 'View More';

    movieCard.appendChild(movieImage);
    movieCard.appendChild(movieTitle);
    movieCard.appendChild(movieLink);

    // Toggle Selection
    movieCard.addEventListener('click', () => toggleSelection(movieCard, anime, type));

    return movieCard;
}

// Toggle Selection
function toggleSelection(movieCard, anime, type) {
    const isSelected = selectedCards.some(card => card.title === anime.title);
    if (isSelected) {
        // Deselect
        selectedCards = selectedCards.filter(card => card.title !== anime.title);
        movieCard.classList.remove('selected');
    } else {
        // Select
        selectedCards.push({ anime, type });
        movieCard.classList.add('selected');
    }
}

// Add Selected Movies
function addSelectedCards() {
    const cardsToAdd = selectedCards.filter(card => card.type === 'search');
    if (cardsToAdd.length === 0) {
        alert('No cards selected to add.');
        return;
    }

    cardsToAdd.forEach(({ anime }) => {
        if (!addedMovies.some(movie => movie.title === anime.title)) {
            addedMovies.push(anime);
        }
    });

    displayAddedMovies();
    alert('Selected movies have been added!');
    selectedCards = []; // Clear selection
}

// Delete Selected Movies
function deleteSelectedCards() {
    const cardsToDelete = selectedCards.filter(card => card.type === 'added');
    if (cardsToDelete.length === 0) {
        alert('No cards selected to delete.');
        return;
    }

    cardsToDelete.forEach(({ anime }) => {
        addedMovies = addedMovies.filter(movie => movie.title !== anime.title);
        const movieCard = addedMoviesContainer.querySelector(`[data-title="${anime.title}"]`);
        if (movieCard) {
            movieCard.classList.add('fade-out');
            setTimeout(() => movieCard.remove(), 500); // Wait for fade-out
        }
    });

    alert('Selected movies have been deleted!');
    selectedCards = []; // Clear selection
}

// Reset Everything
function resetEverything() {
    searchResults = [];
    addedMovies = [];
    selectedCards = [];
    searchResultsContainer.innerHTML = '';
    addedMoviesContainer.innerHTML = '';
    searchInput.value = '';
    alert('All data has been reset!');
}

// Event Listeners
searchButton.addEventListener('click', searchAnime);
addButton.addEventListener('click', addSelectedCards);
deleteButton.addEventListener('click', deleteSelectedCards);
resetButton.addEventListener('click', resetEverything);
