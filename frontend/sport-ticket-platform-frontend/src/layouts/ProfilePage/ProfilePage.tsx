import { useEffect, useState } from "react";
import type { UserProfileModel } from "../../models/UserProfileModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import "./css/Profile.css";

type PanelName = "profile" | "security" | "reports";

export const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfileModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(false);

  const [activePanel, setActivePanel] = useState<PanelName>("profile");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [cityName, setCityName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  const [reportOpen, setReportOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:8082/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to load profile");

      const data: UserProfileModel = await response.json();
      setProfile(data);
      setFirstName(data.firstName ?? "");
      setLastName(data.lastName ?? "");
      setPhoneNumber(data.phoneNumber ?? "");
      setDateOfBirth(data.dateOfBirth ?? "");
      setCityName(data.city?.cityName ?? "");
    } catch (err) {
      setHttpError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const buildUpdateUrl = (np?: string, op?: string) => {
    const url = new URL("http://localhost:8082/user/profile/update");
    if (np) url.searchParams.set("newPassword", np);
    if (op) url.searchParams.set("oldPassword", op);
    return url.toString();
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSavingProfile(true);
    setProfileMsg("");
    try {
      const payload = {
        email: profile.email,
        firstName,
        lastName,
        phoneNumber,
        dateOfBirth,
        city: { cityName },
      };

      const response = await fetch(buildUpdateUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Update failed");

      setProfileMsg("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      setProfileMsg("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!profile) return;
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    setSavingPassword(true);
    setPasswordMsg("");
    try {
      const payload = {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        dateOfBirth: profile.dateOfBirth,
        city: profile.city ? { cityName: profile.city.cityName } : null,
      };

      const response = await fetch(buildUpdateUrl(newPassword, oldPassword), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Password change failed");

      setPasswordMsg("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg("Failed to change password. Check your current password.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (isLoading || !profile) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container mt-5">
        <p>Error loading profile.</p>
      </div>
    );
  }

  const initials = `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`;

  return (
    <div className="pp-layout">
      <aside className="pp-sidebar">
        <div className="pp-side-user">
          <div className="pp-side-avatar">{initials}</div>
          <div>
            <div className="pp-side-user-name">
              {profile.firstName} {profile.lastName}
            </div>
            <div className="pp-side-user-role">Regular user</div>
          </div>
        </div>

        <nav className="pp-side-nav">
          <button
            className={`pp-side-link ${activePanel === "profile" ? "pp-active" : ""}`}
            onClick={() => setActivePanel("profile")}
          >
            <span className="pp-ic">👤</span>
            Profile
          </button>

          <button
            className={`pp-side-link ${activePanel === "security" ? "pp-active" : ""}`}
            onClick={() => setActivePanel("security")}
          >
            <span className="pp-ic">🔒</span>
            Security
          </button>

          <button
            className={`pp-side-link ${activePanel === "reports" ? "pp-active" : ""}`}
            onClick={() => {
              setActivePanel("reports");
              setReportOpen(true);
            }}
          >
            <span className="pp-ic">📋</span>
            Reports
          </button>
        </nav>
      </aside>

      <div className="pp-content">
        {/* ===== PROFILE PANEL ===== */}
        {activePanel === "profile" && (
          <section className="pp-panel pp-active">
            <div className="pp-panel-head">
              <div className="pp-panel-title">Profile</div>
              <div className="pp-panel-sub">
                Update your personal information
              </div>
            </div>

            <div className="pp-readonly-strip">
              <div className="pp-ro-item">
                <span>Email</span>
                <b>{profile.email}</b>
              </div>
              <div className="pp-ro-item">
                <span>Account status</span>
                <span className="pp-status-pill">Active</span>
              </div>
            </div>

            <div className="pp-row2">
              <div className="pp-field">
                <label htmlFor="pFirst">First name</label>
                <input
                  id="pFirst"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="pp-field">
                <label htmlFor="pLast">Last name</label>
                <input
                  id="pLast"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="pp-row2">
              <div className="pp-field">
                <label htmlFor="pPhone">Phone number</label>
                <input
                  id="pPhone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="pp-row2">
              <div className="pp-field">
                <label htmlFor="pCity">City</label>
                <input
                  id="pCity"
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />
              </div>

              <div className="pp-field">
                <label htmlFor="pBirthdate">Date of birth</label>
                <input
                  id="pBirthdate"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>

            {profileMsg && <div className="pp-form-msg">{profileMsg}</div>}

            <button
              className="pp-btn-primary"
              onClick={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? "Saving..." : "Save changes"}
            </button>
          </section>
        )}

        {/* ===== SECURITY PANEL ===== */}
        {activePanel === "security" && (
          <section className="pp-panel pp-active">
            <div className="pp-panel-head">
              <div className="pp-panel-title">Security</div>
              <div className="pp-panel-sub">Manage your password</div>
            </div>

            <div className="pp-field" style={{ maxWidth: 360 }}>
              <label>Current password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your current password"
              />
            </div>
            <div className="pp-field" style={{ maxWidth: 360 }}>
              <label>New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </div>
            <div className="pp-field" style={{ maxWidth: 360 }}>
              <label>Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </div>

            {passwordMsg && <div className="pp-form-msg">{passwordMsg}</div>}

            <button
              className="pp-btn-primary"
              onClick={handleChangePassword}
              disabled={savingPassword || !oldPassword || !newPassword}
            >
              {savingPassword ? "Saving..." : "Change password"}
            </button>
          </section>
        )}

        {/* ===== REPORTS PANEL ===== */}
        {activePanel === "reports" && reportOpen && (
          <section className="pp-panel pp-active">
            <div className="pp-panel-head">
              <div className="pp-panel-title">Reports</div>
              <div className="pp-panel-sub">Submit a new report</div>
            </div>

            <div className="pp-field">
              <label htmlFor="reportTitle">Subject</label>
              <input
                id="reportTitle"
                type="text"
                placeholder="Briefly describe the issue"
              />
            </div>

            <div className="pp-field">
              <label htmlFor="reportContent">Details</label>
              <textarea
                id="reportContent"
                rows={5}
                placeholder="Explain what happened..."
                className="pp-textarea"
              />
            </div>

            <button
              className="pp-btn-primary"
              onClick={() =>
                alert("Report submission endpoint isn't wired yet.")
              }
            >
              Submit report
            </button>
          </section>
        )}
      </div>
    </div>
  );
};
