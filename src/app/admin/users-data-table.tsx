"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminPagination, AdminUser } from "@/hooks/api";

type UsersDataTableProps = {
  columns: ColumnDef<AdminUser>[];
  data: AdminUser[];
  pagination: AdminPagination;
  onPageChange: (page: number) => void;
};

export function UsersDataTable({
  columns,
  data,
  pagination,
  onPageChange,
}: UsersDataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      pagination: {
        pageIndex: Math.max(0, pagination.page - 1),
        pageSize: pagination.limit,
      },
    },
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          <span>
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} users)
          </span>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text=""
                  onClick={(event) => {
                    event.preventDefault();
                    if (pagination.page > 1) onPageChange(pagination.page - 1);
                  }}
                  className={
                    pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1,
              )
                .filter((currentPage) => {
                  if (currentPage === 1) return true;
                  if (currentPage === pagination.totalPages) return true;
                  return Math.abs(currentPage - pagination.page) <= 1;
                })
                .map((currentPage, index, pages) => (
                  <PaginationItem key={currentPage}>
                    {index > 0 && pages[index - 1] !== currentPage - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <PaginationLink
                      href="#"
                      isActive={currentPage === pagination.page}
                      onClick={(event) => {
                        event.preventDefault();
                        onPageChange(currentPage);
                      }}
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text=""
                  onClick={(event) => {
                    event.preventDefault();
                    if (pagination.page < pagination.totalPages) {
                      onPageChange(pagination.page + 1);
                    }
                  }}
                  className={
                    pagination.page >= pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
