import Link from "next/link";
import SiteLayout from "./(site)/layout";

export default function NotFound() {
  return (
    <SiteLayout>
      <section className="container-x py-24 text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">This path doesn’t lead anywhere yet</h1>
        <p className="mt-4 text-muted">Try the home page, or tell us what you were looking for.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">Go to home</Link>
          <Link href="/contact/" className="btn-outline">Contact us</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
