import { useState } from "react";
import { useRouter } from "aleph/react";
import { useStore } from "~/Store.js";
import { authFn } from "~/services/Entries/Functions.js";
import { useAsyncFn } from "~/hooks/useAsync.jsx";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState([]);
  const setAuth = useStore((state) => state.setAuth);
  const { url, redirect } = useRouter();
  const { loading, _errors, execute } = useAsyncFn(authFn);

  const type =
    url.pathname == "/auth/register"
      ? 1
      : url.pathname == "/auth/login"
      ? 0
      : "";

  const title = type === 1 ? "Register" : "Login";

  const handleSubmit = (e) => {
    e.preventDefault();

    const variables =
      type == 1
        ? { username, email, password, password2 }
        : { email, password };

    return execute({ type, variables }).then((res) => {
      if (res && type == 1 ? res.register : res.login) {
        setAuth(type == 1 ? res.register : res.login);
        redirect("/dashboard");
      } else {
        setErrors(res);
      }
    });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>{title}</legend>
        {type === 1 && (
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        )}
        <input
          type="text"
          placeholder="E-Mail"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {type === 1 && (
          <input
            type="password"
            placeholder="Validate Password"
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
          />
        )}

        <button className="btn" type="submit" disabled={loading}>
          {title}
        </button>
      </fieldset>
      {errors.map((err, id) => (
        <div key={id} className="error-msg">
          {err.message}
        </div>
      ))}
    </form>
  );
};

export default Auth;
