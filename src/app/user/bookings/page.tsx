"use client";

import { useEffect, useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { BookingCard } from "@/components/cards/BookingCard";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

export default function UserBookingsPage() {
  const router = useRouter();
const tabs = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

  const [tab, setTab] = useState("upcoming");
  const [bookings, setBookings] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    setLoading(true);
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    apiClient
      .get("/api/bookings", { params: { clientId: user.id } })
      .then(async (res) => {
        const bookingsData = res.data.data || [];
        setBookings(bookingsData);
        // Fetch unique lawyerIds
        const uniqueLawyerIds = [...new Set(bookingsData.map((b: any) => b.lawyerId))];
        const lawyerDetails = await Promise.all(
          uniqueLawyerIds.map(async (id) => {
            try {
              const res = await apiClient.get(`/api/lawyers/${id}`);
              return [id, res.data.data];
            } catch {
              return [id, null];
            }
          })
        );
        setLawyers(Object.fromEntries(lawyerDetails));
        setLoading(false);
      })
      .catch(() => {
        setBookings([]);
        setLoading(false);
      });
  }, [user, hasMounted]);

  const filtered = bookings.filter((booking) => {
    // Debug log for each booking
    if (tab === "upcoming") {
      return ["pending", "confirmed", "active"].includes((booking.status || '').toLowerCase());
    } else {
      return (booking.status || '').toLowerCase() === "completed";
    }
  });

  if (!hasMounted) return null;

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-accent">Bookings</h1>
          <p className="text-slate-500">Upcoming and past consultations.</p>
        </div>
        <Tabs tabs={tabs} value={tab} onChange={setTab} />
      </header>
      <div className="space-y-4">
        {loading ? (
          <div className="text-slate-400">Loading bookings...</div>
        ) : filtered.length === 0 && user ? (
          <div className="text-slate-400">No bookings found.</div>
        ) : (
          filtered.map((booking) => {
            const lawyer = lawyers[booking.lawyerId];
            return (
              <BookingCard
                key={booking._id || booking.id}
                booking={booking}
                lawyerName={lawyer?.user?.name || lawyer?.name || "Assigned lawyer"}
                lawyerSpecialization={lawyer?.specialization || ""}
                lawyerCategory={lawyer?.category || ""}
                lawyerCity={lawyer?.city || ""}
                onClick={() => router.push(`/user/bookings/${booking._id || booking.id}`)}
              />
            );
          })
        )}
      </div>
    </section>
  );
}
