import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { memberships } from '../mock/memberships'
import { orchestras } from '../mock/orchestras'
import { users } from '../mock/users'

function Sidebar() {
    const { user, token, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const currentUser = users.find((u) => u.id === 1)

    const userMemberships = memberships.filter(
        (m) => m.user_id === currentUser.id
    )

    const adminOrchestraIds = userMemberships
        .filter((m) => m.role === 'admin')
        .map((m) => m.orchestra_id)

    const adminOrchestras = orchestras.filter((o) =>
        adminOrchestraIds.includes(o.id)
    )

    const hasAdminOrchestras = adminOrchestras.length > 0

    return (
        <aside style={{
            width: '250px',
            padding: '1rem',
            borderRight: '1px solid #ddd'
        }}>

            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
            </nav>

            <hr />

            {hasAdminOrchestras && (
                <div>
                    <h4>My Orchestras</h4>

                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {adminOrchestras.map((orch) => (
                            <li key={orch.id}>
                                <Link to={`/orchestras/${orch.id}`}>
                                    {orch.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {user && (
                <div style={{ marginBottom: '1rem' }}>
                    <strong>{user.name} {user.last_name}</strong>
                </div>
            )}

            {token && (
                <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
                    Logout
                </button>
            )}

        </aside>
    )
}

export default Sidebar