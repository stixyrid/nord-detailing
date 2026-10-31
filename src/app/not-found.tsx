import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found">
      <p>NORD / 404</p>
      <h1>This road ends here.</h1>
      <p>The page you are looking for could not be found.</p>
      <Link href="/">Back to home ↗</Link>
    </main>
  );
}
