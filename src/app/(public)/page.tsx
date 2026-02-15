// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import Link from 'next/link';
// import { PublicNavbar } from '@/components/navbar/Navbar';
// import { Button } from '@/components/ui/Button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
// import { Input } from '@/components/ui/Input';
// import { LawyerCard } from '@/components/cards/LawyerCard';
// import { ShieldCheck, Video, Calendar, CreditCard, Search, MapPin, Briefcase, ArrowRight, Star } from 'lucide-react';

// const featureCards = [
//   {
//     title: 'Verified lawyers',
//     description: 'Every expert passes document checks, mock hearings, and live interviews before appearing in search.',
//     icon: ShieldCheck,
//     color: 'text-emerald-500',
//     bg: 'bg-emerald-50',
//   },
//   {
//     title: 'Secure OTP sessions',
//     description: 'Two-factor OTP access and encrypted WebRTC calls protect each consultation end-to-end.',
//     icon: Video,
//     color: 'text-blue-500',
//     bg: 'bg-blue-50',
//   },
//   {
//     title: 'Smart bookings',
//     description: 'Choose slots, lock payments, and receive reminders that sync across user, lawyer, and admin portals.',
//     icon: Calendar,
//     color: 'text-violet-500',
//     bg: 'bg-violet-50',
//   },
//   {
//     title: 'Integrated payments',
//     description: 'Razorpay-powered flows with instant refunds, GST invoices, and admin monitoring built-in.',
//     icon: CreditCard,
//     color: 'text-amber-500',
//     bg: 'bg-amber-50',
//   },
// ];

// export default function LandingPage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCity, setSelectedCity] = useState('all');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [lawyers, setLawyers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch lawyers from API
//   useEffect(() => {
//     fetch('/api/lawyers')
//       .then((res) => res.json())
//       .then((data) => {
//         setLawyers(data.data || []);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   // Derive filter options from fetched lawyers
//   const cityOptions = useMemo(() => 
//     ['all', ...new Set(lawyers.map((lawyer) => lawyer.city).filter((city): city is string => Boolean(city)))],
//     [lawyers]
//   );
//   const categoryOptions = useMemo(() => 
//     ['all', ...new Set(lawyers.map((lawyer) => lawyer.category ?? lawyer.specialization).filter((value): value is string => Boolean(value)))],
//     [lawyers]
//   );

//   const filteredLawyers = useMemo(() => {
//     return lawyers
//       .filter((lawyer) => {
//         const matchesName = (lawyer.name ?? '').toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesCategory = (lawyer.specialization ?? '').toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesCityInput = (lawyer.city ?? '').toLowerCase().includes(searchTerm.toLowerCase());

//         const matchesSearch = searchTerm ? matchesName || matchesCategory || matchesCityInput : true;
//         const matchesCity = selectedCity === 'all' ? true : lawyer.city?.toLowerCase() === selectedCity.toLowerCase();
//         const categoryValue = ((lawyer.category ?? lawyer.specialization) ?? '').toLowerCase();
//         const matchesCategoryFilter =
//           selectedCategory === 'all' ? true : categoryValue === selectedCategory.toLowerCase();

//         return matchesSearch && matchesCity && matchesCategoryFilter;
//       })
//       .slice(0, 3);
//   }, [lawyers, searchTerm, selectedCity, selectedCategory]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
//       <PublicNavbar />
//       <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 pb-20 pt-8">
//         {/* Hero Section */}
//         <section className="grid items-center gap-8 lg:gap-12 rounded-3xl bg-white px-6 sm:px-10 py-10 sm:py-14 shadow-lg border border-slate-100 lg:grid-cols-2">
//           <div className="space-y-6">
//             <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
//               <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
//               Legal help in 60 seconds
//             </div>
//             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
//               India&apos;s fastest way to book <span className="text-primary">verified lawyers</span>
//             </h1>
//             <p className="text-lg text-slate-600 leading-relaxed">
//               Vakil connects clients, lawyers, and admins on a single secure workspace with OTP protected video calls,
//               intuitive bookings, and role-aware dashboards.
//             </p>
//             <div className="flex flex-wrap gap-4 pt-2">
//               <Button asChild size="lg" className="gap-2">
//                 <Link href="/auth/register">
//                   Get started
//                   <ArrowRight className="w-4 h-4" />
//                 </Link>
//               </Button>
//               <Button asChild variant="outline" size="lg">
//                 <Link href="/user/lawyers">Browse lawyers</Link>
//               </Button>
//             </div>
//             <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-slate-500">
//               <div className="flex -space-x-2">
//                 {[1, 2, 3, 4].map((i) => (
//                   <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
//                     {String.fromCharCode(64 + i)}
//                   </div>
//                 ))}
//               </div>
//               <span>Trusted by <strong className="text-slate-700">500+</strong> clients</span>
//               <div className="flex items-center gap-1">
//                 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
//                 <span><strong className="text-slate-700">4.9</strong> rating</span>
//               </div>
//             </div>
//           </div>
//           <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0 shadow-xl">
//             <CardHeader>
//               <CardTitle className="text-white text-xl">Live session snapshot</CardTitle>
//               <CardDescription className="text-white/80">
//                 Realtime availability, secure Razorpay payments, and crisp notes sync across devices.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between rounded-2xl bg-white/15 backdrop-blur-sm px-4 py-3">
//                 <div>
//                   <p className="text-sm text-white/70">Next session</p>
//                   <p className="text-lg font-semibold">Your Best Lawyer</p>
//                 </div>
//                 <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium">10:00 AM</span>
//               </div>
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div className="rounded-2xl bg-white/15 backdrop-blur-sm px-4 py-3">
//                   <p className="text-white/70">OTP</p>
//                   <p className="text-xl font-bold tracking-widest">******</p>
//                 </div>
//                 <div className="rounded-2xl bg-white/15 backdrop-blur-sm px-4 py-3">
//                   <p className="text-white/70">Status</p>
//                   <p className="text-xl font-bold text-emerald-300">Ready</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </section>

//         {/* Search Section */}
//         <section className="rounded-2xl bg-white p-4 sm:p-6 shadow-md border border-slate-100">
//           <div className="grid gap-4 md:grid-cols-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//               <Input
//                 placeholder="Search by name or keyword"
//                 value={searchTerm}
//                 onChange={(event) => setSearchTerm(event.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <div className="relative">
//               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
//               <select
//                 value={selectedCity}
//                 onChange={(event) => setSelectedCity(event.target.value)}
//                 className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
//               >
//                 <option value="all">All cities</option>
//                 {cityOptions.filter(c => c !== 'all').map((city) => (
//                   <option key={city} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="relative">
//               <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
//               <select
//                 value={selectedCategory}
//                 onChange={(event) => setSelectedCategory(event.target.value)}
//                 className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
//               >
//                 <option value="all">All categories</option>
//                 {categoryOptions.filter(c => c !== 'all').map((category) => (
//                   <option key={category} value={category.toLowerCase()}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </section>

//         {/* Lawyers Section */}
//         <section className="space-y-6">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div>
//               <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Available lawyers</h2>
//               <p className="text-slate-500 mt-1">Filtered by your city, name, or category preferences.</p>
//             </div>
//             <Button asChild variant="outline" className="gap-2">
//               <Link href="/user/lawyers">
//                 See all lawyers
//                 <ArrowRight className="w-4 h-4" />
//               </Link>
//             </Button>
//           </div>
//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//             {loading ? (
//               <div className="col-span-full flex items-center justify-center py-12">
//                 <div className="flex flex-col items-center gap-3">
//                   <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
//                   <p className="text-sm text-slate-500">Loading lawyers...</p>
//                 </div>
//               </div>
//             ) : filteredLawyers.length ? (
//               filteredLawyers.map((lawyer) => <LawyerCard key={lawyer._id || lawyer.id} lawyer={lawyer} />)
//             ) : (
//               <div className="col-span-full text-center py-12">
//                 <p className="text-slate-500">No lawyers match your filters yet.</p>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Features Section */}
//         <section className="space-y-6">
//           <div className="text-center space-y-2">
//             <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why choose Vakil?</h2>
//             <p className="text-slate-500">Everything you need for seamless legal consultations</p>
//           </div>
//           <div className="grid gap-5 sm:grid-cols-2">
//             {featureCards.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Card key={item.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
//                   <CardHeader>
//                     <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
//                       <Icon className={`w-6 h-6 ${item.color}`} />
//                     </div>
//                     <CardTitle className="text-lg">{item.title}</CardTitle>
//                     <CardDescription className="leading-relaxed">{item.description}</CardDescription>
//                   </CardHeader>
//                 </Card>
//               );
//             })}
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="rounded-3xl bg-gradient-to-br from-primary to-primary/90 p-8 sm:p-12 text-center text-white">
//           <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to get started?</h2>
//           <p className="text-white/80 max-w-xl mx-auto mb-6">
//             Join thousands of clients who trust Vakil for their legal consultations. Sign up today and connect with verified lawyers instantly.
//           </p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
//               <Link href="/auth/register">Create free account</Link>
//             </Button>
//             <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
//               <Link href="/about">Learn more</Link>
//             </Button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }




'use client';

import Link from 'next/link';
import { PublicNavbar } from '@/components/navbar/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Video, Calendar, CreditCard, ArrowRight } from 'lucide-react';

export default function LaunchingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <PublicNavbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-12">

        {/* 🚀 HERO */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Launching Soon
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
            Perfect Vakeel is coming
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            India’s smart legal consultation platform connecting clients with verified lawyers
            through secure video sessions, seamless bookings, and trusted legal support —
            all in one place.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {/* <Button size="lg" className="gap-2">
              Get early access
              <ArrowRight className="w-4 h-4" />
            </Button> */}

            {/* <Button size="lg" variant="outline">
              Contact us
            </Button> */}
          </div>
        </section>

        {/* 🏛️ ABOUT CARD */}
        <section>
          <Card className="shadow-lg border border-slate-100">
            <CardHeader>
              <CardTitle>About Perfect Vakeel</CardTitle>
              <CardDescription>
                A new era of legal consultations
              </CardDescription>
            </CardHeader>

            <CardContent className="text-slate-600 leading-relaxed">
              Perfect Vakeel simplifies how people access legal services. Discover trusted
              lawyers, book consultations instantly, and attend secure video sessions with
              OTP-based access — all on a single platform designed for clients, lawyers,
              and administrators.
            </CardContent>
          </Card>
        </section>

        {/* ⭐ FEATURES PREVIEW */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            What you’ll get
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                title: 'Verified lawyers',
                description: 'Only vetted professionals available for consultation.',
                icon: ShieldCheck,
                color: 'text-emerald-500',
                bg: 'bg-emerald-50',
              },
              {
                title: 'Secure video sessions',
                description: 'Encrypted consultations with OTP protection.',
                icon: Video,
                color: 'text-blue-500',
                bg: 'bg-blue-50',
              },
              {
                title: 'Smart bookings',
                description: 'Schedule consultations with real-time availability.',
                icon: Calendar,
                color: 'text-violet-500',
                bg: 'bg-violet-50',
              },
              {
                title: 'Integrated payments',
                description: 'Safe transactions with instant confirmations.',
                icon: CreditCard,
                color: 'text-amber-500',
                bg: 'bg-amber-50',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 📩 NOTIFY SECTION */}
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary/90 p-8 text-center text-white space-y-4">
          <h2 className="text-2xl font-bold">Get notified on launch</h2>

          <p className="text-white/80 max-w-xl mx-auto">
            Be the first to experience Perfect Vakeel when we go live.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Input placeholder="Enter your email" className="max-w-xs bg-white text-slate-900" />
            <Button variant="secondary" className="bg-white text-primary">
              Notify me
            </Button>
          </div>
        </section>

      </main>
    </div>
  );
}