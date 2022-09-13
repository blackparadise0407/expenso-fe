import { motion } from 'framer-motion'

interface IconButtonProps {
  icon: React.ReactNode
}

export default function IconButton({ icon }: IconButtonProps) {
  return (
    <motion.button
      whileTap={{
        scale: 0.95,
      }}
      className="p-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-opacity-90"
    >
      {icon}
    </motion.button>
  )
}
