import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { LOCALES } from "./lib/constants";
import { AllEffectsContainer } from "./components/Common/modules/AllEffectsContainer";

export type tParams = Promise<{ lang: string }>;

export const metadata: Metadata = {
  title: "Ionic",
  metadataBase: new URL("https://ionic.digitalax.xyz/"),
  description: "Peer appraisals and reaction packs.",
  twitter: {
    description: "Peer appraisals and reaction packs.",
    creator: "@digitalax_",
    site: "@digitalax_",
    card: "summary_large_image",
  },
  alternates: {
    canonical: `https://ionic.digitalax.xyz/`,
    languages: LOCALES.reduce((acc, item) => {
      acc[item] = `https://ionic.digitalax.xyz/${item}/`;
      return acc;
    }, {} as { [key: string]: string }),
  },
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
  },
  keywords: [
    "Web3",
    "Web3 Fashion",
    "Moda Web3",
    "Open Source",
    "CC0",
    "Emma-Jane MacKinnon-Lee",
    "Open Source LLMs",
    "DIGITALAX",
    "F3Manifesto",
    "digitalax.xyz",
    "f3manifesto.xyz",
    "Women",
    "Life",
    "Freedom",
  ],
  creator: "Emma-Jane MacKinnon-Lee",
  publisher: "Emma-Jane MacKinnon-Lee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DIGITALAX",
              url: "https://digitalax.xyz/",
              founder: {
                "@type": "Person",
                "@id": "https://emmajanemackinnonlee.com/#person",
                name: "Emma-Jane MacKinnon-Lee",
                url: "https://emmajanemackinnonlee.com/",
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": "https://emmajanemackinnonlee.com/",
                },
                sameAs: [
                  "https://emmajanemackinnonlee.com/",
                  "https://emmajanemackinnon.com/",
                  "https://emmajane.ai/",
                  "https://janefuture.com/",
                  "https://emmajanemackinnonlee.xyz/",
                  "https://emmajanemackinnonlee.net/",
                  "https://emmajanemackinnonlee.ai/",
                  "https://emmajanemackinnonlee.org/",
                  "https://emmajanemackinnonlee-f3manifesto.com/",
                  "https://emmajanemackinnonlee-digitalax.com/",
                  "https://emmajanemackinnonlee-runway.com/",
                  "https://icoinedweb3fashion.com/",
                  "https://syntheticfutures.xyz/",
                  "https://web3fashion.xyz/",
                  "https://emancipa.xyz/",
                  "https://highlangu.com/",
                  "https://digitalax.xyz/",
                  "https://cc0web3fashion.com/",
                  "https://cc0web3.com/",
                  "https://cuntism.net/",
                  "https://dhawu.com/",
                  "https://casadeespejos.com/",
                  "https://emancipa.net/",
                  "https://dhawu.emancipa.xyz/",
                  "https://highlangu.emancipa.xyz/",
                  "https://twitter.com/emmajane1313",
                  "https://medium.com/@casadeespejos",
                  "https://www.flickr.com/photos/emmajanemackinnonlee/",
                ],
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <AllEffectsContainer />
          <div className="bg-cat-hero relative w-full flex">
            <div className="relative w-full h-fit overflow-x-hidden bg-black/70 flex">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
