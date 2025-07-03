import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

export default function App() {
  console.log("🏁 ROOT RENDERED");
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style>{`
          body { 
            margin: 0; 
            padding: 20px; 
            background: red; 
            color: white; 
            font-family: Arial, sans-serif;
            font-size: 24px;
          }
        `}</style>
      </head>
      <body>
        <div>ROOT IS WORKING</div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
} 