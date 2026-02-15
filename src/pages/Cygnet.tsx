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
      <div className="max-w-[1200px] mx-auto">
        <div>
          {/* Cygnet Institute - SEM 103 Workshop Results */}
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

            .cygnet-page, .cygnet-page * { font-family: 'Montserrat', sans-serif !important; }
            .cygnet-page { background: #faf9f7; color: #2a2a2a; line-height: 1.7; -webkit-font-smoothing: antialiased; }

            .cygnet-page .hero { background: #1B3A5C; padding: 64px 24px 56px; text-align: center; position: relative; overflow: hidden; }
            .cygnet-page .hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #2E8B8B, #3AAFAF, #E8A838); }
            .cygnet-page .hero h1 { font-family: 'Montserrat', sans-serif; font-size: 52px; color: white; margin-bottom: 14px; font-weight: 400; }
            .cygnet-page .hero p { font-size: 24px; color: #a3c0d6; max-width: 620px; margin: 0 auto; }
            .cygnet-page .hero .tag { display: inline-block; margin-top: 20px; padding: 10px 22px; background: rgba(46,139,139,0.25); border: 1px solid rgba(46,139,139,0.4); border-radius: 20px; font-size: 21px; font-weight: 600; color: #7dd4d4; letter-spacing: 0.5px; text-transform: uppercase; }

            .cygnet-page .wrap { margin: 0 auto; padding: 48px 44px 80px; }

            .cygnet-page .context { background: white; border-radius: 14px; padding: 20px; margin-bottom: 44px; border: 1px solid #e8e4df; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
            .cygnet-page .context h2 { font-family: 'Montserrat', sans-serif; font-size: 34px; color: #1B3A5C; margin-bottom: 14px; font-weight: 400; }
            .cygnet-page .context p { font-size: 21px; color: #555; }
            .cygnet-page .context p + p { margin-top: 12px; }

            .cygnet-page .section-div { display: flex; align-items: center; gap: 14px; margin: 52px 0 24px; }
            .cygnet-page .section-div .badge { flex-shrink: 0; padding: 7px 18px; border-radius: 6px; font-size: 21px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: white; }
            .cygnet-page .badge-teal { background: #2E8B8B; }
            .cygnet-page .badge-navy { background: #1B3A5C; }
            .cygnet-page .section-div .line { flex: 1; height: 1px; background: #ddd; }
            .cygnet-page .section-div h2 { font-family: 'Montserrat', sans-serif; font-size: 36px; color: #1B3A5C; font-weight: 400; }

            .cygnet-page .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; margin: 24px 0 32px; }
            .cygnet-page .stat-card { background: white; border-radius: 12px; padding: 24px 18px; text-align: center; border: 1px solid #e8e4df; box-shadow: 0 1px 6px rgba(0,0,0,0.04); position: relative; overflow: hidden; }
            .cygnet-page .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; }
            .cygnet-page .stat-card.teal::before { background: #2E8B8B; }
            .cygnet-page .stat-card.gold::before { background: #E8A838; }
            .cygnet-page .stat-card.navy::before { background: #1B3A5C; }
            .cygnet-page .stat-card .num { font-family: 'Montserrat', sans-serif; font-size: 50px; line-height: 1.1; margin-bottom: 8px; font-weight: 700; }
            .cygnet-page .num-teal { color: #2E8B8B; }
            .cygnet-page .num-gold { color: #D4922A; }
            .cygnet-page .num-navy { color: #1B3A5C; }
            .cygnet-page .stat-card .label { font-size: 21px; color: #777; font-weight: 500; }

            .cygnet-page .explain { background: white; border-radius: 12px; padding: 28px; margin-bottom: 18px; border: 1px solid #e8e4df; box-shadow: 0 1px 6px rgba(0,0,0,0.04); }
            .cygnet-page .explain h3 { font-size: 24px; font-weight: 700; color: #1B3A5C; margin-bottom: 10px; }
            .cygnet-page .explain p { font-size: 21px; color: #555; }
            .cygnet-page .explain p + p { margin-top: 10px; }

            .cygnet-page .quotes { display: grid; grid-template-columns: 1fr; gap: 12px; margin: 24px 0 32px; }
            .cygnet-page .quote-card { background: #1B3A5C; border-radius: 10px; padding: 20px 24px; position: relative; }
            .cygnet-page .quote-card p { font-size: 21px; color: #e8f0f6; font-style: italic; line-height: 1.6; }
            .cygnet-page .quote-card .attr { font-size: 21px; color: #a8cce0; font-style: normal; margin-top: 6px; font-weight: 600; }

            .cygnet-page .bar-section { margin: 24px 0 32px; }
            .cygnet-page .bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
            .cygnet-page .bar-label { width: 190px; font-size: 21px; color: #666; text-align: right; flex-shrink: 0; }
            .cygnet-page .bar-track { flex: 1; height: 28px; background: #eee; border-radius: 4px; position: relative; }
            .cygnet-page .bar-fill { height: 100%; border-radius: 4px; background: #2E8B8B; }
            .cygnet-page .bar-val { width: 55px; font-size: 21px; font-weight: 700; color: #1B3A5C; }

            .cygnet-page .participants { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin: 24px 0 32px; }
            @media (max-width: 560px) { .cygnet-page .participants { grid-template-columns: repeat(2, 1fr); } }
            .cygnet-page .p-card { background: white; border-radius: 10px; padding: 16px 12px; text-align: center; border: 1px solid #e8e4df; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
            .cygnet-page .p-card .p-id { font-size: 21px; font-weight: 700; color: #999; margin-bottom: 6px; text-transform: uppercase; }
            .cygnet-page .p-card .p-scores { font-size: 21px; color: #555; margin-bottom: 4px; }
            .cygnet-page .p-card .p-change { font-family: 'Montserrat', sans-serif; font-size: 34px; line-height: 1; }
            .cygnet-page .change-up { color: #2E8B8B; font-weight: 700; }
            .cygnet-page .change-down { color: #c0392b; }
            .cygnet-page .change-flat { color: #999; }

            .cygnet-page .bottom-note { background: linear-gradient(135deg, #1B3A5C, #244b6e); border-radius: 14px; padding: 32px; margin-top: 40px; position: relative; overflow: hidden; }
            .cygnet-page .bottom-note::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #E8A838, #2E8B8B); }
            .cygnet-page .bottom-note h3 { font-family: 'Montserrat', sans-serif; font-size: 30px; color: #E8A838; margin-bottom: 14px; font-weight: 400; }
            .cygnet-page .bottom-note p { font-size: 21px; color: #e0ecf4; }
            .cygnet-page .bottom-note p + p { margin-top: 12px; }
            .cygnet-page .bottom-note .font-bold { color: #fff; }
            .cygnet-page span { font-size: inherit; }
            .cygnet-page ul { list-style: disc; padding-left: 24px; margin: 10px 0; }
            .cygnet-page li { font-size: 21px; margin-bottom: 8px; }
            .cygnet-page .explain li { color: #555; }
            .cygnet-page .bottom-note li { color: #e0ecf4; }
            .cygnet-page .context li { color: #555; }
          `}</style>

          <div className="cygnet-page">
            <div className="hero">
              <h1>SEM 103 Workshop Results</h1>
              <p>Retirement Cash Flow Planning &middot; UAW 653 PPO Facility &middot; Pontiac, MI</p>
              <div className="tag">January 2026 &middot; 11 Participants</div>
            </div>

            <div className="wrap">
              <div className="context">
                <h2>Summary</h2>
                <p>In January 2026, Cygnet Institute delivered a 3-session workshop — <span className="font-bold">"Retirement Cash Flow Planning"</span> (SEM 103) — at the UAW 653 PPO Facility in Pontiac, Michigan. 11 people attended across three sessions on January 16, 22, and 27.</p>
                <p>Participants completed post-workshop evaluations and also took the CFPB Financial Well-Being Scale — a validated federal instrument — before and after the program. This report presents both sets of results.</p>
              </div>

              {/* Section 1: Workshop Evaluation */}
              <div className="section-div">
                <span className="badge badge-teal">Section 1</span>
                <h2>Workshop Evaluation</h2>
                <span className="line"></span>
              </div>

              <div className="explain">
                <h3>Participant Satisfaction</h3>
                <p>All 11 participants completed post-workshop evaluations, rating their experience on a 1–5 scale across six categories. They also rated their motivation to take action on their finances.</p>
              </div>

              <div className="stats">
                <div className="stat-card teal">
                  <div className="num num-teal">4.91</div>
                  <div className="label">Overall Rating<br />(out of 5.0)</div>
                </div>
                <div className="stat-card navy">
                  <div className="num num-navy">91%</div>
                  <div className="label">Gave a perfect<br />5 out of 5</div>
                </div>
                <div className="stat-card gold">
                  <div className="num num-gold">82%</div>
                  <div className="label">Motivated to act<br />"Right Away"</div>
                </div>
                <div className="stat-card teal">
                  <div className="num num-teal">100%</div>
                  <div className="label">Changed their<br />attitude about money</div>
                </div>
              </div>

              <div className="explain">
                <h3>Key Metrics</h3>
                <ul>
                  <li><span className="font-bold">4.91 out of 5.0 overall rating</span> — Near-perfect average across all 11 participants. 10 of 11 gave the highest possible score.</li>
                  <li><span className="font-bold">91% perfect scores</span> — Only one participant rated the workshop below a 5.</li>
                  <li><span className="font-bold">82% motivated to act "Right Away"</span> — 9 of 11 participants selected the highest urgency level for taking financial action after the workshop.</li>
                  <li><span className="font-bold">100% reported attitude and confidence change</span> — Every participant indicated the workshop changed how they think about their finances and increased their confidence.</li>
                </ul>
              </div>

              <div className="explain">
                <h3>Category Scores</h3>
                <p>Participants rated six aspects of the workshop experience:</p>
              </div>

              <div className="bar-section">
                <div className="bar-row">
                  <span className="bar-label">Room / Facility</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: "100%" }}></div></div>
                  <span className="bar-val">5.00</span>
                </div>
                <div className="bar-row">
                  <span className="bar-label">Overall Rating</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: "98.2%" }}></div></div>
                  <span className="bar-val">4.91</span>
                </div>
                <div className="bar-row">
                  <span className="bar-label">Communication</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: "98.2%" }}></div></div>
                  <span className="bar-val">4.91</span>
                </div>
                <div className="bar-row">
                  <span className="bar-label">Convenience</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: "96.4%" }}></div></div>
                  <span className="bar-val">4.82</span>
                </div>
                <div className="bar-row">
                  <span className="bar-label">Expectations Met</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: "94.6%" }}></div></div>
                  <span className="bar-val">4.73</span>
                </div>
                <div className="bar-row">
                  <span className="bar-label">Handouts</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: "94.6%" }}></div></div>
                  <span className="bar-val">4.73</span>
                </div>
              </div>

              <div className="explain">
                <p>All six categories scored above 4.7 out of 5.0. The facility received a perfect 5.0. The lowest individual category (4.73) still reflects strong approval.</p>
              </div>

              <div className="explain">
                <h3>Content &amp; Presentation Fit</h3>
                <ul>
                  <li><span className="font-bold">Material Coverage: 3.55 out of 4.0</span> — On this scale, 4.0 represents "exactly the right amount." A 3.55 indicates content volume was well-calibrated, leaning slightly toward comprehensive.</li>
                  <li><span className="font-bold">Presentation Length: 3.09 out of 3.0</span> — A 3.0 represents "just right." The near-perfect score indicates session length was appropriate for the material covered.</li>
                </ul>
              </div>

              <div className="explain">
                <h3>Referral Sources</h3>
                <ul>
                  <li>2 participants found the workshop through a flyer</li>
                  <li>2 through word-of-mouth</li>
                  <li>1 via email</li>
                  <li>1 through other means</li>
                </ul>
                <p>Word-of-mouth and print are performing; email outreach represents an opportunity for growth.</p>
              </div>

              <div className="explain">
                <h3>Participant Feedback</h3>
                <p>Selected verbatim responses from post-workshop evaluations:</p>
              </div>

              <div className="quotes">
                <div className="quote-card">
                  <p>"I know I can retire comfortably now"</p>
                  <div className="attr">— on confidence after the workshop</div>
                </div>
                <div className="quote-card">
                  <p>"Motivates me to save more"</p>
                  <div className="attr">— on motivation to change</div>
                </div>
                <div className="quote-card">
                  <p>"Realized I'm better off than initially planned"</p>
                  <div className="attr">— on understanding their own finances</div>
                </div>
                <div className="quote-card">
                  <p>"Plan to set up a living trust right away"</p>
                  <div className="attr">— on taking action</div>
                </div>
                <div className="quote-card">
                  <p>"Intend to cut spending and find additional income"</p>
                  <div className="attr">— on changing money habits</div>
                </div>
                <div className="quote-card">
                  <p>"Increasing 401k to retire better"</p>
                  <div className="attr">— on retirement planning</div>
                </div>
              </div>

              {/* Section 2: CFPB Scores */}
              <div className="section-div">
                <span className="badge badge-navy">Section 2</span>
                <h2>CFPB Financial Well-Being Scores</h2>
                <span className="line"></span>
              </div>

              <div className="explain">
                <h3>About the CFPB Scale</h3>
                <p>The Consumer Financial Protection Bureau (CFPB) Financial Well-Being Scale is a validated federal instrument that measures an individual's sense of financial security. It consists of 10 questions and produces a score from 0 to 100 — higher is better, with 50 as the national average.</p>
                <p>The scale was developed across 14,000+ respondents and is recognized by FINRA, NEFE, United Way, and federal grant agencies as a credible measure of program effectiveness. It is free to use and requires no license.</p>
              </div>

              <div className="explain">
                <h3>Pre/Post Results</h3>
                <p>10 participants completed the CFPB scale before the first session and again after the final session. Results:</p>
              </div>

              <div className="stats">
                <div className="stat-card gold">
                  <div className="num num-gold">+4.1</div>
                  <div className="label">Average point<br />increase</div>
                </div>
                <div className="stat-card teal">
                  <div className="num num-teal">6 of 10</div>
                  <div className="label">Participants<br />improved</div>
                </div>
                <div className="stat-card navy">
                  <div className="num num-navy">+18</div>
                  <div className="label">Biggest individual<br />gain</div>
                </div>
              </div>

              <div className="explain">
                <h3>Key Findings</h3>
                <ul>
                  <li><span className="font-bold">+4.1 average point increase</span> — Group average moved from 65.3 to 69.4 on the 0–100 scale. From a single 3-session program, this represents measurable, validated improvement.</li>
                  <li><span className="font-bold">6 of 10 participants improved</span> — 60% of the group showed gains. Three participants declined slightly, and one held steady. Individual variation is expected — external financial stressors can affect scores independent of the program.</li>
                  <li><span className="font-bold">+18 largest individual gain</span> — Participant #5 moved from 77 to 95, a substantial shift from moderate to high financial well-being.</li>
                </ul>
              </div>

              <div className="explain">
                <h3>Individual Participant Scores</h3>
                <p>Pre and post scores for each participant, with net change:</p>
                <p style={{ marginTop: 14 }}><span style={{ fontWeight: 700, color: "#2E8B8B" }}>Green</span> = score improved &nbsp;&middot;&nbsp; <span style={{ fontWeight: 700, color: "#c0392b" }}>Red</span> = score declined &nbsp;&middot;&nbsp; <span style={{ fontWeight: 700, color: "#999" }}>Gray</span> = no change</p>
              </div>

              <div className="participants">
                <div className="p-card">
                  <div className="p-id">#1</div>
                  <div className="p-scores">50 → 55</div>
                  <div className="p-change change-up">+5</div>
                </div>
                <div className="p-card">
                  <div className="p-id">#2</div>
                  <div className="p-scores">62 → 59</div>
                  <div className="p-change change-down">−3</div>
                </div>
                <div className="p-card">
                  <div className="p-id">#3</div>
                  <div className="p-scores">60 → 68</div>
                  <div className="p-change change-up">+8</div>
                </div>
                <div className="p-card">
                  <div className="p-id">#4</div>
                  <div className="p-scores">63 → 68</div>
                  <div className="p-change change-up">+5</div>
                </div>
                <div className="p-card">
                  <div className="p-id">#5</div>
                  <div className="p-scores">77 → 95</div>
                  <div className="p-change change-up">+18</div>
                </div>
                <div className="p-card">
                  <div className="p-id">#6</div>
                  <div className="p-scores">73 → 68</div>
                  <div className="p-change change-down">−5</div>
                </div>
                <div className="p-card">
                  <div className="p-id">#7</div>
                  <div className="p-scores">58 → 54</div>
                  <div className="p-change change-down">−4</div>
                </div>
                <div className="p-card">
                  <div className="p-id">#8</div>
                  <div className="p-scores">66 → 81</div>
                  <div className="p-change change-up">+15</div>
                </div>
                <div className="p-card">
                  <div className="p-id">#9</div>
                  <div className="p-scores">86 → 86</div>
                  <div className="p-change change-flat">+0</div>
                </div>
                <div className="p-card">
                  <div className="p-id">#10</div>
                  <div className="p-scores">58 → 60</div>
                  <div className="p-change change-up">+2</div>
                </div>
              </div>

              <div className="explain">
                <p>Notable: the two largest gains (+18 and +15) came from participants who started in the mid-range, suggesting the program has the strongest impact on those with moderate baseline financial literacy.</p>
              </div>

              {/* Strategic Value */}
              <div className="bottom-note">
                <h3>Strategic Value of This Data</h3>
                <p>These are <span className="font-bold">validated, quantified outcomes</span> from Cygnet's own programming — not projections or estimates.</p>
                <ul>
                  <li>The workshop evaluation demonstrates <span className="font-bold">exceptional participant satisfaction</span> (4.91/5.0) and high motivation to act (82% "Right Away"). These metrics are ready-to-use assets for marketing copy, landing pages, and social content.</li>
                  <li>The CFPB scores demonstrate <span className="font-bold">measurable improvement in financial well-being</span> using a federally validated instrument. This is the type of outcome data that strengthens grant applications (FINRA, NEFE, United Way), supports the VA SAA approval process, satisfies CRA documentation requirements for bank partnerships, and differentiates Cygnet from competitors who cannot show validated results.</li>
                </ul>
                <p><span className="font-bold">Recommended next step:</span> Integrate the CFPB 5-item scale into all future workshop evaluations to build a longitudinal dataset across cohorts, locations, and program types.</p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
