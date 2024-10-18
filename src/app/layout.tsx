import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";

import { cx } from "~/shared/style";
import { pretendard } from "~/shared/style/fonts";

import {
  JotaiProvider,
  MotionProvider,
  NextUIProvider,
  OverlayProvider,
  QueryProvider,
} from "./_components/providers";

import "~/shared/style/globals.css";

export const metadata: Metadata = {
  title: "메수라이브 - 메이플 시뮬레이터, 계산기",
  description: "메수라이브, 각종 메이플 시뮬레이터와 기댓값 계산기",
  openGraph: {
    title: "메수라이브 - 메플 시뮬레이터, 계산기",
    description: "메수라이브, 각종 메이플 시뮬레이터와 기댓값 계산기",
    url: "https://mesu.live",
    siteName: "메수라이브",
    images: { url: "https://mesu.live/thumbnail.png" },
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF8009",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cx(pretendard.variable, pretendard.className, "font-medium")}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <GoogleAnalytics gaId={process.env.GA4_ID!} />
      <body>
        <MotionProvider>
          <JotaiProvider>
            <NextUIProvider>
              <QueryProvider>
                <OverlayProvider>{children}</OverlayProvider>
              </QueryProvider>
            </NextUIProvider>
          </JotaiProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
