import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, onClick }) {
  return (
    <motion.div
      className={`
        bg-white rounded-xl shadow-md overflow-hidden
        ${hover ? 'cursor-pointer hover:shadow-xl transition-shadow duration-300' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
