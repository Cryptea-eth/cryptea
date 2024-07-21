import Link from 'next/link';
import Image from 'next/image';
import logo from "../../../../public/images/breew1.png";

const LogoSpace = ({style, className}: { style?: object, className?: string }) => {
        return (
          <Link href="/">
            <a
              style={style}
              className={`flex flex-row ${className} max-w-[116px] min-w-[116px] items-center justify-between`}
            >
              <Image src={logo} alt="Breew" width={136} height={37.5} />
            </a>
          </Link>
        );
}

export default LogoSpace;