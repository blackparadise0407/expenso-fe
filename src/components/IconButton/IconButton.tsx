import { motion } from 'framer-motion'

interface IconButtonProps {
  icon: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function IconButton({ icon, onClick }: IconButtonProps) {
  return (
    <motion.button
      whileTap={{
        scale: 0.95,
      }}
      className="p-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-opacity-90"
      onClick={onClick}
    >
      {icon}
    </motion.button>
  )
}
