// Team Project: Music Player with Howler.js
// Configuration - ADD YOUR SONGS HERE!
const songs = [
  { title: "Sunset Vibes", file: "audio/song1.mp3" },
  { title: "Coding Flow", file: "audio/song2.mp3" },
  { title: "Team Victory", file: "audio/song3.mp3" }
];

// DOM Elements
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const songTitle = document.getElementById('song-title');
const playlistEl = document.getElementById('playlist');

// Player State
let currentSongIndex = 0;
let isPlaying = false;
let currentHowl = null;

// Initialize playlist UI
function initPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = song.title;
    li.dataset.index = index;
    
    li.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong();
      playSong();
    });
    
    if (index === 0) li.classList.add('active'); // First song active by default
    playlistEl.appendChild(li);
  });
}

// Load song into Howler
function loadSong() {
  // Stop current playback
  if (currentHowl) currentHowl.unload();
  
  // Create new Howl instance
  currentHowl = new Howl({
    src: [songs[currentSongIndex].file],
    html5: true, // Critical for large files - uses browser's native audio
    preload: true,
    onplay: updatePlayButton,
    onpause: updatePlayButton,
    onend: nextSong,
    onplayerror: (id, error) => {
      console.error("Playback error:", error);
      alert("Error playing audio. Please check file paths.");
    }
  });
  
  // Update UI
  songTitle.textContent = songs[currentSongIndex].title;
  document.querySelectorAll('#playlist li').forEach(li => li.classList.remove('active'));
  document.querySelectorAll('#playlist li')[currentSongIndex].classList.add('active');
}

// Play/Pause toggle
function togglePlay() {
  if (!currentHowl) loadSong();
  
  if (isPlaying) {
    currentHowl.pause();
  } else {
    currentHowl.play();
  }
}

// Update play button icon
function updatePlayButton() {
  isPlaying = currentHowl.playing();
  playBtn.textContent = isPlaying ? '⏸' : '▶️';
}

// Previous song
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong();
  if (isPlaying) playSong();
}

// Next song
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong();
  if (isPlaying) playSong();
}

// Play song helper
function playSong() {
  if (!currentHowl) loadSong();
  currentHowl.play();
}

// Update progress bar
function updateProgress() {
  if (currentHowl && isPlaying) {
    const seek = currentHowl.seek() || 0;
    const duration = currentHowl.duration();
    
    if (duration > 0) {
      const percent = (seek / duration) * 100;
      progress.style.width = `${percent}%`;
    }
  }
  requestAnimationFrame(updateProgress);
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Initialize player
initPlaylist();
loadSong();
updateProgress(); // Start progress tracker