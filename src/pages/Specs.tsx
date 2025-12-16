import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Code,
  Palette,
  Database,
  Globe,
  Smartphone,
  Zap,
  Layers,
  Settings,
  Shield,
  ArrowLeft,
} from "lucide-react";
import {
  techCategories,
  methodologies,
  keyFeatures,
  performanceMetrics,
  pageContent,
} from "../data/specsData";
import MobileTrayMenu from "../components/MobileTrayMenu";
import { content } from "../content";

const Specs = () => {
  const navigate = useNavigate();

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    // Wait for navigation to complete before scrolling
    setTimeout(() => {
      const articlesSection = document.getElementById("articles");
      if (articlesSection) {
        articlesSection.scrollIntoView({ behavior: "smooth" });
      }
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

  // Icon mapping function
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      Code: <Code className="w-6 h-6" />,
      Palette: <Palette className="w-6 h-6" />,
      Database: <Database className="w-6 h-6" />,
      Globe: <Globe className="w-6 h-6" />,
      Smartphone: <Smartphone className="w-6 h-6" />,
      Zap: <Zap className="w-6 h-6" />,
      Layers: <Layers className="w-6 h-6" />,
      Settings: <Settings className="w-6 h-6" />,
      Shield: <Shield className="w-6 h-6" />,
    };
    return iconMap[iconName] || <Code className="w-6 h-6" />;
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
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portfolio
              </Link>

              {/* Title and Navigation Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, delay: 0.2 }}
                className="mb-6 sm:mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-4"
              >
                <div className="flex-1">
                  <h1 className="text-5xl font-bold mb-1 title-font leading-none relative z-10 text-left">
                    {content.siteInfo.subtitle}
                  </h1>
                </div>

                {/* Navigation Links */}
                <div className="hidden lg:flex flex-wrap justify-end gap-2 sm:gap-3 mt-2 lg:mt-0">
                  {content.navigation.links
                    .filter((link) => link.id !== "design-system")
                    .sort((a, b) => {
                      // Define the desired order: Lab, Storytelling, Design, Articles, Career
                      const order = [
                        "current-projects",
                        "stories",
                        "work",
                        "articles",
                        "career",
                      ];
                      const indexA = order.indexOf(a.id);
                      const indexB = order.indexOf(b.id);
                      return (
                        (indexA === -1 ? 999 : indexA) -
                        (indexB === -1 ? 999 : indexB)
                      );
                    })
                    .map((link) => (
                      <button
                        key={link.id}
                        onClick={() => {
                          navigate("/");
                          // Wait for navigation to complete before scrolling
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
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs Content */}
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-16"
            >
              {/* Specs Header */}
              <motion.div variants={fadeInUp} className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                  {pageContent.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {pageContent.subtitle}
                </p>
              </motion.div>

              {/* Technology Stack */}
              <motion.section variants={fadeInUp} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {techCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-center mb-4">
                        <div className="text-primary mr-3">
                          {getIcon(category.icon)}
                        </div>
                        <h3 className="text-xl font-semibold">
                          {category.title}
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="border-l-2 border-primary/20 pl-4"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {item.description}
                            </p>
                            {item.example && (
                              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                  {item.example.description}
                                </p>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
                                  <code className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                                    {item.example.code}
                                  </code>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Methodologies */}
              <motion.section variants={fadeInUp} className="space-y-8">
                <h2 className="text-3xl font-bold text-center mb-12">
                  Development Methodologies
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {methodologies.map((method, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20"
                    >
                      <h3 className="text-xl font-semibold mb-3 text-primary">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {method.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Key Features */}
              <motion.section variants={fadeInUp} className="space-y-8">
                <h2 className="text-3xl font-bold text-center mb-12">
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {keyFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Performance Metrics */}
              <motion.section variants={fadeInUp} className="space-y-8">
                <h2 className="text-3xl font-bold text-center mb-12">
                  Performance Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {performanceMetrics.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="text-center bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl p-6"
                    >
                      <div className="text-3xl font-bold text-primary mb-2">
                        {item.value}
                      </div>
                      <div className="text-lg font-semibold mb-2">
                        {item.metric}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Footer */}
              <motion.div
                variants={fadeInUp}
                className="text-center pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  {pageContent.footerText}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      <MobileTrayMenu />
    </div>
  );
};

export default Specs;
