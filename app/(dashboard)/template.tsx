'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} // smooth cubic-bezier
            className="h-full"
        >
            {children}
        </motion.div>
    )
}
