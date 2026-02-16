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
        .cygnet-page .hero h1 { font-family: 'DM Serif Display', serif !important; font-size: 44px; color: white; margin-bottom: 10px; font-weight: 400; }
        .cygnet-page .hero p { font-size: 18px; color: #a3c0d6; max-width: 620px; margin: 0 auto; }
        .cygnet-page .hero .tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 20px; }
        .cygnet-page .hero .tag { display: inline-block; padding: 7px 18px; background: rgba(46,139,139,0.2); border: 1px solid rgba(46,139,139,0.35); border-radius: 20px; font-size: 15px; font-weight: 600; color: #7dd4d4; letter-spacing: 0.4px; text-transform: uppercase; }

        .cygnet-page .wrap { max-width: 860px; margin: 0 auto; padding: 40px 24px 72px; }

        .cygnet-page .section-label { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #2E8B8B; margin: 40px 0 14px; display: flex; align-items: center; gap: 10px; }
        .cygnet-page .section-label .line { flex: 1; height: 1px; background: #ddd; }

        .cygnet-page .card { background: white; border-radius: 12px; padding: 28px; margin-bottom: 16px; border: 1px solid #e8e4df; box-shadow: 0 1px 6px rgba(0,0,0,0.04); }
        .cygnet-page .card h3 { font-size: 22px; font-weight: 700; color: #1B3A5C; margin-bottom: 8px; }
        .cygnet-page .card p { font-size: 18px; color: #555; }
        .cygnet-page .card p + p { margin-top: 10px; }
        .cygnet-page .card .meta { font-size: 16px; color: #888; font-weight: 600; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }

        .cygnet-page .pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 18px 0 28px; }
        @media (max-width: 540px) { .cygnet-page .pillars { grid-template-columns: 1fr; } }
        .cygnet-page .pillar { background: white; border-radius: 10px; padding: 22px; border: 1px solid #e8e4df; text-align: center; }
        .cygnet-page .pillar .icon { font-size: 32px; margin-bottom: 8px; }
        .cygnet-page .pillar h4 { font-size: 20px; font-weight: 700; color: #1B3A5C; margin-bottom: 6px; }
        .cygnet-page .pillar p { font-size: 18px; color: #666; }

        .cygnet-page .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 18px 0 28px; }
        .cygnet-page .stat { background: white; border-radius: 10px; padding: 20px 14px; text-align: center; border: 1px solid #e8e4df; position: relative; overflow: hidden; }
        .cygnet-page .stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
        .cygnet-page .stat.teal::before { background: #2E8B8B; }
        .cygnet-page .stat.gold::before { background: #E8A838; }
        .cygnet-page .stat.navy::before { background: #1B3A5C; }
        .cygnet-page .stat .num { font-family: 'DM Serif Display', serif !important; font-size: 38px; line-height: 1.1; margin-bottom: 4px; }
        .cygnet-page .num-teal { color: #2E8B8B; } .cygnet-page .num-gold { color: #D4922A; } .cygnet-page .num-navy { color: #1B3A5C; }
        .cygnet-page .stat .label { font-size: 18px; color: #888; font-weight: 500; }

        .cygnet-page .process { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0 28px; }
        @media (max-width: 600px) { .cygnet-page .process { grid-template-columns: 1fr 1fr; } }
        .cygnet-page .step { background: #1B3A5C; border-radius: 10px; padding: 20px 14px; text-align: center; position: relative; }
        .cygnet-page .step .step-num { display: inline-block; width: 34px; height: 34px; border-radius: 50%; background: #2E8B8B; color: white; font-weight: 700; font-size: 17px; line-height: 34px; margin-bottom: 10px; }
        .cygnet-page .step h4 { font-size: 17px; font-weight: 700; color: #E8A838; margin-bottom: 6px; }
        .cygnet-page .step p { font-size: 18px; color: #b8cfe0; line-height: 1.5; }

        .cygnet-page .accred { background: linear-gradient(135deg, #1B3A5C, #244b6e); border-radius: 12px; padding: 28px; margin-top: 18px; position: relative; overflow: hidden; }
        .cygnet-page .accred::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #E8A838, #2E8B8B); }
        .cygnet-page .accred h3 { font-family: 'DM Serif Display', serif !important; font-size: 26px; color: #E8A838; margin-bottom: 12px; font-weight: 400; }
        .cygnet-page .accred p { font-size: 18px; color: #b8cfe0; }
        .cygnet-page .accred p + p { margin-top: 10px; }
        .cygnet-page .accred strong { color: #fff; }

        .cygnet-page .footer-bar { background: #1B3A5C; padding: 24px 28px; text-align: center; }
        .cygnet-page .footer-bar p { font-size: 18px; color: #7fa8c4; }
        .cygnet-page .footer-bar a { color: #3AAFAF; text-decoration: none; }
      `}</style>

      <div className="cygnet-page">
        <div className="hero">
          <h1>Cygnet Institute of Personal Financial Literacy</h1>
          <p>501(c)(3) nonprofit teaching adults real-world money skills since 1989</p>
          <div className="tags">
            <span className="tag">Fiduciary Standard</span>
            <span className="tag">NCCA-Accredited CRC&reg;</span>
            <span className="tag">No Hidden Agenda</span>
            <span className="tag">Since 1989</span>
          </div>
        </div>

        <div className="wrap">

          {/* CORE PILLARS */}
          <div className="section-label">What Makes Cygnet Different <span className="line"></span></div>

          <div className="pillars">
            <div className="pillar">
              <div className="icon">🛡️</div>
              <h4>No Hidden Agenda</h4>
              <p>Our charter bans soliciting participants as clients. We don't sell products — ever.</p>
            </div>
            <div className="pillar">
              <div className="icon">💰</div>
              <h4>Fee, Not Commission</h4>
              <p>Consultants are paid fees for advice — no product sales, no conflicts of interest.</p>
            </div>
            <div className="pillar">
              <div className="icon">⚖️</div>
              <h4>Fiduciary Standard</h4>
              <p>We are legally bound to act in your best interest. All information stays confidential.</p>
            </div>
            <div className="pillar">
              <div className="icon">🎓</div>
              <h4>Hands-On Learning</h4>
              <p>You build your own financial plan in class using our Financial Lifestyle Analysis℠ tool.</p>
            </div>
          </div>

          {/* LEADERSHIP */}
          <div className="card">
            <h3>Leadership</h3>
            <p><strong>Ted Lakkides, CFP®, CRC®</strong> — President and founder. Certified Financial Planner™ and Certified Retirement Counselor®. Created the Financial Lifestyle Analysis℠ process and built partnerships with UAW locals, Rochester Christian University, and financial institutions across Southeast Michigan.</p>
          </div>

          {/* THE FLA PROCESS */}
          <div className="section-label">The Financial Lifestyle Analysis℠ (FLA℠) <span className="line"></span></div>

          <div className="card">
            <p>The Financial Lifestyle Analysis℠ is a <strong>year-by-year projection tool</strong> that shows you the future impact of your money decisions today — like a fast-forward video of your financial life. It connects your wages, Social Security, pensions, 401(k), spending, and goals into one clear picture. It answers the big questions: Am I saving enough? When can I retire? Will my money last?</p>
            <p>The FLA℠ is the core of every Cygnet workshop. It is <strong>cash-flow-based, goal-focused, and transparent</strong> — not a tool for selling financial products.</p>
          </div>

          {/* 4-STEP PROCESS */}
          <div className="section-label">The Cygnet 4-Step Process <span className="line"></span></div>

          <div className="process">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Explain &amp; Collect</h4>
              <p>Gather your financial info and start a Spending Diary</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Review &amp; Project</h4>
              <p>Look at spending, future needs, and retirement income</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Refine &amp; Protect</h4>
              <p>Fine-tune cash flow, review insurance and estate plans</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h4>Finalize &amp; Invest</h4>
              <p>Complete your plan and make investment decisions</p>
            </div>
          </div>

          {/* WORKSHOP PROGRAMS */}
          <div className="section-label">Workshop Programs <span className="line"></span></div>

          <div className="card">
            <div className="meta">SEM 100 / SEM 101 — Financial Plan Checkup℠</div>
            <h3>4-Session Workshop</h3>
            <p>Covers budgeting, net worth, Social Security, pensions, retirement cash flow, and investing basics. You build your complete Financial Lifestyle Analysis℠ across all four sessions.</p>
            <p><strong>SEM 100</strong> — In-person at employer or union facilities.<br />
            <strong>SEM 101</strong> — Online through Rochester Christian University's Canvas LMS, with recorded lectures, quizzes, and assignments.</p>
            <p><strong>$532 per person</strong> · Max 15 per workshop · Led by a certified CRC® professional</p>
          </div>

          <div className="card">
            <div className="meta">SEM 103 — Retirement Cash Flow Planning</div>
            <h3>3-Session Workshop</h3>
            <p>Focused on retirement readiness. January 2026 results at UAW 653: <strong>4.91/5.0 rating</strong>, 82% motivated to act "Right Away," 100% changed their attitude about money, +4.1 point CFPB Well-Being score gain.</p>
          </div>

          {/* LATEST RESULTS */}
          <div className="section-label">January 2026 Workshop Results <span className="line"></span></div>

          <div className="stats">
            <div className="stat teal"><div className="num num-teal">4.91</div><div className="label">Overall Rating<br />(out of 5.0)</div></div>
            <div className="stat navy"><div className="num num-navy">91%</div><div className="label">Perfect 5/5<br />Score</div></div>
            <div className="stat gold"><div className="num num-gold">82%</div><div className="label">Motivated to<br />Act "Right Away"</div></div>
            <div className="stat teal"><div className="num num-teal">+4.1</div><div className="label">CFPB Score<br />Improvement</div></div>
          </div>

          {/* CERTIFICATION PIPELINE */}
          <div className="section-label">Certification Program — LQFM/LQFA <span className="line"></span></div>

          <div className="card">
            <h3>Training the Next Generation of Fee-Based Financial Educators</h3>
            <p>The 24-month LQFM/LQFA program trains people — especially veterans — to lead Cygnet workshops as certified, fee-based financial consultants.</p>
            <p><strong>$23,000 tuition</strong> · 24 months · Leads to CRC® designation eligibility</p>
            <p>CRC® requires: comprehensive exam, 2+ years experience (with bachelor's) or 5+ years (with diploma), Code of Ethics, and 15 hours of continuing education per year.</p>
          </div>

          {/* CRC ACCREDITATION */}
          <div className="accred">
            <h3>CRC® — Certified Retirement Counselor®</h3>
            <p>Issued by the <strong>International Foundation for Retirement Education (InFRE)</strong>, a 501(c)(3) nonprofit. Academic partner: <strong>Texas Tech University</strong>.</p>
            <p><strong>NCCA-accredited through 7/31/2029</strong> — one of only six NCCA-accredited financial certifications in the U.S. (alongside CFP®, AFC, CVA, MAFF, and CSA).</p>
            <p>Used by <strong>60+ public retirement systems</strong> nationwide, including CalPERS, the Federal Retirement Thrift Investment Board, Ohio STRS, and dozens more.</p>
            <p>Endorsed by <strong>NAGDCA</strong> (government retirement plan administrators) and <strong>NPEA</strong> (pension educators).</p>
          </div>

          {/* INSTITUTIONAL PARTNERSHIP */}
          <div className="section-label">Institutional Partnership <span className="line"></span></div>

          <div className="card">
            <h3>Rochester Christian University (2023)</h3>
            <p>Cygnet and RCU in Rochester Hills, MI partnered to expand financial education across Oakland County and Southeast Michigan:</p>
            <p>• 401(k) workshops — in-person and online via Canvas LMS<br />
            • Training program for fee-based Certified Retirement Counselors®<br />
            • Financial Wellness Center on campus<br />
            • Fiduciary Finance Clubs in Michigan high schools</p>
            <p><em>"By combining our financial wellness expertise with RCU's community roots, we aim to help people take control of their finances."</em> — Ted Lakkides, President</p>
          </div>

          {/* DELIVERY MODELS */}
          <div className="section-label">Delivery Models <span className="line"></span></div>

          <div className="card">
            <p><strong>Workplace seminars</strong> — At UAW locations and employer sites, as an employee benefit or 401(k) education requirement.</p>
            <p><strong>Online</strong> — Through RCU's Canvas LMS with recorded lectures, quizzes, and weekly assignments. CRC®-certified instructor support.</p>
            <p><strong>Wellness kiosks</strong> — On-site access points at workplaces and community locations.</p>
            <p><strong>Community programs</strong> — Libraries, senior centers, and LMI communities, aligned with FDIC MoneySmart and CRA bank partnership requirements.</p>
          </div>

          {/* THREE AUDIENCES */}
          <div className="section-label">Three Audiences, One Mission <span className="line"></span></div>

          <div className="pillars">
            <div className="pillar">
              <h4>Working Families</h4>
              <p>401(k) workshops, retirement planning, budgeting, and debt management for employees and employers alike.</p>
            </div>
            <div className="pillar">
              <h4>Veterans</h4>
              <p>A path to a second career as a certified financial educator through the LQFM/LQFA program.</p>
            </div>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <h3>LMI Communities</h3>
            <p>Financial education for lower-income communities — supported by CRA bank partnerships, FDIC MoneySmart materials, and government grants.</p>
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
