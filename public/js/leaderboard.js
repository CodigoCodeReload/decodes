/**
 * Leaderboard module for Pica Game Timer
 * Handles leaderboard data fetching and display
 * Follows Single Responsibility Principle by focusing only on leaderboard functionality
 */
class LeaderboardService {
  /**
   * Get top leaderboard entries
   * @returns {Promise<object>} - Leaderboard data
   */
  static async getLeaderboard() {
    return ApiService.get(Config.api.leaderboard.top);
  }
  
  /**
   * Get detailed leaderboard with pagination
   * @param {number} limit - Number of entries to retrieve
   * @param {number} offset - Pagination offset
   * @returns {Promise<object>} - Detailed leaderboard data
   */
  static async getDetailedLeaderboard(limit = 10, offset = 0) {
    if (!AuthService.isAuthenticated()) {
      throw new Error('Authentication required');
    }
    
    const url = `${Config.api.leaderboard.detailed}?limit=${limit}&offset=${offset}`;
    return ApiService.get(url, true);
  }
  
  /**
   * Format leaderboard data for display
   * @param {Array} leaderboardData - Raw leaderboard data
   * @returns {HTMLElement} - Formatted leaderboard table
   */
  static formatLeaderboard(leaderboardData) {
    // Get the leaderboard template
    const template = document.getElementById('leaderboardTemplate');
    const leaderboardElement = template.content.cloneNode(true);
    const tbody = leaderboardElement.querySelector('#leaderboardBody');
    
    // Clear any existing rows
    tbody.innerHTML = '';
    
    // Add rows for each leaderboard entry
    leaderboardData.forEach((entry, index) => {
      const row = document.createElement('tr');
      
      // Create cells for each data point
      const rankCell = document.createElement('td');
      rankCell.textContent = index + 1;
      
      const usernameCell = document.createElement('td');
      usernameCell.textContent = entry.username;
      
      const gamesCell = document.createElement('td');
      gamesCell.textContent = entry.totalGames;
      
      const avgDeviationCell = document.createElement('td');
      avgDeviationCell.textContent = entry.averageDeviation;
      
      const bestDeviationCell = document.createElement('td');
      bestDeviationCell.textContent = entry.bestDeviation;
      
      const scoreCell = document.createElement('td');
      scoreCell.textContent = entry.totalScore || 'N/A';
      
      // Add cells to the row
      row.appendChild(rankCell);
      row.appendChild(usernameCell);
      row.appendChild(gamesCell);
      row.appendChild(avgDeviationCell);
      row.appendChild(bestDeviationCell);
      row.appendChild(scoreCell);
      
      // Add row to the table
      tbody.appendChild(row);
    });
    
    return leaderboardElement;
  }
}
