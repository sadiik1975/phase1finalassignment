document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const filterInput = document.getElementById('filterInput');
    const submitButton = document.getElementById('submitButton');
    const resetButton = document.getElementById('resetButton');
    const themeToggle = document.getElementById('themeToggle');
    const searchResultsContainer = document.querySelector('#searchResults .movie-list');
    const addedMoviesContainer = document.querySelector('#addedMovies .movie-list');

    let searchResults = [], addedMovies = [];

    // Fetch Anime Function
    const fetchAnime = async () => {
        const query = searchInput.value.trim();
        if (!query) return alert('Enter a search term');
        try {
            const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
            const data = await res.json();
            searchResults = data.data.map(movie => ({ ...movie, upvoteCount: 0 })); // Add upvoteCount property
            displayMovies(searchResults, searchResultsContainer, true);
        } catch (error) {
            console.error('Error fetching anime:', error);
            alert('Failed to fetch anime data.');
        }
    };

    // Display Movies Function
    const displayMovies = (movies, container, isSearch = false) => {
        container.innerHTML = '';
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-item');

            movieCard.innerHTML = `
                <img src="${movie.images?.jpg?.image_url || 'default-image.jpg'}" alt="${movie.title || 'Unknown Title'}">
                <div class="movie-title">${movie.title || 'Unknown Title'}</div>
                <a href="${movie.url}" target="_blank">View More</a>
                <div class="upvote-section">
                    <span class="upvote-count">Votes: ${movie.upvoteCount}</span>
                </div>
            `;

            // Hover shadow effect
            movieCard.addEventListener('mouseover', () => {
                movieCard.style.boxShadow = '5px 5px 15px rgba(0, 0, 0, 0.5)';
            });
            movieCard.addEventListener('mouseout', () => {
                movieCard.style.boxShadow = 'none';
            });

            // Double-Click for Upvoting
            movieCard.addEventListener('dblclick', () => {
                movie.upvoteCount++;
                const upvoteCountDisplay = movieCard.querySelector('.upvote-count');
                upvoteCountDisplay.textContent = `Votes: ${movie.upvoteCount}`;
            });

            if (isSearch) {
                const addBtn = document.createElement('button');
                addBtn.textContent = 'Add';
                addBtn.addEventListener('click', () => addMovie(movie));
                movieCard.appendChild(addBtn);
            }

            container.appendChild(movieCard);
        });
    };

    // Add Movie Function
    const addMovie = (movie) => {
        if (addedMovies.some(m => m.title === movie.title)) return alert('Already added.');
        addedMovies.push(movie);
        displayMovies(addedMovies, addedMoviesContainer);
    };

    // Reset App Function
    const resetApp = () => {
        searchResults = [];
        addedMovies = [];
        searchResultsContainer.innerHTML = '';
        addedMoviesContainer.innerHTML = '';
        searchInput.value = '';
        filterInput.value = ''; // Clear filter input
    };

    // Submit Movies Function
    const submitMovies = () => {
        if (!addedMovies.length) return alert('No movies to submit.');
        alert(`Submitted: ${addedMovies.map(m => m.title).join(', ')}`);
        resetApp();
    };

    // Filter Movies Function
    filterInput.addEventListener('input', () => {
        const filterQuery = filterInput.value.toLowerCase();
        const filteredResults = searchResults.filter(movie =>
            movie.title.toLowerCase().includes(filterQuery)
        );
        displayMovies(filteredResults, searchResultsContainer, true);
    });

    // Toggle Theme Function
    themeToggle.addEventListener('change', (event) => {
        document.body.classList.toggle('dark-mode', event.target.checked);
    });

    // Event Listeners
    searchButton.addEventListener('click', fetchAnime);
    resetButton.addEventListener('click', resetApp);
    submitButton.addEventListener('click', submitMovies);
});
