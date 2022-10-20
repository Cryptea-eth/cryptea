import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../../public/images/cryptea-logo.svg'
import logo1 from "../../../../public/images/cryptea.png";

const LogoSpace = ({style, className}: { style?: object, className?: string }) => {
        return (
          <Link href="/">
            <a
              style={style}
              className={`flex flex-row ${className} max-w-[116px] min-w-[116px] items-center justify-between`}
            >
              <Image
                src={logo}
                alt="cryptea"
                width={30}
                height={30}
                className="min-w-[30px]"
              />

              <Image src={logo1} alt="cryptea" className="min-w-[30px]" />
            </a>
          </Link>
        );
}

export default LogoSpace;