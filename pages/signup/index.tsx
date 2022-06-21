import Nav from "../../app/components/elements/Nav";
import SignUpForm from "../../app/components/elements/SignupForm";
import Head from "next/head";

const Signup = () => {
  return (
    <div>
      <Head>
        <title>Signup | Cryptea</title>
        <meta name="description" content={`Receive tips/donations on another level`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <SignUpForm />
    </div>
  );
};

export default Signup;
