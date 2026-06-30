export let memberships = [
  {
    user_id: 1,
    orchestra_id: 1,
    role: 'admin',
    member_type: 'core',
    instrument: 'violin_1',
    section: 'violin_1',
    joined_at: '2026-01-10'
  },
  {
    user_id: 2,
    orchestra_id: 1,
    role: 'member',
    member_type: 'core',
    instrument: 'violin_2',
    section: 'violin_2',
    joined_at: '2026-01-12'
  },
  {
    user_id: 3,
    orchestra_id: 1,
    role: 'member',
    member_type: 'substitute',
    instrument: 'viola',
    section: 'viola',
    joined_at: '2026-01-15'
  },
  {
    user_id: 4,
    orchestra_id: 1,
    role: 'member',
    member_type: 'core',
    instrument: 'cello',
    section: 'cello',
    joined_at: '2026-01-18'
  },
  {
    user_id: 5,
    orchestra_id: 1,
    role: 'member',
    member_type: 'guest',
    instrument: 'double_bass',
    section: 'double_bass',
    joined_at: '2026-01-20'
  },
  {
    user_id: 6,
    orchestra_id: 1,
    role: 'member',
    member_type: 'core',
    instrument: 'flute',
    section: 'flute',
    joined_at: '2026-01-22'
  },
  {
    user_id: 7,
    orchestra_id: 1,
    role: 'member',
    member_type: 'substitute',
    instrument: 'clarinet',
    section: 'clarinet',
    joined_at: '2026-01-25'
  },
  {
    user_id: 8,
    orchestra_id: 1,
    role: 'member',
    member_type: 'core',
    instrument: 'trumpet',
    section: 'trumpet',
    joined_at: '2026-01-28'
  },
  {
    user_id: 9,
    orchestra_id: 1,
    role: 'member',
    member_type: 'guest',
    instrument: 'trombone',
    section: 'trombone',
    joined_at: '2026-02-01'
  },
  {
    user_id: 10,
    orchestra_id: 1,
    role: 'member',
    member_type: 'core',
    instrument: 'percussion',
    section: 'percussion',
    joined_at: '2026-02-05'
  }
]

export function setMemberships(updater) {
    memberships = updater(memberships)
}