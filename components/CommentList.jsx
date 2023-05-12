import React from "react";
import Comment from "~/components/Comment.jsx";

const CommentsList = ({ comments }) => {
  return comments.map((comment) => {
    return (
      <div className="comment-stack" key={comment.uniqId}>
        <Comment {...comment} />
      </div>
    );
  });
};

export default CommentsList;
