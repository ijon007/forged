import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Customer {
  id: string
  name: string
  email: string
  purchaseDate: string
  amount: string
  course: string
}

interface CustomersTableProps {
  customers: Customer[]
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const getCourseColor = (course: string) => {
    // Generate a consistent color based on course name hash
    let hash = 0
    for (let i = 0; i < course.length; i++) {
      hash = course.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-yellow-100 text-yellow-800", 
      "bg-purple-100 text-purple-800",
      "bg-green-100 text-green-800",
      "bg-indigo-100 text-indigo-800",
      "bg-pink-100 text-pink-800",
      "bg-orange-100 text-orange-800",
      "bg-red-100 text-red-800",
      "bg-teal-100 text-teal-800",
      "bg-cyan-100 text-cyan-800",
    ]
    
    return colors[Math.abs(hash) % colors.length]
  }

  if (customers.length === 0) {
    return (
      <Card className="border rounded-3xl">
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
          <CardDescription>
            A list of your recent customer purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No customers yet. Start promoting your courses to see data here!
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border rounded-3xl">
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>
          A list of your recent customer purchases ({customers.length} shown)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Customer ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Course Purchased</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id.substring(0, 8)}...</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                <TableCell>{customer.purchaseDate}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getCourseColor(customer.course)}>
                    {customer.course}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{customer.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 