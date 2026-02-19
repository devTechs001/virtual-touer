import { AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-dark-50">
      <AnimatePresence mode="wait">
        <main className="flex-1 pt-16 md:pt-20">
          {children}
        </main>
      </AnimatePresence>
    </div>
  );
}
