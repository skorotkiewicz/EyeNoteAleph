import { Link } from "aleph/react";

export default function E404() {
  return (
    <div className="screen e404">
      <h1>Page Not Found</h1>
      <p>Sorry, but the page you were trying to view does not exist.</p>
      <p>
        <Link className="btn" to="/">
          Go back to the homepage
        </Link>
      </p>
    </div>
  );
}
