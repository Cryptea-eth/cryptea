import Nav from "../../app/components/elements/Nav";
import Footer from "../../app/components/elements/Footer";
import Link from "next/link";
import Image from "next/image";
import donation from "../../public/images/donation.png";
import { FaArrowCircleRight } from "react-icons/fa";

const Blog = () => {
  return (
    <div className="h-screen bg-[#F9F8FE]">
      <Nav />

      <div className="w-full px-14">
        <div className="text-4xl font-bold py-12">
          <span
            style={{
              background:
                "linear-gradient(90deg, #F57059 31.38%, #8B59F5 102.16%)",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
            }}
          >
            Cryptea&#39;s Blog
          </span>
        </div>

        <div className="flex flex-col">
          <div className="featured grid grid-cols-2 gap-4 grid-flow-row bg-white rounded-xl">
            <div className="featured-img rounded-l-xl">
              <Image src={donation} alt="Featured Image" />
            </div>

            <div className="featured-conttent">
              <div className="featured-tag my-4">
                <p>Cryptea&#39;s Blog</p>
              </div>
              <div className="featured-title my-3">
                <p className="text-4xl font-bold">Featured Title</p>
              </div>
              <div className="featured-blub my-3">
                <p className="font-normal text-lg">
                  Here&#39;s what you need to know about Immutable X, the new
                  gaming-focused L2 blockchain on Rarible — and the exclusive
                  double $IMX rewards program.{" "}
                </p>
              </div>
              <div className="continue my-3">
                <Link href="/blog/featured">
                  <div className="text-[#f57059] font-bold flex items-center">
                    <p className="mr-2">Continue Reading</p>
                    <FaArrowCircleRight />
                  </div>
                </Link>
              </div>

              <div className="author my-3">
                <div className="flex gap-2 items-center">
                  <div className="author-img rounded-full">
                    <Image
                      src={donation}
                      alt="Author Image"
                      width={44}
                      height={44}
                    />
                  </div>
                  <div className="author-name">
                    <div>
                      <p className="font-bold text-[19px]">Author Name</p>
                    </div>
                    <div className="flex">
                      <div className="author-date">
                        <p className="text-black font-light">Sep 23, 2022</p>
                      </div>
                      <div className="seperator">
                        <p className="text-black font-light">/</p>
                      </div>
                      <div className="author-time">
                        <p className="text-black font-light">2 mins read</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-1/2 flex flex-col justify-items-center my-8">
        <div className="text-black font-bold text-5xl mx-auto mt-24">
          Nothing Here For Now, Check Back Later
        </div>

        <div className="mx-auto mt-8">
          <Link href="/">
            <a>
              <button className="ml-2 hover:bg-[#ff320e] transition-all delay-500 text-sm rounded-lg bg-[#F57059] text-white font-semibold py-4 px-4">
                Go Back Home
              </button>
            </a>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
