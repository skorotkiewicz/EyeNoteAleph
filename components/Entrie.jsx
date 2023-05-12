import { useEffect } from "react";
import { useRouter } from "aleph/react";
import CommentForm from "~/components/CommentForm.jsx";
import CommentsList from "~/components/CommentList.jsx";
import { usePost } from "~/context/EntrieContext.jsx";
import { useStore } from "~/Store.js";
import { useAsyncFn } from "~/hooks/useAsync.jsx";
import { createComment } from "~/services/Entries/Functions.js";
import CommentComp from "~/components/CommentComp.jsx";

const Entrie = () => {
  const { post, rootComments, createLocalComment } = usePost();
  const auth = useStore((state) => state.auth);
  const { redirect } = useRouter();
  const { loading, errors, execute } = useAsyncFn(createComment);

  useEffect(() => {
    if (!post?.getEntrie?.uniqId) return redirect("/entries");
  }, []);

  const handleSubmit = (message) => {
    return execute({ entrieId: post.entrieId, message, token: auth.token })
      .then((res) => {
        // if (!res.postEntrieComment) setErrors(res);
        // else return res.postEntrieComment;
        return res.postEntrieComment;
      })
      .then(createLocalComment);
  };

  return (
    <div className="entries-page">
      <CommentComp
        createdAt={post.getEntrie.added}
        comment={post.getEntrie.post}
        uniqId={post.getEntrie.uniqId}
        user={post.getEntrie.User}
        likeByMe={false}
        // likeCount={false}
        type="e"
        // likeByMe={likeByMe}
        likeCount={post.getEntrie.votes}
      />

      {/* <div className="comment">
        <div className="header">
          <span className="name">{post.getEntrie.User.username}</span>
          <span className="date">
            {post.getEntrie.added &&
              dateFormatter.format(Date.parse(post.getEntrie.added))}
          </span>
        </div>

        <div className="message">{post.getEntrie.post}</div>
        <div className="footer">footer</div>
      </div> */}

      <h3 className="comments-title">Comments</h3>
      <section>
        <CommentForm onSubmit={handleSubmit} loading={loading} error={errors} />
        {rootComments != null && rootComments.length > 0 && (
          <div className="mt-4">
            <CommentsList comments={rootComments} />
          </div>
        )}
      </section>
    </div>
  );
};

export default Entrie;
