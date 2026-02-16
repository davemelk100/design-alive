import { render, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";

// Helper component that exposes auth state for testing
function AuthConsumer({
  onAuth,
}: {
  onAuth: (auth: ReturnType<typeof useAuth>) => void;
}) {
  const auth = useAuth();
  onAuth(auth);
  return (
    <div>
      <span data-testid="authenticated">
        {auth.isAuthenticated ? "yes" : "no"}
      </span>
      <span data-testid="user">{auth.user?.email ?? "none"}</span>
      <span data-testid="loading">{auth.loading ? "yes" : "no"}</span>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("AuthContext", () => {
  it("provides default unauthenticated state", async () => {
    // No token in localStorage, so fetch won't be called and loading finishes immediately
    const spy = vi.fn();
    render(
      <AuthProvider>
        <AuthConsumer onAuth={spy} />
      </AuthProvider>
    );

    await waitFor(() => {
      const latest = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(latest.loading).toBe(false);
    });

    const latest = spy.mock.calls[spy.mock.calls.length - 1][0];
    expect(latest.user).toBeNull();
    expect(latest.isAuthenticated).toBe(false);
  });

  it("calls session endpoint with token on mount", async () => {
    localStorage.setItem("store_auth_token", "test-token-123");
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ user: null }), { status: 401 })
    );

    render(
      <AuthProvider>
        <AuthConsumer onAuth={() => {}} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });

    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toContain("auth-session");
    expect((options as RequestInit).headers).toEqual(
      expect.objectContaining({
        Authorization: "Bearer test-token-123",
      })
    );
  });

  it("sets user on successful session check", async () => {
    localStorage.setItem("store_auth_token", "valid-token");
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test",
      image: null,
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ user: mockUser }), { status: 200 })
    );

    const spy = vi.fn();
    render(
      <AuthProvider>
        <AuthConsumer onAuth={spy} />
      </AuthProvider>
    );

    await waitFor(() => {
      const latest = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(latest.isAuthenticated).toBe(true);
    });

    const latest = spy.mock.calls[spy.mock.calls.length - 1][0];
    expect(latest.user?.email).toBe("test@example.com");
  });

  it("clears token on failed session check", async () => {
    localStorage.setItem("store_auth_token", "bad-token");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
    );

    const spy = vi.fn();
    render(
      <AuthProvider>
        <AuthConsumer onAuth={spy} />
      </AuthProvider>
    );

    await waitFor(() => {
      const latest = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(latest.loading).toBe(false);
    });

    expect(localStorage.getItem("store_auth_token")).toBeNull();
  });

  it("logout clears user and token", async () => {
    localStorage.setItem("store_auth_token", "valid-token");
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test",
      image: null,
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ user: mockUser }), { status: 200 })
    );

    const spy = vi.fn();
    render(
      <AuthProvider>
        <AuthConsumer onAuth={spy} />
      </AuthProvider>
    );

    // Wait for login to complete
    await waitFor(() => {
      const latest = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(latest.isAuthenticated).toBe(true);
    });

    // Now call logout
    act(() => {
      const latest = spy.mock.calls[spy.mock.calls.length - 1][0];
      latest.logout();
    });

    await waitFor(() => {
      const latest = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(latest.isAuthenticated).toBe(false);
    });

    expect(localStorage.getItem("store_auth_token")).toBeNull();
  });

  it("loginWithEmail sends credentials and sets state", async () => {
    const mockUser = {
      id: "2",
      email: "user@example.com",
      name: "User",
      image: null,
    };

    // First call: checkSession with no token (returns 401 or no-op)
    // Second call: loginWithEmail POST
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ token: "new-token", user: mockUser }), {
          status: 200,
        })
      );

    const spy = vi.fn();
    render(
      <AuthProvider>
        <AuthConsumer onAuth={spy} />
      </AuthProvider>
    );

    // Wait for initial load (no token, so loading becomes false quickly)
    await waitFor(() => {
      const latest = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(latest.loading).toBe(false);
    });

    // Call loginWithEmail
    await act(async () => {
      const latest = spy.mock.calls[spy.mock.calls.length - 1][0];
      await latest.loginWithEmail("user@example.com", "password123");
    });

    // Find the loginWithEmail fetch call
    const loginCall = fetchSpy.mock.calls.find(([, opts]) => {
      return (opts as RequestInit)?.method === "POST";
    });

    expect(loginCall).toBeDefined();
    const [loginUrl, loginOpts] = loginCall!;
    expect(loginUrl).toContain("auth-login-email");
    expect(JSON.parse((loginOpts as RequestInit).body as string)).toEqual({
      email: "user@example.com",
      password: "password123",
    });

    // Verify state updated
    await waitFor(() => {
      const latest = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(latest.isAuthenticated).toBe(true);
      expect(latest.user?.email).toBe("user@example.com");
    });

    expect(localStorage.getItem("store_auth_token")).toBe("new-token");
  });
});
