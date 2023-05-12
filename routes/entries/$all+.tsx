import { Link, useRouter } from "aleph/react";
import { dateFormatter } from "~/utils.js";
import PostEntrie from "~/components/PostEntrie.jsx";
import { useAsync } from "~/hooks/useAsync.jsx";
import { getEntries } from "~/services/Entries/Functions.js";
import { Icon } from "@iconify/react";
import IconBtn from "~/components/IconBtn.tsx";
import { Radio } from "react-loader-spinner";

const EntrieList = () => {
  const { url, redirect } = useRouter();

  const paramPage = url.pathname.match(/\/entries\/page\/(\d)/);

  const {
    value: postReq,
    loading,
    errors,
  } = useAsync(() => getEntries(paramPage?.[1]), [paramPage?.[1]]);

  //   if (errors) return <h1 className="error-msg">Something went wrong</h1>;
  if (loading)
    return (
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
    );

  const posts = postReq.getEntries;

  return (
    <>
      <PostEntrie />

      {posts.data?.map((post) => (
        <div className="comment" style={{ margin: 5 }} key={post.uniqId}>
          <div className="header">
            <span className="name">{post.User.username}</span>
            <span className="date">
              {dateFormatter.format(Date.parse(post.added))}
            </span>
          </div>

          <Link to={`/entry/${post.uniqId}`}>
            <div className="message">
              {post.post}
              {/* <Link to={`/entrie/${post.uniqId}`}>{post.post}</Link> */}
            </div>
          </Link>
          <div className="footer">{post.votes} likes</div>
        </div>
      ))}

      <div className="footer-entries">
        <span>Page: </span>

        {posts.meta?.prev && (
          <IconBtn
            aria-label={"Prev"}
            Icon={<Icon icon="ooui:previous-ltr" />}
            onClick={() => redirect(`/entries/page/${posts.meta?.prev}`)}
            //   isActive={!isNaN(posts.meta?.prev)}
          />
        )}

        {posts.meta?.currentPage}

        {posts.meta?.next && (
          <IconBtn
            aria-label={"Next"}
            Icon={<Icon icon="ooui:previous-rtl" />}
            onClick={() => redirect(`/entries/page/${posts.meta?.next}`)}
            // isActive={}
          />
        )}
      </div>
    </>
  );
};

export default EntrieList;
