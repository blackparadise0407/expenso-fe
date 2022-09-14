import clsx from 'clsx'
import { motion } from 'framer-motion'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface IconButtonProps {
  icon: React.ReactNode
  loading?: boolean
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function IconButton({
  loading = false,
  disabled = false,
  icon,
  onClick,
}: IconButtonProps) {
  const computedDisabled = loading || disabled
  return (
    <motion.button
      whileTap={{
        scale: 0.95,
      }}
      disabled={computedDisabled}
      className={clsx(
        'p-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-opacity-90',
        computedDisabled && 'cursor-not-allowed'
      )}
      onClick={onClick}
    >
      {loading ? (
        <AiOutlineLoading3Quarters className="text-gray-500 text-base animate-spin" />
      ) : (
        icon
      )}
    </motion.button>
  )
}
