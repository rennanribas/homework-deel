const Contract = {
  type: {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    TERMINATED: 'terminated',
  },
}

const Job = { maxPercentage: 0.25 }

const Profile = {
  type: {
    CONTRACTOR: 'contractor',
    CLIENT: 'client',
  },
}

module.exports = { Contract, Job, Profile }
