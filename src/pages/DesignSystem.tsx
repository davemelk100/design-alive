import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Download,
  Upload,
  AlertCircle,
  ArrowUp,
  Dribbble,
  Menu,
  ExternalLink,
  X,
  FlaskConical,
  BookOpen,
  FileText,
  Palette,
  Briefcase,
  Settings,
  Users,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Loader2,
  Search,
  Calendar,
  Moon,
  Sun,
  Link2,
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Dot,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import LazyVideo from "../components/LazyVideo";
import { storage } from "../utils/storage";

interface DesignSystemData {
  colors?: {
    [key: string]: string;
  };
  typography?: {
    [key: string]: string;
  };
  spacing?: {
    [key: string]: string;
  };
  borderRadius?: {
    [key: string]: string;
  };
  components?: {
    [key: string]: string[];
  };
  exportDate?: string;
}

const DesignSystem: React.FC = () => {
  const [storageStatus, setStorageStatus] = useState<{
    available: boolean;
    message?: string;
  }>({ available: storage.isAvailable() });

  // Load stored design system data on component mount
  React.useEffect(() => {
    try {
      const storedData = storage.get(
        "designSystemData"
      ) as DesignSystemData | null;
      if (storedData && storedData.colors) {
        // Apply stored colors to CSS custom properties
        const root = document.documentElement;
        Object.entries(storedData.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value as string);
        });
      }
    } catch (error) {
      // Failed to load stored design system data
    }
  }, []);

  const exportData = () => {
    try {
      const designSystemData = {
        colors: {
          primary: "#3b82f6",
          secondary: "#10b981",
          gray100: "#f3f4f6",
          gray200: "#e5e7eb",
          gray600: "#4b5563",
          gray900: "#111827",
        },
        typography: {
          h1: "text-4xl font-bold",
          h2: "text-3xl font-semibold",
          h3: "text-2xl font-semibold",
          h4: "text-xl font-semibold",
          body: "text-base",
          small: "text-sm",
        },
        spacing: {
          xs: "w-4 h-4",
          sm: "w-8 h-8",
          md: "w-12 h-12",
          lg: "w-16 h-16",
          xl: "w-20 h-20",
        },
        borderRadius: {
          none: "rounded-none",
          sm: "rounded-sm",
          base: "rounded",
          md: "rounded-md",
          lg: "rounded-lg",
          full: "rounded-full",
        },
        components: {
          buttons: [
            "Primary",
            "Secondary",
            "Tertiary",
            "Outline Primary",
            "Outline Secondary",
          ],
          cards: ["Background Card", "Video Card", "Lab Card", "Sample Story"],
          icons: [
            "Navigation & UI Icons",
            "Social & Brand Icons",
            "Section Icons",
            "Music Player Icons",
            "Theme Icons",
            "Action Icons",
            "UI Component Icons",
          ],
        },
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(designSystemData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `design-system-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setStorageStatus({
        available: false,
        message: "Failed to export data. Please try again.",
      });
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as DesignSystemData;

        // Apply the imported data to the design system
        try {
          // Store the imported data in localStorage
          storage.set("designSystemData", data);

          // Apply CSS custom properties for colors if they exist
          if (data.colors) {
            const root = document.documentElement;
            Object.entries(data.colors).forEach(([key, value]) => {
              root.style.setProperty(`--color-${key}`, value as string);
            });
          }

          // Force a re-render by updating state
          setStorageStatus({
            available: true,
            message: "Design system data imported and applied successfully!",
          });

          // Clear the message after 3 seconds
          setTimeout(() => {
            setStorageStatus({ available: true });
          }, 3000);

          // Optionally reload the page to see all changes
          // window.location.reload();
        } catch (applyError) {
          setStorageStatus({
            available: false,
            message: "Failed to apply imported data. Please try again.",
          });
        }
      } catch (error) {
        setStorageStatus({
          available: false,
          message: "Invalid file format. Please select a valid JSON file.",
        });
      }
    };
    reader.readAsText(file);
    // Reset the input
    event.target.value = "";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mt-0 mb-2">
                Design System
              </h1>
              <p className="text-lg text-gray-600 mt-0 mb-0">
                Component library and design tokens
              </p>
              {!storageStatus.available && (
                <div className="flex items-center gap-2 mt-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {storageStatus.message || "Storage not available"}
                  </span>
                </div>
              )}
              {storageStatus.message && storageStatus.available && (
                <div className="flex items-center gap-2 mt-2 text-green-600">
                  <span className="text-sm">{storageStatus.message}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              {/* Export/Import buttons */}
              <button
                onClick={exportData}
                className="flex items-center gap-2 w-full justify-center mb-2 sm:w-auto sm:mb-0 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                title="Export design system data"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <label className="flex items-center gap-2 w-full justify-center mb-2 sm:w-auto sm:mb-0 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm cursor-pointer">
                <Upload className="h-4 w-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              <Link
                to="/"
                className="inline-flex items-center gap-2 w-full justify-center mb-2 sm:w-auto sm:mb-0 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-2 sm:px-4 py-12">
        {/* Colors */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Colors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <div className="w-full h-20 bg-primary rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium">Primary</p>
                <p className="text-gray-600">Primary</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-secondary rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium">Secondary</p>
                <p className="text-gray-600">Secondary</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-gray-100 rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium">Gray 100</p>
                <p className="text-gray-600">Gray 100</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-gray-200 rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium">Gray 200</p>
                <p className="text-gray-600">Gray 200</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-gray-600 rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium text-white">Gray 600</p>
                <p className="text-gray-300">Gray 600</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-gray-900 rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium text-white">Gray 900</p>
                <p className="text-gray-300">Gray 900</p>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Typography
          </h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Whereas disregard and contempt for human rights have resulted
              </h1>
              <p className="text-sm text-gray-600">
                Component library and design tokens
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                Whereas disregard and contempt for human rights have resulted
              </h2>
              <p className="text-sm text-gray-600">
                Component library and design tokens
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Whereas disregard and contempt for human rights have resulted
              </h3>
              <p className="text-sm text-gray-600">
                Component library and design tokens
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Whereas disregard and contempt for human rights have resulted
              </h4>
              <p className="text-sm text-gray-600">
                Component library and design tokens
              </p>
            </div>
            <div>
              <p className="text-base text-gray-700 mb-2">
                Whereas disregard and contempt for human rights have resulted in
                barbarous acts which have outraged the conscience of mankind.
              </p>
              <p className="text-sm text-gray-600">
                Body text - This is a paragraph with regular body text styling.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Whereas disregard and contempt for human rights have resulted in
                barbarous acts which have outraged the conscience of mankind.
              </p>
              <p className="text-sm text-gray-600">
                Small text - This is smaller text for captions and secondary
                information.
              </p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
              Secondary Button
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Tertiary Button
            </button>
            <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
              Outline Primary
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Outline Secondary
            </button>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden rounded-lg bg-gray-100/80">
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Background Card
                </h3>
                <p className="text-gray-700">Background Card</p>
              </div>
            </div>

            <div className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[1/1]">
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                <div className="pr-12 flex items-center gap-2">
                  <h3
                    className="text-[20px] font-semibold mb-1 dark:text-black title-font"
                    style={{
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Video Card
                  </h3>
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 dark:text-gray-600 mb-2 flex-1"></p>
                </div>
              </div>
              <div className="absolute inset-0 overflow-hidden z-0">
                <LazyVideo
                  src="/video/jersey.mp4"
                  className="w-full h-full object-cover opacity-70"
                  autoPlay={true}
                  muted={true}
                  loop={true}
                  playsInline={true}
                />
              </div>
            </div>
            <div className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[1/1]">
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                <div className="pr-12 flex items-center gap-2">
                  <h3
                    className="text-[20px] font-semibold mb-1 dark:text-black title-font"
                    style={{
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Lab Card
                  </h3>
                  {/* Greyscale colored balls */}
                  <div className="flex items-center gap-1 ml-2">
                    {[
                      "#6b7280", // Gray 500
                      "#9ca3af", // Gray 400
                      "#d1d5db", // Gray 300
                      "#4b5563", // Gray 600
                      "#374151", // Gray 700
                      "#1f2937", // Gray 800
                    ].map((color, i) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: `radial-gradient(circle at 70% 70%, ${color} 0%, ${color} 60%, ${color}dd 100%)`,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Icons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {/* Navigation & UI Icons */}
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <ArrowUp className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">ArrowUp</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <ArrowLeft className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                ArrowLeft
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <ArrowRight className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                ArrowRight
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Menu className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">Menu</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <X className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                X (Close)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Eye className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                Eye (View)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <ExternalLink className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                ExternalLink
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Search className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">Search</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                Calendar
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Link2 className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">Link2</span>
            </div>

            {/* Social & Brand Icons */}
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Dribbble className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                Dribbble
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <LinkedInLogoIcon className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                LinkedIn
              </span>
            </div>

            {/* Section Icons */}
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <FlaskConical className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                FlaskConical (Lab)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                BookOpen (Articles)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <FileText className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                FileText (Writing)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Palette className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                Palette (Design)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Briefcase className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                Briefcase (Career)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Users className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                Users (Personal)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Settings className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                Settings
              </span>
            </div>

            {/* Music Player Icons */}
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Play className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">Play</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Pause className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">Pause</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <SkipBack className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                SkipBack
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <SkipForward className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                SkipForward
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Volume2 className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">Volume2</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <VolumeX className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">VolumeX</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Loader2 className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">Loader2</span>
            </div>

            {/* Theme Icons */}
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Sun className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                Sun (Light)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Moon className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                Moon (Dark)
              </span>
            </div>

            {/* Action Icons */}
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Download className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                Download
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Upload className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">Upload</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                AlertCircle
              </span>
            </div>

            {/* UI Component Icons */}
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Check className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">Check</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Circle className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">Circle</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <ChevronDown className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                ChevronDown
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <ChevronUp className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                ChevronUp
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <ChevronLeft className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                ChevronLeft
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <ChevronRight className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                ChevronRight
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <GripVertical className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                GripVertical
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Dot className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">Dot</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <MoreHorizontal className="h-6 w-6 text-gray-700" />
              <span className="text-xs text-gray-600 text-center">
                MoreHorizontal
              </span>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Spacing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="text-sm text-gray-600">16px (w-4 h-4)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded"></div>
              <span className="text-sm text-gray-600">32px (w-8 h-8)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded"></div>
              <span className="text-sm text-gray-600">48px (w-12 h-12)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded"></div>
              <span className="text-sm text-gray-600">64px (w-16 h-16)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary rounded"></div>
              <span className="text-sm text-gray-600">80px (w-20 h-20)</span>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Border Radius
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary rounded-none"></div>
              <p className="text-sm text-gray-600">rounded-none (0px)</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary rounded-sm"></div>
              <p className="text-sm text-gray-600">rounded-sm (2px)</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary rounded"></div>
              <p className="text-sm text-gray-600">rounded (4px)</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary rounded-md"></div>
              <p className="text-sm text-gray-600">rounded-md (6px)</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary rounded-lg"></div>
              <p className="text-sm text-gray-600">rounded-lg (8px)</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary rounded-full"></div>
              <p className="text-sm text-gray-600">rounded-full (50%)</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DesignSystem;
