import { useState } from "react";
import CommentList from "~/components/CommentList.jsx";
import { usePost } from "~/context/EntrieContext.jsx";
import { useStore } from "~/Store.js";
import CommentComp from "~/components/CommentComp.jsx";

const Comment = ({ createdAt, uniqId, likeByMe, likeCount, comment, User }) => {
  const user = User;
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const auth = useStore((state) => state.auth);

  const { getReplies } = usePost();
  const childComments = getReplies(uniqId);

  return (
    <>
      <CommentComp
        createdAt={createdAt}
        uniqId={uniqId}
        likeByMe={likeByMe}
        likeCount={likeCount}
        comment={comment}
        user={user}
      />
      {childComments?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${areChildrenHidden && "hide"}`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              <CommentList comments={childComments} />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden && "hide"}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </button>
        </>
      )}
    </>
  );
};

export default Comment;
