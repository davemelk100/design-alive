import usePageMeta from "../hooks/usePageMeta";

export default function Terms() {
  usePageMeta({
    title: "Terms & Conditions | Themal",
    description:
      "Themal's terms and conditions. Covers service description, accounts, free and premium plans, intellectual property, acceptable use, and PR integration.",
  });

  return (
    <div className="flex-1 flex flex-col bg-page">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-light mb-2 text-fg">
          Themal's Terms &amp; Conditions
        </h1>
        <p className="text-sm mb-8 text-muted">
          Last updated: March 3, 2026
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-fg">
          <section>
            <h2 className="text-xl font-medium mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using Themal ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">2. Description of Service</h2>
            <p>Themal is an interactive design system editor that allows you to customize colors, typography, card styles, alerts, buttons, and interaction states for your web applications. The Service generates CSS custom properties that can be exported and integrated into your projects.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">3. Accounts</h2>
            <p>Some features require creating an account through our authentication provider, Clerk. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">4. Free and Premium Plans</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Free plan:</strong> Core design system editing features including color selection, card styling, typography, and alerts are available at no cost.</li>
              <li><strong>Premium plan:</strong> Additional features such as interaction state controls, harmony color schemes, image palette extraction, undo history, and pull request integration require an active paid subscription.</li>
            </ul>
            <p className="mt-2">Premium subscriptions are billed through Stripe. You may cancel your subscription at any time, and you will retain access to premium features until the end of your current billing period.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">5. Intellectual Property</h2>
            <p>The CSS output and design configurations you create using Themal are yours. You retain full ownership of any design systems, color palettes, and styles you generate.</p>
            <p className="mt-2">The Themal application, including its source code, design, and branding, is the intellectual property of Melkonian Industries and is protected by applicable copyright laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Use the Service to generate content that is illegal or harmful</li>
              <li>Attempt to gain unauthorized access to other users' accounts</li>
              <li>Use automated tools to scrape or overload the Service</li>
              <li>Resell access to the Service without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">7. Pull Request Integration</h2>
            <p>The PR integration feature submits design changes to your configured GitHub repository. By using this feature, you authorize Themal to create pull requests on your behalf using the credentials and repository information you provide. You are responsible for reviewing all pull requests before merging.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">8. Disclaimer of Warranties</h2>
            <p>The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Melkonian Industries shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">10. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the updated terms. We will notify registered users of material changes via email.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">11. Contact</h2>
            <p>For questions about these terms, please contact us at <a href="mailto:legal@themalive.com" className="text-sm underline hover:opacity-70">legal@themalive.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
