/**
 * Users Page - Dashboard Portal
 * 
 * User management page with role and status filtering.
 * Features: search, role/status filters, stats cards, user table with actions.
 * 
 * @added 2026-02-04
 * @route /dashboard/users
 */
"use client"

import { useState } from "react"
import {
    Search,
    Plus,
    MoreHorizontal,
    Mail,
    Shield,
    User as UserIcon,
    PenTool
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserRole = "admin" | "client" | "editor"
type UserStatus = "active" | "inactive" | "pending"

interface User {
    id: string
    name: string
    email: string
    role: UserRole
    status: UserStatus
    avatar?: string
    joinedDate: string
}

const initialUsers: User[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
        status: "active",
        joinedDate: "2025-01-15",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "client",
        status: "active",
        joinedDate: "2025-02-20",
    },
    {
        id: "3",
        name: "Mike Johnson",
        email: "mike@example.com",
        role: "editor",
        status: "inactive",
        joinedDate: "2025-03-10",
    },
    {
        id: "4",
        name: "Sarah Wilson",
        email: "sarah@example.com",
        role: "client",
        status: "active",
        joinedDate: "2025-04-05",
    },
    {
        id: "5",
        name: "Tom Brown",
        email: "tom@example.com",
        role: "editor",
        status: "pending",
        joinedDate: "2026-01-25",
    },
    {
        id: "6",
        name: "Emily Davis",
        email: "emily@example.com",
        role: "admin",
        status: "active",
        joinedDate: "2025-06-12",
    },
    {
        id: "7",
        name: "Chris Lee",
        email: "chris@example.com",
        role: "client",
        status: "active",
        joinedDate: "2025-08-30",
    },
    {
        id: "8",
        name: "Alex Turner",
        email: "alex@example.com",
        role: "editor",
        status: "inactive",
        joinedDate: "2025-09-18",
    },
]

const roleConfig = {
    admin: {
        label: "Admin",
        icon: Shield,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    },
    client: {
        label: "Client",
        icon: UserIcon,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    },
    editor: {
        label: "Editor",
        icon: PenTool,
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    },
}

const statusConfig = {
    active: { label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
    inactive: { label: "Inactive", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
}

export default function UsersPage() {
    const [users] = useState<User[]>(initialUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")
    const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all")

    const filteredUsers = users
        .filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((user) => roleFilter === "all" || user.role === roleFilter)
        .filter((user) => statusFilter === "all" || user.status === statusFilter)

    const userStats = {
        total: users.length,
        active: users.filter(u => u.status === "active").length,
        admins: users.filter(u => u.role === "admin").length,
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage user accounts and permissions
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.admins}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-9 w-full pl-8 sm:w-[250px]"
                    />
                </div>
                <Select value={roleFilter} onValueChange={(v: string) => setRoleFilter(v as UserRole | "all")}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(v: string) => setStatusFilter(v as UserStatus | "all")}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        A list of all users in your organization
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => {
                                    const roleInfo = roleConfig[user.role]
                                    const statusInfo = statusConfig[user.status]

                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={user.avatar} alt={user.name} />
                                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    {user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={roleInfo.color}>
                                                    {roleInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={statusInfo.color}>
                                                    {statusInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(user.joinedDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600">
                                                            Delete User
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
