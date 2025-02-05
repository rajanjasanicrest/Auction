const employeeId = "102";
const basePrice = "5";
const isIcon = true;

// TEAMS DATA
const COLUMNS_PER_TEAM = 3;
const TEAM_BALANCE = 20000000;
const BASE_AMOUNT = 500000;
let ICON_BASE_AMOUNT = 3000000;
const ICON_BID_AMOUNT = 200000;
const TOTAL_TEAM_PLAYERS = 9;
const TOTAL_ICON_PLAYERS = 12;
let remainingIconPlayers = 12;

// Protected Code (Not to touch while auction is ON)
async function loadPlayersData() {
  try {
    const response = await fetch("data/players_data.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    // Read the Excel file
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    // Process and return player data indexed by Employee ID
    const playersData = {};
    rawData.forEach((player) => {
      playersData[player["Employee ID"]] = {
        employeeId: player["Employee ID"],
        name: player["Name"],
        image: player["Image"],
        role: player["Role"],
        battingRank: player["Batting Rank"],
        bowlingRank: player["Bowling Rank"],
        inningsBatting: player["Innings Batting"],
        inningsBowling: player["Innings Bowling"],
        strikeRate: player["Strike Rate"],
        runs: player["Runs"],
        wickets: player["Wickets"],
      };
    });
    return playersData;
  } catch (error) {
    console.error("Error loading players data:", error);
    return {};
  }
}

function displayPlayer(player) {
  // document.getElementById("player-id").textContent = player.employeeId;
  document.getElementById("player-name").textContent = player.name;
  document.getElementById("player-role").textContent = player.role;
  document.getElementById("base-price").textContent = isIcon
    ? ICON_BASE_AMOUNT
    : `${basePrice + " Lakhs"}`;
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

let players = {};

async function initializePlayers() {
  players = await loadPlayersData();

  // Set a default Employee ID to fetch on page load

  // Fetch and display player details for the default Employee ID
  fetchPlayerById(employeeId);
}

document.addEventListener("DOMContentLoaded", initializePlayers);

async function fetchPlayerById(employeeId) {
  if (players[employeeId]) {
    displayPlayer(players[employeeId]);
  } else {
    console.error("Player not found for Employee ID:", employeeId);
  }
}

// Event listener for the "Next Player" button
// document.getElementById("next-player-btn").addEventListener("click", () => {
//   currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Loop back to the first player
//   displayPlayer(players[currentPlayerIndex]);
// });

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
      let hasIconPlayer = false;

      // Start from row 2 (skip header and column titles)
      for (let row = 2; row < rawData.length; row++) {
        // Check if we have both name and price in this row
        if (rawData[row][startCol + 1] && rawData[row][startCol + 2]) {
          if (
            rawData[row][startCol + 1].includes("(I)") ||
            rawData[row][startCol + 1].includes("(i)")
          ) {
            remainingIconPlayers--;
            ICON_BASE_AMOUNT += ICON_BID_AMOUNT;
            hasIconPlayer = true;
          }

          console.log("🌟 ~ remainingIconPlayers: \n", remainingIconPlayers);

          players.push({
            index: rawData[row][startCol] || players.length + 1,
            name: rawData[row][startCol + 1],
            price: rawData[row][startCol + 2],
          });
        }
      }
      teams.push({
        team: rawData?.[2]?.[startCol + 1] || teamName,
        players: players,
        hasIconPlayer,
      });
    }

    document.getElementById("base-price").textContent = isIcon
      ? ICON_BASE_AMOUNT >= 10000000
        ? `${(ICON_BASE_AMOUNT / 10000000).toFixed(2)} Cr`
        : `${Math.floor(ICON_BASE_AMOUNT / 100000)} Lakhs`
      : `${basePrice + " Lakhs"}`;

    return teams;
  } catch (error) {
    console.error("Error loading teams data:", error);
    return [];
  }
}

function renderTeamsData(teamsData) {
  try {
    teamsData.forEach((teamData, index) => {
      const { team, players, hasIconPlayer = false } = teamData;

      const currentPlayers = players.length + 1; // +1 for the captain
      const usedBalance = players.reduce(
        (acc, player) => acc + Number(player.price) * 10000000,
        0
      );

      const pendingBalance = TEAM_BALANCE - usedBalance;
      const minBalanceNeeded =
        hasIconPlayer || isIcon
          ? (TOTAL_TEAM_PLAYERS - currentPlayers - 1) * BASE_AMOUNT
          : (TOTAL_TEAM_PLAYERS - currentPlayers - 2) * BASE_AMOUNT +
            (ICON_BASE_AMOUNT + (remainingIconPlayers - 1) * ICON_BID_AMOUNT);

      console.log("team", team, ": minBalanceNeeded: ", minBalanceNeeded);
      console.log(TOTAL_TEAM_PLAYERS - currentPlayers - 2, BASE_AMOUNT);
      console.log(
        (remainingIconPlayers - 1) * ICON_BID_AMOUNT,
        ICON_BASE_AMOUNT
      );
      const maxSpendingLimitForCurrentPlayer =
        pendingBalance > 0 ? pendingBalance - minBalanceNeeded : 0;
      console.log(pendingBalance, maxSpendingLimitForCurrentPlayer);

      document.getElementById(
        `team-${index + 1}`
      ).innerHTML = `<strong>${team}</strong>
                  <div class="team-info">
                      
                    <div>
                      <div>
                        Size :
                      </div>
                      <div class='team-stats-font'>
                        <b>${currentPlayers}</b>
                      </div>

                    </div>
                    
                    <div>
                      <div>
                        Budget: 
                      </div>
                      <div class='team-stats-font'>
                        <b>${
                            pendingBalance >= 10000000
                              ? `${(pendingBalance / 10000000).toFixed(2)} Cr`
                              : `${Math.floor(pendingBalance / 100000)} L`
                          }</b>
                      </div>                      
                    </div>
                      
                    <div>
                      <div>
                        Max Bid: 
                      </div>
                      <div class='team-stats-font'>
                          <b>
                        ${
                          isIcon && hasIconPlayer
                            ? "-"
                            : maxSpendingLimitForCurrentPlayer >= 10000000
                            ? `${(
                                maxSpendingLimitForCurrentPlayer / 10000000
                              ).toFixed(2)} Cr`
                            : `${Math.floor(
                                maxSpendingLimitForCurrentPlayer / 100000
                              )} Lakhs`
                        }</b>
                      </div>                
                    </div>
                  </div>`;
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
