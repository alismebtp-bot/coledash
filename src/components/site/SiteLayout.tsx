import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import Header from './Header'
import Footer from './Footer'
import MobileTabBar from './MobileTabBar'
import PageLoader from '@/components/shared/PageLoader'

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  )
}
