"use client"

import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type AdminDataTableColumn<T> = {
  id: string
  header: string
  headerClassName?: string
  cellClassName?: string
  render: (item: T, index: number) => ReactNode
}

type AdminDataTableProps<T> = {
  data: T[]
  columns: AdminDataTableColumn<T>[]
  getRowKey: (item: T) => string
  emptyTitle: string
  emptyDescription: string
  emptyAction?: ReactNode
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  totalLabel?: string
  rowClassName?: (item: T, index: number) => string
}

export function AdminDataTable<T>({
  data,
  columns,
  getRowKey,
  emptyTitle,
  emptyDescription,
  emptyAction,
  page = 1,
  pageSize,
  onPageChange,
  totalLabel,
  rowClassName,
}: AdminDataTableProps<T>) {
  const resolvedPageSize = pageSize ?? data.length
  const isPaginated = Boolean(pageSize && onPageChange)
  const totalPages = isPaginated ? Math.max(1, Math.ceil(data.length / resolvedPageSize)) : 1
  const currentPage = Math.min(page, totalPages)
  const rows = isPaginated
    ? data.slice((currentPage - 1) * resolvedPageSize, currentPage * resolvedPageSize)
    : data
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="bg-card dark:bg-gray-900 border border-border rounded-xl overflow-hidden shadow-sm">
      {data.length === 0 ? (
        <div className="p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">{emptyTitle}</h3>
          <p className="text-muted-foreground mb-6">{emptyDescription}</p>
          {emptyAction}
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={`px-6 py-4 text-sm font-semibold text-foreground ${column.headerClassName || ""}`}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((item, index) => {
                const absoluteIndex = isPaginated ? (currentPage - 1) * resolvedPageSize + index : index

                return (
                  <TableRow
                    key={getRowKey(item)}
                    className={rowClassName ? rowClassName(item, absoluteIndex) : ""}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={`px-6 py-4 ${column.cellClassName || ""}`}
                      >
                        {column.render(item, absoluteIndex)}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {isPaginated ? (
            <div className="flex flex-col gap-3 border-t border-border px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * resolvedPageSize + 1}-
                {Math.min(currentPage * resolvedPageSize, data.length)} of {data.length}
                {totalLabel ? ` ${totalLabel}` : ""}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                {pageNumbers.map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => onPageChange?.(entry)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition ${
                      currentPage === entry
                        ? "bg-primary text-primary-foreground"
                        : "border border-border hover:bg-secondary text-foreground"
                    }`}
                  >
                    {entry}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
