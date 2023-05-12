import { useRouter } from "aleph/react";
import { useState } from "react";
import { useStore } from "~/Store.js";
import { useAsyncFn } from "~/hooks/useAsync.jsx";
import { createEntrie } from "~/services/Entries/Functions.js";

const PostEntrie = () => {
  const [post, setPost] = useState("");
  const { redirect } = useRouter();
  const auth = useStore((state) => state.auth);

  const { loading, errors, execute } = useAsyncFn(createEntrie);

  const postEntrie = () => {
    return execute({ post: post, token: auth.token }).then((res) => {
      if (res?.postEntrie) redirect("/entry/" + res.postEntrie.uniqId);
    });
    //   .then(createLocalComment);
  };

  return (
    <div className="entries-form">
      <div className="comment-form-row">
        <textarea
          onChange={(e) => {
            setPost(e.target.value);
          }}
          className="message-input"
        ></textarea>

        <button className="btn" onClick={postEntrie} disabled={loading}>
          Post
        </button>
      </div>
      <div className="error-msg">{errors}</div>
      <h3 className="comments-title">Post Entry</h3>
    </div>
  );
};

export default PostEntrie;
