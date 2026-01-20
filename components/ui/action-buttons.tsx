'use client'

import { useState } from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'

interface ActionButtonsProps {
    onView?: () => void
    onEdit?: () => void
    onDelete?: () => void
    deleteAction?: () => Promise<void>
}

export function ActionButtons({ onView, onEdit, onDelete, deleteAction }: ActionButtonsProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            return
        }

        setIsDeleting(true)
        try {
            if (deleteAction) {
                await deleteAction()
            } else if (onDelete) {
                onDelete()
            }
        } catch (error) {
            console.error('Delete failed:', error)
            alert('Failed to delete item')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="flex items-center gap-1">
            {onView && (
                <button
                    onClick={onView}
                    className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200 text-muted-foreground group"
                    title="View details"
                >
                    <Eye className="h-4 w-4" />
                </button>
            )}
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="p-2 hover:bg-blue-500/10 hover:text-blue-600 rounded-lg transition-all duration-200 text-muted-foreground"
                    title="Edit"
                >
                    <Edit className="h-4 w-4" />
                </button>
            )}
            {(onDelete || deleteAction) && (
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all duration-200 text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                >
                    <Trash2 className={`h-4 w-4 ${isDeleting ? 'animate-pulse' : ''}`} />
                </button>
            )}
        </div>
    )
}
