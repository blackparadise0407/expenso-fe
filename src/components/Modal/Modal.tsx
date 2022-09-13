import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { MdClose } from 'react-icons/md'

import { Backdrop } from '../Backdrop'
import { Button } from '../Button'
import { ButtonProps } from '../Button/Button'

interface ModalProps {
  open: boolean
  title?: string
  children?: React.ReactNode
  className?: string
  footer?: React.ReactNode
  okBtnProps?: ButtonProps
  cancelBtnProps?: ButtonProps
  onClose?: () => void
}

export default function Modal({
  className,
  footer,
  title = 'Test title',
  open,
  children,
  okBtnProps = { variant: 'primary' },
  cancelBtnProps = {
    variant: 'text',
  },
  onClose,
}: ModalProps) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <Backdrop centerChildren>
          <motion.div
            initial={{ opacity: 0, y: -150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className={clsx(
              'relative max-w-lg w-full bg-white shadow rounded-lg',
              className
            )}
          >
            <div className="flex px-3 pt-3 pb-2">
              <h5 className="font-semibold">{title}</h5>{' '}
              {onClose && (
                <MdClose
                  className="absolute top-3 right-3 text-xl cursor-pointer"
                  onClick={onClose}
                />
              )}
            </div>
            {children && (
              <>
                <hr />
                <div className="px-3 pb-3 pt-2">{children}</div>
              </>
            )}

            <hr />
            <div className="flex gap-3 px-3 pb-3 pt-2">
              {footer ? (
                footer
              ) : (
                <>
                  <div className="flex-grow"></div>
                  <Button {...cancelBtnProps}>Close</Button>
                  <Button {...okBtnProps}>Confirm</Button>
                </>
              )}
            </div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}
