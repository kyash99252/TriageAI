import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ArrowLeft, CalendarDays, Tag, User, CheckCircle, Info, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

interface TicketUser {
  _id: string;
  email: string;
}
type TicketStatus = "Open" | "In Progress" | "Closed" | "New" | "Resolved" | string;
type TicketPriority = "Low" | "Medium" | "High" | "Urgent" | string;

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  relatedSkills?: string[];
  helpfulNotes?: string;
  assignedTo?: TicketUser | null;
  createdAt: string;
}

interface TicketResponse {
    ticket: Ticket;
    message?: string;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return "Invalid Date";
  }
};

const getStatusVariant = (status?: TicketStatus): BadgeVariant => {
  const lowerStatus = status?.toLowerCase();
  if (lowerStatus === "open" || lowerStatus === "new") return "default";
  if (lowerStatus === "in progress") return "secondary";
  if (lowerStatus === "closed" || lowerStatus === "resolved") return "outline";
  return "default";
};

const getPriorityVariant = (priority?: TicketPriority): BadgeVariant => {
  const lowerPriority = priority?.toLowerCase();
  if (lowerPriority === "high" || lowerPriority === "urgent") return "destructive";
  if (lowerPriority === "medium") return "secondary";
  if (lowerPriority === "low") return "outline";
  return "default";
};

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id) {
        setError("Ticket ID is missing.");
        setLoading(false);
        return;
    }
    const fetchTicket = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok) {
          setTicket((data as TicketResponse).ticket);
        } else {
          setError((data as { message?: string }).message || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching the ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, token]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <Skeleton className="h-10 w-40 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
          <CardFooter>
             <Skeleton className="h-4 w-1/2" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          {error ? "Error Loading Ticket" : "Ticket Not Found"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {error || "We couldn't find the ticket you're looking for."}
        </p>
        <Button asChild variant="outline" className="subtle-shine-hover">
          <Link to="/tickets">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Tickets
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button asChild variant="outline" className="mb-6 subtle-shine-hover">
        <Link to="/tickets">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Tickets
        </Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-start gap-3">
            <FileText className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
            <span>{ticket.title}</span>
          </CardTitle>
          <CardDescription className="text-md leading-relaxed pt-1">
            {ticket.description}
          </CardDescription>
        </CardHeader>

        {(ticket.status || ticket.priority || ticket.relatedSkills?.length || ticket.assignedTo || ticket.helpfulNotes) && (
          <>
            <Separator className="my-4" />
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {ticket.status && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant={getStatusVariant(ticket.status)} className="text-sm">
                          {ticket.status}
                      </Badge>
                    </div>
                  </div>
                )}
                {ticket.priority && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Priority</p>
                        <Badge variant={getPriorityVariant(ticket.priority)} className="text-sm">
                            {ticket.priority}
                        </Badge>
                    </div>
                  </div>
                )}
              </div>

              {ticket.relatedSkills && ticket.relatedSkills.length > 0 && (
                <div className="flex items-start gap-2">
                    <Tag className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Related Skills</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                        {ticket.relatedSkills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                        </div>
                    </div>
                </div>
              )}

              {ticket.assignedTo && (
                 <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{ticket.assignedTo?.email || "N/A"}</p>
                  </div>
                </div>
              )}

              {ticket.helpfulNotes && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Helpful Notes from AI</p>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/50 p-4 rounded-md border">
                    <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          <CalendarDays className="h-4 w-4 mr-2" />
          Created At: {formatDate(ticket.createdAt)}
        </CardFooter>
      </Card>
    </div>
  );
}