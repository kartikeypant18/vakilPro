"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CountryStateCityPicker } from "@/components/ui/CountryStateCityPicker";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/Popover";
import { Calendar } from "@/components/ui/Calendar";

import { useNotificationStore } from "@/store/notification-store";
import { format } from "date-fns";

export default function LawyerProfilePage() {
  const pushToast = useNotificationStore((s) => s.pushToast);

  const [form, setForm] = useState({
    specialization: "",
    category: "",
    experience: 0,
    price: 0,
    languages: "",
    country: "",
    state: "",
    city: "",
  });

  const [dates, setDates] = useState<Date[]>([]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // load profile
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/lawyers/me");
      const d = await r.json();
      const { lawyer, user } = d;

      setForm({
        specialization: lawyer.specialization,
        category: lawyer.category,
        experience: lawyer.experience,
        price: lawyer.price,
        languages: lawyer.languages.join(", "),
        country: lawyer.country || "",
        state: lawyer.state || "",
        city: lawyer.city || "",
      });

      setDates(lawyer.availability.dates.map((d: string) => new Date(d)));
      setSlots(lawyer.availability.slots);
    })();
  }, []);

  const addSlot = () => {
    if (!fromTime || !toTime) {
      pushToast({ title: "Missing", description: "Select both times", variant: "error" });
      return;
    }

    const slot = `${fromTime} - ${toTime}`;
    setSlots((prev) => [...prev, slot]);
    setFromTime("");
    setToTime("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      languages: form.languages.split(",").map((s) => s.trim()),
      availability: {
        dates: dates.map((d) => d.toISOString().split("T")[0]),
        slots,
      },
    };

    await fetch("/api/lawyers/me", {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    pushToast({ title: "Saved", description: "Profile updated", variant: "success" });
    setLoading(false);
  };

  return (
    <form className="space-y-6 max-w-2xl" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold">Lawyer Profile</h1>

      {/* specialization */}
      <div>
        <label className="block font-medium mb-1">Specialization</label>
        <Input
          placeholder="Specialization"
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
        />
      </div>

      {/* category */}
      <div>
        <label className="block font-medium mb-1">Category</label>
        <Input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </div>

      {/* experience */}
      <div>
        <label className="block font-medium mb-1">Experience (years)</label>
        <Input
          type="number"
          placeholder="Experience"
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
        />
      </div>

      {/* price */}
      <div>
        <label className="block font-medium mb-1">Price per session</label>
        <Input
          type="number"
          placeholder="Price per session"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
      </div>

      {/* languages */}
      <div>
        <label className="block font-medium mb-1">Languages (comma separated)</label>
        <Input
          placeholder="Languages (comma separated)"
          value={form.languages}
          onChange={(e) => setForm({ ...form, languages: e.target.value })}
        />
      </div>

      {/* city */}
      <div>
        <label className="block font-medium mb-1">Location</label>
        <CountryStateCityPicker
          value={{ country: form.country, state: form.state, city: form.city }}
          onChange={(val) => setForm({ ...form, ...val })}
        />
      </div>

      {/* date picker */}
      <div>
        <label className="text-sm font-medium">Available Dates</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              {dates.length > 0
                ? dates.map((d) => format(d, "dd MMM")).join(", ")
                : "Pick dates"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2">
            <Calendar mode="multiple" selected={dates} onSelect={setDates} />
          </PopoverContent>
        </Popover>
      </div>

      {/* time slots */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Available Time Slots</label>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="time"
            className="border p-2 rounded"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
          />
          <input
            type="time"
            className="border p-2 rounded"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
          />
        </div>

        <Button type="button" onClick={addSlot}>
          Add Slot
        </Button>

        {slots.map((slot, i) => (
          <div key={i} className="bg-gray-100 p-2 rounded text-sm">
            {slot}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving…" : "Save Profile"}
      </Button>
    </form>
  );
}
