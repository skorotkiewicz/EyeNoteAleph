import { useEffect } from "react";
import { useStore } from "~/Store.js";
import { useRouter } from "aleph/react";

const Dashboard = () => {
  const auth = useStore((state) => state.auth);
  const { redirect } = useRouter();

  useEffect(() => {
    if (!auth.token) redirect("/");
  }, []);

  return (
    <div>
      Dashboard
      <h2>{auth.username}</h2>
      {/* <a
        onMouseEnter={() => console.log("enter")}
        onMouseLeave={() => console.log("leave")}
      >
        test
      </a> */}
    </div>
  );
};

export default Dashboard;
