import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand, Loader2 } from "lucide-react";
import { Document } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { useToast } from "@/lib/react-toastify";
import SimpleBar from "simplebar-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import LazyPage from "@/components/lazy-page";

interface PdfFullscreenProps {
  fileUrl: string;
}

const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();

  const { error } = useToast();

  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant="ghost" className="gap-1.5" aria-label="fullscreen">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogTitle className="hidden">Fullscreen pdf</DialogTitle>
      <DialogContent className="max-w-7xl min-w-[calc(100%-4rem)]">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                error(
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-medium">Error loading PDF</p>
                    <p>Please try again later</p>
                  </div>
                );
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={fileUrl}
              className="max-h-full"
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <LazyPage
                  key={i}
                  width={width ? width : 1}
                  pageNumber={i + 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;
