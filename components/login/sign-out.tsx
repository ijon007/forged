'use client'

import { Button } from '../ui/button'
import { signOut } from '@/actions/auth-actions'
import { LogOut } from 'lucide-react'

const SignOut = () => {
    return (
        <Button variant="outline" onClick={() => signOut()}>
            <LogOut />
            Sign Out
        </Button>
    )
}

export default SignOut