/* eslint-disable react/no-children-prop */
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { MdClose } from 'react-icons/md'

import { Backdrop } from '../Backdrop'
import { Button } from '../Button'
import { ButtonProps } from '../Button/Button'

export interface ModalProps {
  open: boolean
  title?: React.ReactNode
  children?: React.ReactNode
  className?: string
  footer?: React.ReactNode
  okBtnProps?: ButtonProps
  cancelBtnProps?: ButtonProps
  closeOnBackdropClick?: boolean
  onClose?: () => void
}

export default function Modal({
  className,
  footer,
  title = 'Test title',
  open,
  children,
  okBtnProps,
  cancelBtnProps,
  closeOnBackdropClick = false,
  onClose,
}: ModalProps) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <Backdrop
          centerChildren
          onClick={closeOnBackdropClick ? onClose : undefined}
        >
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
              {typeof title === 'string' ? (
                <h4 className="font-semibold">{title}</h4>
              ) : (
                title
              )}
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
                  <Button
                    variant="text"
                    children={'Cancel'}
                    {...cancelBtnProps}
                  />
                  <Button variant="primary" children={'Ok'} {...okBtnProps} />
                </>
              )}
            </div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}
