import { CalendarDays, Clock, ArrowRight, MapPin, Briefcase, IndianRupee } from 'lucide-react';
import type { Booking } from '@/types/booking';
import { formatDate } from '@/utils/formatDate';
import { Card } from '@/components/ui/Card';

interface BookingCardProps {
  booking: any;
  lawyerName: string;
  lawyerSpecialization?: string;
  lawyerCategory?: string;
  lawyerCity?: string;
  clientName?: string;
  onClick?: () => void;
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  completed: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

export function BookingCard({ booking, lawyerName, lawyerSpecialization, lawyerCategory, lawyerCity, clientName, onClick }: BookingCardProps) {
  // Fallbacks for missing fields
  const date = booking.scheduledFor || booking.date;
  const time = booking.slot || (date ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined);
  const matter = booking.matter || booking.note || '';
  const amount = booking.amount;
  const status = booking.status || 'pending';
  const style = statusStyles[status] || statusStyles.pending;

  return (
    <Card className="group hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex items-start gap-4 p-4">
        {/* Avatar */}
        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white font-semibold shrink-0">
          {lawyerName
            .split(' ')
            .map((word) => word[0])
            .join('')
            .slice(0, 2)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-slate-900 truncate">{lawyerName}</h4>
              {(lawyerSpecialization || lawyerCategory || lawyerCity) && (
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                  {lawyerSpecialization && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {lawyerSpecialization}
                    </span>
                  )}
                  {lawyerCity && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {lawyerCity}
                    </span>
                  )}
                </div>
              )}
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          
          {clientName && (
            <p className="text-xs text-slate-500 mb-2">Client: <span className="font-medium">{clientName}</span></p>
          )}
          
          {matter && (
            <p className="text-sm text-slate-600 line-clamp-1 mb-3">{matter}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {date && (
              <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                {formatDate(date)}
              </span>
            )}
            {time && (
              <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {time}
              </span>
            )}
            {amount && (
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                <IndianRupee className="h-3.5 w-3.5" />
                {amount}
              </span>
            )}
          </div>
        </div>
        
        {/* Action */}
        {onClick && (
          <button 
            type="button" 
            className="shrink-0 w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
            onClick={onClick}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </Card>
  );
}
