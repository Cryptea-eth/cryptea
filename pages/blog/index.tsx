import Nav from "../../app/components/elements/Nav";
import Footer from "../../app/components/elements/Footer";
import Link from "next/link";

const Blog = () => {
  return (
    <div className="h-screen">
      <Nav />

      <div className="w-full h-1/2 flex flex-col justify-items-center my-8">
        <div className="text-black font-bold text-5xl mx-auto mt-24">
          Nothing Here For Now, Check Back Later
        </div>

        <div className="mx-auto mt-8">
          <Link href="/">
            <a>
            <button className="ml-2 hover:bg-[#ff320e] transition-all delay-500 text-sm rounded-lg bg-[#F57059] text-white font-semibold py-4 px-4">
              Go Back Home
            </button></a>
          </Link>
        </div>
      </div>

      <Footer />
    </div>

  );
};

export default Blog;
