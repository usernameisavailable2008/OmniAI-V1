import { RemixServer } from "@remix-run/react";
import { renderToPipeableStream } from "react-dom/server";
import { createRequestHandler } from "@remix-run/express";
import type { EntryContext } from "@remix-run/node";
import { isProd } from "~/utils/env.server";

const ABORT_DELAY = 5000;

// Enforce HTTPS in production
export function enforceHttps(
  request: Request,
  next: (request: Request) => Promise<Response>
): Promise<Response> {
  if (isProd) {
    const url = new URL(request.url);
    const proto = request.headers.get("x-forwarded-proto");

    // Redirect HTTP to HTTPS
    if (proto === "http") {
      const httpsUrl = new URL(request.url);
      httpsUrl.protocol = "https:";
      return Promise.resolve(
        new Response(null, {
          status: 301,
          headers: { Location: httpsUrl.toString() },
        })
      );
    }

    // Enforce Strict-Transport-Security
    return next(request).then((response) => {
      const headers = new Headers(response.headers);
      headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      );
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    });
  }

  return next(request);
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let didError = false;

    const stream = new ReadableStream({
      start(controller) {
        const { pipe, abort } = renderToPipeableStream(
          <RemixServer context={remixContext} url={request.url} />,
          {
            onShellReady() {
              responseHeaders.set("Content-Type", "text/html");
              resolve(
                new Response(stream, {
                  headers: responseHeaders,
                  status: didError ? 500 : responseStatusCode,
                })
              );
            },
            onShellError(error: unknown) {
              reject(error);
            },
            onError(error: unknown) {
              didError = true;
              console.error(error);
            },
            onAllReady() {
              controller.close();
            },
          }
        );

        setTimeout(abort, ABORT_DELAY);
      },
    });
  });
}

// Create request handler with middleware
const handler = createRequestHandler({
  build: require("@remix-run/dev/server-build"),
  mode: process.env.NODE_ENV,
  getLoadContext(req, res) {
    return {};
  },
}); 