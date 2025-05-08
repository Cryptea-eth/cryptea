import SignUpForm from "../../app/components/elements/SignupForm";
import Head from "next/head";

const Signup = () => {
  return (
    <>
      <Head>
        <title>Signup | Breew</title>
        <meta
          name="description"
          content={`Breew the best web3 experience for your users, Sign up now to setup`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignUpForm />
    </>
  );
};

export default Signup;
