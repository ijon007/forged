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

const customers = [
  {
    id: "CUST001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    purchaseDate: "2024-01-15",
    amount: "$299.00",
    course: "Advanced React Mastery",
  },
  {
    id: "CUST002", 
    name: "Michael Chen",
    email: "michael.chen@email.com",
    purchaseDate: "2024-01-18",
    amount: "$149.00",
    course: "JavaScript Fundamentals",
  },
  {
    id: "CUST003",
    name: "Emily Davis",
    email: "emily.davis@email.com", 
    purchaseDate: "2024-01-22",
    amount: "$399.00",
    course: "Full Stack Development",
  },
  {
    id: "CUST004",
    name: "David Wilson",
    email: "david.wilson@email.com",
    purchaseDate: "2024-01-25",
    amount: "$199.00", 
    course: "Node.js Backend",
  },
  {
    id: "CUST005",
    name: "Lisa Thompson",
    email: "lisa.thompson@email.com",
    purchaseDate: "2024-01-28",
    amount: "$249.00",
    course: "TypeScript Essentials",
  },
  {
    id: "CUST006",
    name: "James Rodriguez",
    email: "james.rodriguez@email.com",
    purchaseDate: "2024-02-02",
    amount: "$179.00",
    course: "CSS & Design Systems",
  },
  {
    id: "CUST007",
    name: "Anna Martinez",
    email: "anna.martinez@email.com",
    purchaseDate: "2024-02-05",
    amount: "$329.00",
    course: "Advanced React Mastery",
  },
  {
    id: "CUST008",
    name: "Robert Brown",
    email: "robert.brown@email.com",
    purchaseDate: "2024-02-08",
    amount: "$219.00",
    course: "Database Design",
  },
]

export function CustomersTable() {
  const getCourseColor = (course: string) => {
    const colors = {
      "Advanced React Mastery": "bg-blue-100 text-blue-800",
      "JavaScript Fundamentals": "bg-yellow-100 text-yellow-800", 
      "Full Stack Development": "bg-purple-100 text-purple-800",
      "Node.js Backend": "bg-green-100 text-green-800",
      "TypeScript Essentials": "bg-indigo-100 text-indigo-800",
      "CSS & Design Systems": "bg-pink-100 text-pink-800",
      "Database Design": "bg-orange-100 text-orange-800",
    }
    return colors[course as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="border rounded-3xl">
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>
          A list of your recent customer purchases
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
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                <TableCell>{new Date(customer.purchaseDate).toLocaleDateString()}</TableCell>
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