import { PostContext } from "~/context/EntrieContext.jsx";
import Entrie from "~/components/Entrie.jsx";

const Entry = () => {
  return (
    <PostContext>
      <Entrie />
    </PostContext>
  );
};

export default Entry;
