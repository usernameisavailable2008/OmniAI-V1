import type { LoaderFunction } from "@remix-run/node";

// Return empty 204 so browsers stop logging 404 for /favicon.ico
export const loader: LoaderFunction = () => {
  return new Response(null, { status: 204 });
};

export default function Favicon() {
  // This component never renders because loader returns 204
  return null;
} 