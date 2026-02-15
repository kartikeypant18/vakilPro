import Link from 'next/link';
import { MapPin, Briefcase, CheckCircle2, Star, Clock } from 'lucide-react';
import type { Lawyer } from '@/types/lawyer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface LawyerCardProps {
  lawyer: Lawyer & { user?: { name?: string; email?: string } };
  onSelect?: (lawyer: Lawyer) => void;
  showProfileLink?: boolean;
}

export function LawyerCard({ lawyer, onSelect, showProfileLink = true }: LawyerCardProps) {
  // Support both mock data (lawyer.name) and API data (lawyer.user?.name)
  const lawyerName = lawyer.name || lawyer.user?.name || 'Unknown Lawyer';
  // Support both _id (from MongoDB) and id (from mock data)
  const lawyerId = (lawyer as any)._id || lawyer.id;
  // Support both verified boolean and profileStatus string
  const isVerified = lawyer.verified || lawyer.profileStatus === 'verified';

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-white text-lg font-semibold shadow-md">
              {lawyerName
                .split(' ')
                .map((word) => word[0])
                .join('')
                .slice(0, 2)}
            </div>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg truncate">{lawyerName}</CardTitle>
            </div>
            <CardDescription className="text-sm mt-0.5">{lawyer.specialization ?? 'General Practice'}</CardDescription>
            {isVerified && (
              <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          {lawyer.city && (
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> {lawyer.city}
            </span>
          )}
          {lawyer.category && (
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
              <Briefcase className="h-3.5 w-3.5 text-slate-400" /> {lawyer.category}
            </span>
          )}
          {lawyer.experience && (
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
              <Clock className="h-3.5 w-3.5 text-slate-400" /> {lawyer.experience}+ yrs
            </span>
          )}
        </div>
        
        {lawyer.languages?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {lawyer.languages.slice(0, 3).map((lang) => (
              <span key={lang} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {lang}
              </span>
            ))}
            {lawyer.languages.length > 3 && (
              <span className="text-xs text-slate-400">+{lawyer.languages.length - 3} more</span>
            )}
          </div>
        ) : null}

        {lawyer.availability && (Array.isArray(lawyer.availability) ? lawyer.availability.length : lawyer.availability.slots?.length) ? (
          <div className="flex flex-wrap gap-1.5">
            {(Array.isArray(lawyer.availability) ? lawyer.availability : lawyer.availability.slots).slice(0, 3).map((slot) => (
              <span key={slot} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {slot}
              </span>
            ))}
          </div>
        ) : null}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            {lawyer.price ? (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900">₹{lawyer.price}</span>
                <span className="text-sm text-slate-500">/ session</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>Top rated</span>
              </div>
            )}
          </div>
          {onSelect ? (
            <Button size="sm" onClick={() => onSelect(lawyer)} className="group-hover:shadow-md transition-shadow">
              Book now
            </Button>
          ) : showProfileLink ? (
            <Button asChild size="sm" variant="outline" className="group-hover:border-primary group-hover:text-primary transition-colors">
              <Link href={`/user/lawyers/${lawyerId}`}>View profile</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
