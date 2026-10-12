import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  CheckCircle2,
  Filter,
  Search,
  TrendingUp,
  User,
  Clock,
  Reply,
  ChevronDown,
} from 'lucide-react';

/* ─────────────────────── types ─────────────────────── */

type ReviewRating = 1 | 2 | 3 | 4 | 5;
type ReviewStatus = 'pending' | 'replied' | 'flagged' | 'resolved';

interface Review {
  id: string;
  customerName: string;
  customerInitials: string;
  rating: ReviewRating;
  comment: string;
  date: string;
  status: ReviewStatus;
  reply?: string;
  replyDate?: string;
  orderId: string;
  items: string[];
  helpful: number;
}

/* ─────────────────────── mock data ─────────────────────── */

const mockReviews: Review[] = [
  {
    id: 'rev-001',
    customerName: 'Marie L.',
    customerInitials: 'ML',
    rating: 5,
    comment: 'Excellent burger, la viande était parfaitement cuite et les frites croustillantes ! Livraison rapide et chaude. Je recommande vivement.',
    date: '2025-01-15',
    status: 'replied',
    reply: 'Merci beaucoup Marie ! Ravie que vous ayez apprécié. À bientôt !',
    replyDate: '2025-01-15',
    orderId: '#CD-2841',
    items: ['Burger Classic', 'Frites Maison'],
    helpful: 12,
  },
  {
    id: 'rev-002',
    customerName: 'Pierre D.',
    customerInitials: 'PD',
    rating: 4,
    comment: 'Très bon, mais la livraison a pris un peu plus de temps que prévu. Sinon tout était parfait, surtout le milkshake !',
    date: '2025-01-14',
    status: 'pending',
    orderId: '#CD-2840',
    items: ['Double Smash', 'Milkshake Vanille'],
    helpful: 5,
  },
  {
    id: 'rev-003',
    customerName: 'Sophie B.',
    customerInitials: 'SB',
    rating: 5,
    comment: 'Le veggie burger est incroyable ! Enfin une option végétarienne qui a du goût. Merci ColeDash !',
    date: '2025-01-13',
    status: 'replied',
    reply: 'Merci Sophie ! Notre chef met tout son cœur dans le veggie burger. Au plaisir !',
    replyDate: '2025-01-13',
    orderId: '#CD-2839',
    items: ['Veggie Burger'],
    helpful: 8,
  },
  {
    id: 'rev-004',
    customerName: 'Jean M.',
    customerInitials: 'JM',
    rating: 2,
    comment: 'Déçu cette fois. Le burger était froid et les frites molles. J\'espère que ce n\'est qu\'un accident.',
    date: '2025-01-12',
    status: 'flagged',
    orderId: '#CD-2838',
    items: ['Bacon BBQ', 'Frites Maison'],
    helpful: 3,
  },
  {
    id: 'rev-005',
    customerName: 'Claire R.',
    customerInitials: 'CR',
    rating: 5,
    comment: 'Service impeccable, commande arrivée en 20 minutes et tout était chaud. Le packaging est top aussi !',
    date: '2025-01-11',
    status: 'resolved',
    reply: 'Merci Claire ! On fait attention à chaque détail.',
    replyDate: '2025-01-11',
    orderId: '#CD-2837',
    items: ['Burger Classic', 'Frites Maison', 'Coca-Cola'],
    helpful: 15,
  },
];

const statusMeta: Record<ReviewStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-cd-warning', bg: 'bg-cd-warning-light' },
  replied: { label: 'Répondu', color: 'text-cd-success', bg: 'bg-cd-success-light' },
  flagged: { label: 'Signalé', color: 'text-cd-error', bg: 'bg-cd-error-light' },
  resolved: { label: 'Résolu', color: 'text-cd-info', bg: 'bg-cd-info-light' },
};

/* ─────────────────────── sub-components ─────────────────────── */

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? 'text-cd-warning fill-cd-warning' : 'text-cd-border'}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  onReply,
  onStatusChange,
}: {
  review: Review;
  onReply: (id: string, reply: string) => void;
  onStatusChange: (id: string, status: ReviewStatus) => void;
}) {
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);
  const status = statusMeta[review.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-5 space-y-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cd-primary/10 flex items-center justify-center text-cd-primary text-sm font-bold">
            {review.customerInitials}
          </div>
          <div>
            <p className="text-sm font-semibold text-cd-text-primary">{review.customerName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={review.rating} />
              <span className="text-xs text-cd-text-tertiary">{review.date}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Order ref */}
      <div className="flex items-center gap-3 text-xs text-cd-text-tertiary">
        <span>{review.orderId}</span>
        <span>·</span>
        <span>{review.items.join(', ')}</span>
      </div>

      {/* Comment */}
      <p className="text-sm text-cd-text-primary leading-relaxed">{review.comment}</p>

      {/* Reply */}
      {review.reply && (
        <div className="bg-cd-bg-warm rounded-lg p-3 ml-6">
          <div className="flex items-center gap-2 mb-1">
            <ChefHat size={12} className="text-cd-primary" />
            <span className="text-xs font-semibold text-cd-primary">Votre réponse</span>
            <span className="text-xs text-cd-text-tertiary">{review.replyDate}</span>
          </div>
          <p className="text-sm text-cd-text-secondary">{review.reply}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-xs text-cd-text-tertiary hover:text-cd-primary transition-colors">
            <ThumbsUp size={12} />
            {review.helpful}
          </button>
          {review.status === 'pending' && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-xs text-cd-primary hover:underline"
            >
              <Reply size={12} />
              Répondre
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {review.status === 'pending' && (
            <button
              onClick={() => onStatusChange(review.id, 'flagged')}
              className="p-1.5 text-cd-text-tertiary hover:text-cd-error transition-colors"
              title="Signaler"
            >
              <Flag size={14} />
            </button>
          )}
          {review.status === 'flagged' && (
            <button
              onClick={() => onStatusChange(review.id, 'resolved')}
              className="px-3 py-1 bg-cd-success text-white text-xs font-medium rounded-lg hover:bg-[#00b34a] transition-colors"
            >
              Marquer comme résolu
            </button>
          )}
        </div>
      </div>

      {/* Reply form */}
      <AnimatePresence>
        {showReply && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 pt-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Votre réponse..."
                className="flex-1 px-3 py-2 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && replyText.trim()) {
                    onReply(review.id, replyText);
                    setReplyText('');
                    setShowReply(false);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (replyText.trim()) {
                    onReply(review.id, replyText);
                    setReplyText('');
                    setShowReply(false);
                  }
                }}
                className="px-4 py-2 bg-cd-primary text-white text-sm font-medium rounded-lg hover:bg-cd-primary-hover transition-colors"
              >
                Envoyer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ChefHat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 12}
      height={props.height || 12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 4 4 0 0 0-7.04 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" />
      <path d="M6 17h12" />
    </svg>
  );
}

/* ─────────────────────── main component ─────────────────────── */

export default function MerchantReviews() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const handleReply = (id: string, reply: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, reply, replyDate: new Date().toISOString().split('T')[0], status: 'replied' as ReviewStatus }
          : r
      )
    );
  };

  const handleStatusChange = (id: string, status: ReviewStatus) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return r.customerName.toLowerCase().includes(s) || r.comment.toLowerCase().includes(s);
    }
    return true;
  });

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));
  const maxCount = Math.max(...ratingCounts.map((r) => r.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[800px] mx-auto space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-mp-text">Avis clients</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cd-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="pl-9 pr-4 py-2 border border-cd-border rounded-lg text-sm text-cd-text-primary focus:outline-none focus:border-cd-primary"
          />
        </div>
      </div>

      {/* Rating summary */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-[48px] font-extrabold text-cd-text-primary leading-none">{avgRating.toFixed(1)}</p>
            <StarRating rating={Math.round(avgRating)} size={16} />
            <p className="text-xs text-cd-text-tertiary mt-1">{reviews.length} avis</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingCounts.map((r) => (
              <div key={r.star} className="flex items-center gap-3">
                <span className="text-xs text-cd-text-secondary w-3">{r.star}</span>
                <Star size={10} className="text-cd-warning fill-cd-warning" />
                <div className="flex-1 h-2 bg-cd-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cd-warning rounded-full"
                    style={{ width: `${maxCount > 0 ? (r.count / maxCount) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-cd-text-tertiary w-6 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
        {([
          { key: 'all', label: 'Tous' },
          { key: 'pending', label: 'En attente' },
          { key: 'replied', label: 'Répondus' },
          { key: 'flagged', label: 'Signalés' },
          { key: 'resolved', label: 'Résolus' },
        ] as const).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === f.key
                ? 'bg-cd-primary text-white'
                : 'text-cd-text-secondary hover:bg-cd-bg-warm'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReply={handleReply}
              onStatusChange={handleStatusChange}
            />
          ))}
        </AnimatePresence>
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare size={40} className="mx-auto text-cd-text-tertiary mb-3" />
            <p className="text-sm text-cd-text-secondary">Aucun avis trouvé</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
