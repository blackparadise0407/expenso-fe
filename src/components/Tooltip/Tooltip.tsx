import { produce } from 'immer'
import React, { useEffect, useRef, useState } from 'react'

import { useEventListener } from '@/hooks/useEventListener'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  followCursor?: boolean
  mouseEnterDelay?: number
  mouseLeaveDelay?: number
}

export default function Tooltip({
  children,
  followCursor = false,
  content,
  mouseEnterDelay = 0,
  mouseLeaveDelay = 0.1,
}: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const ref = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const mouseEnterTimeout = useRef<NodeJS.Timeout | undefined>(undefined)
  const mouseLeaveTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

  useEventListener(
    'mousemove',
    (e) => {
      if (followCursor) {
        const contentRect = contentRef.current?.getBoundingClientRect()
        setStyle(
          produce((draft) => {
            draft.left = e.clientX
            draft.top = e.clientY - (contentRect?.height ?? 0) - 10
          })
        )
      }
    },
    ref
  )

  useEventListener(
    'mouseenter',
    () => {
      if (mouseLeaveTimeout.current) {
        clearTimeout(mouseLeaveTimeout.current)
      }
      mouseEnterTimeout.current = setTimeout(() => {
        setOpen(true)
      }, mouseEnterDelay * 1000)
    },
    ref
  )

  useEventListener(
    'mouseleave',
    () => {
      if (mouseEnterTimeout.current) {
        clearTimeout(mouseEnterTimeout.current)
      }
      mouseLeaveTimeout.current = setTimeout(() => {
        setOpen(false)
      }, mouseLeaveDelay * 1000)
    },
    ref
  )

  useIsomorphicLayoutEffect(() => {
    if (ref.current && contentRef.current) {
      const wrapperRect = ref.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      setStyle(
        produce((draft) => {
          draft.left = wrapperRect.left + wrapperRect.width / 2
          draft.top = wrapperRect.top - contentRect.height - 10
        })
      )
    }
  }, [open])

  useEffect(() => {
    return () => {
      clearTimeout(mouseLeaveTimeout.current)
      clearTimeout(mouseEnterTimeout.current)
    }
  }, [open])

  return (
    <div className="w-auto" ref={ref}>
      {open && (
        <div
          ref={contentRef}
          className="fixed max-w-[400px] top-0 left-0 p-2 text-sm font-medium text-gray-900 -translate-x-1/2 bg-white shadow rounded-lg z-50"
          style={style}
        >
          {content}
        </div>
      )}
      {children}
    </div>
  )
}
