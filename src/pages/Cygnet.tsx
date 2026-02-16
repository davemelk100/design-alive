import { useState } from "react";

const PASSCODE = "10623";

export default function Cygnet() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("cygnet-auth") === "true"
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSCODE) {
      sessionStorage.setItem("cygnet-auth", "true");
      setAuthenticated(true);
    } else {
      setError(true);
      setInput("");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
          .cygnet-gate, .cygnet-gate * { font-family: 'Montserrat', sans-serif !important; }
        `}</style>
        <div className="cygnet-gate text-center">
          <div style={{ background: "#1B3A5C", borderRadius: 14, padding: "40px 48px", maxWidth: 400 }}>
            <h2 style={{ fontSize: 28, color: "white", marginBottom: 8, fontWeight: 600 }}>Cygnet Institute</h2>
            <p style={{ fontSize: 16, color: "#a3c0d6", marginBottom: 28 }}>Enter passcode to view this report</p>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(false); }}
                placeholder="Passcode"
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: 18,
                  borderRadius: 8,
                  border: error ? "2px solid #c0392b" : "2px solid #2E8B8B",
                  outline: "none",
                  textAlign: "center",
                  letterSpacing: 4,
                  marginBottom: 16,
                  boxSizing: "border-box",
                }}
              />
              {error && <p style={{ color: "#c0392b", fontSize: 14, marginBottom: 12 }}>Incorrect passcode</p>}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "white",
                  background: "#2E8B8B",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Enter
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');

        .cygnet-page, .cygnet-page * { font-family: 'DM Sans', sans-serif !important; margin: 0; padding: 0; box-sizing: border-box; }
        .cygnet-page { background: #faf9f7; color: #2a2a2a; line-height: 1.65; -webkit-font-smoothing: antialiased; }

        .cygnet-page .hero { background: #1B3A5C; padding: 48px 24px 44px; text-align: center; position: relative; overflow: hidden; }
        .cygnet-page .hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #2E8B8B, #3AAFAF, #E8A838); }
        .cygnet-page .hero h1 { font-family: 'DM Serif Display', serif !important; font-size: 38px; color: white; margin-bottom: 8px; font-weight: 400; }
        .cygnet-page .hero p { font-size: 17px; color: #a3c0d6; max-width: 600px; margin: 0 auto; }
        .cygnet-page .hero .tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 16px; }
        .cygnet-page .hero .tag { display: inline-block; padding: 6px 16px; background: rgba(46,139,139,0.2); border: 1px solid rgba(46,139,139,0.35); border-radius: 20px; font-size: 13px; font-weight: 600; color: #7dd4d4; letter-spacing: 0.4px; text-transform: uppercase; }

        .cygnet-page .wrap { max-width: 800px; margin: 0 auto; padding: 36px 20px 64px; }

        .cygnet-page .section-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #2E8B8B; margin: 36px 0 12px; display: flex; align-items: center; gap: 10px; }
        .cygnet-page .section-label .line { flex: 1; height: 1px; background: #ddd; }

        .cygnet-page .part-divider { margin: 52px 0 8px; padding: 20px 24px; text-align: center; background: #1B3A5C; border-radius: 12px; position: relative; overflow: hidden; }
        .cygnet-page .part-divider::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #E8A838, #2E8B8B); }
        .cygnet-page .part-divider h2 { font-family: 'DM Serif Display', serif !important; font-size: 26px; color: white; font-weight: 400; }
        .cygnet-page .part-divider p { font-size: 15px; color: #93b8d4; margin-top: 4px; }

        .cygnet-page .card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 14px; border: 1px solid #e8e4df; box-shadow: 0 1px 6px rgba(0,0,0,0.04); }
        .cygnet-page .card h3 { font-size: 19px; font-weight: 700; color: #1B3A5C; margin-bottom: 6px; }
        .cygnet-page .card p { font-size: 16px; color: #555; }
        .cygnet-page .card p + p { margin-top: 8px; }
        .cygnet-page .card .meta { font-size: 14px; color: #888; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }

        .cygnet-page .context { background: white; border-radius: 12px; padding: 24px; margin-bottom: 14px; border: 1px solid #e8e4df; border-left: 4px solid #2E8B8B; box-shadow: 0 1px 6px rgba(0,0,0,0.04); }
        .cygnet-page .context h2 { font-family: 'DM Serif Display', serif !important; font-size: 22px; color: #1B3A5C; margin-bottom: 8px; font-weight: 400; }
        .cygnet-page .context p { font-size: 16px; color: #555; }
        .cygnet-page .context p + p { margin-top: 8px; }

        .cygnet-page .pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0 24px; }
        @media (max-width: 540px) { .cygnet-page .pillars { grid-template-columns: 1fr; } }
        .cygnet-page .pillar { background: white; border-radius: 10px; padding: 18px; border: 1px solid #e8e4df; text-align: center; }
        .cygnet-page .pillar .icon { font-size: 24px; margin-bottom: 6px; }
        .cygnet-page .pillar h4 { font-size: 16px; font-weight: 700; color: #1B3A5C; margin-bottom: 4px; }
        .cygnet-page .pillar p { font-size: 15px; color: #666; }

        .cygnet-page .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin: 16px 0 24px; }
        .cygnet-page .stat { background: white; border-radius: 10px; padding: 16px 12px; text-align: center; border: 1px solid #e8e4df; position: relative; overflow: hidden; }
        .cygnet-page .stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
        .cygnet-page .stat.teal::before { background: #2E8B8B; }
        .cygnet-page .stat.gold::before { background: #E8A838; }
        .cygnet-page .stat.navy::before { background: #1B3A5C; }
        .cygnet-page .stat .num { font-family: 'DM Serif Display', serif !important; font-size: 32px; line-height: 1.1; margin-bottom: 3px; }
        .cygnet-page .num-teal { color: #2E8B8B; } .cygnet-page .num-gold { color: #D4922A; } .cygnet-page .num-navy { color: #1B3A5C; }
        .cygnet-page .stat .label { font-size: 13px; color: #888; font-weight: 500; }

        .cygnet-page .process { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 16px 0 24px; }
        @media (max-width: 600px) { .cygnet-page .process { grid-template-columns: 1fr 1fr; } }
        .cygnet-page .step { background: #1B3A5C; border-radius: 10px; padding: 16px 12px; text-align: center; }
        .cygnet-page .step .step-num { display: inline-block; width: 32px; height: 32px; border-radius: 50%; background: #2E8B8B; color: white; font-weight: 700; font-size: 15px; line-height: 32px; margin-bottom: 8px; }
        .cygnet-page .step h4 { font-size: 14px; font-weight: 700; color: #E8A838; margin-bottom: 4px; }
        .cygnet-page .step p { font-size: 13px; color: #b8cfe0; line-height: 1.5; }

        .cygnet-page .accred { background: linear-gradient(135deg, #1B3A5C, #244b6e); border-radius: 12px; padding: 24px; margin-top: 16px; position: relative; overflow: hidden; }
        .cygnet-page .accred::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #E8A838, #2E8B8B); }
        .cygnet-page .accred h3 { font-family: 'DM Serif Display', serif !important; font-size: 21px; color: #E8A838; margin-bottom: 10px; font-weight: 400; }
        .cygnet-page .accred p { font-size: 16px; color: #b8cfe0; }
        .cygnet-page .accred p + p { margin-top: 8px; }
        .cygnet-page .accred strong { color: #fff; }

        .cygnet-page .bar-section { margin: 20px 0 28px; }
        .cygnet-page .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .cygnet-page .bar-label { width: 140px; font-size: 15px; color: #666; text-align: right; flex-shrink: 0; }
        .cygnet-page .bar-track { flex: 1; height: 18px; background: #eee; border-radius: 4px; }
        .cygnet-page .bar-fill { height: 100%; border-radius: 4px; background: #2E8B8B; }
        .cygnet-page .bar-val { width: 44px; font-size: 15px; font-weight: 700; color: #1B3A5C; }

        .cygnet-page .quotes { display: grid; grid-template-columns: 1fr; gap: 10px; margin: 20px 0 28px; }
        .cygnet-page .quote-card { background: #1B3A5C; border-radius: 10px; padding: 16px 20px; }
        .cygnet-page .quote-card p { font-size: 16px; color: #c8dae8; font-style: italic; line-height: 1.6; }
        .cygnet-page .quote-card .attr { font-size: 13px; color: #7fa8c4; font-style: normal; margin-top: 4px; font-weight: 600; }

        .cygnet-page .participants { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin: 20px 0 28px; }
        @media (max-width: 560px) { .cygnet-page .participants { grid-template-columns: repeat(2, 1fr); } }
        .cygnet-page .p-card { background: white; border-radius: 10px; padding: 14px 10px; text-align: center; border: 1px solid #e8e4df; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .cygnet-page .p-card .p-id { font-size: 13px; font-weight: 700; color: #999; margin-bottom: 6px; text-transform: uppercase; }
        .cygnet-page .p-card .p-scores { font-size: 15px; color: #555; margin-bottom: 4px; }
        .cygnet-page .p-card .p-change { font-family: 'DM Serif Display', serif !important; font-size: 26px; line-height: 1; }
        .cygnet-page .change-up { color: #2E8B8B; } .cygnet-page .change-down { color: #c0392b; } .cygnet-page .change-flat { color: #999; }

        .cygnet-page .bottom-note { background: linear-gradient(135deg, #1B3A5C, #244b6e); border-radius: 12px; padding: 28px; margin-top: 36px; position: relative; overflow: hidden; }
        .cygnet-page .bottom-note::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #E8A838, #2E8B8B); }
        .cygnet-page .bottom-note h3 { font-family: 'DM Serif Display', serif !important; font-size: 22px; color: #E8A838; margin-bottom: 10px; font-weight: 400; }
        .cygnet-page .bottom-note p { font-size: 16px; color: #b8cfe0; }
        .cygnet-page .bottom-note p + p { margin-top: 10px; }
        .cygnet-page .bottom-note strong { color: #fff; }

        .cygnet-page .footer-bar { background: #1B3A5C; padding: 20px 24px; text-align: center; }
        .cygnet-page .footer-bar p { font-size: 14px; color: #7fa8c4; }
        .cygnet-page .footer-bar a { color: #3AAFAF; text-decoration: none; }
      `}</style>

      <div className="cygnet-page">
        <div className="hero">
          <h1>Cygnet Institute of Personal Financial Literacy</h1>
          <p>Program Overview &amp; SEM 103 Workshop Results — January 2026</p>
          <div className="tags">
            <span className="tag">Fiduciary Standard</span>
            <span className="tag">NCCA-Accredited CRC&reg;</span>
            <span className="tag">No Hidden Agenda</span>
            <span className="tag">Since 1989</span>
          </div>
        </div>

        <div className="wrap">

          {/* ================================================================ */}
          {/* PART 1: PROGRAM OVERVIEW */}
          {/* ================================================================ */}

          <div className="section-label">What Makes Cygnet Different <span className="line"></span></div>

          <div className="pillars">
            <div className="pillar">
              <div className="icon">🛡️</div>
              <h4>No Hidden Agenda</h4>
              <p>Charter prohibits soliciting participants as clients for any purpose. Not a marketing front for product sales.</p>
            </div>
            <div className="pillar">
              <div className="icon">💰</div>
              <h4>Fee, Not Commission</h4>
              <p>Consultants earn fees for advice — no product sales, no conflicts of interest.</p>
            </div>
            <div className="pillar">
              <div className="icon">⚖️</div>
              <h4>Fiduciary Standard</h4>
              <p>Strict adherence to fiduciary responsibility throughout the entire process. Confidentiality guaranteed.</p>
            </div>
            <div className="pillar">
              <div className="icon">🎓</div>
              <h4>Experiential Learning</h4>
              <p>Participants build their own financial plan in class using the copyrighted Financial Lifestyle Analysis℠.</p>
            </div>
          </div>

          <div className="card">
            <h3>Leadership</h3>
            <p><strong>Ted Lakkides, CFP®, CRC®</strong> — President. Certified Financial Planner™ and Certified Retirement Counselor®. Has led Cygnet Institute since its founding, pioneering the Financial Lifestyle Analysis℠ process and building partnerships with UAW locals, Rochester Christian University, and financial institutions across Southeast Michigan.</p>
          </div>

          {/* FLA PROCESS */}
          <div className="section-label">The Financial Lifestyle Analysis℠ (FLA℠) <span className="line"></span></div>

          <div className="card">
            <p>The Financial Lifestyle Analysis℠ is a <strong>copyrighted, year-by-year projection tool</strong> pioneered by Cygnet that lets individuals see the future impact of their financial decisions today — like a video of their financial life on fast-forward. It connects all aspects of a person's financial picture: wages, Social Security, pensions, 401(k) savings, spending patterns, and long-term goals.</p>
            <p>The FLA℠ is the foundation of every Cygnet workshop. It is <strong>cash-flow-based, goal-oriented, transparent, and focused on lifestyle quality</strong> — not on selling financial products.</p>
          </div>

          {/* 4-STEP PROCESS */}
          <div className="section-label">The Cygnet 4-Step Process <span className="line"></span></div>

          <div className="process">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Explain &amp; Collect</h4>
              <p>Explain process, collect financial info, begin Spending Diary</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Review &amp; Project</h4>
              <p>Review spending, project future needs, review retirement revenue</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Refine &amp; Protect</h4>
              <p>Refine cash flow plan, review survivor's plan, insurance, estate</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h4>Finalize &amp; Invest</h4>
              <p>Final plan review, investment analysis, portfolio decisions</p>
            </div>
          </div>

          {/* WORKSHOP PROGRAMS */}
          <div className="section-label">Workshop Programs <span className="line"></span></div>

          <div className="card">
            <div className="meta">SEM 100 / SEM 101 — Financial Plan Checkup℠</div>
            <h3>4-Session Building-Block Workshop</h3>
            <p>Covers personal finance fundamentals, spending analysis, net worth, Social Security, pension review, career projections, retirement cash flow planning, and investment overview. Participants build their complete Financial Lifestyle Analysis℠ across all four sessions.</p>
            <p><strong>SEM 100</strong> — In-person classroom delivery at employer/union facilities.<br />
            <strong>SEM 101</strong> — Asynchronous online delivery via Rochester Christian University's Canvas LMS.</p>
            <p><strong>$532 per participant</strong> · Maximum 15 per workshop · Instructor: Certified CRC® professional</p>
          </div>

          <div className="card">
            <div className="meta">SEM 103 — Retirement Cash Flow Planning</div>
            <h3>3-Session Focused Workshop</h3>
            <p>Concentrated retirement readiness program. January 2026 results at UAW 653 PPO Facility: <strong>4.91/5.0 overall rating</strong>, 82% motivated to act "Right Away," 100% reported attitude change, +4.1 point CFPB Financial Well-Being improvement. Full results below.</p>
          </div>

          {/* CERTIFICATION PIPELINE */}
          <div className="section-label">Certification Program — LQFM/LQFA <span className="line"></span></div>

          <div className="card">
            <h3>Training Veterans and Others to Become Fee-Based Financial Wellness Educators</h3>
            <p>The 24-month LQFM / LQFA program trains individuals — with a focus on veterans — to deliver Cygnet's workshops as certified, fee-based financial consultants.</p>
            <p><strong>$23,000 tuition</strong> · 24 months · Leads to CRC® designation eligibility</p>
            <p>CRC® requirements: comprehensive exam, minimum 2 years professional experience (bachelor's) or 5 years (high school diploma), Code of Ethics adherence, 15 hours continuing education annually.</p>
          </div>

          {/* CRC ACCREDITATION */}
          <div className="accred">
            <h3>CRC® — Certified Retirement Counselor®</h3>
            <p>Issued by the <strong>International Foundation for Retirement Education (InFRE)</strong>, a 501(c)(3) nonprofit. Academic partner: <strong>Texas Tech University</strong> Center for Financial Responsibility.</p>
            <p><strong>NCCA-accredited through 7/31/2029</strong> — one of only six NCCA-accredited financial certifications in the United States (alongside CFP®, AFC, CVA, MAFF, and CSA).</p>
            <p>Used by <strong>60+ public sector retirement systems</strong> nationally, including Federal Retirement Thrift Investment Board, Ohio STRS, South Dakota Retirement System, and dozens of state, county, and local entities.</p>
            <p>Endorsed by <strong>NAGDCA</strong> and the <strong>National Pension Education Association (NPEA)</strong>.</p>
          </div>

          {/* INSTITUTIONAL PARTNERSHIP */}
          <div className="section-label">Institutional Partnership <span className="line"></span></div>

          <div className="card">
            <h3>Rochester Christian University (2023)</h3>
            <p>Cygnet and RCU in Rochester Hills, Michigan formalized a partnership to broaden financial literacy delivery across Oakland County and Southeast Michigan. Joint initiatives include:</p>
            <p>• Employer-sponsored 401(k) workshops (in-person and online via Canvas LMS)<br />
            • Workforce development program to train fee-based Certified Retirement Counselors®<br />
            • Financial Wellness Center at the university<br />
            • Outreach program for Fiduciary Finance Clubs in Michigan high schools</p>
          </div>

          {/* DELIVERY MODELS */}
          <div className="section-label">Delivery Models <span className="line"></span></div>

          <div className="card">
            <p><strong>Employer-sponsored workplace seminars</strong> — Delivered at UAW locations and employer facilities. Structured as standalone employee benefit or 401(k) plan education requirement.</p>
            <p><strong>Online asynchronous</strong> — Via Rochester Christian University's Canvas LMS with voice-over lectures, quizzes, and weekly assignments. Instructor support from certified CRC® professionals.</p>
            <p><strong>Financial wellness kiosks</strong> — On-site access points at employer and community locations.</p>
            <p><strong>Community programs</strong> — Library-based, LMI community delivery aligned with FDIC MoneySmart materials and CRA bank partnership requirements.</p>
          </div>

          {/* THREE AUDIENCES */}
          <div className="section-label">Three Audiences, One Mission <span className="line"></span></div>

          <div className="pillars">
            <div className="pillar">
              <h4>Working Families</h4>
              <p>401(k) workshops, retirement readiness, budgeting, and debt management.</p>
            </div>
            <div className="pillar">
              <h4>Veterans</h4>
              <p>Recruitment pipeline for the LQFM/LQFA certification. A meaningful second career as a fee-based financial educator.</p>
            </div>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <h3>LMI Communities</h3>
            <p>Low-to-moderate income populations — unlocking CRA bank partnerships, FDIC MoneySmart alignment, and government grant opportunities.</p>
          </div>

          {/* ================================================================ */}
          {/* PART 2: WORKSHOP RESULTS */}
          {/* ================================================================ */}

          <div className="part-divider">
            <h2>SEM 103 Workshop Results</h2>
            <p>Retirement Cash Flow Planning · UAW 653 PPO Facility · Pontiac, MI · January 2026 · 11 Participants</p>
          </div>

          {/* SECTION 1: WORKSHOP EVALUATION */}
          <div className="section-label">Participant Satisfaction <span className="line"></span></div>

          <div className="card">
            <p>All 11 participants completed post-workshop evaluations, rating their experience on a 1–5 scale across six categories. They also rated their motivation to take action on their finances.</p>
          </div>

          <div className="stats">
            <div className="stat teal"><div className="num num-teal">4.91</div><div className="label">Overall Rating<br />(out of 5.0)</div></div>
            <div className="stat navy"><div className="num num-navy">91%</div><div className="label">Gave a perfect<br />5 out of 5</div></div>
            <div className="stat gold"><div className="num num-gold">82%</div><div className="label">Motivated to act<br />"Right Away"</div></div>
            <div className="stat teal"><div className="num num-teal">100%</div><div className="label">Changed their<br />attitude about money</div></div>
          </div>

          <div className="card">
            <h3>Key Metrics</h3>
            <p><strong>4.91 out of 5.0 overall rating</strong> — Near-perfect average across all 11 participants. 10 of 11 gave the highest possible score.</p>
            <p><strong>91% perfect scores</strong> — Only one participant rated the workshop below a 5.</p>
            <p><strong>82% motivated to act "Right Away"</strong> — 9 of 11 participants selected the highest urgency level for taking financial action.</p>
            <p><strong>100% reported attitude and confidence change</strong> — Every participant indicated the workshop changed how they think about their finances.</p>
          </div>

          <div className="card">
            <h3>Category Scores</h3>
            <p>Participants rated six aspects of the workshop experience:</p>
          </div>

          <div className="bar-section">
            <div className="bar-row"><span className="bar-label">Room / Facility</span><div className="bar-track"><div className="bar-fill" style={{ width: "100%" }}></div></div><span className="bar-val">5.00</span></div>
            <div className="bar-row"><span className="bar-label">Overall Rating</span><div className="bar-track"><div className="bar-fill" style={{ width: "98.2%" }}></div></div><span className="bar-val">4.91</span></div>
            <div className="bar-row"><span className="bar-label">Communication</span><div className="bar-track"><div className="bar-fill" style={{ width: "98.2%" }}></div></div><span className="bar-val">4.91</span></div>
            <div className="bar-row"><span className="bar-label">Convenience</span><div className="bar-track"><div className="bar-fill" style={{ width: "96.4%" }}></div></div><span className="bar-val">4.82</span></div>
            <div className="bar-row"><span className="bar-label">Expectations Met</span><div className="bar-track"><div className="bar-fill" style={{ width: "94.6%" }}></div></div><span className="bar-val">4.73</span></div>
            <div className="bar-row"><span className="bar-label">Handouts</span><div className="bar-track"><div className="bar-fill" style={{ width: "94.6%" }}></div></div><span className="bar-val">4.73</span></div>
          </div>

          <div className="card">
            <p>All six categories scored above 4.7 out of 5.0. The facility received a perfect 5.0. The lowest individual category (4.73) still reflects strong approval.</p>
          </div>

          <div className="card">
            <h3>Content &amp; Presentation Fit</h3>
            <p><strong>Material Coverage: 3.55 out of 4.0</strong> — On this scale, 4.0 represents "exactly the right amount." A 3.55 indicates content volume was well-calibrated, leaning slightly toward comprehensive.</p>
            <p><strong>Presentation Length: 3.09 out of 3.0</strong> — A 3.0 represents "just right." The near-perfect score indicates session length was appropriate for the material covered.</p>
          </div>

          <div className="card">
            <h3>Referral Sources</h3>
            <p>2 participants found the workshop through a flyer, 2 through word-of-mouth, 1 via email, and 1 through other means. Word-of-mouth and print are performing; email outreach represents an opportunity for growth.</p>
          </div>

          <div className="card">
            <h3>Participant Feedback</h3>
            <p>Selected verbatim responses from post-workshop evaluations:</p>
          </div>

          <div className="quotes">
            <div className="quote-card"><p>"I know I can retire comfortably now"</p><div className="attr">— on confidence after the workshop</div></div>
            <div className="quote-card"><p>"Motivates me to save more"</p><div className="attr">— on motivation to change</div></div>
            <div className="quote-card"><p>"Realized I'm better off than initially planned"</p><div className="attr">— on understanding their own finances</div></div>
            <div className="quote-card"><p>"Plan to set up a living trust right away"</p><div className="attr">— on taking action</div></div>
            <div className="quote-card"><p>"Intend to cut spending and find additional income"</p><div className="attr">— on changing money habits</div></div>
            <div className="quote-card"><p>"Increasing 401k to retire better"</p><div className="attr">— on retirement planning</div></div>
          </div>

          {/* SECTION 2: CFPB SCORES */}
          <div className="section-label">CFPB Financial Well-Being Scores <span className="line"></span></div>

          <div className="card">
            <h3>About the CFPB Scale</h3>
            <p>The Consumer Financial Protection Bureau (CFPB) Financial Well-Being Scale is a validated federal instrument that measures an individual's sense of financial security. It consists of 10 questions and produces a score from 0 to 100 — higher is better, with 50 as the national average.</p>
            <p>The scale was developed across 14,000+ respondents and is recognized by FINRA, NEFE, United Way, and federal grant agencies as a credible measure of program effectiveness.</p>
          </div>

          <div className="card">
            <h3>Pre/Post Results</h3>
            <p>10 participants completed the CFPB scale before the first session and again after the final session:</p>
          </div>

          <div className="stats">
            <div className="stat gold"><div className="num num-gold">+4.1</div><div className="label">Average point<br />increase</div></div>
            <div className="stat teal"><div className="num num-teal">6 of 10</div><div className="label">Participants<br />improved</div></div>
            <div className="stat navy"><div className="num num-navy">+18</div><div className="label">Biggest individual<br />gain</div></div>
          </div>

          <div className="card">
            <h3>Key Findings</h3>
            <p><strong>+4.1 average point increase</strong> — Group average moved from 65.3 to 69.4 on the 0–100 scale. From a single 3-session program, this represents measurable, validated improvement.</p>
            <p><strong>6 of 10 participants improved</strong> — 60% of the group showed gains. Three participants declined slightly, and one held steady. Individual variation is expected — external financial stressors can affect scores independent of the program.</p>
            <p><strong>+18 largest individual gain</strong> — Participant #5 moved from 77 to 95, a substantial shift from moderate to high financial well-being.</p>
          </div>

          <div className="card">
            <h3>Individual Participant Scores</h3>
            <p>Pre and post scores for each participant, with net change:</p>
          </div>

          <div className="participants">
            <div className="p-card"><div className="p-id">#1</div><div className="p-scores">50 → 55</div><div className="p-change change-up">+5</div></div>
            <div className="p-card"><div className="p-id">#2</div><div className="p-scores">62 → 59</div><div className="p-change change-down">−3</div></div>
            <div className="p-card"><div className="p-id">#3</div><div className="p-scores">60 → 68</div><div className="p-change change-up">+8</div></div>
            <div className="p-card"><div className="p-id">#4</div><div className="p-scores">63 → 68</div><div className="p-change change-up">+5</div></div>
            <div className="p-card"><div className="p-id">#5</div><div className="p-scores">77 → 95</div><div className="p-change change-up">+18</div></div>
            <div className="p-card"><div className="p-id">#6</div><div className="p-scores">73 → 68</div><div className="p-change change-down">−5</div></div>
            <div className="p-card"><div className="p-id">#7</div><div className="p-scores">58 → 54</div><div className="p-change change-down">−4</div></div>
            <div className="p-card"><div className="p-id">#8</div><div className="p-scores">66 → 81</div><div className="p-change change-up">+15</div></div>
            <div className="p-card"><div className="p-id">#9</div><div className="p-scores">86 → 86</div><div className="p-change change-flat">+0</div></div>
            <div className="p-card"><div className="p-id">#10</div><div className="p-scores">58 → 60</div><div className="p-change change-up">+2</div></div>
          </div>

          <div className="card">
            <p><strong style={{ color: "#2E8B8B" }}>Green</strong> = score improved. <strong style={{ color: "#c0392b" }}>Red</strong> = score declined. <strong style={{ color: "#999" }}>Gray</strong> = no change. Notable: the two largest gains (+18 and +15) came from participants who started in the mid-range, suggesting the program has the strongest impact on those with moderate baseline financial literacy.</p>
          </div>

          {/* STRATEGIC VALUE */}
          <div className="bottom-note">
            <h3>Strategic Value of This Data</h3>
            <p>These are <strong>validated, quantified outcomes</strong> from Cygnet's own programming — not projections or estimates.</p>
            <p>The workshop evaluation demonstrates <strong>exceptional participant satisfaction</strong> (4.91/5.0) and high motivation to act (82% "Right Away"). These metrics are ready-to-use assets for marketing copy, landing pages, and social content.</p>
            <p>The CFPB scores demonstrate <strong>measurable improvement in financial well-being</strong> using a federally validated instrument. This is the type of outcome data that strengthens grant applications (FINRA, NEFE, United Way), supports the VA SAA approval process, satisfies CRA documentation requirements for bank partnerships, and differentiates Cygnet from competitors who cannot show validated results.</p>
            <p><strong>Recommended next step:</strong> Integrate the CFPB 5-item scale into all future workshop evaluations to build a longitudinal dataset across cohorts, locations, and program types.</p>
          </div>

        </div>

        <div className="footer-bar">
          <p><strong>Cygnet Institute of Personal Financial Literacy</strong><br />
          6515 Highland Rd, Ste #240, Waterford, MI 48327 · (248) 800-2525 · <a href="https://cygnetinstitute.org">cygnetinstitute.org</a></p>
        </div>
      </div>
    </div>
  );
}
