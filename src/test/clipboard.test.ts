import { copyToClipboard } from "../utils/clipboard";

const mockWrite = vi.fn().mockResolvedValue(undefined);

vi.mock("@capacitor/clipboard", () => ({
  Clipboard: { write: (...args: unknown[]) => mockWrite(...args) },
}));

describe("copyToClipboard", () => {
  afterEach(() => {
    delete window.Capacitor;
    mockWrite.mockClear();
  });

  it("uses navigator.clipboard on web", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await copyToClipboard("hello web");

    expect(writeText).toHaveBeenCalledWith("hello web");
    expect(mockWrite).not.toHaveBeenCalled();
  });

  it("uses Capacitor Clipboard on native", async () => {
    window.Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => "ios",
    };

    await copyToClipboard("hello native");

    expect(mockWrite).toHaveBeenCalledWith({ string: "hello native" });
  });

  it("propagates errors from navigator.clipboard", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    Object.assign(navigator, { clipboard: { writeText } });

    await expect(copyToClipboard("fail")).rejects.toThrow("denied");
  });

  it("propagates errors from Capacitor Clipboard", async () => {
    window.Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => "android",
    };
    mockWrite.mockRejectedValueOnce(new Error("native denied"));

    await expect(copyToClipboard("fail")).rejects.toThrow("native denied");
  });
});
