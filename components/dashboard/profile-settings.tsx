'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Upload, Loader2, Check } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ProfileSettingsProps {
    user: any
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
    const router = useRouter()
    const supabase = createClient()

    const handleUpdateProfile = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            })
            if (error) throw error
            router.refresh()
        } catch (error: any) {
            alert('Error updating profile: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            setUploading(true)

            // 1. Check/Create Bucket (Optional, might fail if already exists)
            // In a real app, you'd ensure this exists beforehand.

            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Math.random()}.${fileExt}`
            const filePath = `avatars/${fileName}`

            // 2. Upload to Storage
            // Note: We use the 'avatars' bucket. Make sure it exists and is public!
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) {
                // If bucket doesn't exist, this will fail. 
                // Suggesting the user to create the bucket if it fails.
                throw new Error('Upload failed. Please ensure a "avatars" bucket exists in Supabase Storage and is set to Public.')
            }

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // 4. Update User Metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            })

            if (updateError) throw updateError

            router.refresh()
        } catch (error: any) {
            console.error('Error:', error)
            alert(error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4 rounded-3xl border border-white/20 bg-white/60 dark:bg-card/50 backdrop-blur-md p-6 shadow-lg">
                <h3 className="font-semibold text-lg border-b border-border/40 pb-2 mb-4">User Profile</h3>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                        <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-primary/20 ring-4 ring-white dark:ring-slate-800 overflow-hidden relative">
                            {user?.user_metadata?.avatar_url ? (
                                <Image
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                user?.email?.charAt(0).toUpperCase()
                            )}

                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                                </div>
                            )}
                        </div>

                        <label className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-border cursor-pointer hover:scale-110 transition-transform">
                            <Upload className="h-4 w-4 text-primary" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleUploadAvatar}
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                className="flex h-11 w-full rounded-xl border border-border/50 bg-white/50 dark:bg-slate-900/50 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="Your Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input
                                className="flex h-11 w-full rounded-xl border border-border/50 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2 text-sm cursor-not-allowed opacity-70"
                                defaultValue={user?.email}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 rounded-xl font-semibold text-sm flex items-center shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    )
}
