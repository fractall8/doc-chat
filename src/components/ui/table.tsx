import cn from "clsx";

export const Table = (props: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="my-6 overflow-x-auto rounded-sm border">
    <table
      {...props}
      className={cn("min-w-[640px] w-full border-collapse", "text-sm")}
    />
  </div>
);

export const Thead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead {...props} className="bg-white sticky top-0 z-10 border-b" />
);

export const Tr = (props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    {...props}
    className="even:bg-white odd:bg-gray-50 hover:bg-gray-100 transition-colors border-b last:border-b-0"
  />
);

export const Th = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    {...props}
    className="text-left font-semibold px-4 py-3 align-middle border-r last:border-r-0"
    scope="col"
  />
);

export const Td = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td {...props} className="px-4 py-3 align-middle border-r last:border-r-0" />
);
