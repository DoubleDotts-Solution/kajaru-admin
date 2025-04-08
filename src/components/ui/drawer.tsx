import { X } from "lucide-react";
import { useEffect, useState } from "react";

const Drawer = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black bg-opacity-40"
        onClick={handleClose}
      />

      <div
        className={`
          ml-auto h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300
          ${isVisible ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="absolute top-6 right-6">
          <button onClick={handleClose} className="h-8">
            <X className="w-6 h-6 text-primary" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Drawer;
