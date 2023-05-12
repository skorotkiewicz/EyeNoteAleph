import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "aleph/react";
import { useStore } from "~/Store.js";
import { useAsync } from "~/hooks/useAsync.jsx";
import { getEntrie } from "~/services/Entries/Functions.js";
import { Radio } from "react-loader-spinner";

const Context = createContext();

export const PostContext = ({ children }) => {
  const [comments, setComments] = useState([]);
  const auth = useStore((state) => state.auth);
  const { url } = useRouter();
  const entrieId = url.pathname.match(/\/entry\/(.*)/)[1];

  const { loading, errors, value: post } = useAsync(() => getEntrie(entrieId));

  const commentByParentId = useMemo(() => {
    const group = {};
    comments.forEach((comment) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);

  const getReplies = (parentId) => {
    return commentByParentId[parentId];
  };

  const createLocalComment = (comment) => {
    setComments((previousComments) => {
      return [comment, ...previousComments];
    });
  };

  const updateLocalComment = (uniqId, message) => {
    setComments((previousComments) => {
      return previousComments.map((comment) => {
        if (comment.uniqId == uniqId) {
          return { ...comment, comment: message };
        } else {
          return comment;
        }
      });
    });
  };

  const toggleLocalCommentLike = (entrieId, addLike) => {
    setComments((previousComments) => {
      return previousComments.map((comment) => {
        if (comment.uniqId == entrieId) {
          if (addLike) {
            return {
              ...comment,
              likeCount: comment.likeCount + 1,
              likeByMe: true,
            };
          } else {
            return {
              ...comment,
              likeCount: comment.likeCount - 1,
              likeByMe: false,
            };
          }
        } else {
          return comment;
        }
      });
    });
  };

  const deleteLocalComment = (uniqId) => {
    setComments((previousComments) => {
      return previousComments.filter((comment) => comment.uniqId !== uniqId);
    });
  };

  useEffect(() => {
    if (post?.getEntrie?.comments == null) return;
    setComments(post.getEntrie.comments);
  }, [post?.getEntrie?.comments]);

  return (
    <Context.Provider
      value={{
        post: { entrieId, ...post },
        rootComments: commentByParentId[null],
        getReplies,
        createLocalComment,
        updateLocalComment,
        toggleLocalCommentLike,
        deleteLocalComment,
      }}
    >
      {loading ? (
        <div className="loading">
          <Radio
            visible={true}
            height="60"
            width="60"
            ariaLabel="radio-loading"
            wrapperStyle={{}}
            wrapperClass="loading"
          />
        </div>
      ) : errors ? (
        <h1 className="error-msg">
          {/* {errors.map((err, id) => (
            <p key={id}>{err}</p>
          ))} TODO */}
        </h1>
      ) : (
        children
      )}
    </Context.Provider>
  );
};

export const usePost = () => useContext(Context);
