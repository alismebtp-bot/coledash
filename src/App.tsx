import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CityProvider } from './context/CityContext'
import { NotificationProvider } from './context/NotificationContext'
import { LanguageProvider } from './i18n/LanguageContext'
import ScrollToTop from './components/ScrollToTop'
import DebugTrigger from './components/DebugTrigger'
import ErrorBoundary from './components/ErrorBoundary'
import { PortalLoader } from './components/SkeletonLoader'

// Layouts — always loaded
import Layout from './components/Layout'
import MerchantLayout from './components/MerchantLayout'
import DriverLayout from './components/DriverLayout'
import AdminLayout from './components/AdminLayout'

// Eager-loaded: core customer pages
import Home from './pages/Home'
import BrowseRestaurants from './pages/BrowseRestaurants'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

// Lazy-loaded: secondary pages
const BrowseGrocery = lazy(() => import('./pages/BrowseGrocery'))
const BrowseRetail = lazy(() => import('./pages/BrowseRetail'))
const BrowseFlowers = lazy(() => import('./pages/BrowseFlowers'))
const BouquetBuilder = lazy(() => import('./pages/BouquetBuilder'))
const BouquetCheckout = lazy(() => import('./pages/BouquetCheckout'))
const RestaurantDetail = lazy(() => import('./pages/RestaurantDetail'))
const StoreDetail = lazy(() => import('./pages/StoreDetail'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const OrdersHistory = lazy(() => import('./pages/OrdersHistory'))
const Account = lazy(() => import('./pages/Account'))

// Merchant
const MerchantDashboard = lazy(() => import('./pages/merchant/MerchantDashboard'))
const MerchantOrders = lazy(() => import('./pages/merchant/MerchantOrders'))
const MerchantMenu = lazy(() => import('./pages/merchant/MerchantMenu'))
const MerchantAnalytics = lazy(() => import('./pages/merchant/MerchantAnalytics'))
const MerchantSettings = lazy(() => import('./pages/merchant/MerchantSettings'))
const MerchantReviews = lazy(() => import('./pages/merchant/MerchantReviews'))
const MerchantPayouts = lazy(() => import('./pages/merchant/MerchantPayouts'))
const MerchantPromotions = lazy(() => import('./pages/merchant/MerchantPromotions'))
const AIScanner = lazy(() => import('./pages/merchant/AIScanner'))
const DebugEngineer = lazy(() => import('./pages/merchant/DebugEngineer'))

// Driver
const DriverDashboard = lazy(() => import('./pages/driver/DriverDashboard'))
const DriverOrders = lazy(() => import('./pages/driver/DriverOrders'))
const DriverDelivery = lazy(() => import('./pages/driver/DriverDelivery'))
const DriverEarnings = lazy(() => import('./pages/driver/DriverEarnings'))
const DriverSchedule = lazy(() => import('./pages/driver/DriverSchedule'))
const DriverProfile = lazy(() => import('./pages/driver/DriverProfile'))

// Admin
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'))
const AdminProspecting = lazy(() => import('./pages/admin/AdminProspecting'))
const AdminCities = lazy(() => import('./pages/admin/AdminCities'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminRestaurants = lazy(() => import('./pages/admin/AdminRestaurants'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminFinance = lazy(() => import('./pages/admin/AdminFinance'))
const AdminMarketing = lazy(() => import('./pages/admin/AdminMarketing'))
const AdminSupport = lazy(() => import('./pages/admin/AdminSupport'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const ErrorLogViewer = lazy(() => import('./pages/admin/ErrorLogViewer'))

export default function App() {
  return (
    <LanguageProvider>
    <CityProvider>
    <NotificationProvider>
      <CartProvider>
        <ScrollToTop />
        <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseRestaurants />} />
            <Route path="/grocery" element={<Suspense fallback={<PortalLoader />}><BrowseGrocery /></Suspense>} />
            <Route path="/retail" element={<Suspense fallback={<PortalLoader />}><BrowseRetail /></Suspense>} />
            <Route path="/flowers" element={<Suspense fallback={<PortalLoader />}><BrowseFlowers /></Suspense>} />
            <Route path="/create-bouquet" element={<Suspense fallback={<PortalLoader />}><BouquetBuilder /></Suspense>} />
            <Route path="/create-bouquet/checkout" element={<Suspense fallback={<PortalLoader />}><BouquetCheckout /></Suspense>} />
            <Route path="/restaurant/:id" element={<Suspense fallback={<PortalLoader />}><RestaurantDetail /></Suspense>} />
            <Route path="/store/:id" element={<Suspense fallback={<PortalLoader />}><StoreDetail /></Suspense>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track/:id" element={<Suspense fallback={<PortalLoader />}><OrderTracking /></Suspense>} />
            <Route path="/orders" element={<Suspense fallback={<PortalLoader />}><OrdersHistory /></Suspense>} />
            <Route path="/account" element={<Suspense fallback={<PortalLoader />}><Account /></Suspense>} />
          </Route>

          <Route element={<MerchantLayout />}>
            <Route path="/merchant" element={<Suspense fallback={<PortalLoader />}><MerchantDashboard /></Suspense>} />
            <Route path="/merchant/orders" element={<Suspense fallback={<PortalLoader />}><MerchantOrders /></Suspense>} />
            <Route path="/merchant/menu" element={<Suspense fallback={<PortalLoader />}><MerchantMenu /></Suspense>} />
            <Route path="/merchant/analytics" element={<Suspense fallback={<PortalLoader />}><MerchantAnalytics /></Suspense>} />
            <Route path="/merchant/settings" element={<Suspense fallback={<PortalLoader />}><MerchantSettings /></Suspense>} />
            <Route path="/merchant/reviews" element={<Suspense fallback={<PortalLoader />}><MerchantReviews /></Suspense>} />
            <Route path="/merchant/payouts" element={<Suspense fallback={<PortalLoader />}><MerchantPayouts /></Suspense>} />
            <Route path="/merchant/promotions" element={<Suspense fallback={<PortalLoader />}><MerchantPromotions /></Suspense>} />
            <Route path="/merchant/ai-scanner" element={<Suspense fallback={<PortalLoader />}><AIScanner /></Suspense>} />
            <Route path="/merchant/debug-engineer" element={<Suspense fallback={<PortalLoader />}><DebugEngineer /></Suspense>} />
          </Route>

          <Route element={<DriverLayout />}>
            <Route path="/driver" element={<Suspense fallback={<PortalLoader />}><DriverDashboard /></Suspense>} />
            <Route path="/driver/orders" element={<Suspense fallback={<PortalLoader />}><DriverOrders /></Suspense>} />
            <Route path="/driver/delivery" element={<Suspense fallback={<PortalLoader />}><DriverDelivery /></Suspense>} />
            <Route path="/driver/earnings" element={<Suspense fallback={<PortalLoader />}><DriverEarnings /></Suspense>} />
            <Route path="/driver/schedule" element={<Suspense fallback={<PortalLoader />}><DriverSchedule /></Suspense>} />
            <Route path="/driver/profile" element={<Suspense fallback={<PortalLoader />}><DriverProfile /></Suspense>} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Suspense fallback={<PortalLoader />}><AdminOverview /></Suspense>} />
            <Route path="/admin/users" element={<Suspense fallback={<PortalLoader />}><AdminUsers /></Suspense>} />
            <Route path="/admin/restaurants" element={<Suspense fallback={<PortalLoader />}><AdminRestaurants /></Suspense>} />
            <Route path="/admin/orders" element={<Suspense fallback={<PortalLoader />}><AdminOrders /></Suspense>} />
            <Route path="/admin/finance" element={<Suspense fallback={<PortalLoader />}><AdminFinance /></Suspense>} />
            <Route path="/admin/marketing" element={<Suspense fallback={<PortalLoader />}><AdminMarketing /></Suspense>} />
            <Route path="/admin/support" element={<Suspense fallback={<PortalLoader />}><AdminSupport /></Suspense>} />
            <Route path="/admin/settings" element={<Suspense fallback={<PortalLoader />}><AdminSettings /></Suspense>} />
            <Route path="/admin/prospecting" element={<Suspense fallback={<PortalLoader />}><AdminProspecting /></Suspense>} />
            <Route path="/admin/cities" element={<Suspense fallback={<PortalLoader />}><AdminCities /></Suspense>} />
            <Route path="/admin/logs" element={<Suspense fallback={<PortalLoader />}><ErrorLogViewer /></Suspense>} />
          </Route>
        </Routes>
        </ErrorBoundary>
        <DebugTrigger />
      </CartProvider>
    </NotificationProvider>
    </CityProvider>
    </LanguageProvider>
  )
}
