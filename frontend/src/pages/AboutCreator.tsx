import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutCreator: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="creator-page">
      <button className="creator-back" onClick={() => navigate(-1)} aria-label="Go back">
        ←
      </button>

      <div className="creator-glow creator-glow-left" />
      <div className="creator-glow creator-glow-right" />
      <div className="creator-glow creator-glow-top" />

      <div className="creator-shell">
        <header className="creator-header">
          <p className="creator-eyebrow">
            <span />
            Meet Our Creator
            <span />
          </p>
          <h1 className="creator-title">
            Meet Our <em>Creator</em>
          </h1>
          <p className="creator-subtitle">
            The person behind the code — bringing creativity and technical
            excellence together.
          </p>
        </header>

        <section className="creator-card">
          <aside className="creator-profile">
            <div className="creator-photo-wrap">
              <img src="/images/Charan Sai.jpg" alt="M Charan Sai" />
            </div>
            <h2>M Charan Sai</h2>
            <p className="creator-role">Full Stack Developer</p>
            <div className="creator-tech">
              <span title="React" aria-label="React">
                <svg viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="2.1" fill="#61DAFB" stroke="none" />
                  <ellipse cx="12" cy="12" rx="10" ry="4.2" />
                  <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
                  <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
                </svg>
              </span>
              <span title="JavaScript" aria-label="JavaScript">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="3" fill="#F7DF1E" />
                  <text x="7.2" y="17.2" fontSize="11" fontWeight="800" fontFamily="Arial">JS</text>
                </svg>
              </span>
              <span title="MongoDB" aria-label="MongoDB">
                <svg viewBox="0 0 24 24" fill="#10B981">
                  <path d="M12 2s5 5.4 5 11.2c0 3.6-2.1 6.2-5 8.8-2.9-2.6-5-5.2-5-8.8C7 7.4 12 2 12 2zm0 4.2c-.4 1.8-.8 4.6-.5 7.3.2 1.8.7 3.4 1.5 5 .8-1.6 1.3-3.2 1.5-5 .3-2.7-.1-5.5-.5-7.3-.3.6-.7 1-.5 0z" />
                </svg>
              </span>
              <span title="GitHub" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="#111827">
                  <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
                </svg>
              </span>
              <em className="creator-tech-more">and more</em>
            </div>
            <button type="button" className="creator-cta">
              {'</>'} Let’s Build Together <span>→</span>
            </button>
          </aside>

          <div className="creator-about">
            <h3>About Me</h3>
            <p>
              I’m a passionate <strong>Full-Stack Developer</strong> focused on transforming ideas into scalable and impactful digital solutions.
            </p>
            <p>
              I enjoy solving complex problems and continuously exploring emerging technologies.
            </p>
            <p>
              I’m driven by the challenge of building applications that are both innovative and genuinely useful.
            </p>
            <p>
              Beyond coding, I believe in <strong>sharing knowledge</strong> and contributing to the growth of the <strong>developer community</strong>.
            </p>
            <p>
              My goal is to keep learning, keep building, and create technology that delivers meaningful real-world impact.
            </p>

            <div className="creator-stats">
              <div>
                <span>🚀</span>
                <small>Projects Built</small>
                <b>40+</b>
              </div>
              <div>
                <span>🎓</span>
                <small>Technologies</small>
                <b>10+</b>
              </div>
              <div>
                <span>👥</span>
                <small>Community</small>
                <b>Active</b>
              </div>
              <div>
                <span>💡</span>
                <small>Always</small>
                <b>Learning</b>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .creator-page {
          position: fixed;
          inset: 0;
          overflow-y: auto;
          z-index: 1;
          background: linear-gradient(160deg, #3b2cf0 0%, #4f46e5 38%, #7c3aed 100%);
          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .creator-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(8px);
        }
        .creator-glow-left {
          width: 280px;
          height: 280px;
          top: 80px;
          left: -80px;
          background: rgba(255, 255, 255, 0.12);
        }
        .creator-glow-right {
          width: 420px;
          height: 420px;
          top: -60px;
          right: -120px;
          background: rgba(236, 72, 153, 0.22);
        }
        .creator-glow-top {
          width: 180px;
          height: 180px;
          bottom: 40px;
          left: 18%;
          background: rgba(56, 189, 248, 0.12);
        }

        .creator-back {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.92);
          color: #4a5568;
          font-size: 18px;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .creator-back:hover {
          transform: scale(1.05);
          background: #fff;
        }

        .creator-shell {
          position: relative;
          max-width: 1080px;
          margin: 0 auto;
          padding: 72px 24px 48px;
          min-height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .creator-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .creator-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 0 0 14px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .creator-eyebrow span {
          width: 28px;
          height: 1px;
          background: rgba(255, 255, 255, 0.55);
        }

        .creator-title {
          margin: 0 0 12px;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          line-height: 1.1;
        }
        .creator-title em {
          font-style: normal;
          background: linear-gradient(90deg, #67e8f9 0%, #e879f9 55%, #fb7185 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .creator-subtitle {
          margin: 0 auto;
          max-width: 520px;
          color: rgba(255, 255, 255, 0.82);
          font-size: 1.05rem;
          line-height: 1.6;
        }

        .creator-card {
          display: grid;
          grid-template-columns: 280px 1fr;
          background: #fff;
          border-radius: 28px;
          box-shadow: 0 30px 70px rgba(15, 23, 42, 0.22);
          overflow: hidden;
        }

        .creator-profile {
          padding: 40px 28px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .creator-photo-wrap {
          width: 132px;
          height: 132px;
          border-radius: 50%;
          overflow: hidden;
          background: #f1f5f9;
          box-shadow: 0 0 0 6px #eef2ff;
          margin-bottom: 20px;
        }
        .creator-photo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        .creator-profile h2 {
          margin: 0 0 6px;
          font-size: 1.55rem;
          font-weight: 800;
          color: #0f172a;
        }

        .creator-role {
          margin: 0 0 22px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .creator-tech {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 26px;
        }
        .creator-tech span {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .creator-tech svg {
          width: 20px;
          height: 20px;
        }
        .creator-tech-more {
          font-style: normal;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #64748b;
          white-space: nowrap;
        }

        .creator-cta {
          width: 100%;
          border: none;
          border-radius: 999px;
          padding: 12px 16px;
          background: linear-gradient(90deg, #6366f1 0%, #7c3aed 100%);
          color: #fff;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: default;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.28);
        }

        .creator-about {
          padding: 40px 40px 28px 16px;
        }
        .creator-about h3 {
          margin: 0 0 16px;
          font-size: 1.7rem;
          font-weight: 800;
          color: #0f172a;
        }
        .creator-about p {
          margin: 0 0 12px;
          color: #475569;
          font-size: 0.98rem;
          line-height: 1.7;
        }
        .creator-about p:last-of-type {
          margin-bottom: 22px;
        }
        .creator-about strong {
          color: #6d28d9;
          font-weight: 700;
        }

        .creator-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .creator-stats div {
          background: #f8fafc;
          border-radius: 16px;
          padding: 12px 8px;
          text-align: center;
        }
        .creator-stats span {
          display: block;
          font-size: 16px;
          margin-bottom: 4px;
        }
        .creator-stats small {
          display: block;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 600;
        }
        .creator-stats b {
          display: block;
          margin-top: 2px;
          color: #0f172a;
          font-size: 0.95rem;
        }

        @media (max-width: 860px) {
          .creator-shell {
            padding-top: 88px;
            justify-content: flex-start;
          }
          .creator-card {
            grid-template-columns: 1fr;
          }
          .creator-about {
            padding: 8px 24px 28px;
          }
          .creator-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .creator-about {
            padding: 8px 18px 24px;
          }
          .creator-profile {
            padding: 32px 20px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutCreator;
