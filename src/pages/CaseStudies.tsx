import { useState } from "react";
import PortfolioLayout from "../components/PortfolioLayout";

const caseStudies = [
  {
    id: "accessibility",
    label: "Accessibility",
    title: "Operationalizing Accessibility Across an Enterprise Healthcare Organization",
  },
  {
    id: "ai-interpretation",
    label: "AI Interpretation",
    title: "Designing AI Powered Interpretation for Real Time Enterprise Communication",
  },
  {
    id: "user-testing",
    label: "User Testing Platform",
    title: "Designing a Cross Product User Testing Platform with Unified Data and Theming Architecture",
  },
  {
    id: "inventory-crm",
    label: "Inventory & CRM",
    title: "AI-Augmented Inventory System & CRM Integration",
  },
  {
    id: "delivery-discipline",
    label: "Delivery Discipline",
    title: "Establishing Delivery Discipline Across Distributed, Regulated Environments",
  },
];

export default function CaseStudies() {
  const [activeStudy, setActiveStudy] = useState(caseStudies[0].id);

  return (
    <PortfolioLayout currentPage="case-studies">
      {/* Sub-menu */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 pt-2 pb-4 border-b border-gray-200 dark:border-gray-700">
          {caseStudies.map((study) => (
            <button
              key={study.id}
              onClick={() => {
                setActiveStudy(study.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeStudy === study.id
                  ? "bg-brand-dynamic text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {study.label}
            </button>
          ))}
        </div>
      </div>

      {/* Case Study 1: Accessibility */}
      {activeStudy === "accessibility" && (
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
            <h2 className="font-bold title-font leading-tight text-gray-900 dark:text-white mb-2">
              Operationalizing Accessibility Across an Enterprise Healthcare Organization
            </h2>
            <p className="text-muted-foreground mb-8">
              Senior UX Developer and Accessibility Strategist, Delta Dental of Michigan
            </p>

            <div className="space-y-8">

              {/* Executive Context */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Executive Context</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Delta Dental began encountering RFP and bid language requiring formal compliance with W3C standards, WCAG 2.1 AA, and Section 508 accessibility regulations.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">The organization did not have:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>A documented accessibility framework</li>
                  <li>WCAG-aligned design standards</li>
                  <li>Section 508 mapping documentation</li>
                  <li>Assistive technology testing practices</li>
                  <li>A formal response model for compliance questionnaires</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">The business problem was immediate and concrete.</p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium italic">
                    How do you confidently respond to enterprise bid requirements that mandate W3C and Section 508 compliance when you do not yet have a structured accessibility practice?
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    <strong className="text-gray-900 dark:text-white">I had the expertise to answer that question and build the infrastructure behind it.</strong>
                  </p>
                </div>
              </div>

              {/* The Problem */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">The Problem</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Bid language required demonstrable compliance with:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>W3C Web Content Accessibility Guidelines</li>
                  <li>WCAG 2.1 AA success criteria</li>
                  <li>Section 508 standards</li>
                  <li>ADA alignment</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">However:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Accessibility had not been operationalized</li>
                  <li>Development teams had not been trained on semantic implementation</li>
                  <li>QA did not test with assistive technologies</li>
                  <li>Design components were not documented with accessibility standards</li>
                  <li>No governance model existed</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This created both <strong className="text-gray-900 dark:text-white">revenue risk</strong> and <strong className="text-gray-900 dark:text-white">regulatory exposure</strong>. The organization needed more than a compliance statement. It needed a <strong className="text-gray-900 dark:text-white">defensible system</strong>.
                </p>
              </div>

              {/* My Objective */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">My Objective</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Design and implement an enterprise accessibility framework that would:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Support accurate RFP responses</li>
                  <li>Reduce legal and compliance risk</li>
                  <li>Standardize accessible design and development practices</li>
                  <li>Integrate accessibility into Agile delivery</li>
                  <li>Create sustainable governance</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This was not a remediation project. It was an <strong className="text-gray-900 dark:text-white">operational transformation</strong>.
                </p>
              </div>

              {/* Phase 1 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 1: Translating Bid Requirements into Technical Reality</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  The first step was interpreting regulatory language and translating it into system-level requirements.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">I broke down the bid language into actionable components:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>WCAG 2.1 AA success criteria</li>
                  <li>Section 508 mapping requirements</li>
                  <li>W3C semantic and structural standards</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">I created a traceability matrix mapping:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Regulatory requirement</li>
                  <li>Current implementation state</li>
                  <li>Risk level</li>
                  <li>Remediation priority</li>
                  <li>Implementation approach</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This allowed leadership to see the compliance gap clearly and quantitatively. <strong className="text-gray-900 dark:text-white">Instead of abstract risk, we now had a technical roadmap.</strong>
                </p>
              </div>

              {/* Phase 2 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 2: Enterprise Accessibility Audit</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  To establish a baseline, I conducted structured audits across internal and member-facing applications.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Audit Methodology</h4>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Manual WCAG 2.1 AA review</li>
                  <li>Semantic HTML inspection</li>
                  <li>ARIA role and attribute validation</li>
                  <li>Keyboard-only workflow testing</li>
                  <li>Screen reader testing with JAWS and NVDA</li>
                  <li>Form validation and error announcement analysis</li>
                  <li>Focus order and state validation</li>
                  <li>Color contrast measurement</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Automated scanners were used for surface detection, but all critical findings were validated manually.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Systemic Findings</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Recurring architectural issues included:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Non-semantic interactive components</li>
                  <li>Improper label associations</li>
                  <li>Missing programmatic error announcements</li>
                  <li>Modal dialogs without focus management</li>
                  <li>Inconsistent tab sequencing</li>
                  <li>Dynamic content not exposed to assistive technologies</li>
                  <li>Insufficient color contrast</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The issues were repeatable and pattern-based, which meant they could be addressed at the <strong className="text-gray-900 dark:text-white">component level</strong>.
                </p>
              </div>

              {/* Phase 3 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 3: Building the Accessibility Infrastructure</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Because the organization needed defensible compliance, I built reusable infrastructure rather than issuing isolated fixes.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  As a UX leader fluent in front-end architecture, I translated regulatory requirements directly into implementation patterns.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Accessible Component Patterns</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">I developed standardized code patterns including:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Accessible form field architecture with proper label associations</li>
                  <li>ARIA live region implementation for validation feedback</li>
                  <li>Focus management utilities for modal dialogs and route transitions</li>
                  <li>Keyboard interaction models for custom components</li>
                  <li>Accessible table markup patterns</li>
                  <li>Semantic button and link usage guidelines</li>
                  <li>Skip navigation structures</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Each pattern included:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>HTML structure</li>
                  <li>CSS guidance</li>
                  <li>JavaScript or TypeScript implementation notes</li>
                  <li>WCAG success criteria references</li>
                  <li>Section 508 mapping references</li>
                </ul>

                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    Developers were given working, compliant examples instead of abstract rules.
                  </p>
                </div>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Design System Integration</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Accessibility cannot live only in code. It must begin in design. I embedded accessibility standards directly into the design system:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Focus state design tokens</li>
                  <li>Contrast-compliant color palettes</li>
                  <li>Accessible error messaging patterns</li>
                  <li>Field grouping standards</li>
                  <li>Interaction documentation tied to semantic markup</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Figma components included:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Accessibility annotations</li>
                  <li>Behavioral intent</li>
                  <li>Implementation alignment notes</li>
                  <li>WCAG references</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This ensured that <strong className="text-gray-900 dark:text-white">design intent and code execution were synchronized</strong>.
                </p>
              </div>

              {/* Phase 4 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 4: Agile Process Integration</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  To operationalize accessibility, it needed to be embedded into delivery workflows. I worked with Product Owners, Scrum Masters, and QA leads to:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Add accessibility criteria to the Definition of Done</li>
                  <li>Incorporate accessibility acceptance criteria into user stories</li>
                  <li>Expand QA scripts to include keyboard and screen reader testing</li>
                  <li>Introduce accessibility checkpoints during refinement</li>
                  <li>Create shared accessibility documentation repositories</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">Accessibility moved from reactive defect handling to proactive quality control.</strong>
                </p>
              </div>

              {/* Phase 5 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 5: Governance and RFP Readiness</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Once patterns and workflows were established, I formalized governance documentation. Deliverables included:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>WCAG 2.1 AA alignment documentation</li>
                  <li>Section 508 mapping matrices</li>
                  <li>Accessibility implementation standards</li>
                  <li>Audit reporting templates</li>
                  <li>Compliance response language for bids</li>
                  <li>Internal accessibility playbooks</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    Delta Dental could now respond to RFPs with defensible, documented standards backed by implementation evidence. Accessibility shifted from uncertainty to institutional capability.
                  </p>
                </div>
              </div>

              {/* Technical Depth */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Technical Depth</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  This initiative required fluency across UX strategy and front-end engineering. Applied expertise included:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Semantic HTML architecture</li>
                  <li>ARIA role and property implementation</li>
                  <li>Accessible form validation patterns</li>
                  <li>Focus management in single-page applications</li>
                  <li>Assistive technology behavior testing</li>
                  <li>Component-driven development</li>
                  <li>Progressive enhancement</li>
                  <li>Design token governance</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Because I can speak directly in terms of DOM structure, event handling, and screen reader behavior, there was <strong className="text-gray-900 dark:text-white">no translation gap</strong> between design intent and engineering implementation. <strong className="text-gray-900 dark:text-white">That accelerated adoption.</strong>
                </p>
              </div>

              {/* Organizational Impact */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Organizational Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Before</h4>
                    <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                      <li>No formal accessibility framework</li>
                      <li>Limited understanding of WCAG and Section 508</li>
                      <li>Unclear RFP response capability</li>
                      <li>Reactive remediation</li>
                      <li>Elevated compliance risk</li>
                    </ul>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">After</h4>
                    <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                      <li>Enterprise accessibility framework</li>
                      <li>Reusable compliant component library</li>
                      <li>Accessibility embedded in Agile workflows</li>
                      <li>Clear compliance documentation for bids</li>
                      <li>Reduced rework and QA churn</li>
                      <li>Executive-level visibility into accessibility posture</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-900 dark:text-white font-semibold text-center">
                  Accessibility became operational.
                </p>
              </div>

              {/* Why This Work Matters */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Why This Work Matters</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  For enterprise healthcare organizations, accessibility is not optional. It directly impacts:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Member access</li>
                  <li>Regulatory exposure</li>
                  <li>Contract eligibility</li>
                  <li>Brand trust</li>
                  <li>Operational efficiency</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">This case study demonstrates my ability to:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Translate regulatory language into technical architecture</li>
                  <li>Build scalable implementation standards</li>
                  <li>Align design and engineering systems</li>
                  <li>Embed governance into enterprise workflows</li>
                  <li>Enable revenue opportunities through compliance readiness</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Delta Dental encountered compliance requirements.
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium mt-2">
                    I built the framework that allowed the organization to meet them with confidence.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      )}

      {/* Case Study 2: AI Interpretation */}
      {activeStudy === "ai-interpretation" && (
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
            <h2 className="font-bold title-font leading-tight text-gray-900 dark:text-white mb-2">
              Designing AI Powered Interpretation for Real Time Enterprise Communication
            </h2>
            <p className="text-muted-foreground mb-8">
              UX Lead and Front End Architect, Propio Language Services
            </p>

            <div className="space-y-8">

              {/* Executive Context */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Executive Context</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Propio Language Services provides interpretation and language solutions across healthcare, government, and enterprise sectors. As demand increased, clients began expecting more than basic live transcription. They wanted:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Real time multilingual translation</li>
                  <li>Higher accuracy in domain specific conversations</li>
                  <li>Industry tailored vocabulary</li>
                  <li>Seamless integration with existing communication platforms</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Leadership identified OpenAI as an opportunity to elevate the product into an intelligent interpretation platform that could differentiate us in a competitive market.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  The opportunity required more than adding AI to an existing interface. It required designing a real time AI interaction model that users could trust in high stakes environments such as healthcare and government interpretation.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    I led the UX and front end architecture from concept through production.
                  </p>
                </div>
              </div>

              {/* The Business Problem */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">The Business Problem</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Propio's existing live transcription tool delivered baseline value, but enterprise clients were increasingly asking:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Can this handle medical and legal terminology?</li>
                  <li>Can we customize vocabulary by client?</li>
                  <li>Can it translate in real time?</li>
                  <li>Can it integrate into our existing communication platforms?</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">The business objective was clear:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Improve interpretation quality</li>
                  <li>Increase enterprise adoption</li>
                  <li>Strengthen product differentiation</li>
                  <li>Drive long term competitive advantage</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  However, there was no defined UX model for how AI should behave inside a live interpretation workflow. The challenge was designing both the <strong className="text-gray-900 dark:text-white">user experience</strong> and the <strong className="text-gray-900 dark:text-white">technical integration</strong> simultaneously.
                </p>
              </div>

              {/* My Objective */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">My Objective</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Design and prototype an AI powered interpretation system that would:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Integrate OpenAI into live transcription workflows</li>
                  <li>Support real time multilingual translation</li>
                  <li>Enable customizable industry specific vocabulary</li>
                  <li>Maintain clarity and trust during active sessions</li>
                  <li>Scale technically for enterprise environments</li>
                  <li>Meet accessibility standards</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This required working across <strong className="text-gray-900 dark:text-white">product strategy, UX design, AI interaction modeling, and front end architecture</strong>.
                </p>
              </div>

              {/* Phase 1 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 1: Defining the AI Interaction Model</h3>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium italic">
                    AI features must be designed around human workflow, not technical capability.
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">I began by mapping:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Interpreter workflows</li>
                  <li>Client session flows</li>
                  <li>Real time latency constraints</li>
                  <li>Error tolerance thresholds</li>
                  <li>Translation confidence communication</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">I created:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Detailed user flows</li>
                  <li>State diagrams</li>
                  <li>Decision trees for AI intervention</li>
                  <li>Edge case handling scenarios</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Critical design questions included:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>When should AI suggestions surface?</li>
                  <li>How should translation uncertainty be communicated?</li>
                  <li>How do we prevent cognitive overload during live sessions?</li>
                  <li>How do we allow vocabulary overrides without disrupting flow?</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This systems level modeling ensured the AI <strong className="text-gray-900 dark:text-white">enhanced communication rather than interrupting it</strong>.
                </p>
              </div>

              {/* Phase 2 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 2: Visual Design and High Fidelity Comps</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  I created full interface comps and component designs in Figma.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">The design system included:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Transcript panel architecture</li>
                  <li>Clear differentiation between original and translated text</li>
                  <li>Confidence and status indicators</li>
                  <li>Vocabulary management UI</li>
                  <li>Session controls and integration points</li>
                  <li>Error and latency states</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Each component was documented with:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Behavioral intent</li>
                  <li>Accessibility annotations</li>
                  <li>State variations</li>
                  <li>Engineering alignment notes</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  The Figma files were structured to align with modular component development, making handoff efficient and reducing translation friction between design and engineering.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Interactive prototypes were used to gather feedback from:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Internal stakeholders</li>
                  <li>Product leadership</li>
                  <li>Pilot users</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This allowed us to refine layout density, real time update behavior, and AI feature discoverability before committing to engineering resources.
                </p>
              </div>

              {/* Phase 3 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 3: Front End Architecture and AI Integrated Prototype</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  To accelerate alignment and validate feasibility, I built a working prototype using:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>React</li>
                  <li>TypeScript</li>
                  <li>Component driven architecture</li>
                  <li>Streaming update simulation</li>
                  <li>API integration scaffolding</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  I used the Cursor editor as my primary IDE, leveraging its AI co-pilot capabilities to:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Rapidly scaffold components</li>
                  <li>Refactor state management</li>
                  <li>Optimize type definitions</li>
                  <li>Generate and refine API interaction logic</li>
                  <li>Validate accessibility patterns</li>
                  <li>Debug asynchronous streaming behavior</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    Cursor's AI co-pilot allowed me to iterate on architecture faster while maintaining strict control over implementation quality. It functioned as an augmentation tool rather than an automation crutch.
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">The prototype simulated:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Streaming transcription updates</li>
                  <li>OpenAI powered translation responses</li>
                  <li>Custom vocabulary injection</li>
                  <li>Latency handling</li>
                  <li>Error fallback states</li>
                  <li>Session export capabilities</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Because I delivered a functional front end prototype, engineering could evaluate <strong className="text-gray-900 dark:text-white">real integration complexity early</strong> rather than interpreting static design artifacts.
                </p>
              </div>

              {/* AI System Design Considerations */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">AI System Design Considerations</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Integrating OpenAI into a live communication environment required architectural discipline. Key considerations included:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Token management for long sessions</li>
                  <li>Streaming API handling</li>
                  <li>Latency minimization</li>
                  <li>Preventing hallucinated translations</li>
                  <li>Transparent error states</li>
                  <li>Logging and traceability for enterprise compliance</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">The UI was intentionally designed to:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Visually distinguish human transcript from AI translation</li>
                  <li>Surface confidence and processing indicators</li>
                  <li>Allow user controlled vocabulary overrides</li>
                  <li>Maintain clarity under rapid update conditions</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    Trust was treated as a design requirement, not a secondary feature.
                  </p>
                </div>
              </div>

              {/* Experimentation and Optimization */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Experimentation and Optimization</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">We used Optimizely to run structured A/B experiments on:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Layout variations</li>
                  <li>Transcript and translation positioning</li>
                  <li>Vocabulary control visibility</li>
                  <li>AI feature discoverability</li>
                  <li>Status indicator prominence</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">We gathered:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Task completion rates</li>
                  <li>Feature adoption metrics</li>
                  <li>Engagement duration</li>
                  <li>Qualitative usability feedback</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This allowed us to refine the experience based on <strong className="text-gray-900 dark:text-white">measurable behavior rather than intuition</strong>.
                </p>
              </div>

              {/* Accessibility in Dynamic AI Interfaces */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Accessibility in Dynamic AI Interfaces</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Real time AI interfaces can easily become inaccessible if updates overwhelm assistive technologies. I ensured:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Proper semantic structure</li>
                  <li>Keyboard navigability</li>
                  <li>Screen reader compatibility</li>
                  <li>Focus management discipline</li>
                  <li>Accessible color contrast</li>
                  <li>Controlled ARIA live region updates</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Streaming transcript updates were throttled and structured to avoid excessive screen reader interruption. <strong className="text-gray-900 dark:text-white">AI innovation did not compromise accessibility standards.</strong>
                </p>
              </div>

              {/* From Concept to Production */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">From Concept to Production</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">I contributed across the entire lifecycle:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>UX architecture</li>
                  <li>Figma design systems</li>
                  <li>Interactive prototypes</li>
                  <li>React and TypeScript implementation</li>
                  <li>AI API integration modeling</li>
                  <li>Accessibility validation</li>
                  <li>Experimentation design</li>
                  <li>Production alignment</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Documentation included:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Component specifications</li>
                  <li>API interaction diagrams</li>
                  <li>Prompt behavior guidelines</li>
                  <li>Vocabulary injection rules</li>
                  <li>Error handling logic</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The result was a <strong className="text-gray-900 dark:text-white">scalable AI powered interpretation feature</strong> that could integrate into enterprise communication platforms.
                </p>
              </div>

              {/* Impact */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Before</h4>
                    <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                      <li>Basic transcription capability</li>
                      <li>Limited differentiation</li>
                      <li>Rising client expectations</li>
                      <li>No AI powered enhancements</li>
                    </ul>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">After</h4>
                    <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                      <li>Real time AI powered translation</li>
                      <li>Customizable industry vocabulary</li>
                      <li>Improved transcript clarity</li>
                      <li>Enterprise ready architecture</li>
                      <li>Strengthened competitive positioning</li>
                      <li>Increased perceived product sophistication</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-900 dark:text-white font-semibold text-center">
                  The AI interpretation layer became a strategic differentiator.
                </p>
              </div>

              {/* Technical and Strategic Depth */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Technical and Strategic Depth</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">This project required expertise in:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>AI assisted language modeling</li>
                  <li>Real time UI architecture</li>
                  <li>Streaming API integration</li>
                  <li>React and TypeScript systems</li>
                  <li>AI assisted development workflows</li>
                  <li>Accessibility in dynamic interfaces</li>
                  <li>Experimentation frameworks</li>
                  <li>Enterprise scalability planning</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">I operated at the intersection of <strong className="text-gray-900 dark:text-white">UX strategy, AI interaction design, front end engineering, and product differentiation</strong>.</p>
              </div>

              {/* Why This Work Matters */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Why This Work Matters</h3>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium italic">
                    AI integration without thoughtful UX creates complexity and distrust.
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">This initiative demonstrates my ability to:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Translate AI capabilities into human centered systems</li>
                  <li>Prototype technically credible AI products</li>
                  <li>Use modern AI assisted development tools responsibly</li>
                  <li>Align design, engineering, and business strategy</li>
                  <li>Deliver production ready AI experiences in regulated industries</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    The result was not simply AI integration.
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium mt-2">
                    It was a scalable, accessible, and enterprise ready intelligent interpretation system.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      )}

      {/* Case Study 3: User Testing Platform */}
      {activeStudy === "user-testing" && (
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
            <h2 className="font-bold title-font leading-tight text-gray-900 dark:text-white mb-2">
              Designing a Cross Product User Testing Platform with Unified Data and Theming Architecture
            </h2>
            <p className="text-muted-foreground mb-8">
              UX Architect and Software Engineer, Melkonian Industries
            </p>

            <div className="space-y-8">

              {/* Executive Context */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Executive Context</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Across multiple software products, I encountered a recurring operational problem.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Each product required structured user testing. However:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Testing frameworks were inconsistent</li>
                  <li>Reporting formats varied by product</li>
                  <li>Layout patterns changed between tools</li>
                  <li>Themes and branding created fragmentation</li>
                  <li>Data structures were not normalized</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Teams were solving the same user testing problem repeatedly, but with slightly different implementations.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    The inefficiency was not in research itself. It was in the lack of a shared testing architecture.
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  I designed and built a platform that unified testing inputs, normalized reporting outputs, and allowed fluid theme transitions without disrupting structure or layout predictability.
                </p>
              </div>

              {/* The Core Problem */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">The Core Problem</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Multiple software products required:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Structured user testing flows</li>
                  <li>Survey input collection</li>
                  <li>Usability scoring</li>
                  <li>Qualitative feedback capture</li>
                  <li>Standardized reporting</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">However, each product team:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Designed its own layout patterns</li>
                  <li>Structured data differently</li>
                  <li>Generated inconsistent reports</li>
                  <li>Rebuilt the same UX infrastructure</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">This created:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Redundant engineering effort</li>
                  <li>Inconsistent analytics</li>
                  <li>Fragmented reporting formats</li>
                  <li>Increased cognitive load for stakeholders</li>
                  <li>Difficult cross product comparisons</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The real opportunity was to <strong className="text-gray-900 dark:text-white">separate theme from structure</strong> and <strong className="text-gray-900 dark:text-white">standardize the data model</strong> across contexts.
                </p>
              </div>

              {/* My Objective */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">My Objective</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Design and build a reusable user testing platform that would:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Normalize key data points across products</li>
                  <li>Maintain fluid and predictable layouts</li>
                  <li>Allow clean theme switching without structural disruption</li>
                  <li>Generate standardized cross product reports</li>
                  <li>Scale across use cases</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The goal was not just visual consistency. It was <strong className="text-gray-900 dark:text-white">structural consistency</strong>.
                </p>
              </div>

              {/* Phase 1 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 1: Data Model Normalization</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Before designing UI, I defined the data layer. I mapped:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Common testing objectives</li>
                  <li>Shared usability metrics</li>
                  <li>Scoring systems</li>
                  <li>Open text qualitative feedback</li>
                  <li>Task completion tracking</li>
                  <li>Severity tagging</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">From this analysis, I created a normalized data schema that abstracted:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Test metadata</li>
                  <li>Participant input</li>
                  <li>Quantitative scoring</li>
                  <li>Qualitative commentary</li>
                  <li>Aggregated reporting outputs</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  This ensured that regardless of product theme or purpose, the underlying data model remained consistent.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    The UI adapts. The data structure remains stable.
                  </p>
                </div>
              </div>

              {/* Phase 2 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 2: Layout Architecture and Predictability</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  User testing tools must feel stable and predictable. I designed a layout system with:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Fixed structural regions</li>
                  <li>Predictable navigation patterns</li>
                  <li>Modular component slots</li>
                  <li>Consistent spacing logic</li>
                  <li>Responsive behavior across viewports</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">The architecture emphasized:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Clear hierarchy</li>
                  <li>Minimal cognitive overhead</li>
                  <li>Logical task progression</li>
                  <li>Structured input zones</li>
                  <li>Consistent reporting layout</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    Predictability was treated as a design principle. Users should not relearn layout behavior when themes change.
                  </p>
                </div>
              </div>

              {/* Phase 3 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 3: Theming Without Structural Drift</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  One of the key differentiators of this platform is the ability to perform clean theme transitions. Instead of allowing themes to alter layout logic, I:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Separated design tokens from structural components</li>
                  <li>Defined color systems independently of layout</li>
                  <li>Isolated typography variables</li>
                  <li>Abstracted spacing values</li>
                  <li>Maintained consistent grid logic</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Theme switching affects:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Color palette</li>
                  <li>Surface treatments</li>
                  <li>Typography styling</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">It does not affect:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Information hierarchy</li>
                  <li>Layout regions</li>
                  <li>Interaction patterns</li>
                  <li>Reporting structure</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This separation ensures that theme variation does not introduce layout instability. <strong className="text-gray-900 dark:text-white">The experience remains fluid and predictable regardless of visual treatment.</strong>
                </p>
              </div>

              {/* Phase 4 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 4: Commonized Reporting System</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  A major pain point across products was inconsistent reporting. I designed a standardized reporting model that:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Aggregates quantitative scores</li>
                  <li>Visualizes usability metrics</li>
                  <li>Groups qualitative insights</li>
                  <li>Tags severity levels</li>
                  <li>Highlights recurring friction points</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Reports follow a consistent structural format across themes. This allows:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Cross product comparison</li>
                  <li>Easier stakeholder review</li>
                  <li>Reduced interpretation effort</li>
                  <li>Standardized executive summaries</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    The reporting system becomes a shared language between teams.
                  </p>
                </div>
              </div>

              {/* Phase 5 */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Phase 5: Front End Implementation</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  I built the application with a modular front end architecture focused on reusability and clarity. Key architectural principles included:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Component driven design</li>
                  <li>Centralized state management</li>
                  <li>Data abstraction layer</li>
                  <li>Token driven theming</li>
                  <li>Responsive grid system</li>
                  <li>Reusable reporting modules</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The application maintains smooth theme transitions, predictable layout rendering, consistent spacing and rhythm, and logical state handling. Theme changeover is immediate and clean because <strong className="text-gray-900 dark:text-white">structure and presentation are decoupled</strong>.
                </p>
              </div>

              {/* Interaction Design Principles */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Interaction Design Principles</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">The platform emphasizes:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Clarity over ornamentation</li>
                  <li>Structured input flows</li>
                  <li>Immediate feedback</li>
                  <li>Consistent interaction states</li>
                  <li>Reduced cognitive friction</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Transitions are fluid but restrained. Animations support continuity rather than distraction. This reinforces trust and usability.
                </p>
              </div>

              {/* Technical Design Decisions */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Technical Design Decisions</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">To ensure scalability and flexibility, I implemented:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>A normalized JSON data structure</li>
                  <li>Config driven form rendering</li>
                  <li>Component level theming variables</li>
                  <li>Reusable reporting generators</li>
                  <li>Predictable state transitions</li>
                  <li>Controlled re-render logic</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This ensures new product themes can be added without rewriting core logic, new testing scenarios can plug into the existing schema, reports remain structurally consistent, and layout remains stable. <strong className="text-gray-900 dark:text-white">The system is extensible without fragmentation.</strong>
                </p>
              </div>

              {/* Accessibility Considerations */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Accessibility Considerations</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">The platform adheres to accessibility best practices including:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Semantic markup</li>
                  <li>Logical tab order</li>
                  <li>Clear focus states</li>
                  <li>Sufficient color contrast across themes</li>
                  <li>Accessible form labeling</li>
                  <li>Screen reader compatibility</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Theme variation does not compromise accessibility standards. <strong className="text-gray-900 dark:text-white">Accessibility is embedded in the structural layer, not dependent on theme styling.</strong>
                </p>
              </div>

              {/* Impact */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Before</h4>
                    <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                      <li>Fragmented testing tools</li>
                      <li>Redundant UX infrastructure</li>
                      <li>Inconsistent reporting</li>
                      <li>Theme driven layout instability</li>
                      <li>Difficult cross product comparisons</li>
                    </ul>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">After</h4>
                    <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                      <li>Unified testing architecture</li>
                      <li>Normalized data model</li>
                      <li>Clean theme switching</li>
                      <li>Predictable layouts</li>
                      <li>Commonized reporting format</li>
                      <li>Reduced engineering redundancy</li>
                      <li>Improved stakeholder clarity</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-900 dark:text-white font-semibold text-center">
                  The platform creates a reusable foundation for structured testing across multiple products.
                </p>
              </div>

              {/* Strategic Value */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Strategic Value</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">This initiative demonstrates my ability to:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Abstract patterns across product ecosystems</li>
                  <li>Separate structure from presentation</li>
                  <li>Normalize data across contexts</li>
                  <li>Design scalable reporting systems</li>
                  <li>Build modular front end architecture</li>
                  <li>Align UX, data, and theming systems</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Rather than solving a single product problem, this platform <strong className="text-gray-900 dark:text-white">solves a category problem</strong>. It creates a reusable testing infrastructure that can scale across teams and products without sacrificing clarity or cohesion.
                </p>
              </div>

              {/* Why This Work Matters */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Why This Work Matters</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Organizations often duplicate UX infrastructure across products. This project shows how thoughtful architecture can:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Reduce redundancy</li>
                  <li>Improve data comparability</li>
                  <li>Simplify stakeholder reporting</li>
                  <li>Maintain brand flexibility</li>
                  <li>Preserve layout predictability</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    It reflects systems thinking at both UX and engineering levels.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      )}

      {/* Case Study 4: AI-Augmented Inventory & CRM */}
      {activeStudy === "inventory-crm" && (
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
            <h2 className="font-bold title-font leading-tight text-gray-900 dark:text-white mb-2">
              AI-Augmented Inventory System & CRM Integration
            </h2>
            <p className="text-muted-foreground mb-8">
              Full-Stack Product, AI, & Systems Design for Nextier
            </p>

            <div className="space-y-8">

              {/* Executive Context */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Executive Context</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  A small yet growing tech business needed to unify its inventory processes, eliminate manual workflows, and leverage intelligent insights without disrupting day-to-day operations.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  I led the design and development of an AI-augmented inventory management system tightly integrated with their existing Customer Relationship Management (CRM), transforming disconnected tools into a cohesive, scalable operational backbone.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium italic">
                    How do you unify siloed systems, automate manual processes, and introduce AI-powered insights without disrupting active operations?
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    <strong className="text-gray-900 dark:text-white">I designed and built the system that answered that question.</strong>
                  </p>
                </div>
              </div>

              {/* The Problem */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">The Problem</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">The business operated with siloed systems:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Inventory records were manually maintained</li>
                  <li>CRM updates were not communicating with point-of-sale processes</li>
                  <li>Forecasting was guesswork</li>
                  <li>Teams lacked reliable, real-time visibility into stock status, sales momentum, and replenishment needs</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">This undermined growth efforts and caused avoidable inefficiencies across operations. As a Business & Technical Consultant via Nextier, I was brought in to solve for:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Disconnected data across systems</li>
                  <li>Lack of automation</li>
                  <li>Limited forecasting and reporting</li>
                  <li>High operational drag from manual tasks</li>
                  <li>No AI-enabled insights</li>
                </ul>
              </div>

              {/* Role & Responsibilities */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Role & Responsibilities</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  <strong className="text-gray-900 dark:text-white">Lead Product & Systems Architect</strong>
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Full product design: UX, data flows, interaction models</li>
                  <li>Technical architecture and implementation</li>
                  <li>AI and semantic search integration</li>
                  <li>CRM & backend integration</li>
                  <li>Cloud deployment and CI/CD</li>
                  <li>Requirements definition & stakeholder collaboration</li>
                </ul>
              </div>

              {/* Tools & Technologies */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Tools & Technologies</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  React, TypeScript, Next.js, Tailwind CSS, FastAPI (Python), PostgreSQL (Supabase), JWT Authentication, Supabase Row Level Security, Supabase Realtime, Edge Functions (Deno), Docker, Railway, OpenAI GPT-4o-mini, Groq API, Sentence Transformers, pgvector.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    AI tooling & development workflow included Cursor IDE with the Cursor Co-pilot for accelerated coding, prototyping, and iterative refinement.
                  </p>
                </div>
              </div>

              {/* The Challenge */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">The Challenge</h3>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Disconnected Workflow</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The client's CRM and inventory systems did not talk to one another; data was duplicated and manually reconciled. Users had no real-time inventory view or alerts, and forecasting was manual.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Operational Friction</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Business users spent hours reconciling systems, correcting errors, and updating stock counts. Meanwhile, product leads lacked predictive insights into demand trends.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">AI Integration Constraints</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Incorporating AI had to improve outcomes without drastically increasing complexity or cost. Semantic search needed to feel intuitive, actionable, and embedded into everyday workflows, not "AI for AI's sake."
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Security & Scale Requirements</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Authentication, access control, and real-time collaboration needed to be robust, secure, and scalable without requiring enterprise-grade infrastructure.
                </p>
              </div>

              {/* Solution Overview */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Solution Overview</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  At its core, the product is an AI-augmented inventory platform tightly integrated with the existing CRM, where users can:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>See real-time inventory status synchronized with CRM and point of sale</li>
                  <li>Search inventory semantically (not just keyword)</li>
                  <li>Receive automated demand forecasts</li>
                  <li>Leverage AI-powered categorization and tagging</li>
                  <li>Access secure, role-based dashboards and insights</li>
                </ul>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Key Features</h3>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Real-Time Data Synchronization</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Using Supabase Realtime and Edge Functions, changes to inventory and customer records propagate instantly, eliminating stale data and manual reconciliation.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Two-Way CRM Integration</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Custom middleware and RESTful APIs connect CRM systems bidirectionally, ensuring stock movements and customer interactions stay in sync with inventory status.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">AI-Assisted Categorization</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  GPT-4o-mini and Groq APIs intelligently categorize inventory items and automate tagging, reducing manual workload and improving data quality. This also enabled rich semantic search via vector embeddings (Sentence Transformers + pgvector), allowing users to query inventory with natural language.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Demand Forecasting</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  AI-driven demand insights predict future inventory needs based on historical trends, sales volume, and category dynamics, helping the business plan ahead and optimize stock.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Security & Governance</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  JWT authentication, Supabase Row Level Security, and scalable backend controls ensured access was secure by default and aligned with least-privilege principles.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">CI/CD & Deployment</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Containerized with Docker and deployed with Railway and Netlify, both frontend and backend now benefit from automated build pipelines and predictable releases.
                </p>
              </div>

              {/* Design & UX Strategy */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Design & UX Strategy</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Rather than introducing complexity with new workflows, the design focused on:
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Minimal UI Friction</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Interfaces that felt familiar to users, with concise data views and clear action affordances.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Progressive Reveal of AI Insights</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  AI recommendations appear contextually, not as standalone "AI features," increasing adoption and reducing cognitive load.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Real-Time Feedback Loops</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Realtime updates and notifications ensure users never work with outdated information.
                </p>
              </div>

              {/* Impact */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Before</h4>
                    <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                      <li>Siloed inventory and CRM systems</li>
                      <li>Manual data reconciliation</li>
                      <li>No forecasting capability</li>
                      <li>Keyword-only inventory search</li>
                      <li>No AI-enabled insights</li>
                      <li>High operational drag</li>
                    </ul>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">After</h4>
                    <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                      <li>Unified real-time inventory and CRM</li>
                      <li>AI-powered categorization and tagging</li>
                      <li>Semantic natural language search</li>
                      <li>Automated demand forecasting</li>
                      <li>Role-based secure dashboards</li>
                      <li>Automated CI/CD deployment</li>
                      <li>Rapid iteration via AI-assisted development</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-900 dark:text-white font-semibold text-center">
                  Disconnected tools became a cohesive, intelligent operational backbone.
                </p>
              </div>

              {/* Learnings & Takeaways */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Learnings & Takeaways</h3>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>AI is most valuable when embedded into workflows rather than standalone tools</li>
                  <li>Semantic search transformed user expectation of inventory lookup from exact match to intent understanding</li>
                  <li>Real-time sync across systems reduced operational drag more than any single dashboard feature</li>
                  <li>Secure defaults (JWT + RLS) prevent costly data exposure while enabling fine-grained control</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    The project is not publicly accessible due to client privacy.
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium mt-2">
                    Portfolio and technical demos available upon request.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      )}
      {/* Case Study 5: Delivery Discipline */}
      {activeStudy === "delivery-discipline" && (
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
            <h2 className="font-bold title-font leading-tight text-gray-900 dark:text-white mb-2">
              Establishing Delivery Discipline Across Distributed, Regulated Environments
            </h2>
            <p className="text-muted-foreground mb-8">
              Organization-Wide Operational Transformation -- Agile, Process, & Delivery Excellence
            </p>

            <div className="space-y-8">

              {/* Context */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Context</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Multiple enterprise engagements across regulated industries uncovered a recurring strategic opportunity: teams were delivering work, but delivery discipline, predictability, and cross-functional alignment were inconsistent. I led organizational transformation efforts spanning teams working across continents, in complex regulated environments, to embed disciplined delivery practices, improve predictability, and reduce inefficiencies.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Across three major engagements -- Meridian Health Plan, Optum/UnitedHealthcare Group, and Dewpoint Inc. -- organizations were struggling with variation in delivery outcomes, lack of shared process frameworks, and limited visibility into work at scale.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Challenges cut across:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Distributed teams across 3 continents</li>
                  <li>Healthcare and regulated data environments</li>
                  <li>Siloed engineering and product practices limiting reproducibility of delivery outcomes</li>
                  <li>Leadership seeking better predictability</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  These were real business problems impacting time-to-market, cross-team collaboration, operational costs, and strategic alignment.
                </p>
              </div>

              {/* Role & Responsibilities */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Role & Responsibilities</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  <strong className="text-gray-900 dark:text-white">Enterprise Delivery & Process Transformation Lead</strong>
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Spanning multiple engagements, my responsibilities included:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Assessing existing delivery practices & tooling</li>
                  <li>Designing enterprise-scale delivery frameworks</li>
                  <li>Implementing Agile and process discipline</li>
                  <li>Establishing reporting, metrics, and transparency</li>
                  <li>Mentoring and coaching distributed teams</li>
                  <li>Aligning engineering, product, and business leadership</li>
                  <li>Partnering with senior stakeholders for enterprise outcomes</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3"><strong className="text-gray-900 dark:text-white">Industries:</strong> Healthcare (regulated environments), Enterprise product teams, Digital service delivery</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">Team Scale:</strong> 20-30+ developers, product owners, QA, and delivery leads, spanning North America, Europe, and Asia.
                </p>
              </div>

              {/* The Challenge */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">The Challenge</h3>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Fragmented Delivery Practices</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Different teams operated with different rituals, tools, and levels of Agile maturity, leading to inconsistent delivery outcomes.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Lack of Predictability</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Leadership lacked reliable forecasting, visibility into impediments, and agreed-upon metrics to assess progress.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Distributed Team Complexity</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Teams spanned time zones and cultures, which amplified misalignment and reduced collaboration velocity.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Regulated Data & Compliance</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  In healthcare environments, delivery needed to mesh with compliance requirements, adding procedural overhead without clear frameworks.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Poor Cross-Functional Alignment</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Product, UX, QA, and engineering teams weren't consistently coordinated on priorities or execution.
                </p>
              </div>

              {/* Solution Overview */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Solution Overview</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  The transformation was not about introducing buzzwords. It was about establishing sustainable delivery discipline that removed friction, enabled predictability, and created a framework for continuous improvement.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">The approach involved:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Unified Delivery Frameworks</li>
                  <li>Consistent Metrics & Reporting</li>
                  <li>Best-Practice Agile Rituals</li>
                  <li>Coaching and Mentoring</li>
                  <li>Tooling & Process Enhancements</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This work spanned onboarding, training, team structures, metrics, cross-team planning, and leadership alignment.
                </p>
              </div>

              {/* Key Actions & Features */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Key Actions & Features</h3>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Enterprise Delivery Framework</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">I designed and operationalized a scalable delivery framework that included:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Shared backlog practices</li>
                  <li>Definition of done</li>
                  <li>Sprint ceremonies standardized across teams</li>
                  <li>Clear acceptance criteria and quality gates</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  This reduced ambiguity and created common language across distributed teams.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Metrics, Reporting & Forecasting</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Together with leadership, I established:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Sprint velocity tracking</li>
                  <li>Burndown/backlog health reporting</li>
                  <li>Cross-team dependency visualization</li>
                  <li>Release forecasting models</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  These enabled leadership to make data-informed decisions.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Agile Rituals That Stick</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">Rather than superficial ceremonies, we implemented:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Daily standups with shared accountability</li>
                  <li>Structured refinement sessions</li>
                  <li>Alignment sessions across time zones</li>
                  <li>Monthly leadership reviews tied to business outcomes</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  The result: predictable, repeatable delivery cadences.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Distributed Collaboration Practices</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">To support teams across three continents:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Co-located sprints with overlapping collaboration windows</li>
                  <li>Clear documentation expectations</li>
                  <li>Team charters emphasizing shared norms</li>
                  <li>Feedback loops built into retrospectives</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  This minimized friction from geographic and cultural differences.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Coaching & Capabilities Building</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">I coached individual team leads, scrum masters, and directors to:</p>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Understand Agile values vs dogma</li>
                  <li>Apply continuous improvement practices</li>
                  <li>Align on outcomes, not outputs</li>
                  <li>Communicate effectively across organizational layers</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This helped sustain transformation beyond my involvement.
                </p>
              </div>

              {/* Design & Strategy Highlights */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Design & Strategy Highlights</h3>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Process First, Tools Second</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Rather than layering tools on top of shallow practices, we built frameworks that tools could support, not the other way around.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Metrics Aligned with Business Outcomes</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Velocity was never an end. It drove predictability in forecasting which informed leadership decisions.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Empowering Teams with Structure</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Structure enabled autonomy: teams knew what success looked like, and how to measure it.
                </p>

                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Continuous Feedback Built Into Workflows</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Retrospectives weren't forced rituals. They were mechanisms for constant refinement.
                </p>
              </div>

              {/* Impact */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Before</h4>
                    <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                      <li>Fragmented delivery practices</li>
                      <li>Inconsistent Agile maturity</li>
                      <li>No reliable forecasting</li>
                      <li>Distributed team misalignment</li>
                      <li>Limited cross-functional coordination</li>
                      <li>Compliance overhead without clear frameworks</li>
                    </ul>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">After</h4>
                    <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                      <li>Predictable delivery cadence</li>
                      <li>Reduced delivery risk</li>
                      <li>Improved transparency for leadership</li>
                      <li>Distributed collaboration aligned on norms</li>
                      <li>Sustainable practice adoption</li>
                      <li>Teams carrying practices forward independently</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-900 dark:text-white font-semibold text-center">
                  Delivery discipline became operational across organizations.
                </p>
              </div>

              {/* Learnings & Takeaways */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white title-font">Learnings & Takeaways</h3>
                <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 mb-4">
                  <li>Structure enables autonomy. Without common frameworks, teams drift into localized silos.</li>
                  <li>Predictability fuels decision-making. Leadership needs clarity more than velocity.</li>
                  <li>Distributed teams require intentional collaboration design. Time zones and cultures matter.</li>
                  <li>Tools don't fix process problems. Frameworks and habits do.</li>
                  <li>Continuous improvement isn't optional. It's what makes delivery discipline sustainable.</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 my-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    This case study synthesizes work from multiple enterprise engagements (Meridian Health Plan, Optum/UnitedHealthcare, Dewpoint Inc.). Specific artifacts and internal dashboards are proprietary to each organization.
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium mt-2">
                    Methodologies and frameworks can be shared upon request for professional conversations or workshops.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      )}
    </PortfolioLayout>
  );
}
