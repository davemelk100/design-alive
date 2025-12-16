import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import MobileTrayMenu from "../components/MobileTrayMenu";
import { content } from "../content";

// Lazy load icon to avoid blocking critical path
const LazyArrowLeft = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ArrowLeft }))
);

const Story = () => {
  const navigate = useNavigate();

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="py-4 sm:py-4xl:py-4 relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {/* Hero Content */}
            <div className="pt-4 rounded-lg">
              {/* Back Navigation */}
              <Link
                to="/"
                onClick={handleBackClick}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-8 relative z-50"
              >
                <Suspense fallback={<span className="h-4 w-4 mr-2">←</span>}>
              <LazyArrowLeft className="h-4 w-4 mr-2" />
            </Suspense>
                Back to Portfolio
              </Link>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, delay: 0.2 }}
                className="mb-6 sm:mb-8"
              >
                <h1 className="text-5xl font-bold mb-1 title-font leading-none relative z-10 text-left">
                  End-to-End Product Development
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                  AI Interpretation Feature at Propio Language Services
                </p>
              </motion.div>

              {/* Navigation Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, delay: 0.4 }}
                className="hidden lg:flex flex-wrap justify-start gap-2 sm:gap-3 mb-2 sm:mb-4"
              >
                {content.navigation.links
                  .filter((link) => link.id !== "design-system")
                  .map((link) => (
                    <button
                      key={link.id}
                      onClick={() => {
                        navigate("/");
                        setTimeout(() => {
                          const element = document.getElementById(link.id);
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                            });
                          }
                        }, 100);
                      }}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {link.text}
                    </button>
                  ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-12"
          >
            {/* Question 1 */}
            <motion.section variants={fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                1. How you identified the problem?
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  At Propio Language Services, I identified the problem through
                  multiple signals converging to indicate a clear opportunity:
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4 ml-4">
                  <li>
                    User feedback and support tickets showed growing
                    dissatisfaction with transcription quality and accuracy
                  </li>
                  <li>
                    Business leadership was seeing competitive pressure from
                    providers offering more advanced AI capabilities
                  </li>
                  <li>
                    Market research indicated that interpretation quality was
                    becoming a key differentiator in the language services space
                  </li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Through user research interviews and stakeholder discussions,
                  I synthesized the core issues:
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4 ml-4">
                  <li>
                    Limited accuracy in existing transcription capabilities
                  </li>
                  <li>
                    No support for industry-specific vocabulary customization
                  </li>
                  <li>
                    Disconnected experiences across different communication
                    platforms
                  </li>
                  <li>
                    A perception that our solution lagged behind market leaders
                    in AI innovation
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Question 2 */}
            <motion.section variants={fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                2. How you prioritized the problem and inferred that it was big
                enough to solve?
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  I prioritized this by evaluating business impact and strategic
                  value:
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4 ml-4">
                  <li>
                    <strong>Market differentiation:</strong> Leadership
                    recognized OpenAI capabilities as an opportunity to elevate
                    our offering and distinguish it in the market
                  </li>
                  <li>
                    <strong>User demand:</strong> Growing user demands for
                    enhanced accuracy and clarity indicated significant market
                    need
                  </li>
                  <li>
                    <strong>Competitive risk:</strong> Falling behind in AI
                    capabilities could lead to customer churn and market share
                    loss
                  </li>
                  <li>
                    <strong>Business goals:</strong> The initiative aligned with
                    goals to increase adoption, address diverse client needs,
                    and strengthen competitive advantage
                  </li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The decision was validated through:
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4 ml-4">
                  <li>
                    Stakeholder alignment that this was a strategic priority
                  </li>
                  <li>Sufficient resources allocated for the initiative</li>
                  <li>
                    Clear business metrics tied to success (adoption rates,
                    client satisfaction, competitive positioning)
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Question 3 */}
            <motion.section variants={fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                3. What solution options you came up with?
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  I explored several potential approaches:
                </p>
                <div className="space-y-6 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-blue-600">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      Option 1: Enhance existing transcription engine
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Pros:</strong> Faster to implement, lower risk
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Cons:</strong> Likely insufficient to meet new
                      demands, limited scalability
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-green-600">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      Option 2: Integrate third-party AI transcription service
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Pros:</strong> Faster time to market, proven
                      technology
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Cons:</strong> Less control, potential dependency
                      issues
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-primary">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      Option 3: Integrate OpenAI into our live transcription
                      feature (Selected)
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Pros:</strong> Powerful AI capabilities,
                      customizable, scalable, real-time capabilities, market
                      recognition
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Cons:</strong> Higher complexity, integration
                      effort required
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-gray-600">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      Option 4: Build proprietary AI solution
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Pros:</strong> Full control, potential IP
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Cons:</strong> High cost, long timeline, uncertain
                      quality
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Within Option 3, I also evaluated specific feature priorities:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4 ml-4">
                  <li>Real-time language translation</li>
                  <li>Customizable industry-specific vocabulary</li>
                  <li>
                    Seamless integration with existing communication platforms
                  </li>
                  <li>User-friendly interface with high accuracy</li>
                </ul>
              </div>
            </motion.section>

            {/* Question 4 */}
            <motion.section variants={fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                4. Which solution you picked and why?
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  I selected{" "}
                  <strong>
                    Option 3: Integrating OpenAI into Propio's live
                    transcription feature
                  </strong>
                  .
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  <strong>Why this solution:</strong>
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4 ml-4">
                  <li>
                    <strong>Strategic alignment:</strong> This solution aligned
                    with leadership's vision to leverage OpenAI's capabilities
                  </li>
                  <li>
                    <strong>Market positioning:</strong> It positioned us as an
                    AI-forward provider in the interpretation services market
                  </li>
                  <li>
                    <strong>User value:</strong> It delivered real-time
                    translation, customizable vocabulary, and platform
                    integration that users needed
                  </li>
                  <li>
                    <strong>Business impact:</strong> It supported goals to
                    increase adoption, address diverse client needs, and
                    strengthen competitive position
                  </li>
                  <li>
                    <strong>Feasibility:</strong> The integration complexity was
                    manageable within our timeline and resources
                  </li>
                  <li>
                    <strong>Scalability:</strong> OpenAI's infrastructure could
                    scale with our growth
                  </li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Trade-offs considered:
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4 ml-4">
                  <li>
                    Investment in integration complexity was justified by
                    strategic value
                  </li>
                  <li>
                    We focused on high-impact features first, deferring
                    lower-priority capabilities
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Question 5 */}
            <motion.section variants={fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                5. How did you develop the solution and roll it out?
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Development and rollout followed a structured, user-centered
                  approach:
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">
                  Discovery and Planning Phase
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-6 ml-4">
                  <li>
                    Collaborated with business stakeholders to define
                    requirements and success metrics
                  </li>
                  <li>
                    Conducted user research and reviewed existing feedback to
                    identify pain points
                  </li>
                  <li>
                    Evaluated OpenAI integration points and technical
                    requirements
                  </li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">
                  Design and Prototyping Phase
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-6 ml-4">
                  <li>Created user flows mapping the end-to-end experience</li>
                  <li>
                    Developed wireframes establishing structure and interactions
                  </li>
                  <li>
                    Built interactive prototypes in Figma to gather stakeholder
                    and user feedback early
                  </li>
                  <li>
                    Built a functional front-end prototype using React and
                    TypeScript to demonstrate the user interface and highlight
                    the potential of OpenAI integration
                  </li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">
                  Testing and Validation Phase
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-6 ml-4">
                  <li>
                    Used Optimizely to run A/B tests and refine the design
                  </li>
                  <li>
                    Collected qualitative insights to ensure the interface was
                    intuitive and the AI features were effective
                  </li>
                  <li>
                    Tested accessibility and scalability throughout development
                  </li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">
                  Implementation Phase
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-6 ml-4">
                  <li>
                    Worked closely with engineering teams to translate designs
                    into production code
                  </li>
                  <li>
                    Ensured accessibility and scalability from concept through
                    production
                  </li>
                  <li>
                    Maintained focus on user experience while meeting technical
                    requirements
                  </li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">
                  Rollout Phase
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-6 ml-4">
                  <li>Phased deployment to manage risk and gather feedback</li>
                  <li>
                    Monitored key metrics including adoption rates, user
                    satisfaction, and transcription accuracy
                  </li>
                  <li>Iterated based on real-world usage</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">
                  Results
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The result was a seamless and impactful transcription tool
                  that became a key business differentiator for Propio. The
                  solution improved user satisfaction and adoption, and
                  strengthened our competitive position in the interpretation
                  services market.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">
                  Key Success Factors
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-6 ml-4">
                  <li>End-to-end ownership from concept through production</li>
                  <li>
                    Strong collaboration across business, design, and
                    engineering
                  </li>
                  <li>
                    Data-driven decision making using A/B testing and user
                    feedback
                  </li>
                  <li>Focus on accessibility and scalability from the start</li>
                </ul>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </section>
      <MobileTrayMenu />
    </div>
  );
};

export default Story;
