const musicContainer = document.getElementById("musicContainer");
const mainPlayer = document.getElementById("mainPlayer");
const playerBar = document.getElementById("playerBar");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
const coverImg = document.getElementById("cover-img");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const playingGif = document.getElementById("playingGif");
const showMoreBtn = document.getElementById("showMoreBtn");

 


const songTitles = [
  "Rehle Mere Khool",  "Parde E Dil Pochi","Mushk","Main Aisay Hi Mohabbat Ho Gaya","Larsha Pekhawar","Kis Ko Pata Tha Pehlo Mein Rakhha","Karde Karam Tu",
  "Kahani Suno","Jhol",  "Falak Ijazat","Heer","Has Has","Finding Her","Courtside Qawwali","Pasoori","Kana Yaari","Mannad","Pal Pal",
  "Softly","Sanso Ki Mala","Lover","Saadi Tu Hamari Zara Dekhiya","Ishq Wala Love","Haseen","Hum Kahan Ke Sachay Thay","Ishq Risk","Main Agar Kahoon",
  "Maula Mere Maula","Sahiba","You And Me"
];


let currentSongIndex = -1; // Keeps track of currently playing song



const songsData = [];

for (let i = 1; i <= 30; i++) {
  songsData.push({
    title: songTitles[i - 1] || `Song ${i}`,
    imgPaths: [
      `Cover/Img-${i}.jpg`,
      `Cover/Img-${i}.jpeg`,
      `Cover/Img-${i}.avif`
    ],
    audio: `Song/${i}.mp3`
  });
}

let songsPerPage = 5;
let currentIndex = 0;
let expanded = false; // Track if all songs are shown

function renderSongs() {
  musicContainer.innerHTML = ""; // Clear old cards

  const songsToShow = expanded ? songsData.length : currentIndex + songsPerPage;
  const displaySongs = songsData.slice(0, songsToShow);

  displaySongs.forEach((song, idx) => {
    const card = document.createElement("div");
    card.classList.add("music-card");

    const image = new Image();
    image.src = song.imgPaths[0];
    image.onerror = () => {
      image.src = song.imgPaths[1];
      image.onerror = () => {
        image.src = song.imgPaths[2];
      };
    };

    card.innerHTML = `
      <div class="cover-box"></div>
      <h4>${song.title}</h4>
    `;
    card.querySelector(".cover-box").appendChild(image);

    // Click event to play song
    card.addEventListener("click", () => {
      playSong(idx);
    });

    musicContainer.appendChild(card);
  });

  // Button text change
  if (expanded) {
    showMoreBtn.textContent = "Show Less";
  } else {
    showMoreBtn.textContent = "Show More";
  }
}

// Button click handler
showMoreBtn.addEventListener("click", () => {
  if (!expanded) {
    expanded = true;
  } else {
    expanded = false;
  }
  renderSongs();
});

// Initial load
renderSongs();

// Previous button click
prevBtn.addEventListener("click", () => {
  if (currentSongIndex > 0) {
    playSong(currentSongIndex - 1);
  }
});

// Next button click
nextBtn.addEventListener("click", () => {
  if (currentSongIndex < songTitles.length - 1) {
    playSong(currentSongIndex + 1);
  }
});

// Play/Pause button click


playPauseBtn.addEventListener("click", () => {
  if (mainPlayer.paused) {
    mainPlayer.play();
    playPauseBtn.innerText = "⏸";
  } else {
    mainPlayer.pause();
    playPauseBtn.innerText = "⏯";
  }
});

// Update play/pause button icon based on player state
mainPlayer.addEventListener("play", () => {
  playPauseBtn.innerText = "⏸";
  playingGif.style.display = "block";
});
mainPlayer.addEventListener("pause", () => {
  playPauseBtn.innerText = "⏯";
  playingGif.style.display = "none";
});

// Update play/pause button icon on song change
mainPlayer.addEventListener("play", () => {
  playPauseBtn.innerText = "⏸";
});
mainPlayer.addEventListener("pause", () => {
  playPauseBtn.innerText = "⏯";
});

// Function to play a song by index
function playSong(index) {
  if (index < 0 || index >= songTitles.length) return;

  const audioPath = `Song/${index + 1}.mp3`;
  const fallbackImgJpg = `Cover/Img-${index + 1}.jpg`;
  const fallbackImgJpeg = `Cover/Img-${index + 1}.jpeg`;
  const fallbackImgAvif = `Cover/Img-${index + 1}.avif`;

  mainPlayer.src = audioPath;
  mainPlayer.play();
  nowPlayingTitle.innerText = `Now Playing: ${songTitles[index]}`;

  coverImg.style.display = "inline-block";
  coverImg.src = fallbackImgJpg;
  coverImg.onerror = () => {
    coverImg.src = fallbackImgJpeg;
    coverImg.onerror = () => {
      coverImg.src = fallbackImgAvif;
    };
  };

  playerBar.style.display = "flex";
  playPauseBtn.innerText = "⏸";
  currentSongIndex = index;
}

const seekBar = document.getElementById("seekBar");

// Update seekBar as audio plays
mainPlayer.addEventListener("timeupdate", () => {
  seekBar.value = (mainPlayer.currentTime / mainPlayer.duration) * 100 || 0;
});

// Allow user to seek by dragging the range
seekBar.addEventListener("input", () => {
  mainPlayer.currentTime = (seekBar.value / 100) * mainPlayer.duration;
});


/* ====== Search feature ====== */
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchMessage = document.getElementById("searchMessage");

/** remove existing highlights */
function clearHighlights() {
  const highlighted = document.querySelectorAll(".music-card.highlight");
  highlighted.forEach(el => el.classList.remove("highlight"));
}

/** show small message under search */
function showMessage(text, type = "") {
  if (!searchMessage) return;
  searchMessage.textContent = text;
  searchMessage.classList.remove("notfound", "success");
  if (type === "notfound") searchMessage.classList.add("notfound");
  if (type === "success") searchMessage.classList.add("success");
}

/** main search function */
function searchSongs(query) {
  const q = String(query || "").trim().toLowerCase();
  clearHighlights();
  if (!q) {
    showMessage("Please enter a search term");
    return;
  }

  // find all matching indices
  const matches = [];
  songTitles.forEach((title, idx) => {
    if (title && title.toLowerCase().includes(q)) matches.push(idx);
  });

  if (matches.length === 0) {
    showMessage(`No results for "${query}"`, "notfound");
    return;
  }

  // highlight matched cards and scroll to first match
  matches.forEach(i => {
    const card = musicContainer.children[i];
    if (card) card.classList.add("highlight");
  });

  const firstCard = musicContainer.children[matches[0]];
  if (firstCard) {
    firstCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Play first match (optional)
  if (typeof playSong === "function") {
    playSong(matches[0]);
  }

  showMessage(`${matches.length} result(s) found for "${query}"`, "success");

  // clear highlights after 6 seconds
  clearTimeout(window._clearHighlightTimeout);
  window._clearHighlightTimeout = setTimeout(() => {
    clearHighlights();
    showMessage("");
  }, 6000);
}

/* events: click and enter key */
if (searchBtn) {
  searchBtn.addEventListener("click", () => searchSongs(searchInput.value));
}
if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchSongs(searchInput.value);
    }
  });
}

// optional: live search as user types (uncomment if you want instant results)
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim();
  if (q.length >= 2) searchSongs(q);
  else {
    clearHighlights();
    showMessage("");
  }
});


