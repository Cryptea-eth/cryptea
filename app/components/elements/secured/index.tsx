import { FaLock } from 'react-icons/fa'


const Secured = ({ className }: { className?: string }) => {
    return (
      <div className={`flex ${className} text-[14px] font-[400] text-[#979797] items-center justify-center`}>
        <FaLock className="mr-1" size={15} /> Secured by Wift
      </div>
    );
}

export default Secured;