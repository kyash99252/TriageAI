import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Save, XCircle, Edit3, Users as UsersIcon } from "lucide-react";

interface User {
  _id: string;
  email: string;
  role: "user" | "moderator" | "admin";
  skills?: string[];
}

interface FormData {
  role: "user" | "moderator" | "admin";
  skills: string;
}

export default function AdminPanel() {
  useEffect(() => {
    document.title = "Admin - TriageAI";
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ role: "user", skills: "" });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: any = await res.json();
      if (res.ok) {
        setUsers(data as User[]);
        setFilteredUsers(data as User[]);
      } else {
        console.error("Failed to fetch users:", data.error || data.message);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
    else setIsLoading(false);
  }, [token]);

  const handleEditClick = (user: User) => {
    setEditingUserEmail(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", ") || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingUserEmail) return;
    setIsUpdating(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: editingUserEmail,
            role: formData.role,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      const data: any = await res.json();
      if (!res.ok) {
        console.error(data.error || data.message || "Failed to update user");
        return;
      }

      setEditingUserEmail(null);
      setFormData({ role: "user", skills: "" });
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <UsersIcon className="h-8 w-8 text-primary" />
          Admin Panel - Manage Users
        </h1>
        <p className="text-muted-foreground">
          View, search, and manage user roles and skills.
        </p>
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          className="pl-10 w-full md:w-1/2 lg:w-1/3"
          placeholder="Search by email or role..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredUsers.length === 0 && searchQuery ? (
        <p className="text-center text-muted-foreground py-10">No users found matching your search.</p>
      ) : filteredUsers.length === 0 ? (
         <p className="text-center text-muted-foreground py-10">No users available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user._id} className="flex flex-col metallic-glow-hover">
              <CardHeader>
                <CardTitle className="text-lg">{user.email}</CardTitle>
                <p className="text-sm text-muted-foreground">ID: {user._id}</p>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div>
                  <Label htmlFor={`role-${user._id}`} className="text-xs font-semibold text-muted-foreground">Current Role</Label>
                  <p id={`role-${user._id}`}>{user.role}</p>
                </div>
                <div>
                  <Label htmlFor={`skills-${user._id}`} className="text-xs font-semibold text-muted-foreground">Skills</Label>
                  <p id={`skills-${user._id}`} className="text-sm break-words">
                    {user.skills && user.skills.length > 0
                      ? user.skills.join(", ")
                      : "N/A"}
                  </p>
                </div>

                {editingUserEmail === user.email && (
                  <div className="mt-4 space-y-4 pt-4 border-t">
                    <div>
                      <Label htmlFor={`edit-role-${user._id}`}>New Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: "user" | "moderator" | "admin") =>
                          setFormData({ ...formData, role: value })
                        }
                      >
                        <SelectTrigger id={`edit-role-${user._id}`}>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`edit-skills-${user._id}`}>New Skills (comma-separated)</Label>
                      <Input
                        id={`edit-skills-${user._id}`}
                        type="text"
                        placeholder="e.g., javascript, react, node"
                        value={formData.skills}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, skills: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                {editingUserEmail === user.email ? (
                  <div className="flex gap-2 w-full">
                    <Button
                      size="sm"
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="flex-1 metallic-shine-hover"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isUpdating ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingUserEmail(null)}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditClick(user)}
                    className="w-full subtle-shine-hover"
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit User
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}