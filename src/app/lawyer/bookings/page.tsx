"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useNotificationStore } from "@/store/notification-store";

type Booking = {
	_id: string;
	matter: string;
	clientId: string | { name?: string; email?: string; _id?: string };
	note?: string;
	slot?: string;
	date?: string;
	status: string;
	[key: string]: any;
};

const LawyerBookingsPage = () => {
	const pushToast = useNotificationStore((state) => state.pushToast);
	const user = useAuthStore((state) => state.user);
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(false);
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	useEffect(() => {
			if (!user?.id) return;
			setLoading(true);
			// Fetch lawyer profile to get lawyerId
			fetch("/api/lawyers/me", { credentials: "include" })
				.then((res) => res.json())
				.then((lawyerData) => {
					const lawyerId = lawyerData.lawyer?._id || user.id;
					return fetch(`/api/bookings?status=pending&lawyerId=${lawyerId}`, { credentials: "include" });
				})
				.then((res) => res.json())
				.then((data) => setBookings(Array.isArray(data.data) ? data.data : []))
				.catch(() => pushToast({ variant: "error", title: "Failed to fetch bookings" }))
				.finally(() => setLoading(false));
		}, [user?.id, pushToast]);

	const handleAccept = async (id: string) => {
		setUpdatingId(id);
		try {
			const res = await fetch(`/api/bookings`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status: "active" }),
				credentials: "include",
			});
			if (!res.ok) throw new Error("Failed to update booking");
			pushToast({ variant: "success", title: "Booking accepted" });
			// Refresh bookings
			// Fetch lawyer profile to get lawyerId for refresh
			const lawyerRes = await fetch("/api/lawyers/me", { credentials: "include" });
			const lawyerData = await lawyerRes.json();
			const lawyerId = lawyerData.lawyer?._id || user?.id;
			const updated = await fetch(`/api/bookings?status=pending&lawyerId=${lawyerId}`, { credentials: "include" }).then((r) => r.json());
			setBookings(Array.isArray(updated.data) ? updated.data : []);
		} catch (err) {
			pushToast({ variant: "error", title: "Failed to accept booking" });
		} finally {
			setUpdatingId(null);
		}
	};

	if (!user?.id) {
		return <p className="text-slate-500">Please log in as a lawyer to view bookings.</p>;
	}

	return (
		<section className="space-y-6">
			<header>
				<h1 className="font-display text-3xl text-accent">Booking requests</h1>
				<p className="text-slate-500">Accept pending consultations.</p>
			</header>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="space-y-4">
					{bookings.length === 0 ? (
						<p className="text-slate-500">No pending bookings.</p>
					) : (
						bookings.map((booking) => (
							<Card key={booking._id} className="border border-slate-200 shadow-sm rounded-xl p-0">
								<CardHeader className="bg-slate-50 rounded-t-xl px-6 py-4 border-b border-slate-200">
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-lg font-semibold text-accent mb-1">{booking.matter}</CardTitle>
											<CardDescription className="text-sm text-slate-600">
												<span className="font-medium">Client:</span> {typeof booking.clientId === "object" ? booking.clientId.name : booking.clientId}
											</CardDescription>
										</div>
										<span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{booking.status}</span>
									</div>
								</CardHeader>
								<CardContent className="px-6 py-4 space-y-2">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-xs text-slate-400">Date</p>
											<p className="text-sm font-medium text-slate-700">{booking.date || '-'}</p>
										</div>
										<div>
											<p className="text-xs text-slate-400">Slot</p>
											<p className="text-sm font-medium text-slate-700">{booking.slot || '-'}</p>
										</div>
									</div>
									<div>
										<p className="text-xs text-slate-400">Note</p>
										<p className="text-sm text-slate-700">{booking.note || '-'}</p>
									</div>
									<div className="flex justify-end mt-4">
										<Button
											variant="secondary"
											onClick={() => handleAccept(booking._id)}
											disabled={updatingId === booking._id}
											className="min-w-[100px]"
										>
											{updatingId === booking._id ? "Accepting..." : "Accept"}
										</Button>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>
			)}
		</section>
	);
};

export default LawyerBookingsPage;
