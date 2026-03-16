import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBio = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState("");

  const handleclick = async () => {
    try{const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/addbio`,
      { bio: bio },
      { withCredentials: true }
    );
    console.log(res.data);
    navigate(`/users/profile/${res.data.user._id}`);}
    catch(err){
      console.log(err)
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .addbio-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .addbio-root {
          font-family: 'DM Sans', sans-serif;
          background: #05060f;
          min-height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* Ambient background blobs */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.18;
        }
        .bg-blob-1 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, #6366f1, transparent 70%);
          top: -120px; left: -100px;
        }
        .bg-blob-2 {
          width: 360px; height: 360px;
          background: radial-gradient(circle, #818cf8, transparent 70%);
          bottom: -80px; right: -80px;
        }
        .bg-blob-3 {
          width: 240px; height: 240px;
          background: radial-gradient(circle, #4f46e5, transparent 70%);
          top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.10;
        }

        /* Subtle grid texture */
        .bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* ── MOBILE ── */
        .mobile-wrap {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 100vh;
          width: 100vw;
          padding: 40px 28px 36px;
        }
        @media (min-width: 768px) { .mobile-wrap { display: none !important; } }

        .brand-badge-mobile {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
        }
        .icon-box-mobile {
          width: 58px; height: 58px;
          border-radius: 18px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          box-shadow: 0 0 32px rgba(99,102,241,0.45);
        }
        .app-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 28px;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .subtitle {
          color: #64748b;
          font-size: 13px;
          text-align: center;
          line-height: 1.6;
          margin-top: 4px;
        }

        .input-block { display: flex; flex-direction: column; width: 100%; max-width: 360px; gap: 14px; }
        .field-wrap { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding-left: 2px;
        }
        .bio-textarea {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid rgba(99,102,241,0.2);
          background: rgba(15,18,35,0.9);
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          resize: none;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          line-height: 1.6;
        }
        .bio-textarea::placeholder { color: #334155; }
        .bio-textarea:focus {
          border-color: rgba(99,102,241,0.6);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12), inset 0 0 20px rgba(99,102,241,0.04);
        }
        .hint {
          color: #334155;
          font-size: 11px;
          padding-left: 2px;
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.12s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(99,102,241,0.35);
        }
        .btn-primary:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(99,102,241,0.45); }
        .btn-primary:active { transform: translateY(0); opacity: 1; }

        .btn-ghost {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(99,102,241,0.15);
          background: transparent;
          color: #475569;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .btn-ghost:hover {
          border-color: rgba(99,102,241,0.35);
          color: #94a3b8;
          background: rgba(99,102,241,0.05);
        }

        .step-dots { display: flex; align-items: center; gap: 8px; padding-bottom: 4px; }
        .dot { border-radius: 99px; transition: all 0.3s; }
        .dot-inactive { width: 6px; height: 6px; background: #1e293b; }
        .dot-active { width: 20px; height: 6px; background: linear-gradient(90deg, #6366f1, #818cf8); }

        /* ── DESKTOP ── */
        .desktop-card {
          display: none;
        }
        @media (min-width: 768px) {
          .desktop-card {
            display: flex;
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 880px;
            border-radius: 28px;
            overflow: hidden;
            border: 1px solid rgba(99,102,241,0.15);
            box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset;
          }
        }

        /* Left panel */
        .left-panel {
          width: 38%;
          background: linear-gradient(160deg, #312e81 0%, #3730a3 40%, #1e1b4b 100%);
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .left-panel::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .left-panel::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }

        .brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 99px;
          padding: 6px 14px;
          width: fit-content;
          margin-bottom: 36px;
        }
        .brand-pill span:first-child { font-size: 14px; }
        .brand-pill-text {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 12px;
          color: rgba(255,255,255,0.9);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .panel-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 38px;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -1px;
        }
        .panel-heading em {
          font-style: normal;
          color: #a5b4fc;
        }
        .panel-sub {
          color: rgba(196, 196,226, 0.7);
          font-size: 13.5px;
          margin-top: 16px;
          line-height: 1.7;
          max-width: 220px;
        }

        .step-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }
        .step-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          color: rgba(196,196,226,0.55);
          margin-left: 6px;
          letter-spacing: 0.5px;
        }

        /* Right panel */
        .right-panel {
          width: 62%;
          background: #0d1117;
          padding: 52px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
        .right-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);
        }

        .panel-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 30px;
          color: #f1f5f9;
          letter-spacing: -0.8px;
          margin-bottom: 6px;
        }
        .panel-desc {
          color: #475569;
          font-size: 14px;
          margin-bottom: 36px;
          line-height: 1.6;
        }

        .desktop-field-label {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 8px;
          display: block;
        }

        .desktop-textarea {
          width: 100%;
          padding: 16px 18px;
          border-radius: 14px;
          border: 1px solid rgba(99,102,241,0.18);
          background: rgba(15,18,35,0.7);
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          resize: none;
          outline: none;
          line-height: 1.65;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 8px;
        }
        .desktop-textarea::placeholder { color: #1e293b; }
        .desktop-textarea:focus {
          border-color: rgba(99,102,241,0.55);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1), inset 0 0 30px rgba(99,102,241,0.03);
        }
        .desktop-hint {
          color: #1e293b;
          font-size: 11px;
          margin-bottom: 28px;
          padding-left: 2px;
        }

        .btn-row { display: flex; flex-direction: column; gap: 12px; }

        .desktop-btn-primary {
          width: 100%;
          padding: 15px 24px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.5px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(99,102,241,0.3);
          transition: opacity 0.15s, transform 0.12s, box-shadow 0.2s;
        }
        .desktop-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,102,241,0.4); }
        .desktop-btn-primary:active { transform: translateY(0); }

        .desktop-btn-ghost {
          width: 100%;
          padding: 15px 24px;
          border-radius: 14px;
          border: 1px solid rgba(99,102,241,0.13);
          background: transparent;
          color: #334155;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .desktop-btn-ghost:hover {
          border-color: rgba(99,102,241,0.3);
          color: #64748b;
          background: rgba(99,102,241,0.04);
        }

        /* Char counter glow */
        .char-count {
          font-size: 11px;
          color: ${bio.length > 130 ? '#f87171' : '#334155'};
          text-align: right;
          margin-top: -4px;
          margin-bottom: 24px;
          transition: color 0.2s;
        }
      `}</style>

      <div className="addbio-root">
        {/* Background effects */}
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
        <div className="bg-grid" />

        {/* ── MOBILE ── */}
        <div className="mobile-wrap">
          {/* Top: icon + heading */}
          <div className="brand-badge-mobile">
            <span className="app-name">Vortex</span>
            <p className="subtitle">Tell people a little about yourself.</p>
          </div>

          {/* Middle: bio input */}
          <div className="input-block">
            <div className="field-wrap">
              <label className="field-label">Bio</label>
              <textarea
                placeholder="Write something about you…"
                rows={5}
                className="bio-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <p className="hint">You can always edit this later from your profile.</p>
            </div>

            <button type="button" className="btn-primary" onClick={handleclick}>
              Add Bio
            </button>
            <button className="btn-ghost" onClick={handleclick}>
              Skip for now
            </button>
          </div>

          {/* Bottom step indicator */}
          <div className="step-dots">
            <span className="dot dot-inactive" />
            <span className="dot dot-inactive" />
            <span className="dot dot-active" />
          </div>
        </div>

        {/* ── DESKTOP ── */}
        <div className="desktop-card">
          {/* Left panel */}
          <div className="left-panel">
            <div>
              <div className="brand-pill">
                <span className="brand-pill-text">Vortex</span>
              </div>
              <h2 className="panel-heading">
                Make your<br /><em>profile</em><br />stand out.
              </h2>
              <p className="panel-sub">
                A good bio helps others know who you are and what you're about. Keep it short and real.
              </p>
            </div>

            <div className="step-indicator">
              <span className="dot dot-inactive" style={{ background: 'rgba(165,180,252,0.3)' }} />
              <span className="dot dot-inactive" style={{ background: 'rgba(165,180,252,0.3)' }} />
              <span className="dot dot-active" style={{ background: 'rgba(255,255,255,0.9)', width: '20px' }} />
              <span className="step-label">Step 3 of 3</span>
            </div>
          </div>

          {/* Right panel */}
          <div className="right-panel">
            <h1 className="panel-title">Add a bio</h1>
            <p className="panel-desc">
              Let people know a little about you. You can skip this and do it later.
            </p>

            <label className="desktop-field-label">Bio</label>
            <textarea
              placeholder="Write something about you…"
              rows={5}
              className="desktop-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="desktop-hint">Max 150 characters. You can edit this anytime.</p>

            <div className="btn-row">
              <button
                type="button"
                className="desktop-btn-primary"
                onClick={handleclick}
              >
                Add Bio <span>→</span>
              </button>
              <button
                className="desktop-btn-ghost"
                onClick={handleclick}
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBio;