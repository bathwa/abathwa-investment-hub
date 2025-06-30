import React, { useState, useEffect } from 'react';
import { supabase } from '@/server/supabaseClient';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { UserWithProfile } from '@/shared/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

const USERS_PER_PAGE = 10;

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchUsers();
    getTotalUsersCount();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_profiles (
            id,
            user_id,
            company_name,
            industry,
            experience_years,
            created_at,
            updated_at
          )
        `)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE - 1);

      if (error) throw error;

      // Transform the data to match UserWithProfile type
      const transformedUsers: UserWithProfile[] = (data || []).map(user => ({
        ...user,
        user_profiles: Array.isArray(user.user_profiles) && user.user_profiles.length > 0 
          ? {
              id: user.user_profiles[0].id,
              user_id: user.user_profiles[0].user_id,
              company_name: user.user_profiles[0].company_name,
              industry: user.user_profiles[0].industry,
              experience_years: user.user_profiles[0].experience_years,
              created_at: user.user_profiles[0].created_at,
              updated_at: user.user_profiles[0].updated_at,
              investment_preferences: undefined,
              risk_tolerance: undefined,
              investment_horizon: undefined,
              minimum_investment: undefined,
              maximum_investment: undefined,
              preferred_currencies: undefined
            }
          : undefined
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalUsersCount = async () => {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact' });

      if (error) throw error;
      setTotalUsers(count || 0);
    } catch (error) {
      console.error('Error fetching total users count:', error);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Implement search logic here (e.g., filter users based on search query)
  };

  const handleRoleChange = async (role: string) => {
    setSelectedRole(role);
    // Implement role filtering logic here
  };

  const handleOpenDialog = (user: UserWithProfile) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">User Management</h1>

      <div className="flex justify-between items-center mb-5">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-md"
        />
        <Select onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
            <SelectItem value="investor">Investor</SelectItem>
            <SelectItem value="service_provider">Service Provider</SelectItem>
            <SelectItem value="observer">Observer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-3">Name</TableHead>
                <TableHead className="px-6 py-3">Email</TableHead>
                <TableHead className="px-6 py-3">Role</TableHead>
                <TableHead className="px-6 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.full_name}</TableCell>
                  <TableCell className="px-6 py-4">{user.email}</TableCell>
                  <TableCell className="px-6 py-4">{user.role}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Button variant="secondary" onClick={() => handleOpenDialog(user)}>View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-center mt-5">
        {Array.from({ length: Math.ceil(totalUsers / USERS_PER_PAGE) }, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => handlePageChange(page)}
            className="mx-1"
          >
            {page}
          </Button>
        ))}
      </div>

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input type="text" id="name" value={selectedUser.full_name} className="col-span-3" disabled />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input type="email" id="email" value={selectedUser.email} className="col-span-3" disabled />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input type="text" id="role" value={selectedUser.role} className="col-span-3" disabled />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="created_at" className="text-right">
                  Created At
                </Label>
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
