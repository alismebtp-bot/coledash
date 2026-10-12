import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  TrendingUp,
  Sun,
  Moon,
} from 'lucide-react';

/* ─────────────────────── types ─────────────────────── */

interface ShiftSlot {
  id: string;
  start: string;
  end: string;
  zone: string;
  estimatedEarnings: number;
  booked: boolean;
}

interface DaySchedule {
  date: string;
  dayName: string;
  dayNum: number;
  slots: ShiftSlot[];
}

/* ─────────────────────── mock data ─────────────────────── */

const ZONES = ['Centre', 'Marais', 'Montmartre', 'Bastille', 'La Défense'];

function generateMockSchedule(): DaySchedule[] {
  const days: DaySchedule[] = [];
  const today = new Date();
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const slots: ShiftSlot[] = [];
    const numSlots = isWeekend ? 4 : 3;

    const slotTemplates = [
      { start: '11:00', end: '14:00', zone: ZONES[0], earnings: 25 },
      { start: '12:00', end: '15:00', zone: ZONES[1], earnings: 28 },
      { start: '18:00', end: '21:00', zone: ZONES[2], earnings: 35 },
      { start: '19:00', end: '22:30', zone: ZONES[3], earnings: 40 },
      { start: '11:30', end: '14:30', zone: ZONES[4], earnings: 22 },
    ];

    for (let j = 0; j < numSlots; j++) {
      const tmpl = slotTemplates[j % slotTemplates.length];
      const booked = i < 2 && j < 2; // First 2 days have some booked slots
      slots.push({
        id: `slot-${i}-${j}`,
        start: tmpl.start,
        end: tmpl.end,
        zone: tmpl.zone,
        estimatedEarnings: tmpl.earnings + Math.floor(Math.random() * 15),
        booked,
      });
    }

    days.push({
      date: date.toISOString().split('T')[0],
      dayName: dayNames[dayOfWeek],
      dayNum: date.getDate(),
      slots,
    });
  }

  return days;
}

/* ─────────────────────── sub-components ─────────────────────── */

function TimeIcon({ start }: { start: string }) {
  const hour = parseInt(start.split(':')[0], 10);
  const isDay = hour >= 6 && hour < 18;
  return isDay ? <Sun size={14} className="text-cd-warning" /> : <Moon size={14} className="text-cd-info" />;
}

function SlotCard({
  slot,
  onToggle,
}: {
  slot: ShiftSlot;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-3 rounded-lg border transition-all ${
        slot.booked
          ? 'bg-cd-primary-light border-cd-primary'
          : 'bg-white border-cd-border hover:border-cd-primary/50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TimeIcon start={slot.start} />
          <span className="text-sm font-semibold text-cd-text-primary">
            {slot.start} – {slot.end}
          </span>
        </div>
        <button
          onClick={onToggle}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            slot.booked
              ? 'bg-cd-error text-white hover:bg-cd-primary-dark'
              : 'bg-cd-primary text-white hover:bg-cd-primary-hover'
          }`}
        >
          {slot.booked ? <Trash2 size={13} /> : <Plus size={13} />}
        </button>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-cd-text-secondary">
          <MapPin size={11} />
          {slot.zone}
        </span>
        <span className="flex items-center gap-1 text-cd-success font-medium">
          <DollarSign size={11} />
          ~{slot.estimatedEarnings} €
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── main component ─────────────────────── */

export default function DriverSchedule() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(generateMockSchedule);
  const [weekOffset, setWeekOffset] = useState(0);

  const toggleSlot = (dayIdx: number, slotId: string) => {
    setSchedule((prev) => {
      const next = [...prev];
      const day = { ...next[dayIdx] };
      day.slots = day.slots.map((s) => (s.id === slotId ? { ...s, booked: !s.booked } : s));
      next[dayIdx] = day;
      return next;
    });
  };

  const visibleDays = schedule.slice(weekOffset * 7, weekOffset * 7 + 7);

  const totalBooked = schedule.reduce(
    (sum, d) => sum + d.slots.filter((s) => s.booked).reduce((s, slot) => s + slot.estimatedEarnings, 0),
    0
  );
  const totalHours = schedule.reduce(
    (sum, d) =>
      sum +
      d.slots
        .filter((s) => s.booked)
        .reduce((h, slot) => {
          const startH = parseInt(slot.start.split(':')[0], 10);
          const endH = parseInt(slot.end.split(':')[0], 10);
          return h + (endH - startH);
        }, 0),
    0
  );
  const bookedCount = schedule.reduce((sum, d) => sum + d.slots.filter((s) => s.booked).length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[900px] mx-auto space-y-5"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-mp-text">Planning</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
            disabled={weekOffset === 0}
            className="w-9 h-9 rounded-lg bg-white border border-cd-border flex items-center justify-center hover:bg-cd-bg-warm transition-colors disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-cd-text-primary w-32 text-center">
            Semaine {weekOffset + 1}
          </span>
          <button
            onClick={() => setWeekOffset((w) => Math.min(1, w + 1))}
            disabled={weekOffset === 1}
            className="w-9 h-9 rounded-lg bg-white border border-cd-border flex items-center justify-center hover:bg-cd-bg-warm transition-colors disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-1">Créneaux réservés</p>
          <p className="text-[28px] font-extrabold text-cd-text-primary leading-tight">{bookedCount}</p>
          <p className="text-xs text-cd-text-tertiary mt-1">Cette semaine</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-1">Heures planifiées</p>
          <p className="text-[28px] font-extrabold text-cd-text-primary leading-tight">{totalHours}h</p>
          <p className="text-xs text-cd-text-tertiary mt-1">Environ</p>
        </div>
        <div className="bg-gradient-to-r from-[#FFF0ED] to-white rounded-xl p-4 shadow-sm border border-[#FFD5CC]">
          <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-1">Gains estimés</p>
          <p className="text-[28px] font-extrabold text-cd-success leading-tight">{totalBooked.toFixed(2)} €</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className="text-cd-success" />
            <span className="text-xs text-cd-success font-medium">+12% vs semaine dernière</span>
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="space-y-4">
        {visibleDays.map((day, dayIdx) => {
          const actualIdx = weekOffset * 7 + dayIdx;
          const isToday = actualIdx === 0;
          const hasBooked = day.slots.some((s) => s.booked);

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIdx * 0.05 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Day Header */}
              <div className={`px-5 py-3 flex items-center justify-between ${isToday ? 'bg-cd-primary-light' : 'bg-cd-bg-warm'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    isToday ? 'bg-cd-primary text-white' : 'bg-white text-cd-text-primary'
                  }`}>
                    {day.dayNum}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isToday ? 'text-cd-primary' : 'text-cd-text-primary'}`}>
                      {day.dayName}{isToday && ' · Aujourd\'hui'}
                    </p>
                    <p className="text-xs text-cd-text-tertiary">
                      {day.slots.filter((s) => s.booked).length} / {day.slots.length} créneaux réservés
                    </p>
                  </div>
                </div>
                {hasBooked && (
                  <span className="px-2.5 py-1 bg-cd-success-light text-cd-success text-[10px] font-bold rounded-full">
                    RÉSERVÉ
                  </span>
                )}
              </div>

              {/* Slots */}
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {day.slots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    onToggle={() => toggleSlot(actualIdx, slot.id)}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
