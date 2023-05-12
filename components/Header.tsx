import { Link, NavLink } from "aleph/react";
import { useStore } from "~/Store.js";

export default function Header() {
  const auth = useStore((state) => state.auth);
  const logout = useStore((state) => state.logout);

  return (
    <header>
      <div className="header-wrapper">
        <h1>
          <Link to="/">EyeNote</Link>
        </h1>
        <nav>
          {auth.token ? (
            <span>
              <a onClick={logout}>Logout</a>
            </span>
          ) : (
            <span>
              <NavLink activeClassName="active" to="/auth/login">
                Login
              </NavLink>
              <NavLink activeClassName="active" to="/auth/register">
                Register
              </NavLink>
            </span>
          )}

          <NavLink activeClassName="active" to="/entries">
            Entries
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
