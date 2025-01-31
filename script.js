// Sample player data
const players = [
  {
    name: "Virat Kohli",
    image: "https://via.placeholder.com/150?text=Virat+Kohli",
    battingRank: 1,
    bowlingRank: 50,
    inningsBatting: 200,
    inningsBowling: 5,
    strikeRate: 95.6,
    runs: 12000,
    wickets: 5
  },
  {
    name: "Rohit Sharma",
    image: "https://via.placeholder.com/150?text=Rohit+Sharma",
    battingRank: 2,
    bowlingRank: 75,
    inningsBatting: 180,
    inningsBowling: 3,
    strikeRate: 88.4,
    runs: 11000,
    wickets: 3
  },
  {
    name: "Jasprit Bumrah",
    image: "https://via.placeholder.com/150?text=Jasprit+Bumrah",
    battingRank: 100,
    bowlingRank: 1,
    inningsBatting: 10,
    inningsBowling: 150,
    strikeRate: 150.0,
    runs: 200,
    wickets: 250
  }
];

let currentPlayerIndex = 0;

// Function to display player details
function displayPlayer(player) {
  // document.getElementById("player-image").src = player.image;
  document.getElementById("player-name").textContent = 'player.name';
  document.getElementById("batting-rank").textContent = player.battingRank;
  document.getElementById("bowling-rank").textContent = player.bowlingRank;
  document.getElementById("innings-batting").textContent = player.inningsBatting;
  document.getElementById("innings-bowling").textContent = player.inningsBowling;
  document.getElementById("strike-rate").textContent = player.strikeRate;
  document.getElementById("runs").textContent = player.runs;
  document.getElementById("wickets").textContent = player.wickets;
}

// Initialize with the first player
displayPlayer(players[currentPlayerIndex]);

// Event listener for the "Next Player" button
document.getElementById("next-player-btn").addEventListener("click", () => {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Loop back to the first player
  displayPlayer(players[currentPlayerIndex]);
});