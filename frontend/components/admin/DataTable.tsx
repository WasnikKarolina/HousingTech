import * as React from "react";
import { Popconfirm } from "antd";
import { Button } from "@/components/ui/button";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {useRouter} from "next/navigation";
import {Users} from "@/components/types/types";

const columns: ColumnDef<Users>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "isActive",
        header: "Active",
    },
    {
        accessorKey: "isOnboarded",
        header: "Onboarded",
    },
    {
        accessorKey: "Actions",
        header: "Actions",
    },
];

interface DataTableProps {
    users: Users[];
    deleteUser: (userId: string) => void;
    enableUser: (userId: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ users, deleteUser, enableUser }) => {

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [searchEmail, setSearchEmail] = React.useState<string>(''); // State to manage the search email

    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const filteredUsers = users.filter(user => user.email.toLowerCase().includes(searchEmail.toLowerCase()));

    const handleDeleteUser = (userId: string) => {
        deleteUser(userId);
    };

    const handleEnableUser = (userId: string) => {
        enableUser(userId);
    };
    const router = useRouter();

    const handleRowClick = (userId: string) => {
        router.push(`/users/users?users=${userId}`);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Search by email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                />
                <div>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchEmail('');
                        }}
                    >
                        Clear
                    </Button>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} >
                                <TableCell className="cursor-pointer" onClick={() => handleRowClick(user.id)}>{user.id}</TableCell>
                                <TableCell className="cursor-pointer" onClick={() => handleRowClick(user.id)}>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.isActive ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{user.isOnboarded ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button
                                        style={{
                                            backgroundColor: "#f3f4f6",
                                            border: "1px solid #e5e7eb",
                                            color: "black",
                                        }}
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Disable
                                    </Button>
                                    <Button
                                        style={{
                                            backgroundColor: "#f3f4f6",
                                            border: "1px solid #e5e7eb",
                                            color: "black",
                                        }}
                                        onClick={() => handleEnableUser(user.id)}
                                    >
                                        Enable
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DataTable;
