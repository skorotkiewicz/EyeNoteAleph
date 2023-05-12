import { useState } from "react";
import { dateFormatter } from "~/utils.js";
import { Icon } from "@iconify/react";
import IconBtn from "~/components/IconBtn.tsx";
import CommentForm from "~/components/CommentForm.jsx";
import { usePost } from "~/context/EntrieContext.jsx";
import { useStore } from "~/Store.js";
import { useAsyncFn } from "~/hooks/useAsync.jsx";
import { toast } from "react-toastify";
import {
  createComment,
  updateComment,
  voteComment,
  deleteComment,
  voteEntry,
} from "~/services/Entries/Functions.js";

const CommentComp = ({
  createdAt,
  uniqId,
  likeByMe,
  likeCount,
  comment,
  user,
  type,
}) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const auth = useStore((state) => state.auth);

  const updateCommentFn = useAsyncFn(updateComment);
  const createCommentFn = useAsyncFn(createComment);
  const deleteCommentFn = useAsyncFn(deleteComment);
  const toggleCommentLikeFn = useAsyncFn(type == "e" ? voteEntry : voteComment);
  const {
    post,
    updateLocalComment,
    toggleLocalCommentLike,
    createLocalComment,
    deleteLocalComment,
  } = usePost();

  const onCommentUpdate = (message) => {
    return updateCommentFn
      .execute({ uniqId, message, token: auth.token })
      .then((comment) => {
        setIsEditting(false);
        updateLocalComment(uniqId, comment.updateEntrie.comment);
        if (comment.updateEntrie.error)
          return toast(comment.updateEntrie.error);
      });
  };

  const onCommentReply = (message) => {
    return createCommentFn
      .execute({
        entrieId: post.getEntrie.uniqId,
        message,
        parentId: uniqId,
        token: auth.token,
      })
      .then((comment) => {
        setIsReplaying(false);
        createLocalComment(comment.postEntrieComment);
      });
  };

  const onDeleteComment = () => {
    return deleteCommentFn
      .execute({ uniqId, token: auth.token })
      .then(() => deleteLocalComment(uniqId));
  };

  const onToggleCommentLike = () => {
    return toggleCommentLikeFn
      .execute({ entrieId: uniqId, token: auth.token })
      .then((addLike) => {
        return toggleLocalCommentLike(
          uniqId,
          type == "e" ? addLike.voteEntry.addLink : addLike.voteComment.addLike
        );
      });
  };

  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{user.username}</span>
          <span className="date">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>

        {isEditting ? (
          <CommentForm
            autoFocus
            initialValue={comment}
            onSubmit={onCommentUpdate}
            loading={updateCommentFn.loading}
            error={updateCommentFn.errors}
          />
        ) : (
          <div className="message">{comment}</div>
        )}

        <div className="footer">
          <IconBtn
            aria-label={likeByMe ? "Unlike" : "Like"}
            Icon={
              likeByMe ? (
                <Icon icon="mdi:cards-heart" />
              ) : (
                <Icon icon="mdi:cards-heart-outline" />
              )
            }
            onClick={onToggleCommentLike}
            disabled={toggleCommentLikeFn.loading}
          >
            {likeCount}
          </IconBtn>

          {type !== "e" && (
            <IconBtn
              aria-label={isReplaying ? "Cancel Reply" : "Reply"}
              Icon={<Icon icon="bi:reply-fill" />}
              onClick={() => setIsReplaying((prev) => !prev)}
              isActive={isReplaying}
            />
          )}

          {user.username === auth.username && (
            <>
              <IconBtn
                isActive={isEditting}
                Icon={<Icon icon="material-symbols:edit" />}
                aria-label={isEditting ? "Cancel Edit" : "Edit"}
                onClick={() => setIsEditting((prev) => !prev)}
              />
              <IconBtn
                Icon={<Icon icon="ph:trash-simple-fill" />}
                color="danger"
                aria-label="Delete"
                onClick={onDeleteComment}
              />
            </>
          )}
        </div>
      </div>
      {isReplaying && (
        <div className="mt-1 ml-3">
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={createCommentFn.loading}
            error={createCommentFn.errors}
          />
        </div>
      )}
    </>
  );
};

export default CommentComp;
