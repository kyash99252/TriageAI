import { useEffect, useState} from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Ticket as TicketIcon, ListChecks, CalendarDays, AlertTriangle } from "lucide-react";

interface TicketListItem {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  status?: string;
}

interface TicketsResponse {
    tickets: TicketListItem[];
    message?: string;
}

interface CreateTicketForm {
  title: string;
  description: string;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return "Invalid Date";
  }
};


export default function TicketsPage() {
  useEffect(() => {
    document.title = "Dashboard - TriageAI";
  }, []);

  const [form, setForm] = useState<CreateTicketForm>({ title: "", description: "" });
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingTickets, setIsLoadingTickets] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    setIsLoadingTickets(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      if (res.ok) {
        setTickets((data as TicketsResponse).tickets || []);
      } else {
        setError((data as { message?: string }).message || "Failed to fetch tickets.");
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setError("Something went wrong while fetching tickets.");
    } finally {
      setIsLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (token) fetchTickets();
    else {
        setIsLoadingTickets(false);
        setError("You need to be logged in to view tickets.");
    }
  }, [token]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
        alert("Title and description are required.");
        return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets();
      } else {
        alert((data as { message?: string }).message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <PlusCircle className="h-7 w-7 text-primary" />
            Create a New Ticket
          </CardTitle>
          <CardDescription>
            Fill out the form below to submit a new support ticket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Ticket Title</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Login button not working"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Ticket Description</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the issue..."
                rows={5}
                required
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto metallic-shine-hover">
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <header className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ListChecks className="h-8 w-8 text-primary" />
          Your Tickets
        </h2>
        <p className="text-muted-foreground">
          Browse and manage your submitted tickets.
        </p>
      </header>

      {isLoadingTickets ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                 <Skeleton className="h-4 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-destructive">
          <AlertTriangle className="mx-auto h-12 w-12 mb-3" />
          <p className="text-lg font-medium">{error}</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page or check if you are logged in.</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-10">
            <TicketIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-lg font-medium text-muted-foreground">No tickets submitted yet.</p>
            <p className="text-sm text-muted-foreground">Why not create your first one above?</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="block group">
              <Card className="h-full flex flex-col metallic-glow-hover group-hover:ring-2 group-hover:ring-primary transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {ticket.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {ticket.description}
                  </p>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground border-t pt-3 mt-auto">
                    <div className="flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                        <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}