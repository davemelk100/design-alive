import { copyToClipboard } from "../utils/clipboard";

const mockWrite = vi.fn().mockResolvedValue(undefined);

vi.mock("@capacitor/clipboard", () => ({
  Clipboard: { write: (...args: unknown[]) => mockWrite(...args) },
}));

describe("editor copyToClipboard", () => {
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).Capacitor;
    mockWrite.mockClear();
  });

  it("uses navigator.clipboard when Capacitor is absent", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await copyToClipboard("web text");

    expect(writeText).toHaveBeenCalledWith("web text");
    expect(mockWrite).not.toHaveBeenCalled();
  });

  it("uses Capacitor Clipboard when native", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => "ios",
    };

    await copyToClipboard("native text");

    expect(mockWrite).toHaveBeenCalledWith({ string: "native text" });
  });

  it("falls back to web when Capacitor exists but reports web", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Capacitor = {
      isNativePlatform: () => false,
      getPlatform: () => "web",
    };
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await copyToClipboard("still web");

    expect(writeText).toHaveBeenCalledWith("still web");
    expect(mockWrite).not.toHaveBeenCalled();
  });

  it("falls back to web when Capacitor.isNativePlatform is not a function", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Capacitor = { version: "8.0" };
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await copyToClipboard("partial capacitor");

    expect(writeText).toHaveBeenCalledWith("partial capacitor");
    expect(mockWrite).not.toHaveBeenCalled();
  });
});
