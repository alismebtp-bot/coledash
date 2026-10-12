import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, MessageCircle, CheckCircle, Truck, Package } from 'lucide-react';

const steps = [
  { id: 'placed', label: 'Commande passée', icon: CheckCircle },
  { id: 'preparing', label: 'En préparation', icon: Package },
  { id: 'ready', label: 'Prête', icon: CheckCircle },
  { id: 'picked', label: 'Prise en charge', icon: Truck },
  { id: 'delivered', label: 'Livrée', icon: CheckCircle },
];

export default function OrderTracking() {
  const { id } = useParams();
  const currentStep = 2; // Mock: preparing

  return (
    <div className="min-h-screen bg-[#faf9f7] pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-stone-800 mb-2">Suivi de commande</h1>
        <p className="text-stone-500 mb-8">Commande #{id}</p>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-stone-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, i) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  i <= currentStep ? 'bg-[#e11d48] text-white' : 'bg-stone-100 text-stone-400'
                }`}>
                  <step.icon size={18} />
                </div>
                <span className={`text-xs mt-2 ${i <= currentStep ? 'text-stone-800 font-medium' : 'text-stone-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-rose-50 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e11d48] flex items-center justify-center">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-800">En préparation</h3>
                <p className="text-sm text-stone-500">Votre commande est en cours de préparation.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Driver */}
        <div className="bg-white rounded-xl border border-stone-100 p-6 mb-6">
          <h2 className="font-semibold text-stone-800 mb-4">Votre livreur</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-stone-200" />
            <div className="flex-1">
              <p className="font-medium text-stone-800">Thomas M.</p>
              <div className="flex items-center gap-1 text-sm text-stone-500">
                <MapPin size={14} />
                <span>À 5 min de vous</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200">
                <Phone size={18} className="text-stone-600" />
              </button>
              <button className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200">
                <MessageCircle size={18} className="text-stone-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
