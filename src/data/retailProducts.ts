/** Catalogue of the retail shops (pharmacies, cavistes, high-tech, librairies). */

export type RetailCategory = 'Pharmacie' | 'Caviste' | 'High-tech' | 'Librairie'

export interface RetailProduct {
  id: string
  /** Matches Store.category of retail stores. */
  storeCategory: RetailCategory
  subcategory: string
  name: string
  brand: string
  description: string
  price: number
  originalPrice?: number
  image: string
  /** Format / contenance, e.g. "75 cl", "400 ml". */
  size?: string
  origin?: string
  tags: string[]
  isAlcohol?: boolean
  isNew?: boolean
  isBestseller?: boolean
}

export const retailCategories: { id: RetailCategory; label: string; description: string; image: string }[] = [
  { id: 'Pharmacie', label: 'Pharmacie', description: 'Parapharmacie, soins et hygiène', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&h=600&fit=crop' },
  { id: 'Caviste', label: 'Caviste', description: 'Vins, bulles et spiritueux', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&h=600&fit=crop' },
  { id: 'High-tech', label: 'High-tech', description: 'Chargeurs, audio et accessoires', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=600&fit=crop' },
  { id: 'Librairie', label: 'Librairie', description: 'Romans, beaux livres et papeterie', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&h=600&fit=crop' },
]

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop`

export const retailProducts: RetailProduct[] = [
  // ── Parapharmacie ───────────────────────────────────────
  { id: 'rp-para-01', storeCategory: 'Pharmacie', subcategory: 'Visage', name: 'Eau micellaire apaisante', brand: 'Thermes d’Auvergne', description: 'Démaquille et nettoie le visage et les yeux sans rinçage. Formulée pour les peaux sensibles, sans parfum.', price: 8.9, image: img('1556228578-8c89e6adf883'), size: '400 ml', origin: 'France', tags: ['peaux sensibles', 'sans parfum'], isBestseller: true },
  { id: 'rp-para-02', storeCategory: 'Pharmacie', subcategory: 'Visage', name: 'Crème hydratante peaux sèches', brand: 'Laboratoire Mistral', description: 'Crème riche à l’eau thermale et au beurre de karité. Hydrate 24 h et apaise les tiraillements.', price: 15.9, originalPrice: 18.5, image: img('1571781926291-c477ebfd024b'), size: '50 ml', origin: 'France', tags: ['hydratation', 'peaux sèches'] },
  { id: 'rp-para-03', storeCategory: 'Pharmacie', subcategory: 'Visage', name: 'Sérum éclat vitamine C', brand: 'Laboratoire Mistral', description: 'Sérum concentré à 15 % de vitamine C pour unifier le teint et réveiller l’éclat. Application le matin.', price: 24.5, image: img('1576426863848-c21f53c60b19'), size: '30 ml', origin: 'France', tags: ['anti-taches', 'éclat'], isNew: true },
  { id: 'rp-para-04', storeCategory: 'Pharmacie', subcategory: 'Solaire', name: 'Lait solaire SPF 50+', brand: 'Sol de Biarritz', description: 'Très haute protection UVA/UVB, résistant à l’eau. Texture fluide non grasse, adaptée à toute la famille.', price: 17.9, image: img('1629198688000-71f23e745b6e'), size: '200 ml', origin: 'France', tags: ['SPF 50+', 'famille'] },
  { id: 'rp-para-05', storeCategory: 'Pharmacie', subcategory: 'Corps', name: 'Huile sèche corps et cheveux', brand: 'Maison Calanques', description: 'Huile nourrissante aux huiles de noisette et d’argan. Fini satiné, parfum fleur d’oranger.', price: 19.9, image: img('1617897903246-719242758050'), size: '100 ml', origin: 'France', tags: ['nutrition', 'naturel'] },
  { id: 'rp-para-06', storeCategory: 'Pharmacie', subcategory: 'Corps', name: 'Crème mains réparatrice', brand: 'Thermes d’Auvergne', description: 'Répare les mains sèches et abîmées dès la première application. Pénètre vite, ne colle pas.', price: 6.9, image: img('1601049676869-702ea24cfd58'), size: '75 ml', origin: 'France', tags: ['mains sèches'] },
  { id: 'rp-para-07', storeCategory: 'Pharmacie', subcategory: 'Compléments', name: 'Magnésium marin + vitamine B6', brand: 'Nutri’Santé', description: 'Contribue à réduire la fatigue. Une gélule matin et soir pendant le repas.', price: 12.9, image: img('1584308666744-24d5c474f2ae'), size: '60 gélules', origin: 'France', tags: ['fatigue', 'cure 1 mois'] },
  { id: 'rp-para-08', storeCategory: 'Pharmacie', subcategory: 'Compléments', name: 'Vitamine D3 1 000 UI', brand: 'Nutri’Santé', description: 'Vitamine D3 d’origine naturelle, un comprimé par jour. Contribue au fonctionnement normal du système immunitaire.', price: 9.9, image: img('1550572017-edd951b55104'), size: '90 comprimés', origin: 'France', tags: ['immunité', 'hiver'] },
  { id: 'rp-para-09', storeCategory: 'Pharmacie', subcategory: 'Hygiène', name: 'Brosses à dents bambou souples', brand: 'Écoliss', description: 'Manche en bambou compostable, poils souples. Lot de deux.', price: 5.9, image: img('1607613009820-a29f7bb81c04'), size: 'Lot de 2', origin: 'Union européenne', tags: ['zéro déchet'] },
  { id: 'rp-para-10', storeCategory: 'Pharmacie', subcategory: 'Hygiène', name: 'Gel lavant surgras', brand: 'Thermes d’Auvergne', description: 'Nettoie en douceur le visage et le corps sans dessécher. pH physiologique, convient aux peaux atopiques.', price: 7.5, image: img('1556229010-6c3f2c9ca5f8'), size: '500 ml', origin: 'France', tags: ['peaux atopiques'] },
  { id: 'rp-para-11', storeCategory: 'Pharmacie', subcategory: 'Santé', name: 'Spray nasal eau de mer', brand: 'Océal', description: 'Solution isotonique pour l’hygiène quotidienne du nez. Dès 3 ans. Dispositif médical.', price: 5.2, image: img('1631729371254-42c2892f0e6e'), size: '100 ml', origin: 'Bretagne, France', tags: ['rhume', 'enfants'] },
  { id: 'rp-para-12', storeCategory: 'Pharmacie', subcategory: 'Visage', name: 'Baume à lèvres réparateur', brand: 'Laboratoire Mistral', description: 'Nourrit et protège les lèvres gercées. À la cire d’abeille et à l’huile de calendula.', price: 4.5, image: img('1599305090598-fe179d501227'), size: '15 ml', origin: 'France', tags: ['hiver', 'lèvres'] },

  // ── Caviste ─────────────────────────────────────────────
  { id: 'rp-cave-01', storeCategory: 'Caviste', subcategory: 'Vins rouges', name: 'Côtes-du-Rhône rouge 2022', brand: 'Domaine des Garrigues', description: 'Grenache et syrah sur des notes de fruits noirs et d’épices douces. Parfait sur une côte de bœuf ou un plat mijoté.', price: 11.9, image: img('1553361371-9b22f78e8b1d'), size: '75 cl', origin: 'Vallée du Rhône', tags: ['rouge', 'fruité'], isAlcohol: true, isBestseller: true },
  { id: 'rp-cave-02', storeCategory: 'Caviste', subcategory: 'Vins rouges', name: 'Bourgogne Pinot noir 2021', brand: 'Maison Clos-Vougeot', description: 'Robe rubis, nez de cerise et de sous-bois. Tanins soyeux, belle longueur.', price: 21.5, image: img('1586370434639-0fe43b2d32e6'), size: '75 cl', origin: 'Bourgogne', tags: ['rouge', 'élégant'], isAlcohol: true },
  { id: 'rp-cave-03', storeCategory: 'Caviste', subcategory: 'Vins blancs', name: 'Chablis 2022', brand: 'Domaine Guérin', description: 'Chardonnay minéral et tendu, aux notes d’agrumes et de pierre à fusil. Idéal avec les huîtres.', price: 19.9, image: img('1584916201218-f4242ceb4809'), size: '75 cl', origin: 'Bourgogne', tags: ['blanc', 'minéral'], isAlcohol: true },
  { id: 'rp-cave-04', storeCategory: 'Caviste', subcategory: 'Vins blancs', name: 'Sancerre blanc 2023', brand: 'Domaine des Caillottes', description: 'Sauvignon vif et aromatique, notes de pamplemousse et de buis. Sur un crottin de Chavignol.', price: 23, image: img('1516594915697-87eb3b1c14ea'), size: '75 cl', origin: 'Val de Loire', tags: ['blanc', 'vif'], isAlcohol: true },
  { id: 'rp-cave-05', storeCategory: 'Caviste', subcategory: 'Rosés', name: 'Côtes de Provence rosé 2023', brand: 'Château Sainte-Victoire', description: 'Rosé pâle et gourmand, fraise des bois et pêche blanche. À servir bien frais.', price: 13.5, originalPrice: 15.9, image: img('1558001373-7b93ee48ffa0'), size: '75 cl', origin: 'Provence', tags: ['rosé', 'apéritif'], isAlcohol: true },
  { id: 'rp-cave-06', storeCategory: 'Caviste', subcategory: 'Bulles', name: 'Champagne brut réserve', brand: 'Maison Lemaire', description: 'Bulles fines, notes de brioche et de poire. Assemblage de chardonnay et de pinot noir.', price: 34.9, image: img('1547595628-c61a29f496f0'), size: '75 cl', origin: 'Champagne', tags: ['fête', 'bulles'], isAlcohol: true, isBestseller: true },
  { id: 'rp-cave-07', storeCategory: 'Caviste', subcategory: 'Bulles', name: 'Crémant de Loire brut', brand: 'Caves de Saumur', description: 'Méthode traditionnelle, bulles vives et fruit croquant. Le meilleur rapport qualité-prix pour trinquer.', price: 12.9, image: img('1506377247377-2a5b3b417ebb'), size: '75 cl', origin: 'Val de Loire', tags: ['bulles', 'apéritif'], isAlcohol: true },
  { id: 'rp-cave-08', storeCategory: 'Caviste', subcategory: 'Spiritueux', name: 'Whisky tourbé français', brand: 'Distillerie des Abers', description: 'Single malt breton vieilli en fût de chêne. Tourbe légère, notes iodées et de miel.', price: 42, image: img('1569529465841-dfecdab7503b'), size: '70 cl', origin: 'Bretagne', tags: ['whisky', 'tourbé'], isAlcohol: true },
  { id: 'rp-cave-09', storeCategory: 'Caviste', subcategory: 'Spiritueux', name: 'Gin artisanal aux agrumes', brand: 'Distillerie du Lubéron', description: 'Gin distillé avec du genièvre, du citron de Menton et de la lavande. Parfait en gin tonic.', price: 36, image: img('1551538827-9c037cb4f32a'), size: '70 cl', origin: 'Provence', tags: ['gin', 'cocktail'], isAlcohol: true, isNew: true },
  { id: 'rp-cave-10', storeCategory: 'Caviste', subcategory: 'Spiritueux', name: 'Pastis artisanal', brand: 'Maison Rinaldi', description: 'Anis étoilé, réglisse et plantes de Provence macérés. Un pastis franc, à allonger d’eau fraîche.', price: 24.9, image: img('1514362545857-3bc16c4c7d1b'), size: '70 cl', origin: 'Marseille', tags: ['apéritif', 'anisé'], isAlcohol: true },
  { id: 'rp-cave-11', storeCategory: 'Caviste', subcategory: 'Bières', name: 'Bière IPA de brasserie locale', brand: 'Brasserie de la Goutte', description: 'Pale ale houblonnée, notes de mangue et de résine. Pack de quatre bouteilles.', price: 9.9, image: img('1608270586620-248524c67de9'), size: '4 × 33 cl', origin: 'France', tags: ['bière', 'houblonnée'], isAlcohol: true },
  { id: 'rp-cave-12', storeCategory: 'Caviste', subcategory: 'Sans alcool', name: 'Jus de raisin pétillant', brand: 'Vergers du Jura', description: 'Pur jus de raisin blanc légèrement pétillant, sans alcool ni sucres ajoutés. Pour trinquer avec tout le monde.', price: 6.9, image: img('1474722883778-792e7990302f'), size: '75 cl', origin: 'Jura', tags: ['sans alcool'] },

  // ── High-tech ───────────────────────────────────────────
  { id: 'rp-tech-01', storeCategory: 'High-tech', subcategory: 'Câbles & chargeurs', name: 'Câble USB-C vers USB-C tressé', brand: 'Voltéo', description: 'Câble nylon tressé, charge rapide jusqu’à 100 W et transfert de données. Longueur 2 m.', price: 14.9, image: img('1585995603413-eb35b5f4a50b'), size: '2 m', tags: ['charge rapide'], isBestseller: true },
  { id: 'rp-tech-02', storeCategory: 'High-tech', subcategory: 'Câbles & chargeurs', name: 'Chargeur secteur USB-C 30 W', brand: 'Voltéo', description: 'Chargeur compact compatible avec la plupart des smartphones et tablettes. Charge à 50 % en 30 min.', price: 24.9, image: img('1583863788434-e58a36330cf0'), size: '30 W', tags: ['charge rapide', 'compact'] },
  { id: 'rp-tech-03', storeCategory: 'High-tech', subcategory: 'Câbles & chargeurs', name: 'Chargeur sans fil à induction 15 W', brand: 'Voltéo', description: 'Socle magnétique compatible Qi, charge rapide 15 W, câble USB-C inclus. Voyant discret pour la table de nuit.', price: 29.9, originalPrice: 34.9, image: img('1615526675159-e248c3021d3f'), size: '15 W', tags: ['sans fil'] },
  { id: 'rp-tech-04', storeCategory: 'High-tech', subcategory: 'Audio', name: 'Écouteurs sans fil à réduction de bruit', brand: 'Sonora', description: 'Réduction de bruit active, 28 h d’autonomie avec le boîtier, résistants à la transpiration.', price: 79, image: img('1606220588913-b3aacb4d2f46'), tags: ['bluetooth', 'sport'], isNew: true },
  { id: 'rp-tech-05', storeCategory: 'High-tech', subcategory: 'Audio', name: 'Casque audio Bluetooth', brand: 'Sonora', description: 'Casque circum-auriculaire pliable, coussinets à mémoire de forme, 40 h d’autonomie.', price: 99, image: img('1505740420928-5e560c06d30e'), tags: ['bluetooth', 'télétravail'] },
  { id: 'rp-tech-06', storeCategory: 'High-tech', subcategory: 'Audio', name: 'Enceinte Bluetooth étanche', brand: 'Sonora', description: 'Son à 360°, étanche IP67, 12 h d’autonomie. Se glisse dans un sac de plage.', price: 49.9, image: img('1608043152269-423dbba4e7e1'), tags: ['étanche', 'nomade'] },
  { id: 'rp-tech-07', storeCategory: 'High-tech', subcategory: 'Protection', name: 'Coque silicone pour smartphone', brand: 'Coquille', description: 'Silicone doux au toucher, intérieur microfibre, bords surélevés pour protéger l’écran et l’objectif.', price: 19.9, image: img('1556656793-08538906a9f8'), tags: ['protection'] },
  { id: 'rp-tech-08', storeCategory: 'High-tech', subcategory: 'Protection', name: 'Verre trempé protection d’écran', brand: 'Coquille', description: 'Dureté 9H, anti-traces de doigts, pose sans bulles grâce au cadre d’alignement. Lot de deux.', price: 12.9, image: img('1544866092-1935c5ef2a8f'), size: 'Lot de 2', tags: ['protection'] },
  { id: 'rp-tech-09', storeCategory: 'High-tech', subcategory: 'Bureau', name: 'Souris sans fil silencieuse', brand: 'Clikk', description: 'Clics silencieux, capteur précis 1 600 ppp, récepteur USB-C. Pile fournie.', price: 22.9, image: img('1527864550417-7fd91fc51a46'), tags: ['télétravail'] },
  { id: 'rp-tech-10', storeCategory: 'High-tech', subcategory: 'Bureau', name: 'Clavier compact Bluetooth AZERTY', brand: 'Clikk', description: 'Clavier français multi-appareils (jusqu’à 3), touches plates et silencieuses, rechargeable.', price: 39.9, image: img('1587829741301-dc798b83add3'), tags: ['AZERTY', 'télétravail'] },
  { id: 'rp-tech-11', storeCategory: 'High-tech', subcategory: 'Bureau', name: 'Adaptateur USB-C 6 en 1', brand: 'Voltéo', description: 'HDMI 4K, deux ports USB-A, lecteur de cartes SD et charge USB-C 100 W. Boîtier aluminium.', price: 34.9, image: img('1588872657578-7efd1f1555ed'), tags: ['ordinateur portable'] },

  // ── Librairie ───────────────────────────────────────────
  { id: 'rp-livre-01', storeCategory: 'Librairie', subcategory: 'Romans', name: 'Le Petit Prince', brand: 'Antoine de Saint-Exupéry', description: 'Le conte poétique et philosophique, avec les aquarelles de l’auteur. Édition de poche.', price: 7.5, image: img('1550399105-c4db5fb85c18'), size: 'Poche · 112 pages', tags: ['classique', 'jeunesse'], isBestseller: true },
  { id: 'rp-livre-02', storeCategory: 'Librairie', subcategory: 'Romans', name: 'Le Comte de Monte-Cristo, tome 1', brand: 'Alexandre Dumas', description: 'Trahi et emprisonné au château d’If, Edmond Dantès prépare sa vengeance. Le grand roman d’aventures.', price: 9.9, image: img('1543002588-bfa74002ed7e'), size: 'Poche · 864 pages', tags: ['classique', 'aventure'] },
  { id: 'rp-livre-03', storeCategory: 'Librairie', subcategory: 'Romans', name: 'Madame Bovary', brand: 'Gustave Flaubert', description: 'Emma Bovary rêve d’une vie plus grande que la sienne. Un chef-d’œuvre du roman réaliste.', price: 5.9, image: img('1481627834876-b7833e8f5570'), size: 'Poche · 512 pages', tags: ['classique'] },
  { id: 'rp-livre-04', storeCategory: 'Librairie', subcategory: 'Poésie', name: 'Les Fleurs du mal', brand: 'Charles Baudelaire', description: 'Le recueil fondateur de la poésie moderne, dans sa version de 1861.', price: 4.9, image: img('1519682337058-a94d519337bc'), size: 'Poche · 320 pages', tags: ['poésie', 'classique'] },
  { id: 'rp-livre-05', storeCategory: 'Librairie', subcategory: 'Romans', name: 'Les Quais de la Saône', brand: 'Claire Morel', description: 'Un polar lyonnais haletant : une commissaire enquête sur une disparition entre Fourvière et la Croix-Rousse.', price: 21, image: img('1495446815901-a7297e633e8d'), size: 'Broché · 384 pages', tags: ['polar', 'nouveauté'], isNew: true },
  { id: 'rp-livre-06', storeCategory: 'Librairie', subcategory: 'Beaux livres', name: 'Cuisine des bistrots parisiens', brand: 'Julien Garnier', description: '80 recettes de bistrot, du bœuf bourguignon à la tarte Tatin, photographiées dans les adresses mythiques de la capitale.', price: 29.9, image: img('1532012197267-da84d127e765'), size: 'Relié · 240 pages', tags: ['cuisine', 'cadeau'] },
  { id: 'rp-livre-07', storeCategory: 'Librairie', subcategory: 'Papeterie', name: 'Agenda 2027 semainier', brand: 'Atelier Papier', description: 'Une semaine sur deux pages, couverture toilée, ruban marque-page et pochette intérieure.', price: 16.9, image: img('1517842645767-c639042777db'), size: 'Format A5', tags: ['organisation'] },
  { id: 'rp-livre-08', storeCategory: 'Librairie', subcategory: 'Papeterie', name: 'Carnet ligné couverture lin', brand: 'Atelier Papier', description: 'Papier ivoire 90 g, 192 pages lignées, reliure cousue qui s’ouvre à plat.', price: 12.5, image: img('1531346878377-a5be20888e57'), size: 'Format A5', tags: ['écriture'] },
  { id: 'rp-livre-09', storeCategory: 'Librairie', subcategory: 'Papeterie', name: 'Stylos-feutres noirs pointe fine', brand: 'Plumetis', description: 'Encre pigmentée résistante à l’eau, pointe 0,4 mm. Idéal pour l’écriture et le dessin. Lot de quatre.', price: 8.9, image: img('1583485088034-697b5bc54ccd'), size: 'Lot de 4', tags: ['dessin', 'écriture'] },
  { id: 'rp-livre-10', storeCategory: 'Librairie', subcategory: 'Papeterie', name: 'Crayons de couleur aquarellables', brand: 'Plumetis', description: '24 couleurs vives à utiliser à sec ou au pinceau mouillé. Boîte métal.', price: 14.9, image: img('1456735190827-d1262f71b8a3'), size: 'Boîte de 24', tags: ['dessin', 'enfants'] },
  { id: 'rp-livre-11', storeCategory: 'Librairie', subcategory: 'Papeterie', name: 'Cartes postales illustrées', brand: 'Atelier Papier', description: 'Dix cartes illustrées par des artistes français, avec enveloppes kraft.', price: 9, image: img('1586075010923-2dd4570fb338'), size: 'Lot de 10', tags: ['cadeau'] },
]

export function getRetailProducts(category: string): RetailProduct[] {
  return retailProducts.filter((p) => p.storeCategory === category)
}

export function getRetailSubcategories(category: string): string[] {
  return [...new Set(getRetailProducts(category).map((p) => p.subcategory))]
}
