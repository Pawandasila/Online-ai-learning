import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "sonner";
import ThemeProviderClient from "./theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SkillSprint - AI-Powered Course Creator | Personalized Learning Platform",
  description: "Create personalized learning courses instantly with AI. Generate comprehensive courses with videos, exercises, progress tracking, and certificates. Start learning any topic today with our intelligent course generator.",
  keywords: [
    "AI course generator",
    "personalized learning platform", 
    "online course creator",
    "AI-powered education",
    "custom learning paths",
    "educational content generator",
    "e-learning platform",
    "skill development",
    "professional training",
    "certificate courses",
    "programming courses",
    "web development training",
    "data science learning",
    "machine learning courses",
    "SkillSprint"
  ].join(", "),
  authors: [{ name: "SkillSprint Team", url: "https://skillsprint.com" }],
  creator: "SkillSprint",
  publisher: "SkillSprint",
  category: "Education Technology",
  classification: "Educational Platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "SkillSprint - AI-Powered Course Creator | Personalized Learning Platform",
    description: "Create personalized learning courses instantly with AI. Generate comprehensive courses with videos, exercises, progress tracking, and certificates.",
    type: "website",
    siteName: "SkillSprint",
    locale: "en_US",
    url: "https://skillsprint.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SkillSprint - AI-Powered Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillSprint - AI-Powered Course Creator",
    description: "Create personalized learning courses instantly with AI. Generate comprehensive courses with videos, exercises, and certificates.",
    creator: "@skillsprint",
    images: ["/twitter-card.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://skillsprint.com",
    languages: {
      "en-US": "https://skillsprint.com",
      "es-ES": "https://skillsprint.com/es",
      "fr-FR": "https://skillsprint.com/fr",
    },
  },
  other: {
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProviderClient>
            <Provider>{children}</Provider>
            <Toaster richColors />
          </ThemeProviderClient>
        </body>
      </html>
    </ClerkProvider>
  );
}
