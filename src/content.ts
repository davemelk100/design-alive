// This file exports application content data
// It must not be tree-shaken away - marked as having side effects in vite.config.ts
export const content = {
  siteInfo: {
    title: "Dave Melkonian",
    subtitle: "Dave Melkonian",
    description: "Digital Experience Designer",
    scrollText: "Scroll to explore",
  },

  navigation: {
    menuAriaLabels: {
      open: "Open menu",
      close: "Close menu",
    },
    links: [
      {
        id: "current-projects",
        text: "Lab",
      },
      {
        id: "career",
        text: "Career",
      },
      // {
      //   id: "stories",
      //   text: "Storytelling",
      // },
      {
        id: "work",
        text: "Design",
      },
      {
        id: "articles",
        text: "Articles",
      },
      {
        id: "design-system",
        text: "Design System",
      },
      {
        id: "testimonials",
        text: "Testimonials",
      },
      {
        id: "contact",
        text: "Contact",
      },
    ],
    social: {
      linkedin: {
        text: "LinkedIn",
        url: "https://www.linkedin.com/in/davemelk/",
      },
      dribbble: {
        text: "Dribbble",
        url: "https://dribbble.com/davemelk100",
      },
    },
  },

  work: {
    title: "Design Work",
    subtitle: "There is much more I am unable to show, unfortunately.",
    projects: [
      {
        title: "Delta Dental Member Portal",
        description: "Led UI design implementation for a SaaS product",
        categories: "",
        image: "/img/delta-portal-sq.png",
        alt: "Delta Dental Member Portal",
        url: "https://www.memberportal.com/mp/delta/",
      },

      {
        title: "MajorLeagueNumbers.com Logo",
        description: "Logo design for baseball analytics platform",
        categories: "Logo Design, Branding, Sports",
        image: "/img/mln-patches.svg",
        alt: "MajorLeagueNumbers.com Logo",
        url: "https://dribbble.com/shots/26980187-MajorLeagueNumbers-com-logo",
      },
      {
        title: "ChatMLB Bot",
        description: "AI chatbot design for baseball statistics",
        categories: "AI, Chatbot Design, Sports",
        image: "/img/chatmlb-port.png",
        alt: "ChatMLB Bot",
        url: "https://dribbble.com/shots/26980175-ChatMLB-bot",
      },
      {
        title: "Figma Prototypes",
        description: "Figma samples",
        categories: "Prototyping, Design Systems, UX",
        image: "/img/figma-graph.png",
        alt: "Figma Prototypes",
        url: "https://www.figma.com/proto/0ardLlpbeKWcNUOGxzMREX/dm-ds?node-id=305-11828&t=Vqw9xHgmaGsyEfUd-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=305%3A11828&show-proto-sidebar=1",
      },
      {
        title: "Figma Mobile Prototype",
        description: "Mobile interface prototypes and interactions",
        categories: "Mobile Design, Prototyping, UX",
        image: "/img/figma-mobile-2.png",
        alt: "Figma Mobile Prototype",
        url: "https://www.figma.com/proto/0ardLlpbeKWcNUOGxzMREX/dm-ds?node-id=9-4191&t=saMfWR54wMQQ5dYx-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=9%3A4191&show-proto-sidebar=1",
      },
      {
        title: "Figma Wireframe",
        description: "Low-fidelity wireframes and user flow diagrams",
        categories: "Wireframing, UX Design, User Flows",
        image: "/img/figma-wire.png",
        alt: "Figma Wireframe",
        url: "https://www.figma.com/proto/0ardLlpbeKWcNUOGxzMREX/dm-ds?node-id=19-6883&t=saMfWR54wMQQ5dYx-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=19%3A6883&show-proto-sidebar=1",
      },
      {
        title: "Delta Dental Registration",
        description: "Individual insurance registration application.",
        categories: "Insurance",
        image: "/img/delta-search.png",
        alt: "Delta Dental Individual Insurance Registration",
        url: "https://www.mysmilecoverage.com/delta/",
      },
      {
        title: "3D Conversion UX Plan",
        description:
          "Comprehensive UX strategy for 3D software conversion and modernization.",
        categories: "UX Strategy, 3D Design, Documentation",
        image: "/img/onuog.png",
        alt: "3D Conversion UX Plan",
      },
      {
        title: "Mushroom Tour Cards",
        description: "Card design for a mushroom tour app.",
        image: "/img/shroom-cards.png",
        alt: "Card design for a mushroom tour app.",
        categories: "Mobile App, Photography",
      },
      {
        title: "Hex Code Pop Art",
        description: "Digital art piece with hex codes",
        categories: "Graphic Design, CSS",
        image: "/img/hex-orange.png",
        alt: "Hex Code Pop Art",
        url: "https://dribbble.com/shots/25891436-Hex-code-gradient-endpoints-in-pop-art-style",
      },
      {
        title: "Logos for Sports Podcast",
        description: "Logo designs for a sports podcast",
        categories: "Logo Design, Branding, Sports",
        image: "/img/nfl-logos.png",
        alt: "NFL-Themed Logos for Sports Podcast",
        url: "https://dribbble.com/shots/25274995-NFL-Themed-Logos-for-Sports-Podcast",
      },
      {
        title: "Vintage Form Design",
        description: "Design for an online vintage store",
        categories: "E-commerce, Form Design, Vintage",
        image: "/img/vintage-phone.png",
        alt: "Vintage Form Design for Online Store",
        url: "https://dribbble.com/shots/25650265-Contact-Form",
      },
      {
        title: "Band Shirt Design",
        description: "Shirt design with vintage sports theme",
        categories: "Graphic Design, Typography, Merchandise",
        image: "/img/ht.png",
        alt: "Band Shirt Design",
        url: "https://dribbble.com/shots/20590794-band-shirt-design",
      },
      {
        title: "Design Panes",
        description: "Design, designs, and designers.",
        categories: "Design Systems, UX, Web Development",
        image: "/img/dpanez.png",
        alt: "Design Panes",
        url: "https://designpanes.com/",
      },
      {
        title: "HealthAware",
        description: "A health monitoring system.",
        categories: "Health Tech, UX, IoT, Real-time Data",
        image: "/img/healthaware.png",
        alt: "HealthAware",
        url: "https://my-health-powerered-vehicle.netlify.app/",
      },
    ],
  },

  testimonials: {
    title: "Testimonials",
    subtitle: "Thank you to everyone who has shared such kind words.",
    items: [
      {
        quote:
          "I had the opportunity to work with Dave when he was my UX Manager at Meridian Health Plan. Dave is a thoughtful and inspiring leader who brings a strong vision to UX while empowering his team to grow and succeed. He provided clear direction, constructive feedback, and created a collaborative environment that allowed great design to thrive. I truly appreciated his mentorship and leadership, and I'd highly recommend him to any organization looking for a strong UX leader.",
        author: "Priya Duraikannu",
        role: "Product Design & UX Leader",
      },
      {
        quote:
          "Dave is one of the best design and user experience professionals I have worked with. He takes a pragmatic and user focused approach to design, ensuring the linkage between an idea and the resulting experience are complementary and consistent. He is approachable and mature, while also being very creative. While we were both at Dewpoint we worked on multiple shared client engagements, and I always looked forward to having Dave on the team.",
        author: "Christopher Weiss",
        role: "Chief Technology Officer at Powerley",
      },
      {
        quote:
          "I highly recommend David for his exceptional expertise in UX/UI design. With experience as a User Experience Manager, Senior Designer, and Interface Developer, he has consistently delivered user-centered, innovative, and seamless digital experiences. David excels at aligning user needs with business goals, fostering collaboration, and solving complex challenges with creative, effective solutions. His technical proficiency and ability to implement clean, efficient designs make him an invaluable asset to any team. David is a skilled professional whose contributions drive impactful results, and I have no doubt he will excel in any role he undertakes.",
        author: "Keerthi Baliga",
        role: "CSPO certified | Product Owner at Propio Language Services",
      },
      {
        quote:
          "Dave, a seasoned UI/UX specialist, hired me into the Web Developer role at Optum. He mentored me and other developers, helping us become strong front-end developers. His practical experience is invaluable during strategic discussions and decision-making processes. Dave would be an asset to any team, bringing years of industry and management experience.",
        author: "Rajashri Bharathan, CSM",
        role: "Engineering Delivery Manager at Airspace Link",
      },
      {
        quote:
          "As is clear from the other recommendations here, Dave is a wizard at all things UI/UX and Front End, and a passionate, opinionated, inspiring, entertaining, and widely experienced one at that! Dave and I worked on several projects together during our time at Propio, and in every case Dave produced creative, high quality, and well thought out prototypes and solutions to the UI/UX problems at hand, regularly surprising and impressing the teams and users with whom he was working. In addition, he was enthusiastically willing to consider and incorporate feedback from all involved parties, and to engage in well-informed and productive discussions around his (and the industry's) reasoning behind his approaches and the inevitable alternatives, choices, and concerns that arose along the way. In short, I highly recommend Dave as a highly skilled, self-motivated UI/UX/Front End expert who can be relied on to deliver above and beyond expectations. He is a pleasure to work with, and I look forward to the chance to work with him again.",
        author: "Jud Cole",
        role: "Experienced Technology Leader, Innovator, Strategist, and Mentor",
      },
      {
        quote:
          "Dave is a senior leader, who is able to be \"hands on\" writing code as easily as contributing to strategic discussions and decisions. He's easy to work with, and strong in all things UI and UX.",
        author: "Brent Knop, CSM, PMPO, ITIL",
        role: "Leading Healthcare Software Engineering Teams",
      },
      {
        quote:
          "I worked alongside Dave on several large, complex web projects, and we quickly became aligned on the type and quality of work we both strived to deliver. David is one of the brightest minds out there doing UI. He is not one you put in a box; his talents are diverse, he is creative as well as analytical, and he has a curious mindset. He has the knack for identifying a design problem clearly and solving it quickly and effectively. His work is always on point. He is a great colleague and leader. I would be thrilled to work with him again.",
        author: "Brian Carroll",
        role: "User Experience Consultant",
      },
      {
        quote:
          "I had the pleasure of working with Dave at Propio on several exciting and challenging projects, including a complete overhaul of an existing enterprise application and the design of new, AI-driven initiatives. These projects were greenfield, requiring a lot of active prototyping, collaboration, and creative problem-solving, and Dave excelled in all of these areas. Dave quickly became a go-to resource for brainstorming and refining ideas. His ability to balance user needs with business goals made him an invaluable partner in the design process. One of the qualities I most admired was his steadfast advocacy for accessibility. For example, he championed the use of skip links to enhance the experience for screen reader users, a small but impactful addition that showed his commitment to inclusive design. If you're looking for a UX designer who is innovative, collaborative, and deeply user-focused, I recommend Dave. He's a true asset to any team.",
        author: "Chris Baker",
        role: "15+ Years of Software Dev Experience",
      },
      {
        quote:
          "It was a privilege to work alongside David at several companies, including Meridian. David consistently displayed exceptional dedication, a strong work ethic, and remarkable attention to detail. His talent for analyzing challenges and devising innovative solutions was very influential to our team. David's commitment to excellence and his adaptability in dynamic situations also stood out. His strong communication skills enabled seamless collaboration with cross-functional team, along with stakeholders and business leaders. David is a natural team player and brought a collaborative spirit and a positive attitude to every project. He actively participated in discussions, offered valuable insights, and went above and beyond to ensure success. His expertise in research, design and development played a pivotal role in helping our team communicate our vision effectively. I would absolutely recommend David Melkonian for any role requiring a motivated, detail-oriented professional. His passion for continuous learning and growth will undoubtedly make him a valuable asset to any organization.",
        author: "Matthew Petoskey",
        role: "Customer Experience (CX) Strategist & UX Leader",
      },
      {
        quote:
          "David is a consummate professional whose skills and experience extend beyond excellence in UX/UI development. He is an empathetic and insightful partner in software development who knows how to support the development team while driving the value-based initiatives of product management. I wholeheartedly recommend him to any organization in need of a talented UX pro who can deliver the goods!",
        author: "T. S. Jensen",
        role: "Writer",
      },
      {
        quote:
          "I had the pleasure of working with Dave at Optum, and I can confidently say he is one of the most talented developer/delivery managers that I've encountered. Dave combines deep front-end expertise with an exceptional ability to lead and inspire his team, making him invaluable to any project. Dave has a remarkable eye for detail and a strong commitment to creating seamless, user-friendly applications. He not only ensures that code quality and best practices are upheld but also actively mentors his team, helping each member to grow and excel. His technical acumen, especially in front-end architecture, design patterns and scalable solutions, consistently elevates projects. I highly recommend Dave to any organization looking for a strong technical leader who delivers outstanding results.",
        author: "Timothy Hellebuyck",
        role: "Technology Executive | Director, Technology and Software Development",
      },
      {
        quote:
          "Dave and I teamed up on a 3D imaging software project, and he really brought his A-game. He pulled together an awesome plan with everything from user research and detailed workflows to testing plans, wireframes, and full graphic comps. He was extremely efficient, detail oriented, and made sure we had every design artifact ready for the dev team. Working with him was a pleasure, start to finish!",
        author: "Sam Sesti",
        role: "CEO at Cloudlab",
      },
      {
        quote:
          "Dave has a rare combination of artistic ability and technical competency that make him an amazing UX designer. I worked with Dave for about a year at Propio and during that time he revamped multiple old web and mobile applications with slick modern interfaces, pushing our user experience beyond what our competitors were doing. He's a wizard with Figma, CSS/HTML, various design paradigms, graphics and sound, and is always a pleasure to work with. He has a great eye for usability and accessibility, and has many times shocked me with a clever design for something I thought would be difficult. I heartily recommend Dave for any UX position.",
        author: "Mike Slavik",
        role: "Staff Software Engineer at Propio Language Services",
      },
      {
        quote:
          "I had the privilege of working alongside Dave at two different companies, where I had the opportunity to lead him on multiple projects. Dave possesses a unique ability to not only lead and mentor junior staff but also to collaborate effectively with peers on complex tasks. His passion for development is evident in his work, coupled with a remarkable attention to detail that ensures high-quality outcomes. He demonstrates a genuine interest in enhancing user experience, which makes him an exceptional asset to any team. I wholeheartedly recommend Dave for any opportunity that allows him to showcase his skills and dedication.",
        author: "Chris Bellinger",
        role: "Digital Transformation Leader",
      },
      {
        quote:
          "It is my pleasure to recommend Dave as an exceptional leader in software design, UX/UI, and front-end development. I've had the privilege of overseeing his work on high-impact projects for major clients such as Optum, HealthCare.gov, Delta Dental, and Propio Language Services, and I've consistently observed his ability to deliver substantial value with professionalism and enthusiasm. Dave's expertise spans usability, accessibility, and Agile methodologies, making him a seamless and proactive contributor within cross-functional teams and an effective collaborator with leadership. His unique blend of design and technical skills allows him to create visually engaging, user-friendly experiences that meet and often exceed client expectations. Beyond his technical acumen, Dave demonstrates strong leadership and mentoring abilities, fostering growth within his teams while driving projects toward excellence. In every project, Dave brings an invaluable combination of experience, adaptability, and a positive, solutions-oriented mindset. His contributions to our team and his dedication to quality make him an asset to any organization fortunate enough to work with him.",
        author: "Brian Singer",
        role: "Technology and Product Innovator | CTO | CIO",
      },
    ],
  },

  career: {
    title: "Career Journey",
    subtitle: "Organizations that have supported my career",
    positions: [
      {
        title: "Technical and Business Consultant",
        company: "Melkonian Industries · Self-employed",
        period: "Jan 2026 – Present",
        description: [
          "Implementing SEO enhancements and Google Ad placement strategy to increase traffic for a non-profit financial wellness organization",
          "Redesigned and rebuilt an application for a Six Sigma Training and Book advertising site for a consulting collective",
          "Deep dive into process and technologies for a small tech business. Implemented an inventory system integrated with an existing CRM, and tied it into the point-of-sale solution",
          "Established a digital supply chain to automate workflows and templating for back-end processing for an accounting firm",
          "Conducting exploratory consults to determine a social media strategy and user demographic study for multiple clients",
          "Built a time-tracking system to ensure clients have full transparency into the details and time frames in which work was performed. This is targeted towards independent employees requiring a simple time-tracking mechanism",
          "Architecting a site for a large skateboard company in which to incorporate all of its sub-brands under its main brands' umbrella. Doing SEO enhancements, and targeted Google Ad placement, in addition to client interface with music licensing personnel",
          "Built operational and digital workflow improvements, with an emphasis on tooling, automation, and simple tech stacks",
          "Implemented lightweight process and system enhancements to improve efficiency",
          "Delivered assessments and recommendations on accessibility, content structure, and internal systems for an AI chatbot company, and for a data governance organization",
          "Provided training and coaching to improve tool adoption, self-sufficiency, and day-to-day execution",
          "Built a RAG application for materials inventory using: Full-Stack: React, TypeScript, Python, FastAPI, Netlify, Railway | AI/ML: RAG, Sentence Transformers, pgvector, OpenAI, Anthropic, Groq, Ollama",
        ],
      },
      {
        title: "Business and Technical Consultant",
        company: "Nextier",
        period: "December 2025 – Present",
        description: [
          "Designed and developed full-stack inventory management system using React, TypeScript, Next.js, and Tailwind CSS",
          "Built robust backend with FastAPI (Python 3.11+), PostgreSQL (Supabase), and Pydantic models, implementing JWT authentication, Row Level Security (RLS), and real-time updates via Supabase Realtime",
          "Engineered seamless two-way integration with existing CRM using RESTful APIs, Supabase Edge Functions (Deno), and custom middleware",
          "Incorporated AI-assisted features using OpenAI GPT-4o-mini and Groq API for smart categorization, demand forecasting, and automated tagging",
          "Implemented vector search capabilities with pgvector and Sentence Transformers (all-MiniLM-L6-v2) for semantic search",
          "Containerized application with Docker and established CI/CD pipelines for Railway (backend) and Netlify (frontend)",
        ],
      },
      {
        title: "Director of Product",
        company: "SOULCHI, Global",
        period: "August 2025 – December 2025",
        description: [
          "Led cross-functional team building AI-driven wellness platform",
          "Orchestrated design-to-development handoffs, increasing delivery efficiency by 50% through improved component specs, ticket structure, and review workflows",
          "Built executive-ready demos using React, TypeScript, Vite, and Tailwind to validate technical feasibility and stakeholder alignment",
          "Integrated React Router for single-page application navigation",
          "Developed native mobile applications for iOS and Android using Capacitor",
          "Architected client-side state management using React Hooks and localStorage persistence",
        ],
      },
      {
        title: "Senior Product and Experience Consultant",
        company: "Powerley Inc., Detroit, MI",
        period: "January 2025 – August 2025",
        description: [
          "Led definition of new client-facing programs and supporting operational processes",
          "Used qualitative and quantitative research to improve communication clarity, UX flows, and stakeholder alignment",
          "Facilitated feedback and usability sessions to validate new features and drive adoption",
          "Developed technical documentation and training assets to support change management",
          "Built demos and POCs using React/TypeScript, Tailwind, Supabase, Python, and OpenAI integration",
        ],
      },
      {
        title: "Independent Consultant",
        company: "Melkonian Industries",
        period: "November 2024 – January 2025",
        description: [
          "Advised small businesses on operational and digital workflow improvements, emphasizing tooling, automation, and simple tech stacks",
          "Implemented lightweight process and system enhancements to improve efficiency, data consistency, and reporting",
          "Delivered assessments and recommendations on accessibility, content structure, and internal systems",
          "Provided training and coaching to improve tool adoption and self-sufficiency",
          "Built RAG application for materials inventory with full-stack architecture",
          "Frontend: React, TypeScript deployed on Netlify",
          "Backend: Python, FastAPI deployed on Railway with Docker containerization",
          "AI/ML: RAG, Sentence Transformers, pgvector for semantic search and embeddings",
          "LLM Integration: OpenAI, Anthropic, Groq, and Ollam APIs",
          "Database: PostgreSQL with Supabase, pgvector extension for vector storage",
          "Web Scraping: Playwright, BeautifulSoup4, PyPDF2, and LangChain for data extraction",
          "Integration: RESTful APIs, Supabase Edge Functions (Deno), and n8n for workflow automation",
        ],
      },
      {
        title: "Principal Experience Lead",
        company: "Propio Language Services Inc., Overland Park, KS",
        period: "July 2023 – November 2024",
        description: [
          "Directed UX and accessibility initiatives for enterprise language and communication platforms, improving compliance and end-user satisfaction",
          "Facilitated collaboration between product, engineering, and operations to refine workflows and service delivery",
          "Created reusable UX patterns, documentation, and training to scale design across distributed teams",
          "Partnered with leadership to ensure UX investments aligned with roadmap priorities and measurable outcomes",
          "Created POC for platform revamp using React 18 + TypeScript + Vite, Tailwind CSS",
          "Implemented WebRTC for peer-to-peer video calls with Socket.io signaling server (Express.js)",
          "Integrated OpenAI GPT-3.5-turbo API for real-time text translation between 10 languages",
          "Leveraged Web Speech API for voice input recognition and text-to-speech",
        ],
      },
      {
        title: "Senior Operations and Experience Lead",
        company: "Dewpoint Inc., Lansing, MI",
        period: "May 2016 – July 2023",
        description: [
          "Established enterprise-wide standards for processes, workflows, and digital experience delivery",
          "Advised on methodology, tooling, and strategy to align UX, engineering, and business objectives",
          "Assessed processes and operations to identify opportunities for automation and system improvements",
          "Mentored team members and supported hiring to strengthen UX, product, and technical capabilities",
        ],
      },
      {
        title: "Manager of Application Delivery",
        company: "Meridian Health Plan, Detroit, MI",
        period: "June 2015 – May 2016",
        description: [
          "Managed team of 20 across 3 continents in regulated healthcare environment",
          "Defined and implemented delivery discipline across product and engineering teams",
          "Conducted research and analysis to guide program decisions and sequencing of technical work",
          "Introduced agile processes to increase throughput, visibility, and predictability",
          "Reported on technical and strategic progress to senior leadership and stakeholders",
        ],
      },
      {
        title: "Development Manager / Program Lead",
        company: "Optum and United Healthcare Group, Southfield, MI",
        period: "October 2012 – June 2015",
        description: [
          "Led teams of 30 across multi-site programs, focusing on operational excellence",
          "Consulted on large-scale initiatives to reduce inefficiencies and improve throughput",
          "Developed frameworks, guidelines, and standards that informed program delivery and tool usage",
          "Facilitated research and working sessions to shape strategy and process changes",
          "Recruited, trained, and developed team members to meet evolving operational and technical demands",
        ],
      },
    ],
  },

  skillsAndSoftware: {
    title: "Skills and Software",
    subtitle: "Skills and Software Used to Execute",
    categories: [
      {
        name: "User Experience (UX) Design",
        skills: [
          {
            skill: "Designing mobile and desktop interfaces for dashboards",
            software: ["Figma", "Useberry", "bolt.new", "X-Code"],
          },
          {
            skill: "Creating interactive prototypes",
            software: ["Figma", "bolt.new"],
          },
          {
            skill: "Building scalable design systems and reusable components",
            software: ["Figma", "Sketch", "HTML", "CSS"],
          },
          {
            skill: "Facilitating and analyzing user testing sessions",
            software: ["Useberry", "UserTesting", "Maze"],
          },

          {
            skill: "Synthesizing feedback to refine designs",
            software: ["Figma", "Useberry", "Perplexity", "ChatGPT", "Grok"],
          },
        ],
      },
      {
        name: "Digital Accessibility",
        skills: [
          {
            skill: "Conducting usability evaluations and heuristic analysis",
            software: ["Useberry", "Lighthouse", "aXe"],
          },
          {
            skill: "Conducting accessibility audits and remediation",
            software: ["Lighthouse", "aXe", "NVDA", "JAWS", "WAZE"],
          },
          {
            skill: "Ensuring ADA/Section 508/WCAG compliance",
            software: ["Lighthouse", "aXe"],
          },
          {
            skill:
              "Improving accessibility for applications (e.g., video call apps)",
            software: [
              "Lighthouse",
              "aXe",
              "screen readers",
              "keyboard navigation tools",
            ],
          },
          {
            skill: "Using AI-powered tools for accessibility validation",
            software: ["Perplexity", "ChatGPT", "Grok"],
          },
        ],
      },
      {
        name: "Front-End Development",
        skills: [
          {
            skill: "Developing dynamic websites and applications",
            software: [
              "React",
              "Next.js",
              "HTML",
              "CSS",
              "JavaScript",
              "TypeScript",
              "ColdFusion",
            ],
          },
          {
            skill: "Creating pattern libraries and frameworks",
            software: ["HTML", "CSS", "JavaScript", "TypeScript"],
          },

          {
            skill: "Integrating payment systems and inventory sync",
            software: ["Authorize.net", "coreSTORE", "WooCommerce"],
          },

          {
            skill: "Integrating email systems and automation",
            software: ["Email.js", "Auth0", "Mailchimp", "Contact Form 7"],
          },
        ],
      },
      {
        name: "Search Engine Optimization (SEO)",
        skills: [
          {
            skill: "Implementing SEO strategies and enhancements",
            software: ["AIOSEO", "SEOpress"],
          },
          {
            skill: "Conducting SEO analysis",
            software: ["Lighthouse", "AIOSEO", "SEOpress"],
          },
          {
            skill: "Using AI-powered SEO tools",
            software: ["AIOSEO", "SEOpress"],
          },
        ],
      },
      {
        name: "Technical Writing and Content Creation",
        skills: [
          {
            skill: "Writing technical documentation and user guides",
            software: ["SGML", "ArborText"],
          },
          {
            skill: "Creating service manuals and electronic signage guides",
            software: ["SGML", "ArborText"],
          },
          {
            skill: "Developing interactive training guides and help content",
            software: ["SGML", "HTML", "Confluence"],
          },
          {
            skill: "Using AI to edit and test user-facing language",
            software: ["Perplexity", "ChatGPT", "Grok"],
          },
        ],
      },
      {
        name: "AI and Automation",
        skills: [
          {
            skill: "Leveraging AI tools for research and feedback generation",
            software: ["Perplexity", "ChatGPT", "Grok", "Cursor"],
          },
          {
            skill: "Integrating AI chatbots into applications",
            software: ["WordPress", "Slack", "React"],
          },
          {
            skill: "Using Generative AI for actionable insights",
            software: ["Perplexity", "ChatGPT", "Grok"],
          },
          {
            skill: "Developing AI-powered features (e.g., live interpreter)",
            software: ["React", "Next.js"],
          },
        ],
      },
    ],
  },

  stories: {
    title: "Storytelling",
    subtitle: "My approach to problem solving and solution delivery.",
    items: [
      {
        title: "Selling Accessibility",
        subtitle: "Building an accessibility discipline",
        description: "",
        category: "UX Strategy",
        image: "/img/delta-story.png",
        content:
          "At Dewpoint Inc., I led efforts to embed accessibility into the foundation of our design and development practices. Initially, accessibility compliance was treated as a checklist item. I recognized the need for a more sustainable and integrated approach, especially as I supported enterprise clients like Delta Dental of Michigan.\n\nI began by conducting usability evaluations and accessibility audits across several of their internal applications. Through screen reader testing, keyboard navigation reviews, and WCAG/Section 508 audits, I identified critical barriers to access, particularly in areas involving form-heavy workflows and administrative tools.\n\nRather than only reporting issues, I built an accessibility support model that included reusable code snippets (HTML, CSS, JS/TS), component-level guidelines, and Figma pattern documentation. I worked closely with developers and business analysts to bake accessibility into the design system and into Agile sprints, ensuring each scrum team had a shared understanding of what accessible implementation looked like.\n\nI formalized these practices into enterprise-wide standards, which included ADA, WCAG, and Section 508 compliance. I created internal documentation and training workshops to scale adoption. I also integrated storytelling techniques into design prototypes, helping stakeholders visualize the impact of inclusive design and making accessibility a shared responsibility across design, development, and QA.\n\nAs a result, we shifted from reactive compliance to proactive inclusion, setting a scalable precedent for accessible design that aligned with business goals and regulatory requirements.",
        date: "2024",
        hasModal: true,
      },
      {
        title: "AI Interpretation",
        subtitle: "Researching, and designing an AI design feature",
        description: "",
        category: "AI Design",
        image: "/img/propio-story.png",
        content:
          "The integration of OpenAI into Propio's live transcription feature was driven by a commitment to improving interpretation quality, with the goal of enhancing accuracy and clarity amid growing user demands. Leadership recognized OpenAI's AI capabilities as an opportunity to elevate our offering and distinguish it in the market.\n\nThe business team envisioned a product that offered more than basic transcription. They aimed to include real-time language translation, customizable industry-specific vocabulary, and seamless integration with existing communication platforms. Their goal was to deliver a user-friendly and highly accurate solution that would increase adoption, address diverse client needs, and strengthen our competitive advantage.\n\nI led the UX effort, starting with user flows and wireframes, and continued by developing interactive prototypes to gather feedback from stakeholders and users. I then built a front-end prototype using React and TypeScript to demonstrate the user interface and highlight the potential of OpenAI integration.\n\nWe used Optimizely to run A/B tests and refine the design, collecting qualitative insights to ensure the interface was intuitive and the AI features were effective. I contributed from concept through production, with a focus on accessibility and scalability. The result was a seamless and impactful transcription tool that became a key business differentiator.",
        date: "2024",
        hasModal: true,
      },
      {
        title: "Design Management",
        subtitle:
          "Proposing and implementing new efficiencies and opportunities for a development and design organization",
        description: "",
        category: "Process Improvement",
        image: "/img/meridian-story.png",
        content:
          "At Meridian Health, I identified opportunities to streamline our development and design processes while creating new growth opportunities for the team. The organization was experiencing bottlenecks in project delivery and team members were looking for ways to expand their skills and responsibilities.\n\nI began by conducting a comprehensive analysis of our current workflows, identifying pain points in project handoffs, design reviews, and development cycles. I also surveyed team members to understand their career aspirations and areas where they wanted to grow.\n\nBased on my findings, I proposed several efficiency improvements including standardized design systems, automated testing protocols, and cross-functional training programs. I created detailed implementation plans that included timelines, resource requirements, and success metrics.\n\nI worked closely with leadership to gain buy-in and secure the necessary resources. I then led the implementation of these improvements, starting with the most impactful changes first. This included establishing a design system that reduced design-to-development handoff time by 40%, implementing automated testing that caught 60% more bugs before production, and creating mentorship programs that helped junior team members advance their careers.\n\nThe result was a more efficient, engaged team that delivered projects 25% faster while providing new growth opportunities for team members. Several team members were promoted to new roles, and the organization saw improved retention rates and higher job satisfaction scores.",
        date: "2024",
        hasModal: true,
      },
      {
        title: "Product Design Process",
        subtitle: "My approach to greenfield product design projects",
        description: "",
        category: "Design Process",
        image: "/img/tunnel-article.png",
        content:
          "For a greenfield project, ideally, I'd like to be in the earliest stage (\"furthest left\") possible. This gives us a way to absorb the concept, understand the reasoning, and provide insight as to how the design plan should begin.\n\nIn no particular order, I would want to know these things first:\nAudience / Client?\nWhat is the business goal?\nExpectations for initial deliverables (paper? static? clickable prototype?)\nHow much budget/time for user research?\nAre we delivering an MVP or fully baked product?\nDo we have a color palette from Marketing or otherwise? Same for fonts?\nWhich views are top priority?\nAre we focusing on mobile-first? Which form factor(s) best suits our targeted users?\n\nAssuming we get those details, we (Product and Design) then sit with an SME or BA to dive deeper into the details to share and synthesize all user data we've collected. If we have no user data, we research the client/audience to determine the best way in which to obtain meaningful feedback. The mechanism used to find those folks and test with them will vary depending on what we are trying to find out. I could write much more, but suffice it to say, we decide which quantitative / qualitative / behavioral / ethnographic / et al data we need and what technique(s) helps us best retrieve it.\n\nDesigners begin the persona and user journey mapping exercises, while others are wireframing concurrently beginning with a general site 'frame' and using general best practices and minimal detail. This can be done in Figma or elsewhere – as long as we can easily share and present the details.\n\nAt this point, we have enough to start fleshing out full pages and implementing colors and branding. The sooner we get this in front of decision makers and obtain signoff on the core structure, the sooner we can start propagating the look-and-feel to the rest of the app.\n\nFirst, we can focus on our building blocks, which essentially means creating base components and their variants. We can also declare our variables at this point. As this work is happening, we need to collect graphic assets, whether they be stock images or original, and we need to start writing copy.\n\nIn the spirit of getting something in front of the client sooner rather than later, I'd put half the designers on fleshing out full-page layouts with placeholders for content within the sections. And I would put the other half on building out cards or section elements and microinteractions. This not only allows stakeholders to see *something* with a fully structured page, even if there are placeholders or bare bone designs that are indicative of purpose. A page with colors and tasteful placeholders goes a long way in earning trust that progress is indeed being made.\n\nFrom there, as the design nears completion, I would begin a conversation with engineering to ensure the images and details provide enough context for them. I also want to find out the technical feasibility, and the timeframe in which they feel this can be executed within. After those discussions occur, we define the scope of that function or feature based on input from business, product, and development stakeholders.\n\nBy now, we'd like to have all design elements locked down and assembled into a master design system. Once the design is built and deployed, it's open to (welcomed) scrutiny so we can find more granular details and user behaviors in addition to overarching feedback.\n\nBased on what we've learned, we synthesize the data, and perform this exercise again, but now, with considerable progress and much more data about users and feasibility.",
        date: "2025",
        hasModal: true,
      },
      {
        title: "CMS Portfolio",
        subtitle:
          "Building a simple portfolio to be a multi-purpose career portal",
        description: "",
        category: "Portfolio Development",
        image: "/img/port-story.png",
        content:
          "What started as a simple portfolio site evolved into a comprehensive career portal that demonstrates both technical skills and content management capabilities. The journey began with a basic React/TypeScript application showcasing design work and career history.\n\nThe initial challenge was creating a portfolio that could adapt to different audiences and purposes. Rather than building separate sites for different use cases, I designed a single application with sophisticated content management capabilities. This approach allowed the same codebase to serve as a portfolio, writing platform, and demonstration of technical skills.\n\nThe technical implementation focused on creating a flexible content system. I built a comprehensive admin panel with granular visibility controls for all content types - articles, design work, lab projects, and testimonials. The system includes persistent storage with export/import functionality, session management, and backup/restore capabilities.\n\nKey features include a music player showcasing creative interests, a writing gallery with card-based layout for content management, and sophisticated storage system with migration capabilities. The admin panel allows real-time content management without requiring code changes, making it easy to update the portfolio for different opportunities.\n\nThe result is a portfolio that serves multiple purposes: it demonstrates technical skills through its implementation, showcases design work through its presentation, and provides a platform for sharing insights through articles and writing samples. The content management system itself becomes a demonstration of understanding user needs and creating efficient workflows.\n\nThis approach has proven valuable for career opportunities where technical skills, design thinking, and content management abilities are all relevant. The portfolio demonstrates not just what I've done, but how I think about solving problems and creating systems that scale.",
        date: "2025",
        hasModal: true,
      },
    ],
  },

  featuredWork: {
    title: "Featured Work",
    projects: [
      {
        title: "Major League Numbers and ChatMLB",
        description:
          "A comprehensive analytics platform for MLB, NHL, NBA, NFL statistics and a chatbot for sports data.",
        technologies: ["React", "TypeScript", "Data Visualization"],
        demo: "https://majorleaguenumbers.com",
        image: "/img/mln-featured.png",
      },
    ],
  },

  currentProjects: {
    title: "Lab",
    subtitle: "New design and development projects",
    projects: [
      {
        title: "Chatbots",
        description: "Interactive chatbot experiments",
        technologies: ["React", "OpenAI API", "Tailwind", "Node.js"],
        demo: "https://chatbot-samples.netlify.app/",
        image: "/img/ai-user-research.png",
      },

      {
        title: "Design Panes",
        description: "Design, designs, and designers.",
        technologies: ["React", "TypeScript", "Tailwind", "Figma API"],
        demo: "https://designpanes.com/",
        image: "/img/design-panes.png",
      },
      {
        title: "AI NUI",
        description: "Let's make the AI UI better.",
        technologies: ["React", "AI", "UI/UX", "Design Systems"],
        demo: "https://aiuinui.netlify.app/",
        image: "/img/ai-user-research.png",
      },
      {
        title: "HealthAware",
        description: "A health monitoring system.",
        technologies: ["React", "Health APIs", "IoT", "Real-time Data"],
        demo: "https://my-health-powerered-vehicle.netlify.app/",
        image: "/img/health-aware-animation.svg",
      },
      {
        title: "Major League Numbers",
        description: "Baseball analytics platform with AI-powered stats and insights.",
        technologies: ["React", "TypeScript", "Python", "AI"],
        demo: "https://majorleaguenumbers.com/",
        image: "/img/mln-logo.svg",
      },
      {
        title: "User Testing Config",
        description: "Configurable user testing.",
        technologies: ["React", "TypeScript", "Tailwind", "Testing APIs"],
        demo: "https://stupendous-paprenjak-06c1cc.netlify.app/",
        image: "/img/user-testing-config-animation.svg",
      },
      {
        title: "Configurable Multivariate Testing",
        description: "Configurable multivariate testing.",
        technologies: ["React", "TypeScript", "Tailwind"],
        demo: "https://multi-configs.netlify.app/",
        image: "/img/multivariate-testing-animation.svg",
      },
      {
        title: "MicroLearn",
        description:
          "Bite-sized micro-learning platform for continuous development.",
        technologies: ["React", "TypeScript", "Tailwind", "Vite"],
        demo: "https://small-learning.netlify.app/welcome",
        image: "/img/micro-learn-animation.svg",
      },
      {
        title: "RAG App",
        description: "RAG with Python and n8n.",
        technologies: ["Python", "n8n", "RAG", "AI"],
        demo: "https://rag-with-python-and-n8n.netlify.app/",
        image: "/img/rag-app-animation.svg",
      },
      {
        title: "Translate & Interpret",
        description: "Translation and interpretation services platform.",
        technologies: ["React", "TypeScript", "Tailwind"],
        demo: "https://translate-interpret.netlify.app/",
        image: "/img/translate-interpret-animation.svg",
      },
    ],
  },

  articles: {
    title: "Articles",
    subtitle: "As an English major, I found it natural to start writing these.",
    items: [
      {
        id: "manifest-development",
        title: "MANIFEST Development",
        description:
          "An artifact from a development approach I put together for building better software and, often more importantly, a better team.",
        url: "https://davemelk.substack.com/p/manifest-development-yes-its-an-acronym",
        content: `<h1>MANIFEST Development (Yes, it's an acronym)</h1>

<h2>An artifact from a development approach I put together for building better software and, often more importantly, a better team.</h2>

<p>As a younger developer, I went to quite a few tech conferences and traveled considerably. I noticed a common theme in many of these talks and conference events, and the theme is still relevant today. Boiled down to its essence - developers want to do a good job, but they also want to innovate. And the two are obviously not mutually exclusive.</p>

<p>Anyway, here is the aforementioned 'manifesto':</p>

<h2><strong>MANIFEST Development</strong></h2>

<h3><strong>M</strong>ake<br>
<strong>A</strong>ll<br>
<strong>N</strong>ecessary<br>
<strong>I</strong>nteractions<br>
<strong>F</strong>easible,<br>
<strong>E</strong>xtendable,<br>
<strong>S</strong>ignificant,<br>
<strong>T</strong>ruthful</h3>

<p>This document is intended to make you a better developer, and also potentially a better human being altogether.</p>

<p>If you work in the software development field, we'll just go ahead and assume you have the technical chops required to retain a job in this industry. But as we all know, not all developers are created equal. Technical prowess aside, some developers simply 'get it' more than others. These folks are usually courteous, attentive to details, cooperative, patient and great decision makers. We've seen people who fail miserably at this part of their job. Great coder, terrible teammate.</p>

<p>They won't ever be the great developer that they see themselves as today. If they can't surpass their inability to cooperate effectively with others, they will remain stagnant within the self-imposed ceiling they'll continue to hit.</p>

<p>This manifesto contains small chunks of advice we believe - if followed - will set you apart from the rest of the industry. It will endear you not only to your peers but also to your partners in the business, and the management at large. But ultimately it will fulfill YOU most. You can become a respected member of the community simply by your actions, decisions and ability to communicate effectively.</p>

<h2><strong>Technology Agnosticism</strong></h2>

<p>Balance open-mindedness with healthy skepticism. Trends in this field fade quickly.<br>
There isn't always a clear way to select a technology. The newest, shiniest product/framework/design pattern/methodology, etc. is not necessarily the right tool for the job. Or for your team. Or for your project. Or based upon the constraints within your infrastructure. Try them all, evaluate without emotion or bias, then make a choice based on which approach satisfies each one of your requirements.</p>

<h3><strong>Scalable Methods Of Practice</strong></h3>

<p>Treat the way you learn like the way you code. Build your knowledge based on not only the hands-on necessities to get code up and running, but also using high-level conceptual learning techniques. Be able to analyze the tool you have chosen or not only syntax, but for the overall methodology it employs. Have you seen this pattern before? Does it use best practice for all involved parties? This not only helps you understand this specific technology, but makes you better at choosing technologies in the future.</p>

<h3><strong>Patience In Decision</strong></h3>

<p>Be patient. In doing so, you will absolutely make better decisions. Don't mistake hastiness for a sense of urgency.</p>

<h2><strong>Quality-Focus</strong></h2>

<p>Don't hurry up to satisfy unrealistic deadlines. Plead your case to the teams to insist on producing the right measure of quality for all code you commit and deploy.</p>

<h3><strong>Testing and Diagnosis</strong></h3>

<p>Before you code, nail down what you will use to test. This includes tools, test cases, etc. This isn't optional. Test everything, everywhere. This will make you a better developer, guaranteed.</p>

<p>The most successful developers are often the ones who are able to diagnose code well. We aren't always able to start with a codebase we approve of and we almost always inherit code we would have done differently. Regardless, your ability to use skills and tools that aid you in diagnosing code will prove major dividends to you as not only a defect resolver, but as a reverse engineer when a situation calls for it.</p>

<h3><strong>Commitment To Process</strong></h3>

<p>Process does not exist to make your life more difficult. Process exists to ensure consistent, repeatable tasks get done as efficiently and effectively as necessary without having to improvise a new solution each time you conduct the same task. Process is the business equivalent to programming.</p>

<p>At a conference, I learned that at Etsy, they make each new developer change code and then deploy it to production as an exercise in testing their process. If the new developer fails at this, then Etsy concludes that their process isn't robust enough.</p>

<h2><strong>Perpetual Innovation</strong></h2>

<h3><strong>Fearless Coding</strong></h3>

<p>Do not be afraid. When you open your code editor, get ready to break rules and break functionality. The only way to get better is to break down, re-examine and re-build. Don't worry about status quo. Deadlines always need to be met, but don't sell yourself short on the amount of reckless productivity you can generate by being inquisitive, curious and intent on finding a better way.</p>

<h3><strong>Focus On The Next</strong></h3>

<p>Be the razor that cuts the bleeding edge. Define the bleeding edge. Don't sit around reading about people who theorize it. Do it. Make it. Stop sitting there and innovate.</p>

<h3><strong>Create The Future</strong></h3>

<p>The future has zero blueprints. Nobody can predict what is going to happen. It is incumbent upon you to thrust features and technology into people's lives that will inspire them about what is to come. We are today's manufacturing class. We create experiences and tools that help people live better lives.</p>

<h2><strong>Cooperation-Centric</strong></h2>

<p>I've seen many a developer meet failure because of a lack of ability to get along with partners on a project. There's no way you can bulldoze your ideas and opinions through a team of your peers and expect to succeed.</p>

<h3><strong>Constraint Cognizance</strong></h3>

<p>You will never have a job that doesn't have constraints. Resist every urge you have to complain about it. Read "The Obstacle Is The Way" by Ryan Holiday. He has great advice about re-envisioning your struggles and how to use them to your advantage.</p>

<h3><strong>Comfort Zone Re-Zoning</strong></h3>

<p>As uncomfortable as it is for many of us, you must speak to actual people, preferably in a conversational construct. We all probably enjoy this least, but this is what may ultimately serve you best.</p>

<p>Take a fresh approach to interacting with your peers and business partners. Concede that you are going to be more successful by discussing and learning about this project by having a better relationship with these folks. This is exactly how you get better at your job. You can't live your whole life under the headphones and in a bubble.</p>`,
        image: "/img/manifesto.png",
        date: "August 19, 2025",
        tags: ["Development", "Team Building", "Best Practices", "Leadership"],
      },
      {
        id: "mobile-web-seamless-experience",
        title: "Building for Mobile on Web: The Small Details That Matter",
        description:
          "How to create seamless mobile web experiences that feel native, even without the app wrapper.",
        url: "mobile-web-seamless-experience",
        content: `<h1>Building for Mobile on Web: The Small Details That Matter</h1>

<h2>The Mobile Web Paradox</h2>

<p>We've all been there. You're browsing a website on your phone, and something just feels... off. The buttons are too small, the text is hard to read, or the navigation requires too many taps. It's not broken, but it's not quite right either. This is the mobile web paradox: technically functional, but experientially frustrating.</p>

<p>The truth is, most websites are built for desktop first and then "made responsive." But true mobile web design isn't about making desktop layouts smaller - it's about reimagining the entire experience for touch, thumb navigation, and the unique constraints of mobile devices.</p>

<h2>Touch Targets: The 44px Rule</h2>

<p>Apple's Human Interface Guidelines established the 44px minimum touch target size for a reason. Your thumb isn't a mouse cursor. It's a blunt instrument that needs space to land accurately. When buttons are too small, users miss their targets, get frustrated, and abandon tasks.</p>

<p>But here's the thing: 44px isn't just about the button itself. It's about the entire touchable area. I've seen designs where the button text is 44px tall, but the actual clickable area is much smaller due to padding issues. Always test your touch targets on actual devices.</p>

<p>Pro tip: Use CSS to create invisible touch targets that extend beyond the visual button. This gives users a larger hit area without changing the visual design.</p>

<h2>Thumb Navigation: The Natural Way</h2>

<p>Look at how you hold your phone. Your thumb naturally arcs in a specific pattern - it's most comfortable reaching the bottom third of the screen and the sides. The top corners? That's a stretch. Literally.</p>

<p>This is why bottom navigation bars work so well on mobile. They put the most important actions where your thumb naturally rests. It's not just about convenience - it's about reducing cognitive load. When navigation feels natural, users don't have to think about how to get around.</p>

<p>I recently redesigned a mobile web app that had all navigation at the top. Users were constantly dropping their phones trying to reach the menu button. Moving the navigation to the bottom reduced user errors by 60% and increased task completion rates significantly.</p>

<h2>The Loading State Problem</h2>

<p>Mobile networks are unpredictable. Users switch between WiFi and cellular, move through dead zones, and experience varying connection speeds. Your loading states need to account for this reality.</p>

<p>Don't just show a spinner. Tell users what's happening. "Loading your profile..." is better than a generic loading indicator. Even better: show progress when possible. "Step 2 of 4: Processing payment..." gives users a sense of forward momentum.</p>

<p>And please, for the love of all things good, don't show a loading spinner for more than 3 seconds without additional context. Users will think your app is broken and leave.</p>

<h2>Form Design: The Mobile Challenge</h2>

<p>Forms are where mobile web experiences often fall apart. Tiny input fields, cramped layouts, and keyboard issues make users want to throw their phones.</p>

<p>Here's what works: large input fields (at least 44px tall), clear labels, and smart keyboard types. If you're asking for an email, set the input type to "email" so the keyboard shows the @ symbol. For phone numbers, use "tel" to show the numeric keypad.</p>

<p>Auto-focus the first field when the form loads, but be careful about auto-advancing between fields. Some users need time to review what they've entered. Let them control the flow.</p>

<h2>The Scroll Experience</h2>

<p>Mobile users scroll differently than desktop users. They use momentum scrolling, expect smooth animations, and are sensitive to janky performance. A 60fps scroll experience isn't just nice - it's expected.</p>

<p>But here's the real issue: infinite scroll on mobile can be a nightmare. Users lose their place, can't find content they saw earlier, and get frustrated when they accidentally trigger new content loads.</p>

<p>Consider pagination or "load more" buttons instead. Give users control over when new content loads. And always provide a way to get back to the top quickly - a floating "back to top" button or pull-to-refresh functionality.</p>

<h2>Visual Hierarchy: Less is More</h2>

<p>Mobile screens are small. Really small. Every pixel counts. When you try to cram too much information onto a mobile screen, everything becomes noise.</p>

<p>Use progressive disclosure. Show the most important information first, then let users tap to see more details. Card-based layouts work well because they create natural content boundaries.</p>

<p>Typography is crucial. Use larger font sizes than you think you need. 16px is the minimum for body text on mobile. And please, don't use light gray text on white backgrounds. It's unreadable in sunlight.</p>

<h2>The Keyboard Problem</h2>

<p>When the keyboard appears, it covers up to 50% of the screen. Your carefully designed layout suddenly becomes unusable. This is a common mobile web failure point.</p>

<p>Solutions: Use viewport units that account for the keyboard, implement smart scrolling that keeps the active input visible, and consider using fixed positioning for important actions when the keyboard is open.</p>

<p>Test your forms with the keyboard open. You'd be surprised how many designs break when the virtual keyboard appears.</p>

<h2>Performance: The Silent Killer</h2>

<p>Mobile users are impatient. They expect pages to load in under 3 seconds. After 5 seconds, you've lost 90% of your users. Performance isn't just about speed - it's about user retention.</p>

<p>Optimize images, minimize JavaScript, and use lazy loading. But most importantly, measure performance on actual devices, not just desktop browsers. Mobile performance is a different beast entirely.</p>

<p>Consider using service workers for offline functionality. Even a simple "you're offline" message is better than a broken page.</p>

<h2>The Small Details That Matter</h2>

<p>It's the small details that separate good mobile web experiences from great ones:</p>

<ul>
<li><strong>Pull-to-refresh:</strong> Users expect it. Implement it consistently.</li>
<li><strong>Haptic feedback:</strong> Subtle vibrations for button presses feel native.</li>
<li><strong>Status bar styling:</strong> Match your app's theme to the device status bar.</li>
<li><strong>Safe areas:</strong> Account for notches and home indicators.</li>
<li><strong>Orientation changes:</strong> Handle landscape mode gracefully.</li>
</ul>

<p>These aren't just nice-to-haves. They're the difference between a website that works on mobile and a mobile web experience that feels native.</p>

<h2>Testing: The Reality Check</h2>

<p>You can't design for mobile without testing on mobile. Period. Desktop browser testing isn't enough. You need to test on actual devices with real fingers and real network conditions.</p>

<p>Test on different screen sizes, different operating systems, and different network speeds. Test with one hand, test while walking, test in bright sunlight. Test everything that could go wrong.</p>

<p>And don't just test functionality - test the emotional experience. Does it feel good to use? Does it make users want to come back?</p>

<h2>The Bottom Line</h2>

<p>Building great mobile web experiences isn't about making desktop websites smaller. It's about understanding the unique constraints and opportunities of mobile devices and designing specifically for them.</p>

<p>The small details matter. The 44px touch targets, the bottom navigation, the loading states, the keyboard handling - these aren't just technical requirements. They're the difference between a frustrating experience and a seamless one.</p>

<p>Mobile web users deserve better than responsive design. They deserve mobile-first design that understands their needs, their behaviors, and their constraints. When you get it right, the result is an experience that feels so natural, users forget they're using a website instead of an app.</p>

<p>That's the goal: not just functional, but delightful. Not just responsive, but mobile-native.</p>

`,
        image: "/img/mobile-web-experience.png",
        date: "January 15, 2025",
        tags: [
          "Mobile Design",
          "UX Design",
          "Web Development",
          "User Experience",
        ],
      },
      {
        id: "ux-business-financial-implications",
        title: "When Good UX Isn't Good Business",
        description:
          "Why UX professionals need to understand the financial implications of their design decisions.",
        url: "when-good-ux-isnt-good-business",
        content: `<h1>When Good UX Isn't Good Business</h1>

<h2>The UX Professional's Blind Spot</h2>

<p>We UX professionals are trained to think about user needs, accessibility, and intuitive interactions. We pride ourselves on creating experiences that feel natural and helpful. But there's a critical gap in our education and practice: we rarely consider the financial implications of our design decisions.</p>

<p>Here's the uncomfortable truth: sometimes what feels like "good UX" to us isn't actually good for the business. And when we don't understand the financial impact of our decisions, we're not serving our users as well as we think we are.</p>

<h2>The Hidden Costs of "Intuitive" Design</h2>

<p>Consider a common scenario: you design a checkout flow that's so streamlined, users can complete a purchase in three clicks. It feels great, it's accessible, it follows all the UX best practices. But what if that streamlined flow actually reduces the average order value by 15%?</p>

<p>Or take another example: you create a beautiful, distraction-free reading experience that removes all navigation elements. Users can focus entirely on the content. But what if that same design reduces page views by 30% and cuts ad revenue in half?</p>

<p>These aren't hypothetical situations - they're real trade-offs that happen every day in product design. The problem is that most UX professionals don't have the data or the financial literacy to understand these implications.</p>

<h2>Why Traditional UX Thinking Falls Short</h2>

<p>Our traditional UX education teaches us to optimize for user satisfaction, task completion, and accessibility. These are all important, but they're not the whole picture. We're missing a crucial piece: understanding how our design decisions impact the business metrics that keep the product alive.</p>

<p>When we design without considering financial implications, we're essentially working in a vacuum. We might create the most beautiful, accessible interface in the world, but if it doesn't support the business model, it won't last long enough to help anyone.</p>

<p>Think about it: if your product can't sustain itself financially, it won't exist to serve users at all. The most user-friendly design in the world is worthless if the company goes out of business.</p>

<h2>The Financial Literacy Gap</h2>

<p>Most UX professionals don't have a background in business or finance. We don't understand concepts like customer lifetime value, conversion rates, or revenue per user. We don't know how to read a P&L statement or understand what metrics actually matter to the business.</p>

<p>This gap creates a dangerous disconnect. We make design decisions based on what feels right, while the business makes decisions based on what drives revenue. When these two perspectives don't align, everyone loses.</p>

<p>The solution isn't to abandon user-centered design principles. It's to expand our understanding to include business metrics alongside user metrics. We need to become bilingual - fluent in both UX and business language.</p>

<h2>When "Bad UX" Might Be Good Business</h2>

<p>Here's where it gets really uncomfortable: sometimes what we consider "bad UX" might actually be good for the business. A slightly longer checkout process might increase order value. A few more clicks might lead to better user education and higher satisfaction in the long run.</p>

<p>This doesn't mean we should abandon our principles and create intentionally frustrating experiences. It means we need to understand the full context of our decisions and find ways to balance user needs with business needs.</p>

<p>The key is to move beyond binary thinking. It's not "good UX vs. bad UX" - it's "what serves both the user and the business in the long term?"</p>

<h2>Building Financial Awareness</h2>

<p>So how do we bridge this gap? Start by asking questions:</p>

<ul>
<li>What are the key business metrics for this product?</li>
<li>How do our design decisions impact those metrics?</li>
<li>What's the cost of implementing this feature vs. the potential revenue impact?</li>
<li>Are we optimizing for short-term user satisfaction at the expense of long-term business health?</li>
</ul>

<p>Learn to speak the language of business. Understand basic financial concepts. Ask to see the data that drives business decisions. Collaborate with product managers and business analysts to understand the full picture.</p>

<p>Most importantly, recognize that serving users well means ensuring the product can continue to serve them. That requires understanding how your design decisions impact the business model.</p>

<h2>The Path Forward</h2>

<p>This isn't about selling out or abandoning user-centered design. It's about expanding our definition of what it means to serve users well. The best UX professionals understand that they're not just designing interfaces - they're designing business models.</p>

<p>When we understand the financial implications of our decisions, we can make better choices. We can design experiences that serve users while also supporting the business that makes those experiences possible.</p>

<p>It's time for UX professionals to become financially literate. Our users deserve nothing less.</p>

`,
        image: "/img/analytics-desktop.svg",
        date: "Draft - January 2025",
        tags: ["UX Design", "Business", "Product Strategy"],
      },
      {
        id: "seven-interviews-excessive",
        title: "Seven Interviews?",
        description: "Some folks say that's excessive.",
        url: "https://open.substack.com/pub/davemelk/p/seven-interviews?r=1jgk3k&utm_campaign=post&utm_medium=web",
        content: `<p>Read the full article on <a href="https://open.substack.com/pub/davemelk/p/seven-interviews?r=1jgk3k&utm_campaign=post&utm_medium=web" target="_blank" rel="noopener noreferrer">Substack</a>.</p>`,
        image: "/img/seven-interview-article.png",
        date: "June 7, 2024",
        tags: ["Career", "Hiring", "Workplace Culture"],
      },
      {
        id: "vibe-coding-vs-vibe-engineering",
        title: "Vibe Coding v Vibe Engineering",
        description: "Making things work right, not just feel right.",
        url: "https://open.substack.com/pub/davemelk/p/vibe-coding-v-vibe-engineering?r=1jgk3k&utm_campaign=post&utm_medium=web",
        content: `<p>Read the full article on <a href="https://open.substack.com/pub/davemelk/p/vibe-coding-v-vibe-engineering?r=1jgk3k&utm_campaign=post&utm_medium=web" target="_blank" rel="noopener noreferrer">Substack</a>.</p>`,
        image: "/img/vibe-engineering.png",
        date: "June 8, 2024",
        tags: ["UX Design", "Development", "Product Design"],
      },
      {
        id: "json-ai-prompts-obsessed",
        title:
          "I Just Heard About Using JSON for AI Prompts, and Now I Won't Shut Up About It",
        description: "Bots love structured data. Imagine that.",
        url: "https://davemelk.substack.com/p/i-just-heard-about-using-json-for",
        content: `<h1>I Heard About Using JSON for AI Prompts, and Now I'm Obsessed</h1>

<h2>The Discovery</h2>

<p>I was scrolling through a post when someone mentioned they were using JSON to structure their AI prompts. My first reaction was "wow, yes!". Soon after, I was absolutely furious that I hadn't thought of it first. And then I thought 'omg am I the only one who hasn't heard of this? Was I was wrong to be furious? Of course - I want to be the first to know about everything.'</p>

<p>That said, it's a simplisticly elegant and brilliant idea that is sitting right in front of my face.</p>

<p>See, me, I like to brain dump into that input box with little to no regard for spelling and punctuation. Now, instead of relying on my horribly-structured and poorly-punctuated typing, I copy my lazy prompt, then paste it into an LLM, and say 'make this JSON'. The resulting JSON proceeds to organize my pile of text into a cohesive structure.</p>

<h2>Why JSON Makes Sense</h2>

<p>Ask an AI to "create a login form," you're leaving a lot to interpretation. What validation rules should it include? What styling should it use? Should it have password requirements? What about error handling? You get my drift</p>

<p>But when you structure that same request as JSON, you can be explicit about every detail:</p>

<pre><code>{
  "request": "create_login_form",
  "requirements": {
    "validation": ["email_format", "password_strength"],
    "styling": "modern_minimal",
    "error_handling": "user_friendly",
    "accessibility": "wcag_aa_compliant"
  },
  "constraints": {
    "framework": "react",
    "styling": "tailwind_css"
  }
}</code></pre>

<h3>Breaking Down the Structure:</h3>

<h4>📋 Request Section</h4>
<p><strong>Purpose:</strong> Defines what you want the AI to create</p>
<pre><code>"request": "create_login_form"</code></pre>

<h4>✅ Requirements Section</h4>
<p><strong>Purpose:</strong> Specifies the features and behaviors you need</p>
<ul>
<li><strong>validation:</strong> What input validation rules to include</li>
<li><strong>styling:</strong> The visual design approach</li>
<li><strong>error_handling:</strong> How to handle and display errors</li>
<li><strong>accessibility:</strong> Compliance standards to follow</li>
</ul>

<h4>🔧 Constraints Section</h4>
<p><strong>Purpose:</strong> Defines technical limitations and preferences</p>
<ul>
<li><strong>framework:</strong> Which technology stack to use</li>
<li><strong>styling:</strong> Specific CSS framework or approach</li>
</ul>

<p>Suddenly, there's no ambiguity. Mr. LLM Search Engine knows exactly what you want, and you get more predictable outcomes.</p>

<p>Basically, just pick one common task you do and create a JSON structure for it. Maybe it's generating React components, or writing API documentation, or creating test cases. But I don't need to tell you that. You're smart. Do whatever you want with it. But you have to admit, it's kinda awesome. I'm very glad that I thought of it first. What?</p>
`,
        image: "/img/JSON.png",
        date: "January 20, 2025",
        tags: ["AI", "JSON", "Development", "Productivity"],
      },
      {
        id: "ai-hallucination-prevention",
        title: "AI Hallucination Prevention",
        description:
          "How to spot, handle, and stop the AI needle from skipping.",
        url: "ai-hallucination-prevention",
        content: `
<h2>The AI Confidence Trap</h2>

<p>When your AI assistant sounds super confident about something, but you're pretty sure it's making it up - that's a hallucination. It's when AI confidently presents false information as fact. It's like that friend who always has an answer, even when they're completely wrong.</p>

<p>When you catch an AI hallucinating, call it out directly: "I think you might be hallucinating here." Ask for sources or citations, break the problem into smaller pieces, give it more context. If all else fails, start fresh with a new conversation.</p>

<h2>The Practical Guide</h2>

<p>The best way to prevent hallucinations is to be specific about what you need, provide relevant context, ask for step-by-step reasoning, request sources or citations upfront, and use follow-up questions to verify information.</p>

<p>Remember, it's not just what you ask - it's how you ask it. Telling AI to "create a login form" might get you something that looks right but doesn't actually work. Instead, try "create a login form with email validation, password requirements, and error handling for invalid credentials." The more specific your request, the less room there is for the AI to fill in the gaps with made-up details. It's like the difference between asking someone to "make it look nice" versus "use a 16px font size with 1.5 line height and 24px margins."</p>

<p>Here's a hard truth: even when AI gives you exactly what you asked for, you still need to test it. Every time. I've seen AI-generated code that looked perfect but broke existing functionality. That's why regression testing is non-negotiable - especially when working with AI. It's not about distrusting the AI; it's about respecting the complexity of the systems we're building.</p>

<p>One of the trickiest parts of working with AI is knowing when to be specific and when to be vague. Need a specific implementation? Be precise with your requirements. Looking for creative solutions? Leave some room for the AI to surprise you. It's like the difference between asking for "a blue button" versus "something that draws attention to this action." Sometimes the AI's interpretation is better than what you had in mind.</p>

<p>Here's something I've learned the hard way: multi-step changes are risky. When you ask AI to make several changes at once, it's like playing a game of telephone - each step can introduce new errors or misunderstandings. Instead, break complex changes into single, focused steps. Test each step before moving to the next. It might feel slower, but it's much faster than fixing a cascade of issues later.</p>

<h2>Moving Forward</h2>

<p>Hallucinations aren't going away anytime soon. They're part of how these models work. The key is to develop a healthy skepticism and know how to work around them. <strong>THINK</strong> of it like proofreading - you don't trust spell check completely, you use it as a tool.</p>

`,
        image: "/img/ai-hallucination.png",
        cardImage: "/img/lebow-ball.png",
        date: "May 30, 2024",
        tags: ["AI", "Productivity", "Best Practices"],
      },
      {
        id: "bolt-new-rapid-prototyping",
        title: "Bolt.new: The Leader in the Clubhouse",
        description:
          "Bolt.new and its ecosystem is killing it in the AI-assisted development and design space.",
        url: "bolt-new-rapid-prototyping",
        content: `<h1>Bolt.new: Leader in the Rapid Prototyping Clubhouse</h1>

<h2>The Speed of Thought</h2>

<p>When you have a great idea, but getting it into something you can actually show people takes forever - bolt.new is like having a superpower for turning ideas into real things, fast.</p>

<p>The interface is slick, everything moves smoothly, and it looks good while being quick. Sure, it can get a bit sluggish when you're pushing it hard - we're talking about AI here - but that's a small price to pay for what it gives you in return.</p>

<h2>The Real Magic</h2>

<p>The best part about bolt.new isn't the tech - it's how it changes the way you talk about ideas. Instead of trying to explain what you're thinking, you can just show it. That changes everything about how you get feedback and make things better.</p>

<h2>Looking Forward</h2>

<p>Tools like bolt.new aren't just about speed - they're about making better stuff. When you can focus on solving problems instead of fighting with your tools, that's when the real magic happens.</p>

<p>And the best part? This is just the start. As bolt.new keeps getting better, we're seeing a future where the line between design and development gets blurrier - and that's exactly what we need.</p>

`,
        image: "/img/bolt-new.png",
        cardImage: "/img/bolt-new.png",
        date: "June 1, 2024",
        tags: ["Design Tools", "Prototyping", "UX Design"],
      },
      {
        id: "information-architecture-not-sacred",
        title: "Information Architecture Is Not Sacred",
        description: "Your IA should evolve with your users, not remain rigid.",
        url: "https://davemelk.substack.com/p/information-architecture-not-sacred",
        content: `<p>Read the full article on <a href="https://davemelk.substack.com/p/information-architecture-not-sacred" target="_blank" rel="noopener noreferrer">Substack</a>.</p>`,
        image: "/img/ia-flexible.png",
        tags: ["Information Architecture", "UX Design", "User Experience"],
        date: "March 19, 2024",
      },

      {
        id: "negotiating-with-your-co-pilot",
        title: "Negotiating With Your Co-Pilot",
        description:
          "Make an agreement on shared language with the fountain of eternal hallucination, aka your AI co-pilot.",
        url: "https://davemelk.substack.com/p/negotiating-with-your-co-pilot",
        content: `<h1>Negotiating With Your Co-Pilot</h1>

<h2>The Language Barrier</h2>

<p>Working with AI is like having a brilliant but sometimes confused co-worker who speaks a different dialect. You might both be speaking English, but you're using different words for the same things. This creates a communication gap that leads to misunderstandings, wasted time, and yes, those infamous AI hallucinations.</p>

<p>The solution isn't to dumb down your requests or accept mediocre results. It's to establish a shared vocabulary - a common language that both you and your AI co-pilot understand clearly.</p>

<h2>Why Shared Language Matters</h2>

<p>When you say "card" and your AI thinks you mean "content container with defined boundaries, shadows, and padding," you're setting yourself up for confusion. But when you both agree that a card is a "card," communication becomes crystal clear.</p>

<p>This isn't just about avoiding misunderstandings. Shared language creates efficiency. You spend less time explaining what you want and more time getting what you need. Your AI co-pilot becomes more predictable, more reliable, and more useful.</p>

<h2>Creating Your Shared Vocabulary</h2>

<p>Start by documenting the terms you use for common elements. In your design system, you have cards, buttons, modals, sections, and more. These aren't just UI components - they're the building blocks of your shared language.</p>

<p>Create a glossary that both you and your AI can reference. When you say "add a card here," your AI should know exactly what that means. No more guessing games or interpretation errors.</p>

<h2>The Hallucination Prevention Protocol</h2>

<p>AI hallucinations often happen when there's ambiguity in language. When you're vague about what you want, the AI fills in the gaps with assumptions. Sometimes these assumptions are helpful, but often they're wrong.</p>

<p>By establishing clear, shared terminology, you reduce the room for interpretation. A button is a button, not a "clickable element that triggers an action." A modal is a modal, not an "overlay dialog that appears above the main content."</p>

<h2>Negotiating the Terms</h2>

<p>This is a two-way conversation. Your AI might suggest alternative terms that are more precise or more commonly understood. Be open to these suggestions, but also be clear about your preferences.</p>

<p>If you've always called something a "card," there's no need to change that just because your AI suggests "content container." But if your AI points out that "modal" is more specific than "popup," that might be worth considering.</p>

<h2>Testing Your Shared Language</h2>

<p>Once you've established your vocabulary, test it. Ask your AI to create a card, then ask it to create a content container. If you get different results, you know your language isn't aligned yet.</p>

<p>Keep refining until you're both speaking the same language. This might take a few iterations, but the payoff is worth it.</p>

<h2>The Long-Term Benefits</h2>

<p>With shared language comes better collaboration. Your AI becomes more like a true co-pilot - someone who understands your workflow, your preferences, and your terminology.</p>

<p>You'll spend less time explaining and more time creating. Your AI will generate more accurate, more useful results. And most importantly, you'll reduce the frustration that comes from miscommunication.</p>

<h2>Making the Agreement</h2>

<p>So here's the deal: establish your shared vocabulary, document it clearly, and stick to it. Use the same terms consistently in your requests, and expect your AI to understand them.</p>

<p>This isn't about limiting creativity or flexibility. It's about creating a foundation for better collaboration. When you and your AI co-pilot speak the same language, you can focus on the important stuff - building great experiences for your users.</p>

<p>Remember, this is a negotiation, not a dictatorship. Be clear about your needs, listen to your AI's suggestions, and find common ground. The result will be a more productive, more enjoyable partnership with your digital co-pilot.</p>`,
        image: "/img/negotiate-tall.png",
        date: "January 20, 2025",
        tags: ["AI", "Communication", "Productivity", "Design Systems"],
      },

      {
        id: "five-design-genres",
        title: "The Five Design Genres",
        description: "I have defined the five design genres.",
        url: "https://open.substack.com/pub/davemelk/p/the-five-design-genres?r=1jgk3k&utm_campaign=post&utm_medium=web",
        content: `<p>Read the full article on <a href="https://open.substack.com/pub/davemelk/p/the-five-design-genres?r=1jgk3k&utm_campaign=post&utm_medium=web" target="_blank" rel="noopener noreferrer">Substack</a>.</p>`,
        image: "/img/genres-article.png",
        cardImage: "/img/genres-article.png",
        date: "June 15, 2024",
        tags: ["Design", "UX Design", "User Experience", "Design Systems"],
      },
      {
        id: "api-tokens-digital-arcade",
        title: "API Tokens: The Digital Arcade",
        description:
          "How the concept of tokens in modern API usage echoes the arcade culture of the 1980s.",
        url: "https://open.substack.com/pub/davemelk/p/api-tokens-the-digital-arcade?r=1jgk3k&utm_campaign=post&utm_medium=web",
        content: `<p>Read the full article on <a href="https://open.substack.com/pub/davemelk/p/api-tokens-the-digital-arcade?r=1jgk3k&utm_campaign=post&utm_medium=web" target="_blank" rel="noopener noreferrer">Substack</a>.</p>`,
        image: "/img/tokens.png",
        date: "June 14, 2024",
        tags: ["Development", "API Design", "User Experience"],
      },
      {
        id: "five-design-anti-patterns",
        title: "The 5 Design Anti-Patterns",
        description:
          "Accidental and intentional anti-patterns that make users insane.",
        url: "https://open.substack.com/pub/davemelk/p/the-5-design-anti-patterns?r=1jgk3k&utm_campaign=post&utm_medium=web",
        content: `<p>Read the full article on <a href="https://open.substack.com/pub/davemelk/p/the-5-design-anti-patterns?r=1jgk3k&utm_campaign=post&utm_medium=web" target="_blank" rel="noopener noreferrer">Substack</a>.</p>`,
        image: "/img/anti-patterns.png",
        date: "June 10, 2024",
        tags: ["UX Design", "User Experience", "Design Patterns"],
      },
      {
        id: "commit-message-fatigue",
        title: "Commit Message Fatigue",
        description: "Do this and never write another one again 💎💎",
        url: "https://davemelk.substack.com/p/commit-message-fatigue",
        content: `<p>Read the full article on <a href="https://davemelk.substack.com/p/commit-message-fatigue" target="_blank" rel="noopener noreferrer">Substack</a>.</p>`,
        image: "/img/commit-fatigue.png",
        date: "June 11, 2024",
        tags: ["Git", "Development", "Best Practices", "Productivity"],
      },
      {
        id: "ai-hydrated-user-research",
        title: "AI is hydrated with user research data",
        description:
          "How every interaction with an LLM is training data that makes it smarter.",
        url: "https://davemelk.substack.com/p/ai-hydrated-user-research",
        content: `<p>Read the full article on <a href="https://davemelk.substack.com/p/ai-hydrated-user-research" target="_blank" rel="noopener noreferrer">Substack</a>.</p>`,
        image: "/img/ai-user-research.png",
        cardImage: "/img/ai-hydrated.png",
        date: "June 19, 2024",
        tags: [
          "AI",
          "User Experience",
          "Machine Learning",
          "Product Development",
        ],
      },

      {
        id: "prompts-prompt-structure-heuristic-evaluations",
        title: "Prompting for Heuristic Evaluations",
        description:
          "How to structure AI prompts to conduct effective, comprehensive UI heuristic evaluations.",
        url: "https://davemelk.substack.com/p/prompts-prompt-structure-heuristic-evaluations",
        content: `<p>Read the full article on <a href="https://davemelk.substack.com/p/prompts-prompt-structure-heuristic-evaluations" target="_blank" rel="noopener noreferrer">Substack</a>.</p>`,
        image: "/img/user-testing.png",
        date: "June 20, 2024",
        tags: ["AI", "UX Design", "User Testing", "Prompt Engineering"],
      },
      {
        id: "ai-prompts-rolling-dice",
        title: "AI Prompts and the Art of Rolling the Dice",
        description:
          "Why sometimes the best AI results come from unexpected prompts, not perfect planning.",
        url: "https://open.substack.com/pub/davemelk/p/ai-prompts-and-the-art-of-rolling?r=1jgk3k&utm_campaign=post&utm_medium=web&showWelcomeOnShare=false",
        content: `<p>Read the full article on <a href="https://open.substack.com/pub/davemelk/p/ai-prompts-and-the-art-of-rolling?r=1jgk3k&utm_campaign=post&utm_medium=web&showWelcomeOnShare=false" target="_blank" rel="noopener noreferrer">Substack</a>.</p>`,
        image: "/img/overthink-prompts.png",
        cardImage: "/img/overthink-prompts.png",
        date: "January 15, 2025",
        tags: ["AI", "Prompt Engineering", "Creativity", "Productivity"],
      },

      {
        id: "cultivating-development-growth",
        title: "Cultivating Development Growth",
        description:
          "Strategies for still delivering with shrinking software engineering teams.",
        url: "https://open.substack.com/pub/davemelk/p/cultivating-development-growth-in?r=1jgk3k&utm_campaign=post&utm_medium=web&showWelcomeOnShare=false",
        content: `
<h2>Cultivating Development Growth</h2>

<p>Building a culture of continuous learning and growth within development teams is essential for long-term success. This article explores practical strategies for fostering professional development in software engineering environments.</p>

<h3>Key Areas Covered</h3>

<ul>
<li>Creating learning opportunities within the team</li>
<li>Mentorship and knowledge sharing programs</li>
<li>Encouraging experimentation and innovation</li>
<li>Building a growth mindset culture</li>
<li>Measuring and tracking development progress</li>
</ul>

<p>Read the full article on <a href="https://open.substack.com/pub/davemelk/p/cultivating-development-growth-in?r=1jgk3k&utm_campaign=post&utm_medium=web&showWelcomeOnShare=false" target="_blank" rel="noopener noreferrer">Substack</a>.</p>
`,
        image: "/img/dev-mgr.png",
        cardImage: "/img/dev-mgr.png",
        date: "January 20, 2025",
        tags: ["Development", "Team Building", "Leadership", "Growth"],
      },
    ],
  },

  designSystem: {
    title: "Design System",
    subtitle: "Component library and design tokens.",
    backToSite: "Back to Site",
    storageNotAvailable: "Storage not available.",
    sections: {
      colors: "Colors",
      typography: "Typography",
      buttons: "Buttons",
      cards: "Cards",
      icons: "Icons",
      spacing: "Spacing",
    },
    colorLabels: [
      { label: "Primary" },
      { label: "Secondary" },
      { label: "Gray 100" },
      { label: "Gray 200" },
      { label: "Gray 600" },
      { label: "Gray 900" },
    ],
    // Add more as needed
  },
} as const;

// Side-effect guard: ensure this module is not tree-shaken away
// This statement creates a side effect that prevents the module from being removed
// The content object must be preserved for the application to function
export default content;
