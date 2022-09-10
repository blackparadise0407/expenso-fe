import clsx from 'clsx'
import { motion, Variants } from 'framer-motion'
import { useEffect } from 'react'
import { MdOutlineClose } from 'react-icons/md'

interface ToastProps {
  data: Toast
  onRemove: (id: string) => void
}

const getDivClassFromVariant = (v: ToastVariant) => {
  switch (v) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warn':
      return 'bg-orange-500'
  }
}
const getToastClassFromVariant = (v: ToastVariant) => {
  switch (v) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warn':
      return 'text-orange-500'
  }
}

const variants: Variants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    y: -100,
  },
}

export default function Toast({ data, onRemove = () => {} }: ToastProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onRemove(data.id)
    }, 5000)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="initial"
      className={clsx(
        'relative pl-4 pr-6 py-2 min-w-[240px] max-w-[500px] bg-white rounded-lg shadow overflow-hidden',
        getToastClassFromVariant(data.variant)
      )}
    >
      <div
        className={clsx(
          'absolute top-0 left-0 w-[5px] h-full',
          getDivClassFromVariant(data.variant)
        )}
      />
      <span className="font-medium">{data.message}</span>
      <MdOutlineClose
        className="absolute top-1 right-1 cursor-pointer"
        onClick={() => onRemove(data.id)}
      />
    </motion.div>
  )
}
