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
    wickets: 5,
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
    wickets: 3,
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
    wickets: 250,
  },
];

let currentPlayerIndex = 0;

// Function to display player details
function displayPlayer(player) {
  // document.getElementById("player-image").src = player.image;
  document.getElementById("player-name").textContent = "player.name";
  document.getElementById("batting-rank").textContent = player.battingRank;
  document.getElementById("bowling-rank").textContent = player.bowlingRank;
  document.getElementById("innings-batting").textContent =
    player.inningsBatting;
  document.getElementById("innings-bowling").textContent =
    player.inningsBowling;
  document.getElementById("strike-rate").textContent = player.strikeRate;
  document.getElementById("runs").textContent = player.runs;
  document.getElementById("wickets").textContent = player.wickets;
}

// Initialize with the first player
displayPlayer(players[currentPlayerIndex]);

// Event listener for the "Next Player" button
// document.getElementById("next-player-btn").addEventListener("click", () => {
//   currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Loop back to the first player
//   displayPlayer(players[currentPlayerIndex]);
// });

// TEAMS DATA
const COLUMNS_PER_TEAM = 3;
const TEAM_BALANCE = 10000000;
const BASE_AMOUNT = 500000;
const TOTAL_TEAM_PLAYERS = 9;

async function loadTeamsData() {
  try {
    const response = await fetch("data/TeamsData.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    // Read the Excel file
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Process the data
    const teams = [];

    // Get number of teams (ceiling of total columns / 3)
    const numTeams = Math.ceil(rawData[0].length / COLUMNS_PER_TEAM);

    for (let teamIndex = 0; teamIndex < numTeams; teamIndex++) {
      const startCol = teamIndex * COLUMNS_PER_TEAM;
      // Get team name from the first row, first column of each 3-column section
      const teamName = rawData[0][startCol] || "Unknown Team";

      const players = [];

      // Start from row 2 (skip header and column titles)
      for (let row = 2; row < rawData.length; row++) {
        // Check if we have both name and price in this row
        if (rawData[row][startCol + 1] && rawData[row][startCol + 2]) {
          players.push({
            index: rawData[row][startCol] || players.length + 1,
            name: rawData[row][startCol + 1],
            price: rawData[row][startCol + 2],
          });
        }
      }

      teams.push({
        team: teamName,
        players: players,
      });
    }

    return teams;
  } catch (error) {
    console.error("Error loading teams data:", error);
    return [];
  }
}

function renderTeamsData(teamsData) {
  try {
    console.log("🌟 ~ teamsData: \n", teamsData);
    teamsData.forEach((teamData) => {
      const { team, players } = teamData;
      console.log("🌟🌟🌟 ~ team: \n", team);

      const currentPlayers = players.length;
      const usedBalance = players.reduce(
        (acc, player) => acc + Number(player.price) * 100000,
        0
      );
      console.log(" ~ usedBalance: \n", usedBalance);

      const pendingBalance = TEAM_BALANCE - usedBalance;
      const maxSpendingLimitForCurrentPlayer =
        pendingBalance - (TOTAL_TEAM_PLAYERS - currentPlayers) * BASE_AMOUNT;

      console.log(" ~ currentPlayers: \n", currentPlayers);
      console.log(" ~ pendingBalance: \n", pendingBalance);
      console.log(
        " ~ maxSpendingLimitForCurrentPlayer: \n",
        maxSpendingLimitForCurrentPlayer
      );
    });
  } catch (error) {
    console.error("Error loading teams data:", error);
    return [];
  }
}

// Load teams data when page loads

document.addEventListener("DOMContentLoaded", async () => {
  const teamsData = await loadTeamsData();
  console.log("Teams Data:", teamsData);

  renderTeamsData(teamsData);
});
