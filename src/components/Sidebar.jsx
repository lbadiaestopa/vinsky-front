import { Link } from 'react-router-dom'
import { memberships } from '../mock/memberships'
import { orchestras } from '../mock/orchestras'
import { users } from '../mock/users'

function Sidebar() {
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

        </aside>
    )
}

export default Sidebar