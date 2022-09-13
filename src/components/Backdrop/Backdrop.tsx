import clsx from 'clsx'

interface BackdropProps {
  children: React.ReactNode
  centerChildren?: boolean
}

export default function Backdrop({
  children,
  centerChildren = false,
}: BackdropProps) {
  return (
    <div
      className={clsx(
        'fixed top-0 left-0 !m-0 w-screen h-screen bg-black bg-opacity-10 backdrop-blur-[1px] overflow-x-hidden overflow-y-auto z-[900]',
        centerChildren && 'flex justify-center items-center'
      )}
    >
      {children}
    </div>
  )
}
