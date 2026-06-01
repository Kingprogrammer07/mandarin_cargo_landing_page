export const dynamic = "force-static";

export default function RootPage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0;url=/uz" />
        <title>Mandarin Cargo</title>
      </head>
      <body>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- standalone static-export redirect document, outside the app/[locale] tree */}
        <p>Redirecting to <a href="/uz">Uzbek</a>...</p>
      </body>
    </html>
  );
}
