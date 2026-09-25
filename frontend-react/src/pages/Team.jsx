
import { useEffect, useState } from "react";

function Team() {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("Developer");

  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Load teams from localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem("devflowx_teams");

    if (savedTeams) {
      try {
        setTeams(JSON.parse(savedTeams));
      } catch (error) {
        console.error("Unable to load teams:", error);
      }
    }
  }, []);

  // Save teams in localStorage
  useEffect(() => {
    localStorage.setItem(
      "devflowx_teams",
      JSON.stringify(teams)
    );
  }, [teams]);

  // Show notification
  function showMessage(text, type) {
    setMessage(text);
    setMessageType(type);
  }

  // Create a new team
  function handleCreateTeam(event) {
    event.preventDefault();

    const cleanName = teamName.trim();
    const cleanDescription = description.trim();

    if (!cleanName) {
      showMessage("Please enter a team name.", "error");
      return;
    }

    if (cleanName.length < 3) {
      showMessage(
        "Team name must contain at least 3 characters.",
        "error"
      );
      return;
    }

    const alreadyExists = teams.some(
      (team) =>
        team.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (alreadyExists) {
      showMessage(
        "A team with this name already exists.",
        "error"
      );
      return;
    }

    const newTeam = {
      id: Date.now(),
      name: cleanName,
      description:
        cleanDescription || "No description provided.",
      members: [],
      createdAt: new Date().toLocaleDateString()
    };

    setTeams((previousTeams) => [
      ...previousTeams,
      newTeam
    ]);

    setTeamName("");
    setDescription("");

    showMessage("Team created successfully.", "success");
  }

  // Delete a complete team
  function handleDeleteTeam(teamId) {
    const team = teams.find(
      (item) => item.id === teamId
    );

    if (!team) {
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${team.name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    setTeams((previousTeams) =>
      previousTeams.filter(
        (item) => item.id !== teamId
      )
    );

    if (selectedTeamId === teamId) {
      setSelectedTeamId(null);
    }

    showMessage("Team deleted successfully.", "success");
  }

  // Open the member form for a team
  function openMemberForm(teamId) {
    setSelectedTeamId(teamId);

    setMemberName("");
    setMemberEmail("");
    setMemberRole("Developer");

    setMessage("");
    setMessageType("");
  }

  // Add a member to a team
  function handleAddMember(event) {
    event.preventDefault();

    const cleanName = memberName.trim();
    const cleanEmail = memberEmail.trim();

    if (!selectedTeamId) {
      showMessage("Please select a team first.", "error");
      return;
    }

    if (!cleanName || !cleanEmail) {
      showMessage(
        "Please enter member name and email.",
        "error"
      );
      return;
    }

    if (!cleanEmail.includes("@")) {
      showMessage(
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    const newMember = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      role: memberRole
    };

    setTeams((previousTeams) =>
      previousTeams.map((team) => {
        if (team.id !== selectedTeamId) {
          return team;
        }

        const existingMembers = Array.isArray(team.members)
          ? team.members
          : [];

        const emailExists = existingMembers.some(
          (member) =>
            member.email.toLowerCase() ===
            cleanEmail.toLowerCase()
        );

        if (emailExists) {
          return team;
        }

        return {
          ...team,
          members: [
            ...existingMembers,
            newMember
          ]
        };
      })
    );

    setMemberName("");
    setMemberEmail("");
    setMemberRole("Developer");

    showMessage("Member added successfully.", "success");
  }

  // Delete a member from a team
  function handleDeleteMember(teamId, memberId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this member?"
    );

    if (!confirmDelete) {
      return;
    }

    setTeams((previousTeams) =>
      previousTeams.map((team) => {
        if (team.id !== teamId) {
          return team;
        }

        return {
          ...team,
          members: team.members.filter(
            (member) => member.id !== memberId
          )
        };
      })
    );

    showMessage("Member removed successfully.", "success");
  }

  // Clear create-team form
  function handleClearForm() {
    setTeamName("");
    setDescription("");
    setMessage("");
    setMessageType("");
  }

  return (
    <main className="premium-team-page">

      {/* 3D Background */}
      <div className="team-background-shape shape-one"></div>
      <div className="team-background-shape shape-two"></div>
      <div className="team-background-shape shape-three"></div>

      {/* Header */}
      <section className="premium-team-header">

        <div className="team-heading-content">

          <div className="team-breadcrumb">
            WORKSPACE <span>/</span> TEAM
          </div>

          <div className="team-heading-row">

            <div className="team-heading-icon">
              <span>✦</span>
            </div>

            <div>
              <h1>Team Collaboration</h1>

              <p>
                Build your team, manage members,
                and collaborate with your developers.
              </p>
            </div>

          </div>

        </div>

        <div className="total-team-glass-card">

          <div className="total-team-icon">
            👥
          </div>

          <div>
            <span>Total Teams</span>
            <strong>{teams.length}</strong>
          </div>

        </div>

      </section>

      {/* Notification */}
      {message && (
        <div className={`premium-team-alert ${messageType}`}>
          <span>
            {messageType === "success" ? "✓" : "!"}
          </span>

          {message}
        </div>
      )}

      {/* Main Layout */}
      <section className="premium-team-grid">

        {/* Create Team */}
        <div className="premium-glass-card create-team-panel">

          <div className="card-top-line"></div>

          <div className="premium-card-heading">

            <div className="premium-card-icon create-icon">
              +
            </div>

            <div>
              <h2>Create New Team</h2>
              <p>Start a new team workspace.</p>
            </div>

          </div>

          <form onSubmit={handleCreateTeam}>

            <div className="premium-form-group">

              <label htmlFor="teamName">
                Team Name
              </label>

              <input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(event) =>
                  setTeamName(event.target.value)
                }
                placeholder="DevFlow AI Team"
                maxLength={80}
              />

            </div>

            <div className="premium-form-group">

              <label htmlFor="teamDescription">
                Description
              </label>

              <textarea
                id="teamDescription"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Write a short team description..."
                rows={5}
                maxLength={300}
              />

            </div>

            <div className="form-button-row">

              <button
                type="button"
                className="premium-clear-button"
                onClick={handleClearForm}
              >
                Clear
              </button>

              <button
                type="submit"
                className="premium-create-button"
              >
                <span>✦</span>
                Create Team
              </button>

            </div>

          </form>

        </div>

        {/* Teams List */}
        <div className="premium-glass-card teams-panel">

          <div className="premium-card-heading">

            <div className="premium-card-icon teams-icon">
              👥
            </div>

            <div>
              <h2>Your Teams</h2>
              <p>Manage your teams and members.</p>
            </div>

          </div>

          {teams.length === 0 ? (

            <div className="premium-empty-state">

              <div className="empty-3d-icon">
                👥
              </div>

              <h3>No teams found</h3>

              <p>
                Create your first team to get started.
              </p>

            </div>

          ) : (

            <div className="premium-teams-grid">

              {teams.map((team, index) => {

                const teamMembers = Array.isArray(
                  team.members
                )
                  ? team.members
                  : [];

                return (
                  <article
                    className="premium-team-card"
                    key={team.id}
                  >

                    <div className="team-card-glow"></div>

                    <div className="team-card-header">

                      <div
                        className={`premium-team-avatar avatar-${index % 4}`}
                      >
                        {team.name.charAt(0).toUpperCase()}
                      </div>

                      <span className="premium-active-badge">
                        ● Active
                      </span>

                    </div>

                    <h3>{team.name}</h3>

                    <p className="premium-team-description">
                      {team.description}
                    </p>

                    <div className="premium-team-meta">

                      <span>
                        👤 {teamMembers.length} member
                        {teamMembers.length !== 1 ? "s" : ""}
                      </span>

                      <span>
                        ◷ {team.createdAt}
                      </span>

                    </div>

                    {/* Add Member Button */}
                    <button
                      type="button"
                      className="premium-add-member-button"
                      onClick={() =>
                        openMemberForm(team.id)
                      }
                    >
                      + Add Member
                    </button>

                    {/* Member Form */}
                    {selectedTeamId === team.id && (

                      <form
                        className="member-form"
                        onSubmit={handleAddMember}
                      >

                        <h4>Add Team Member</h4>

                        <input
                          type="text"
                          placeholder="Member name"
                          value={memberName}
                          onChange={(event) =>
                            setMemberName(event.target.value)
                          }
                        />

                        <input
                          type="email"
                          placeholder="Member email"
                          value={memberEmail}
                          onChange={(event) =>
                            setMemberEmail(event.target.value)
                          }
                        />

                        <select
                          value={memberRole}
                          onChange={(event) =>
                            setMemberRole(event.target.value)
                          }
                        >
                          <option value="Developer">
                            Developer
                          </option>

                          <option value="Team Lead">
                            Team Lead
                          </option>

                          <option value="Designer">
                            Designer
                          </option>

                          <option value="Tester">
                            Tester
                          </option>

                          <option value="Manager">
                            Manager
                          </option>
                        </select>

                        <div className="member-form-buttons">

                          <button type="submit">
                            Save Member
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedTeamId(null)
                            }
                          >
                            Cancel
                          </button>

                        </div>

                      </form>

                    )}

                    {/* Member List */}
                    {teamMembers.length > 0 && (

                      <div className="team-members-list">

                        <h4>Team Members</h4>

                        {teamMembers.map((member) => (

                          <div
                            className="team-member-item"
                            key={member.id}
                          >

                            <div className="member-avatar">
                              {member.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="member-details">

                              <strong>
                                {member.name}
                              </strong>

                              <span>
                                {member.email}
                              </span>

                              <small>
                                {member.role}
                              </small>

                            </div>

                            <button
                              type="button"
                              className="remove-member-button"
                              onClick={() =>
                                handleDeleteMember(
                                  team.id,
                                  member.id
                                )
                              }
                              title="Remove member"
                            >
                              ×
                            </button>

                          </div>

                        ))}

                      </div>

                    )}

                    {/* Team Footer */}
                    <div className="team-card-footer">

                      <span className="team-workspace-label">
                        DEVFLOW WORKSPACE
                      </span>

                      <button
                        type="button"
                        className="premium-delete-button"
                        onClick={() =>
                          handleDeleteTeam(team.id)
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default Team;