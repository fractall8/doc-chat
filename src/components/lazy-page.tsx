import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Page } from "react-pdf";

function LazyPage({
  pageNumber,
  width,
}: {
  pageNumber: number;
  width: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    if (!ref.current) return;
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Page pageNumber={pageNumber} width={width} />
      ) : (
        <div className="h-[800px] flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  );
}

export default LazyPage;
