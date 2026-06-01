export const dynamic = "force-static";

// Detect browser language, redirect to matching locale before paint. Runs synchronously in <head>.
const redirectScript = `(function(){
  var l=(navigator.language||"uz").toLowerCase();
  var t="/uz/";
  if(l.indexOf("ru")===0)t="/ru/";
  else if(l.indexOf("zh")===0||l.indexOf("cn")===0)t="/cn/";
  else if(l.indexOf("en")===0)t="/en/";
  else if(l.indexOf("uz")===0)t="/uz/";
  location.replace(t);
})();`;

export default function RootPage() {
  return (
    <html lang="uz">
      <head>
        <meta charSet="utf-8" />
        <title>Mandarin Cargo</title>
        <link rel="canonical" href="https://mandarincargo.uz/uz/" />
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
        {/* noscript fallback */}
        <noscript>
          <meta httpEquiv="refresh" content="0;url=/uz/" />
        </noscript>
      </head>
      <body style={{ margin: 0, background: "#fff" }} />
    </html>
  );
}
