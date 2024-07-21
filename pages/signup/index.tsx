import SignUpForm from "../../app/components/elements/SignupForm";
import Head from "next/head";

const Signup = () => {
  
  return (
    <>
      <Head>
        <title>Signup | Breew</title>
        <meta name="description" content={`Receive Payments Instantly With Ease, Sign up now to setup`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignUpForm />
    </>
  );
};

export default Signup;
