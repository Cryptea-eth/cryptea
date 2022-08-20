import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

const LinkOverview = () => {
  const { Moralis, user } = useMoralis();

  const router = useRouter();

  const [data, setData] = useState<any>({});

  const [isLoading, setLoader] = useState<boolean>(true);

  const { slug } = router.query;

  useEffect(() => {
    const init = async () => {
      const loadx = Moralis.Object.extend("link");

      const loadq = new Moralis.Query(loadx);

      loadq.equalTo("link", String(slug).toLowerCase());

      const resq = await loadq.first();

      setData({});

      setLoader(false);
    };

    init();
  }, [router.isReady, slug, Moralis.Object, Moralis.Query]);

  return (
    <>
      <Head>
        <title>overview | {slug} | Cryptea</title>
      </Head>
      something here
    </>
  );
};

export default LinkOverview;
