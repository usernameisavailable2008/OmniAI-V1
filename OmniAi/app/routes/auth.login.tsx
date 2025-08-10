import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');
  
  if (shop) {
    return redirect(`/auth?shop=${shop}`);
  }
  
  // If no shop parameter, redirect to landing page
  return redirect('/');
};

// This route only handles redirects, no component needed
export default function AuthLogin() {
  return null;
} 