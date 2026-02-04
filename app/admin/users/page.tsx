import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Editor", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Client", status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Editor", status: "Inactive" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "Admin", status: "Active" },
    { id: 5, name: "Tom Brown", email: "tom@example.com", role: "Client", status: "Active" },
]

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground">Manage user accounts and permissions</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>A list of all users in your organization</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user.name}</span>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === "Active" ? "default" : "outline"}>{user.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
