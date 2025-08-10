import { shopifyRequest } from './shopify';

export async function updateProductTitle({
  shop,
  productId,
  title,
}: {
  shop: string;
  productId: number;
  title: string;
}) {
  const body = { product: { id: productId, title } };
  return shopifyRequest({ shop, path: `products/${productId}.json`, method: 'PUT', body });
}

export async function updateProductDescription({
  shop,
  productId,
  bodyHtml,
}: {
  shop: string;
  productId: number;
  bodyHtml: string;
}) {
  const body = { product: { id: productId, body_html: bodyHtml } };
  return shopifyRequest({ shop, path: `products/${productId}.json`, method: 'PUT', body });
}

export async function updateVariantPrice({
  shop,
  variantId,
  price,
}: {
  shop: string;
  variantId: number;
  price: string | number;
}) {
  const body = { variant: { id: variantId, price } };
  return shopifyRequest({ shop, path: `variants/${variantId}.json`, method: 'PUT', body });
}

export async function createProduct({
  shop,
  title,
  price,
}: {
  shop: string;
  title: string;
  price?: string | number;
}) {
  const product: any = { title };
  if (price !== undefined) {
    product.variants = [{ price: String(price) }];
  }
  return shopifyRequest({ shop, path: 'products.json', method: 'POST', body: { product } });
}
