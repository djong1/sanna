// Billie Eilish Songs Data
const billieEilishSongs = [
    {
        id: 1,
        title: "bad guy",
        album: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?",
        year: 2019
    },
    {
        id: 2,
        title: "When the Party's Over",
        album: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?",
        year: 2018
    },
    {
        id: 3,
        title: "everything i wanted",
        album: "everything i wanted",
        year: 2019
    },
    {
        id: 4,
        title: "Therefore I Am",
        album: "Therefore I Am",
        year: 2020
    },
    {
        id: 5,
        title: "Happier Than Ever",
        album: "Happier Than Ever",
        year: 2021
    },
    {
        id: 6,
        title: "Lovely (with Khalid)",
        album: "13 Reasons Why (Season 2)",
        year: 2018
    },
    {
        id: 7,
        title: "ocean eyes",
        album: "dont smile at me",
        year: 2016
    },
    {
        id: 8,
        title: "Bellyache",
        album: "dont smile at me",
        year: 2017
    },
    {
        id: 9,
        title: "idontwannabeyouanymore",
        album: "dont smile at me",
        year: 2017
    },
    {
        id: 10,
        title: "What Was I Made For?",
        album: "Barbie The Album",
        year: 2023
    },
    {
        id: 11,
        title: "No Time To Die",
        album: "No Time To Die",
        year: 2020
    },
    {
        id: 12,
        title: "Lost Cause",
        album: "Happier Than Ever",
        year: 2021
    },
    {
        id: 13,
        title: "Your Power",
        album: "Happier Than Ever",
        year: 2021
    },
    {
        id: 14,
        title: "Getting Older",
        album: "Happier Than Ever",
        year: 2021
    },
    {
        id: 15,
        title: "Oxytocin",
        album: "Happier Than Ever",
        year: 2021
    }
];

// Local Storage Keys
const RATINGS_KEY = 'billie_eilish_ratings';

// Load ratings from localStorage
function loadRatings() {
    const saved = localStorage.getItem(RATINGS_KEY);
    return saved ? JSON.parse(saved) : {};
}

// Save ratings to localStorage
function saveRatings(ratings) {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
}

// Calculate average rating for a song
function calculateAverageRating(songId, ratings) {
    const songRatings = ratings[songId];
    if (!songRatings || songRatings.length === 0) {
        return 0;
    }
    const sum = songRatings.reduce((acc, rating) => acc + rating, 0);
    return sum / songRatings.length;
}

// Get user's current rating for a song
function getUserRating(songId, ratings) {
    const songRatings = ratings[songId];
    return songRatings && songRatings.length > 0 ? songRatings[songRatings.length - 1] : 0;
}

// Add or update user rating
function addRating(songId, rating) {
    const ratings = loadRatings();
    if (!ratings[songId]) {
        ratings[songId] = [];
    }
    ratings[songId].push(rating);
    saveRatings(ratings);
}

// Create star rating HTML
function createStarRating(songId, currentRating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const isActive = i <= currentRating;
        stars.push(`
            <span class="star ${isActive ? 'active' : ''}" 
                  data-song-id="${songId}" 
                  data-rating="${i}">★</span>
        `);
    }
    return stars.join('');
}

// Create song card HTML
function createSongCard(song, ratings) {
    const averageRating = calculateAverageRating(song.id, ratings);
    const userRating = getUserRating(song.id, ratings);
    const totalRatings = ratings[song.id] ? ratings[song.id].length : 0;
    
    return `
        <div class="song-card" data-song-id="${song.id}">
            <div class="song-title">${song.title}</div>
            <div class="song-album">${song.album}</div>
            <div class="song-year">${song.year}</div>
            <div class="rating-section">
                <div class="rating-title">Rate this song:</div>
                <div class="rating-stars">
                    ${createStarRating(song.id, userRating)}
                </div>
                <div class="rating-info">
                    <span class="average-rating">
                        Average: ${averageRating > 0 ? averageRating.toFixed(1) : 'No ratings yet'}
                    </span>
                    <span class="total-ratings">${totalRatings} rating${totalRatings !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    `;
}

// Get popular songs (sorted by average rating)
function getPopularSongs(songs, ratings, limit = 5) {
    return songs
        .map(song => ({
            ...song,
            averageRating: calculateAverageRating(song.id, ratings),
            totalRatings: ratings[song.id] ? ratings[song.id].length : 0
        }))
        .filter(song => song.totalRatings > 0) // Only songs with ratings
        .sort((a, b) => {
            // First sort by average rating (descending)
            if (b.averageRating !== a.averageRating) {
                return b.averageRating - a.averageRating;
            }
            // If average ratings are equal, sort by total ratings (descending)
            return b.totalRatings - a.totalRatings;
        })
        .slice(0, limit);
}

// Render songs list
function renderSongs() {
    const ratings = loadRatings();
    const songsContainer = document.getElementById('songs-list');
    const popularContainer = document.getElementById('popular-list');
    
    // Render all songs
    songsContainer.innerHTML = billieEilishSongs
        .map(song => createSongCard(song, ratings))
        .join('');
    
    // Render popular songs
    const popularSongs = getPopularSongs(billieEilishSongs, ratings);
    
    if (popularSongs.length > 0) {
        popularContainer.innerHTML = popularSongs
            .map(song => createSongCard(song, ratings))
            .join('');
    } else {
        popularContainer.innerHTML = `
            <div class="empty-popular">
                <p>No popular songs yet!</p>
                <small>Start rating songs to see the most popular ones here.</small>
            </div>
        `;
    }
}

// Handle star click events
function handleStarClick(event) {
    if (!event.target.classList.contains('star')) return;
    
    const songId = parseInt(event.target.dataset.songId);
    const rating = parseInt(event.target.dataset.rating);
    
    // Add the rating
    addRating(songId, rating);
    
    // Update the display
    updateSongRating(songId, rating);
    
    // Re-render to update popular songs
    setTimeout(() => {
        renderSongs();
    }, 300); // Small delay for visual feedback
}

// Update star display for a specific song
function updateSongRating(songId, rating) {
    const songCards = document.querySelectorAll(`[data-song-id="${songId}"]`);
    
    songCards.forEach(card => {
        const stars = card.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        // Update rating info
        const ratings = loadRatings();
        const averageRating = calculateAverageRating(songId, ratings);
        const totalRatings = ratings[songId] ? ratings[songId].length : 0;
        
        const averageElement = card.querySelector('.average-rating');
        const totalElement = card.querySelector('.total-ratings');
        
        if (averageElement) {
            averageElement.textContent = `Average: ${averageRating.toFixed(1)}`;
        }
        
        if (totalElement) {
            totalElement.textContent = `${totalRatings} rating${totalRatings !== 1 ? 's' : ''}`;
        }
    });
}

// Initialize the application
function init() {
    // Render initial content
    renderSongs();
    
    // Add event listeners
    document.addEventListener('click', handleStarClick);
    
    // Add hover effects for stars
    document.addEventListener('mouseover', (event) => {
        if (!event.target.classList.contains('star')) return;
        
        const rating = parseInt(event.target.dataset.rating);
        const songId = event.target.dataset.songId;
        const stars = document.querySelectorAll(`[data-song-id="${songId}"] .star`);
        
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#ffd700';
            } else {
                star.style.color = '#e2e8f0';
            }
        });
    });
    
    document.addEventListener('mouseout', (event) => {
        if (!event.target.classList.contains('star')) return;
        
        const songId = event.target.dataset.songId;
        const ratings = loadRatings();
        const currentRating = getUserRating(parseInt(songId), ratings);
        const stars = document.querySelectorAll(`[data-song-id="${songId}"] .star`);
        
        stars.forEach((star, index) => {
            if (index < currentRating) {
                star.style.color = '#ffd700';
            } else {
                star.style.color = '#e2e8f0';
            }
        });
    });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);