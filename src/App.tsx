import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import SiteLayout from '@/components/site/SiteLayout'
import ScrollToTop from '@/components/shared/ScrollToTop'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import { MerchantLayout, DriverLayout, AdminLayout } from '@/components/portal/portals'
import Home from '@/pages/site/Home'

const page = <T,>(load: () => Promise<{ default: T }>) => lazy(load as () => Promise<{ default: React.ComponentType }>)

// Site client
const Restaurants = page(() => import('@/pages/site/Restaurants'))
const RestaurantDetail = page(() => import('@/pages/site/RestaurantDetail'))
const Search = page(() => import('@/pages/site/Search'))
const Grocery = page(() => import('@/pages/site/Grocery'))
const Retail = page(() => import('@/pages/site/Retail'))
const StoreDetail = page(() => import('@/pages/site/StoreDetail'))
const Flowers = page(() => import('@/pages/site/Flowers'))
const BouquetBuilder = page(() => import('@/pages/site/BouquetBuilder'))
const Cart = page(() => import('@/pages/site/Cart'))
const Checkout = page(() => import('@/pages/site/Checkout'))
const OrderTracking = page(() => import('@/pages/site/OrderTracking'))
const Orders = page(() => import('@/pages/site/Orders'))
const Account = page(() => import('@/pages/site/Account'))
const Login = page(() => import('@/pages/site/Login'))
const Signup = page(() => import('@/pages/site/Signup'))
const Partners = page(() => import('@/pages/site/Partners'))
const Help = page(() => import('@/pages/site/Help'))
const NotFound = page(() => import('@/pages/site/NotFound'))

// Espace commerçant
const MerchantDashboard = page(() => import('@/pages/merchant/MerchantDashboard'))
const MerchantOrders = page(() => import('@/pages/merchant/MerchantOrders'))
const MerchantMenu = page(() => import('@/pages/merchant/MerchantMenu'))
const MerchantAnalytics = page(() => import('@/pages/merchant/MerchantAnalytics'))
const MerchantReviews = page(() => import('@/pages/merchant/MerchantReviews'))
const MerchantPromotions = page(() => import('@/pages/merchant/MerchantPromotions'))
const MerchantPayouts = page(() => import('@/pages/merchant/MerchantPayouts'))
const MerchantSettings = page(() => import('@/pages/merchant/MerchantSettings'))

// Espace livreur
const DriverDashboard = page(() => import('@/pages/driver/DriverDashboard'))
const DriverOrders = page(() => import('@/pages/driver/DriverOrders'))
const DriverDelivery = page(() => import('@/pages/driver/DriverDelivery'))
const DriverEarnings = page(() => import('@/pages/driver/DriverEarnings'))
const DriverSchedule = page(() => import('@/pages/driver/DriverSchedule'))
const DriverProfile = page(() => import('@/pages/driver/DriverProfile'))

// Administration
const AdminOverview = page(() => import('@/pages/admin/AdminOverview'))
const AdminOrders = page(() => import('@/pages/admin/AdminOrders'))
const AdminRestaurants = page(() => import('@/pages/admin/AdminRestaurants'))
const AdminUsers = page(() => import('@/pages/admin/AdminUsers'))
const AdminCities = page(() => import('@/pages/admin/AdminCities'))
const AdminFinance = page(() => import('@/pages/admin/AdminFinance'))
const AdminMarketing = page(() => import('@/pages/admin/AdminMarketing'))
const AdminProspecting = page(() => import('@/pages/admin/AdminProspecting'))
const AdminSupport = page(() => import('@/pages/admin/AdminSupport'))
const AdminSettings = page(() => import('@/pages/admin/AdminSettings'))

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="restaurants/:id" element={<RestaurantDetail />} />
          <Route path="recherche" element={<Search />} />
          <Route path="courses" element={<Grocery />} />
          <Route path="courses/:id" element={<StoreDetail />} />
          <Route path="boutiques" element={<Retail />} />
          <Route path="boutiques/:id" element={<StoreDetail />} />
          <Route path="fleurs" element={<Flowers />} />
          <Route path="fleurs/atelier" element={<BouquetBuilder />} />
          <Route path="fleurs/:id" element={<StoreDetail />} />
          <Route path="panier" element={<Cart />} />
          <Route path="commande" element={<Checkout />} />
          <Route path="suivi/:id" element={<OrderTracking />} />
          <Route path="commandes" element={<Orders />} />
          <Route path="compte" element={<Account />} />
          <Route path="connexion" element={<Login />} />
          <Route path="inscription" element={<Signup />} />
          <Route path="partenaires" element={<Partners />} />
          <Route path="aide" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="marchand" element={<MerchantLayout />}>
          <Route index element={<MerchantDashboard />} />
          <Route path="commandes" element={<MerchantOrders />} />
          <Route path="carte" element={<MerchantMenu />} />
          <Route path="statistiques" element={<MerchantAnalytics />} />
          <Route path="avis" element={<MerchantReviews />} />
          <Route path="promotions" element={<MerchantPromotions />} />
          <Route path="paiements" element={<MerchantPayouts />} />
          <Route path="parametres" element={<MerchantSettings />} />
        </Route>

        <Route path="livreur" element={<DriverLayout />}>
          <Route index element={<DriverDashboard />} />
          <Route path="courses" element={<DriverOrders />} />
          <Route path="livraison" element={<DriverDelivery />} />
          <Route path="gains" element={<DriverEarnings />} />
          <Route path="planning" element={<DriverSchedule />} />
          <Route path="profil" element={<DriverProfile />} />
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="commandes" element={<AdminOrders />} />
          <Route path="commerces" element={<AdminRestaurants />} />
          <Route path="utilisateurs" element={<AdminUsers />} />
          <Route path="villes" element={<AdminCities />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="marketing" element={<AdminMarketing />} />
          <Route path="prospection" element={<AdminProspecting />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="parametres" element={<AdminSettings />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
