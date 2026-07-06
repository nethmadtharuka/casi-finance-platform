import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

// Part 15: Profile is minimal for MVP (name/email display, logout button) —
// the full version is Sprint 5 scope. Logout is real and functional now since
// it's simple and genuinely useful to have working during Sprint 4 testing.
export default function ProfilePlaceholder() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-xl text-foreground">{user?.name}</p>
      </div>
      <Button variant="outline" onClick={handleLogout}>
        <LogOut size={16} className="mr-2" />
        Log Out
      </Button>
    </div>
  )
}
