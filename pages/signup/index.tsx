import Nav from "../../app/components/elements/Nav";
import SignUpForm from "../../app/components/elements/SignupForm";
import Head from "next/head";

const Signup = () => {
  
  return (
    <>
      <Head>
        <title>Signup | Cryptea</title>
        <meta name="description" content={`Receive Payments Instantly With Ease`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Nav />

      <SignUpForm />
    </>
  );
};

export default Signup;
