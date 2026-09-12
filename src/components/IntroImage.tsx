import { useEffect, useState } from "react";

interface IntroImageProps {
  onFinish: () => void;
}

const IntroImage = ({ onFinish }: IntroImageProps) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("introShown");

    if (shown) {
      onFinish();
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem("introShown", "true");
      onFinish();
    }, 2500); // 4 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-white overflow-hidden">
      <img
        src="/Loading-image.png"
        alt="Loading"
        onLoad={() => setLoaded(true)}
        className={"w-full h-full object-cover transition-opacity duration-500"}
      />
    </div>
  );
};

export default IntroImage;
