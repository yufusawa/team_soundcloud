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
// Add after DOM elements declaration
const volumeSlider = document.getElementById('volume-slider');
const volumeLabel = document.getElementById('volume-label');
const volumeIcon = document.querySelector('.volume-icon');

// Initialize volume from localStorage or default
let currentVolume = localStorage.getItem('playerVolume') || 1;
currentVolume = parseFloat(currentVolume);
volumeSlider.value = currentVolume;
updateVolumeDisplay(currentVolume);

// Initialize Howler with saved volume
if (typeof Howler !== 'undefined') {
  Howler.volume(currentVolume);
}

// Volume event handler
volumeSlider.addEventListener('input', function() {
  const volume = parseFloat(this.value);
  setVolume(volume);
});

// Volume control functions
function setVolume(volume) {
  // Save to localStorage
  localStorage.setItem('playerVolume', volume.toString());
  
  // Update UI
  updateVolumeDisplay(volume);
  
  // Update Howler
  if (currentHowl) {
    currentHowl.volume(volume);
  } else {
    Howler.volume(volume);
  }
  
  // Update mute state
  updateMuteState(volume);
}

function updateVolumeDisplay(volume) {
  volumeLabel.textContent = `${Math.round(volume * 100)}%`;
  volumeSlider.value = volume;
}

function updateMuteState(volume) {
  if (volume === 0) {
    volumeIcon.textContent = '🔇';
    volumeIcon.classList.add('muted');
  } else if (volume < 0.3) {
    volumeIcon.textContent = '🔈';
    volumeIcon.classList.remove('muted');
  } else {
    volumeIcon.textContent = '🔊';
    volumeIcon.classList.remove('muted');
  }
}

// Add mute toggle on volume icon click
volumeIcon.addEventListener('click', function() {
  if (currentVolume === 0) {
    // Restore previous volume
    const savedVolume = localStorage.getItem('previousVolume') || 0.7;
    setVolume(parseFloat(savedVolume));
  } else {
    // Save current volume before muting
    localStorage.setItem('previousVolume', currentVolume);
    setVolume(0);
  }
});

// Add keyboard shortcuts (optional but nice)
document.addEventListener('keydown', function(e) {
  if (e.key === 'm' || e.key === 'M') {
    // Toggle mute on 'M' key
    if (currentVolume === 0) {
      const savedVolume = localStorage.getItem('previousVolume') || 0.7;
      setVolume(parseFloat(savedVolume));
    } else {
      localStorage.setItem('previousVolume', currentVolume);
      setVolume(0);
    }
  }
  
  // Volume up/down with arrow keys
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    const newVolume = Math.min(1, currentVolume + 0.1);
    setVolume(newVolume);
  }
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const newVolume = Math.max(0, currentVolume - 0.1);
    setVolume(newVolume);
  }
});

// Add this inside the loadSong() function after creating new Howl
// (around line 78 in previous script.js)
currentHowl.volume(currentVolume);

// Update currentVolume when slider changes
volumeSlider.addEventListener('input', function() {
  currentVolume = parseFloat(this.value);
  setVolume(currentVolume);
});

// Initialize at the very end of script.js
// (after initPlaylist() and loadSong())
document.addEventListener('DOMContentLoaded', function() {
  // Set initial volume state
  currentVolume = parseFloat(volumeSlider.value);
  Howler.volume(currentVolume);
});