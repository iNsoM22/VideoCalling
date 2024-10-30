import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

const Avatar = ({ imageURL }) => {
  if (imageURL) {
    return (
      <Image
        src={imageURL}
        alt="Avatar"
        className="rounded-full"
        height={40}
        width={40}
      />
    );
  }

  return <FaUserCircle size={40} name={"H"} />;
};

export default Avatar;
