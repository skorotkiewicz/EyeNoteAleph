import { useEffect } from "react";
import { useStore } from "~/Store.js";
import { useAsyncFn } from "~/hooks/useAsync.jsx";
import { useRouter } from "aleph/react";
import { getWelcome } from "~/services/Entries/Functions.js";
import { toast } from "react-toastify";

const Welcome = () => {
  const auth = useStore((state) => state.auth);
  const setAuth = useStore((state) => state.setAuth);
  const logout = useStore((state) => state.logout);
  const { loading, errors, execute } = useAsyncFn(getWelcome);
  const { redirect } = useRouter();

  const welcome = (token) => {
    execute({ token }).then((res) => {
      //   if (res.welcome != "OK") {
      //     toast("Session expired, please log in!");
      //     logout();
      //     redirect("/login");
      //   }
    });
  };

  useEffect(() => {
    setAuth();
  }, []);

  useEffect(() => {
    if (auth.token) welcome(auth.token);
  }, [auth]);

  return <></>;
};

export default Welcome;
