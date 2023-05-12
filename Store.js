import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Cookies from "js-cookie";

export const useStore = create(
  devtools((set) => ({
    count: 0,
    auth: {},

    increase: () =>
      set((state) => ({ count: state.count + 1 }), false, "count/increase"),

    removeAll: () => set(() => ({ count: 0 }), false, "count/remove"),

    test: (pond) => set(() => ({ count: pond }), false, "count/test"),

    setAuth: (user) =>
      set(
        () => {
          const cookie = Cookies.get("EyeNote");

          if (cookie) {
            return { auth: JSON.parse(cookie) };
          } else {
            if (!user) return {};
            Cookies.set("EyeNote", JSON.stringify(user));
            return { auth: user };
          }
        },
        false,
        "user/auth"
      ),

    logout: () =>
      set(
        () => {
          Cookies.remove("EyeNote");
          return { auth: {} };
        },
        false,
        "user/logout"
      ),
  }))
);
