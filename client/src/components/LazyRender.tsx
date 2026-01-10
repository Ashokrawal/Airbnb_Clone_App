import { useRef, useState, useEffect, type ReactNode } from "react";

interface LazyRenderProps {
  children: ReactNode;
  height?: number; // reserve space to prevent CLS
}

const LazyRender: React.FC<LazyRenderProps> = ({ children, height = 300 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // trigger when 10% visible
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {isVisible ? children : null}
    </div>
  );
};

export default LazyRender;
