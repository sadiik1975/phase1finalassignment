document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const submitButton = document.getElementById('submitButton');
    const resetButton = document.getElementById('resetButton');
    const searchResultsContainer = document.querySelector('#searchResults .movie-list');
    const addedMoviesContainer = document.querySelector('#addedMovies .movie-list');

    let searchResults = [], addedMovies = [];

    const fetchAnime = async () => {
        const query = searchInput.value.trim();
        if (!query) return alert('Enter a search term');
        try {
            const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
            const data = await res.json();
            searchResults = data.data || [];
            displayMovies(searchResults, searchResultsContainer, true);
        } catch {
            alert('Failed to fetch anime data.');
        }
    };

    const displayMovies = (movies, container, isSearch = false) => {
        container.innerHTML = '';
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-item');
            movieCard.innerHTML = `
                <img src="${movie.images.jpg.image_url}" alt="${movie.title}">
                <div class="movie-title">${movie.title}</div>
                <a href="${movie.url}" target="_blank">View More</a>
            `;
            if (isSearch) {
                const addBtn = document.createElement('button');
                addBtn.textContent = 'Add';
                addBtn.addEventListener('click', () => addMovie(movie));
                movieCard.appendChild(addBtn);
            }
            container.appendChild(movieCard);
        });
    };

    const addMovie = (movie) => {
        if (addedMovies.some(m => m.title === movie.title)) return alert('Already added.');
        addedMovies.push(movie);
        displayMovies(addedMovies, addedMoviesContainer);
    };

    const resetApp = () => {
        searchResults = [];
        addedMovies = [];
        searchResultsContainer.innerHTML = '';
        addedMoviesContainer.innerHTML = '';
        searchInput.value = '';
    };

    const submitMovies = () => {
        if (!addedMovies.length) return alert('No movies to submit.');
        alert(`Submitted: ${addedMovies.map(m => m.title).join(', ')}`);
        resetApp();
    };

    searchButton.addEventListener('click', fetchAnime); //  Trigger anime search
    resetButton.addEventListener('click', resetApp); // Reset everything
    submitButton.addEventListener('click', submitMovies);  // Submit added movies
});
