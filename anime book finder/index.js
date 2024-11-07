// Get references to DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const addButton = document.getElementById('addButton');
const deleteButton = document.getElementById('deleteButton');
const movieList = document.getElementById('movieList');

let searchResults = []; // Store fetched search results
let addedCards = []; // Track added cards
let selectedCards = []; // Track selected cards for both adding and deleting

// Function to fetch anime data from the Jikan API
async function searchAnime() {
    const query = searchInput.value.trim(); // Get user input
    if (!query) {
        alert('Please enter a search term');
        return;
    }

    const url = `https://api.jikan.moe/v4/anime?q=${query}`; // Jikan API endpoint

    try {
        const response = await fetch(url);
        const data = await response.json();
        searchResults = data.data; // Store search results
        displaySearchResults(); // Display results in the DOM
    } catch (error) {
        console.error('Error fetching anime data:', error);
        alert('Failed to fetch anime. Please try again.');
    }
}

// Function to display fetched search results on the page
function displaySearchResults() {
    movieList.innerHTML = ''; // Clear current results

    searchResults.forEach(anime => {
        const movieItem = createMovieCard(anime);
        movieList.appendChild(movieItem);
    });
}

// Function to create a movie card
function createMovieCard(anime) {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');
    movieItem.setAttribute('data-title', anime.title); // Add unique identifier

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

    movieItem.appendChild(movieImage);
    movieItem.appendChild(movieTitle);
    movieItem.appendChild(movieLink);

    // Add click event to toggle selection
    movieItem.addEventListener('click', () => toggleSelection(movieItem, anime));

    return movieItem;
}

// Function to toggle selection of a card
function toggleSelection(movieItem, anime) {
    const isSelected = selectedCards.some(card => card.title === anime.title);

    if (isSelected) {
        // Remove from selected cards
        selectedCards = selectedCards.filter(card => card.title !== anime.title);
        movieItem.classList.remove('selected');
    } else {
        // Add to selected cards
        selectedCards.push(anime);
        movieItem.classList.add('selected');
    }
}

// Function to add selected cards to the added list
function addSelectedCards() {
    if (selectedCards.length === 0) {
        alert('No cards selected to add.');
        return;
    }

    selectedCards.forEach(anime => {
        // Avoid adding duplicates
        if (!addedCards.some(card => card.title === anime.title)) {
            addedCards.push(anime);

            // Add a new card for the added list
            const addedCard = createMovieCard(anime);
            movieList.appendChild(addedCard);
        }
    });

    alert('Selected cards have been added!');
    selectedCards = []; // Clear selection after adding
}

// Function to delete selected cards (from both added and search results)
function deleteSelectedCards() {
    if (selectedCards.length === 0) {
        alert('No cards selected to delete.');
        return;
    }

    selectedCards.forEach(card => {
        // Remove from addedCards
        addedCards = addedCards.filter(added => added.title !== card.title);

        // Remove from the displayed movie list
        const movieItems = Array.from(movieList.children);
        const itemToRemove = movieItems.find(item => item.getAttribute('data-title') === card.title);
        if (itemToRemove) {
            movieList.removeChild(itemToRemove);
        }
    });

    alert('Selected cards have been deleted!');
    selectedCards = []; // Clear selection after deletion
}

// Event listeners for buttons
searchButton.addEventListener('click', searchAnime);
addButton.addEventListener('click', addSelectedCards);
deleteButton.addEventListener('click', deleteSelectedCards);
