const API_URL = "http://localhost:5000/api/teams";

// Get token
const getToken = () => {
  return localStorage.getItem("token");
};

// Get all teams
export const getTeams = async () => {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch teams.");
  }

  return data;
};

// Delete team
export const deleteTeam = async (teamId) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/${teamId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete team.");
  }

  return data;
};