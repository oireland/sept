const IS_SERVER = typeof window === "undefined";
export default function getURL(path: string) {
  console.log(process.env.NEXT_PUBLIC_SITE_URL)
  const baseURL = IS_SERVER
    ? process.env.NEXT_PUBLIC_SITE_URL
    : window.location.origin;
    console.log("new URL", new URL(path, baseURL).toString())
  return new URL(path, baseURL).toString();
}
