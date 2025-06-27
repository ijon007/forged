'use client'

import { Button } from '../ui/button'
import { signOut } from '@/actions/auth-actions'
import { LogOut } from 'lucide-react'

const SignOut = () => {
    const handleSignOut = async () => {
        await signOut()
    }
    return (
        <Button variant="outline" onClick={handleSignOut} className='w-full cursor-pointer text-red-500 hover:text-red-600'>
            <LogOut />
            Sign Out
        </Button>
    )
}

export default SignOut