import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "aleph/react";
import { useStore } from "~/Store.js";

export const useAsync = (func, dependancies = []) => {
  const { execute, ...state } = useAsyncInternal(func, dependancies, true);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
};
export const useAsyncFn = (func, dependancies = []) => {
  return useAsyncInternal(func, dependancies, false);
};

const useAsyncInternal = (func, dependancies, initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);
  const [errors, setErrors] = useState(null);
  const [value, setValue] = useState(null);
  const logout = useStore((state) => state.logout);
  const { redirect } = useRouter();

  const execute = useCallback((...params) => {
    setLoading(true);
    return func(...params)
      .then((data) => {
        // if error - data[0]?.message

        if (data[0]?.message) {
          const res = data[0].message;

          if (res == "Invalid Token") {
            toast("Session expired, please log in!");
            logout();
            redirect("/auth/login");
            return;
          }

          toast(res);
          setValue(undefined);
          setErrors(res);
          return Promise.reject(res);
        } else {
          setValue(data);
          setErrors(undefined);
          return data;
        }
      })
      .catch((err) => {
        setValue(undefined);
        setErrors(err);
        return Promise.reject(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, dependancies);

  // const execute = useCallback((...params) => {
  //   setLoading(true);
  //   return func(...params)
  //     .then((data) => {
  //       setValue(data);
  //       setErrors(undefined);
  //       return data;
  //     })
  //     .catch((err) => {
  //       setValue(undefined);
  //       setErrors(err);
  //       return Promise.reject(err);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, dependancies);

  return { errors, loading, value, execute };
};
