import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones, Search, Filter, ChevronDown, ChevronRight, MessageSquare,
  Mail, Clock, CheckCircle2, XCircle, AlertCircle, Send, Paperclip,
  Smile, MoreHorizontal, Star, ThumbsUp, ThumbsDown, Tag, User,
  ArrowLeft, Plus, Trash2, Edit3, Eye, Archive, RotateCcw,
  Phone, Smartphone, FileText, Image as ImageIcon, Link, ExternalLink,
  Copy, Check, AlertTriangle, BarChart3, TrendingUp, TrendingDown
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
interface Ticket {
  id: string; subject: string; user: { name: string; email: string; avatar: string };
  status: 'open' | 'in_progress' | 'resolved' | 'closed'; priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string; createdAt: string; updatedAt: string; messages: Message[];
  assignedTo?: string; tags: string[]; rating?: number;
}

interface Message {
  id: string; author: 'user' | 'support' | 'system'; text: string; timestamp: string;
  attachments?: { name: string; url: string; size: string }[];
}

// ─── Mock Data ───────────────────────────────────────────────────────
const tickets: Ticket[] = [
  {
    id: 'TKT-001', subject: 'Commande non reçue', user: { name: 'Marie Dupont', email: 'marie@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    status: 'open', priority: 'high', category: 'Livraison', createdAt: '2025-01-15 14:30', updatedAt: '2025-01-15 14:30',
    messages: [
      { id: 'm1', author: 'user', text: 'Bonjour, j\'ai passé une commande il y a plus de 2h et je n\'ai toujours rien reçu. Numéro de commande: #CMD-1234. Merci de votre aide.', timestamp: '2025-01-15 14:30' },
    ],
    tags: ['livraison', 'retard'],
  },
  {
    id: 'TKT-002', subject: 'Problème de paiement', user: { name: 'Jean Martin', email: 'jean@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    status: 'in_progress', priority: 'urgent', category: 'Paiement', createdAt: '2025-01-15 10:15', updatedAt: '2025-01-15 11:45',
    assignedTo: 'Sophie L.',
    messages: [
      { id: 'm1', author: 'user', text: 'Ma carte a été débitée mais la commande n\'apparaît pas dans mon historique.', timestamp: '2025-01-15 10:15' },
      { id: 'm2', author: 'support', text: 'Bonjour Jean, je suis désolée pour ce désagrément. Pouvez-vous me confirmer les 4 derniers chiffres de votre carte ?', timestamp: '2025-01-15 10:30' },
      { id: 'm3', author: 'user', text: 'Les 4 derniers chiffres sont 4242.', timestamp: '2025-01-15 10:35' },
    ],
    tags: ['paiement', 'carte'],
  },
  {
    id: 'TKT-003', subject: 'Remboursement demandé', user: { name: 'Alice Bernard', email: 'alice@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
    status: 'resolved', priority: 'medium', category: 'Remboursement', createdAt: '2025-01-14 16:00', updatedAt: '2025-01-14 18:30',
    assignedTo: 'Pierre M.',
    messages: [
      { id: 'm1', author: 'user', text: 'J\'ai reçu ma commande mais un article manque. Je souhaite être remboursée.', timestamp: '2025-01-14 16:00' },
      { id: 'm2', author: 'support', text: 'Bonjour Alice, je procède au remboursement de l\'article manquant (€12.50). Vous le recevrez sous 3 à 5 jours ouvrés.', timestamp: '2025-01-14 16:15' },
      { id: 'm3', author: 'system', text: 'Remboursement de €12.50 initié.', timestamp: '2025-01-14 16:20' },
      { id: 'm4', author: 'user', text: 'Merci beaucoup pour votre réactivité !', timestamp: '2025-01-14 18:30' },
    ],
    tags: ['remboursement', 'article-manquant'],
    rating: 5,
  },
  {
    id: 'TKT-004', subject: 'Application qui plante', user: { name: 'Thomas Petit', email: 'thomas@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    status: 'closed', priority: 'low', category: 'Technique', createdAt: '2025-01-13 09:00', updatedAt: '2025-01-13 12:00',
    messages: [
      { id: 'm1', author: 'user', text: 'L\'application se ferme automatiquement quand je veux passer commande.', timestamp: '2025-01-13 09:00' },
      { id: 'm2', author: 'support', text: 'Bonjour Thomas, avez-vous essayé de redémarrer l\'application ?', timestamp: '2025-01-13 09:15' },
      { id: 'm3', author: 'user', text: 'Oui, j\'ai aussi réinstallé l\'app mais le problème persiste.', timestamp: '2025-01-13 09:30' },
      { id: 'm4', author: 'support', text: 'Merci pour ces informations. Nous avons identifié le bug et un correctif sera déployé demain.', timestamp: '2025-01-13 10:00' },
      { id: 'm5', author: 'system', text: 'Ticket fermé automatiquement.', timestamp: '2025-01-13 12:00' },
    ],
    tags: ['bug', 'app'],
  },
];

// ─── Status Config ───────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  open: { label: 'Ouvert', color: '#FF3008', bg: '#FFF0ED', icon: AlertCircle },
  in_progress: { label: 'En cours', color: '#2962FF', bg: '#E3F2FD', icon: Clock },
  resolved: { label: 'Résolu', color: '#00C853', bg: '#E8F5E9', icon: CheckCircle2 },
  closed: { label: 'Fermé', color: '#A6A6A6', bg: '#F0EEEA', icon: XCircle },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Basse', color: '#A6A6A6' },
  medium: { label: 'Moyenne', color: '#FFB300' },
  high: { label: 'Haute', color: '#FF3008' },
  urgent: { label: 'Urgente', color: '#FF3008' },
};

// ─── Components ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const c = statusConfig[status] || statusConfig.open;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium`} style={{ backgroundColor: c.bg, color: c.color }}>
      <c.icon size={12} /> {c.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const c = priorityConfig[priority] || priorityConfig.medium;
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-lg" style={{ backgroundColor: c.color + '15', color: c.color }}>
      {c.label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AdminSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.subject.toLowerCase().includes(q) || t.user.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    }
    return true;
  });

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;
  const avgResponseTime = '12 min';

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    setReplyText('');
  };

  if (selectedTicket) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedTicket(null)}
            className="w-9 h-9 rounded-lg border border-[#E8E8E8] flex items-center justify-center text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[#1A1A1A]">{selectedTicket.subject}</h2>
            <p className="text-xs text-[#A6A6A6]">{selectedTicket.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={selectedTicket.status} />
            <PriorityBadge priority={selectedTicket.priority} />
          </div>
        </div>

        {/* Info bar */}
        <div className="bg-white rounded-2xl border border-[#F0EEEA] p-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <img src={selectedTicket.user.avatar} alt={selectedTicket.user.name} className="w-8 h-8 rounded-full object-cover" />
            <div>
              <p className="text-sm font-medium text-[#1A1A1A]">{selectedTicket.user.name}</p>
              <p className="text-xs text-[#A6A6A6]">{selectedTicket.user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#A6A6A6]">
            <Tag size={12} /> {selectedTicket.category}
          </div>
          {selectedTicket.assignedTo && (
            <div className="flex items-center gap-1 text-xs text-[#A6A6A6]">
              <User size={12} /> Assigné à: {selectedTicket.assignedTo}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-[#A6A6A6]">
            <Clock size={12} /> Créé le {selectedTicket.createdAt}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-2xl border border-[#F0EEEA] p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {selectedTicket.messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.author === 'support' ? 'flex-row-reverse' : ''}`}>
              {msg.author === 'user' && (
                <img src={selectedTicket.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              )}
              {msg.author === 'support' && (
                <div className="w-8 h-8 rounded-full bg-[#FF3008] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  S
                </div>
              )}
              {msg.author === 'system' && (
                <div className="w-8 h-8 rounded-full bg-[#F0EEEA] flex items-center justify-center text-[#A6A6A6] flex-shrink-0">
                  <AlertCircle size={14} />
                </div>
              )}
              <div className={`max-w-[70%] ${msg.author === 'system' ? 'mx-auto text-center' : ''}`}>
                <div className={`p-3 rounded-2xl ${
                  msg.author === 'user' ? 'bg-[#F9F9FB] rounded-tl-none' :
                  msg.author === 'support' ? 'bg-[#FFF0ED] rounded-tr-none' :
                  'bg-[#F0EEEA]'
                }`}>
                  <p className="text-sm text-[#1A1A1A]">{msg.text}</p>
                </div>
                <p className="text-[10px] text-[#A6A6A6] mt-1">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply */}
        {selectedTicket.status !== 'closed' && (
          <div className="bg-white rounded-2xl border border-[#F0EEEA] p-4">
            <div className="relative">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Écrivez votre réponse..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] text-sm resize-none focus:outline-none focus:border-[#FF3008] pr-24"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg hover:bg-[#F9F9FB] flex items-center justify-center text-[#A6A6A6]">
                  <Paperclip size={14} />
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-[#F9F9FB] flex items-center justify-center text-[#A6A6A6]">
                  <Smile size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <select className="h-9 px-3 rounded-lg border border-[#E8E8E8] text-xs">
                  <option>Ouvert</option>
                  <option>En cours</option>
                  <option>Résolu</option>
                  <option>Fermé</option>
                </select>
                <select className="h-9 px-3 rounded-lg border border-[#E8E8E8] text-xs">
                  <option>Non assigné</option>
                  <option>Sophie L.</option>
                  <option>Pierre M.</option>
                </select>
              </div>
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="h-10 px-5 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={14} /> Envoyer
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Support</h1>
          <p className="text-sm text-[#A6A6A6]">Gérez les tickets de support client</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ouverts', value: openCount.toString(), icon: AlertCircle, color: '#FF3008' },
          { label: 'En cours', value: inProgressCount.toString(), icon: Clock, color: '#2962FF' },
          { label: 'Résolus', value: resolvedCount.toString(), icon: CheckCircle2, color: '#00C853' },
          { label: 'Temps de réponse', value: avgResponseTime, icon: BarChart3, color: '#FFB300' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-[#F0EEEA] p-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: stat.color + '15' }}>
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <p className="text-xl font-bold text-[#1A1A1A]">{stat.value}</p>
            <p className="text-xs text-[#A6A6A6]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6A6A6]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un ticket..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(statusConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
        >
          <option value="all">Toutes priorités</option>
          {Object.entries(priorityConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-[#F0EEEA]">
        <div className="divide-y divide-[#F0EEEA]">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#F9F9FB] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#F0EEEA] flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src={ticket.user.avatar} alt={ticket.user.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-medium text-[#1A1A1A]">{ticket.subject}</h4>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-[#A6A6A6]">
                  <span>{ticket.user.name}</span>
                  <span>{ticket.category}</span>
                  <span>{ticket.messages.length} message{ticket.messages.length > 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-[#A6A6A6]">{ticket.updatedAt}</p>
                {ticket.assignedTo && <p className="text-[10px] text-[#FF3008]">Assigné: {ticket.assignedTo}</p>}
              </div>
              <ChevronRight size={16} className="text-[#A6A6A6]" />
            </div>
          ))}
        </div>
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-10">
          <CheckCircle2 size={32} className="text-[#A6A6A6] mx-auto mb-2" />
          <p className="text-sm text-[#A6A6A6]">Aucun ticket trouvé</p>
        </div>
      )}
    </div>
  );
}
