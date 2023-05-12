import { Head, Link, useRouter } from "aleph/react";
import { useStore } from "~/Store.js";

function Index() {
  const count = useStore((state) => state.count);

  const increase = useStore((state) => state.increase);
  const reset = useStore((state) => state.removeAll);
  const test = useStore((state) => state.test);

  const { url, redirect } = useRouter();
  const searchParams = url.searchParams;
  const pathname = url.pathname;

  // console.log(searchParams.get("salt"), pathname);
  // /?salt=1234

  return (
    <div className=":uno: screen index">
      <Head>
        <title>Aleph.js</title>
        <meta name="description" content="The Fullstack Framework in Deno." />
      </Head>

      <h1>The Fullstack Framework in Deno.</h1>

      <nav>
        {/*  */}
        <p>{count}</p>
        <p>
          <button className="ebtn" onClick={increase}>
            Increase
          </button>
          <button className="ebtn" onClick={reset}>
            Reset
          </button>
          <button
            className="ebtn"
            onClick={() => {
              test(7 * count);
            }}
          >
            Test
          </button>
        </p>
        {/*  */}
      </nav>
    </div>
  );
}

export default Index;
