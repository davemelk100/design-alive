import usePageMeta from "../hooks/usePageMeta";

export default function CookiesPolicy() {
  usePageMeta({
    title: "Cookies Policy | Themal",
    description:
      "Themal's cookies policy. We use localStorage for design preferences. Third-party cookies from Clerk (auth), Stripe (payments), and Google Fonts (typography).",
  });

  return (
    <div className="flex-1 flex flex-col bg-page">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-light mb-2 text-fg">
          Themal's Cookies Policy
        </h1>
        <p className="text-sm mb-8 text-muted-foreground">
          Last updated: March 3, 2026
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-fg">
          <section>
            <h2 className="text-xl font-medium mb-2">What Are Cookies</h2>
            <p>Cookies are small text files stored on your device by your web browser. They are used to remember preferences, maintain sessions, and provide analytics about how services are used.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">How We Use Cookies</h2>
            <p>Themal itself does not set first-party cookies. We use <strong>localStorage</strong> to store your design preferences (theme, colors, typography settings) locally in your browser. This data never leaves your device unless you explicitly initiate an action like creating a pull request.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">Third-Party Cookies</h2>
            <p>Our third-party service providers may set cookies on your device:</p>

            <div className="mt-4 rounded-lg border overflow-hidden border-theme">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted-surface">
                    <th className="px-4 py-2 font-medium">Provider</th>
                    <th className="px-4 py-2 font-medium">Purpose</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-theme">
                    <td className="px-4 py-2">Clerk</td>
                    <td className="px-4 py-2">Authentication &amp; session management. Maintains your sign-in state across page loads.</td>
                    <td className="px-4 py-2">Essential</td>
                  </tr>
                  <tr className="border-t border-theme">
                    <td className="px-4 py-2">Stripe</td>
                    <td className="px-4 py-2">Payment processing &amp; fraud prevention. Set during checkout flows.</td>
                    <td className="px-4 py-2">Essential</td>
                  </tr>
                  <tr className="border-t border-theme">
                    <td className="px-4 py-2">Google Fonts</td>
                    <td className="px-4 py-2">Font delivery for typography previews. May set cookies for CDN optimization.</td>
                    <td className="px-4 py-2">Functional</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">Managing Cookies</h2>
            <p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>View what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block all cookies</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
            <p className="mt-2">Please note that blocking essential cookies (Clerk) will prevent you from signing in and using premium features.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">Local Storage</h2>
            <p>In addition to cookies, we use browser localStorage to persist your design system preferences (color theme, typography choices, card styles, etc.). This data is stored entirely on your device and is not transmitted to our servers. You can clear this data at any time through your browser's developer tools or site settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">Contact</h2>
            <p>If you have questions about our use of cookies, please contact us at <a href="mailto:privacy@themalive.com" className="text-sm underline hover:opacity-70">privacy@themalive.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
