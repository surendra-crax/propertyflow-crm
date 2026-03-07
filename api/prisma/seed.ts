import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive seed...')

  // Clean existing data in order
  await prisma.notification.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.siteVisit.deleteMany()
  await prisma.deal.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.project.deleteMany()
  await prisma.broker.deleteMany()
  await prisma.user.deleteMany()

  console.log('✓ Cleared existing data')

  const password = await bcrypt.hash('password123', 10)
  const demoPassword = await bcrypt.hash('demo123', 10)

  // ===========================
  // USERS
  // ===========================
  const admin = await prisma.user.create({
    data: { name: 'Rajesh Kumar', email: 'admin@propertyflow.com', password, phone: '9800000001', role: 'ADMIN' }
  })

  // Specific Demo Accounts for Website Visitors
  const demoAdmin = await prisma.user.create({
    data: { name: 'Demo Admin', email: 'demo@crm.com', password: demoPassword, phone: '9800000000', role: 'ADMIN' }
  })

  const demoAgent = await prisma.user.create({
    data: { name: 'Demo Agent', email: 'agent@crm.com', password: demoPassword, phone: '9800000009', role: 'AGENT' }
  })

  const manager1 = await prisma.user.create({
    data: { name: 'Priya Sharma', email: 'priya@propertyflow.com', password, phone: '9800000002', role: 'MANAGER' }
  })

  const manager2 = await prisma.user.create({
    data: { name: 'Vikram Singh', email: 'vikram@propertyflow.com', password, phone: '9800000003', role: 'MANAGER' }
  })

  const agents = await Promise.all([
    prisma.user.create({ data: { name: 'Amit Patel', email: 'amit@propertyflow.com', password, phone: '9800000010', role: 'AGENT' } }),
    prisma.user.create({ data: { name: 'Sneha Reddy', email: 'sneha@propertyflow.com', password, phone: '9800000011', role: 'AGENT' } }),
    prisma.user.create({ data: { name: 'Rahul Verma', email: 'rahul@propertyflow.com', password, phone: '9800000012', role: 'AGENT' } }),
    prisma.user.create({ data: { name: 'Deepika Nair', email: 'deepika@propertyflow.com', password, phone: '9800000013', role: 'AGENT' } }),
    prisma.user.create({ data: { name: 'Karan Malhotra', email: 'karan@propertyflow.com', password, phone: '9800000014', role: 'AGENT' } }),
  ])

  // Include demo accounts so they get leads/projects assigned to them
  agents.push(demoAgent)

  const brokerUsers = await Promise.all([
    prisma.user.create({ data: { name: 'Sunil Broker', email: 'sunil@brokers.com', password, phone: '9800000020', role: 'BROKER' } }),
    prisma.user.create({ data: { name: 'Anita Broker', email: 'anita@brokers.com', password, phone: '9800000021', role: 'BROKER' } }),
    prisma.user.create({ data: { name: 'Mohan Broker', email: 'mohan@brokers.com', password, phone: '9800000022', role: 'BROKER' } }),
  ])

  console.log('✓ Created 11 users (1 admin, 2 managers, 5 agents, 3 brokers)')

  // ===========================
  // BROKERS (separate entity)
  // ===========================
  const brokers = await Promise.all([
    prisma.broker.create({ data: { name: 'Kumar Realty', company: 'Kumar Realty Pvt Ltd', phone: '9900000001', email: 'info@kumarrealty.com', commission: 1.5 } }),
    prisma.broker.create({ data: { name: 'Sharma Properties', company: 'Sharma Properties Group', phone: '9900000002', email: 'info@sharmaprops.com', commission: 2.0 } }),
    prisma.broker.create({ data: { name: 'Metro Estates', company: 'Metro Estates LLC', phone: '9900000003', email: 'info@metroestates.com', commission: 1.75 } }),
  ])

  console.log('✓ Created 3 brokers')

  // ===========================
  // PROJECTS
  // ===========================
  const projectsData = [
    { name: 'Green Valley Residency', location: 'Whitefield, Bangalore', minPrice: 4500000, maxPrice: 8500000, totalUnits: 120, availableUnits: 45, status: 'ONGOING' as const, managerId: manager1.id, coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', 'https://images.unsplash.com/photo-1515263487990-61b07816b324', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'] },
    { name: 'Palm Meadows', location: 'Gachibowli, Hyderabad', minPrice: 5500000, maxPrice: 12000000, totalUnits: 80, availableUnits: 22, status: 'ONGOING' as const, managerId: manager1.id, coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'https://images.unsplash.com/photo-1600607687931-cebf10cbdf1f'] },
    { name: 'Skyline Towers', location: 'Bandra, Mumbai', minPrice: 15000000, maxPrice: 35000000, totalUnits: 200, availableUnits: 85, status: 'ONGOING' as const, managerId: manager2.id, coverImage: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3', 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef'] },
    { name: 'Riverfront Heights', location: 'Navrangpura, Ahmedabad', minPrice: 3500000, maxPrice: 7000000, totalUnits: 150, availableUnits: 60, status: 'ONGOING' as const, managerId: manager2.id, coverImage: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'] },
    { name: 'Urban Nest Apartments', location: 'Koramangala, Bangalore', minPrice: 6000000, maxPrice: 10000000, totalUnits: 60, availableUnits: 8, status: 'ONGOING' as const, managerId: manager1.id, coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1502672260266-1c1de2d1d0cb', 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0'] },
    { name: 'Lakeview Residences', location: 'Salt Lake, Kolkata', minPrice: 4000000, maxPrice: 9000000, totalUnits: 110, availableUnits: 40, status: 'ONGOING' as const, managerId: manager1.id, coverImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb', 'https://images.unsplash.com/photo-1502005097973-1577c0e5aeca', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc'] },
    { name: 'Silver Oak Villas', location: 'Jubilee Hills, Hyderabad', minPrice: 8000000, maxPrice: 18000000, totalUnits: 30, availableUnits: 12, status: 'PRELAUNCH' as const, managerId: manager2.id, coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'] },
    { name: 'Emerald City Towers', location: 'Hebbal, Bangalore', minPrice: 5000000, maxPrice: 9500000, totalUnits: 90, availableUnits: 90, status: 'PRELAUNCH' as const, managerId: manager1.id, coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8', 'https://images.unsplash.com/photo-1430285561322-780c604beffc'] },
    { name: 'Golden Horizon', location: 'MG Road, Pune', minPrice: 3000000, maxPrice: 6000000, totalUnits: 50, availableUnits: 0, status: 'COMPLETED' as const, managerId: manager2.id, coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1577495508048-b635879837f1', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511', 'https://images.unsplash.com/photo-1502672260266-1c1de2d1d0cb'] },
    { name: 'Sunrise Enclave', location: 'ECR Road, Chennai', minPrice: 12000000, maxPrice: 25000000, totalUnits: 40, availableUnits: 15, status: 'ONGOING' as const, managerId: manager1.id, coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750', 'https://images.unsplash.com/photo-1600607687931-cebf10cbdf1f', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde'] },
  ]

  const projects = await Promise.all(
    projectsData.map(p => prisma.project.create({ data: p }))
  )

  console.log('✓ Created 10 projects')

  // ===========================
  // LEADS (100)
  // ===========================
  const firstNames = [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
    'Ananya', 'Diya', 'Myra', 'Sara', 'Aanya', 'Aadhya', 'Aarushi', 'Riya', 'Kavya', 'Meera',
    'Rohan', 'Dev', 'Aryan', 'Kabir', 'Dhruv', 'Harsh', 'Yash', 'Pranav', 'Nikhil', 'Akash',
    'Priti', 'Neha', 'Pooja', 'Shruti', 'Ankita', 'Divya', 'Rashmi', 'Sanjana', 'Tanvi', 'Nisha',
    'Rajat', 'Varun', 'Gaurav', 'Sumit', 'Ashish', 'Naveen', 'Manish', 'Deepak', 'Suresh', 'Ramesh',
  ]

  const lastNames = [
    'Sharma', 'Patel', 'Singh', 'Kumar', 'Reddy', 'Nair', 'Gupta', 'Verma', 'Joshi', 'Malhotra',
    'Agarwal', 'Mehta', 'Chopra', 'Kapoor', 'Saxena', 'Bhat', 'Rao', 'Iyer', 'Desai', 'Shah',
  ]

  const sources: ('WEBSITE' | 'FACEBOOK_ADS' | 'GOOGLE_ADS' | 'BROKER' | 'REFERRAL' | 'WALK_IN')[] = [
    'WEBSITE', 'FACEBOOK_ADS', 'GOOGLE_ADS', 'BROKER', 'REFERRAL', 'WALK_IN'
  ]

  const statuses: ('NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'SITE_VISIT_DONE' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST')[] = [
    'NEW', 'CONTACTED', 'FOLLOW_UP', 'SITE_VISIT_DONE', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'
  ]

  const statusWeights = [20, 18, 15, 15, 12, 12, 8]

  const propertyTypes: ('FLAT' | 'VILLA' | 'PLOT' | 'COMMERCIAL')[] = ['FLAT', 'VILLA', 'PLOT', 'COMMERCIAL']

  function pickWeighted<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0)
    let rand = Math.random() * total
    for (let i = 0; i < items.length; i++) {
      rand -= weights[i]
      if (rand <= 0) return items[i]
    }
    return items[items.length - 1]
  }

  function randomDate(daysBack: number, daysForward: number): Date {
    const now = new Date()
    const offset = Math.floor(Math.random() * (daysBack + daysForward)) - daysBack
    now.setDate(now.getDate() + offset)
    now.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60))
    return now
  }

  const leads: any[] = []

  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const status = pickWeighted(statuses, statusWeights)
    const project = projects[Math.floor(Math.random() * projects.length)]
    const agent = agents[i % agents.length]
    const source = sources[Math.floor(Math.random() * sources.length)]
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)]

    const budgetMin = project.minPrice * (0.8 + Math.random() * 0.4)
    const budgetMax = budgetMin * (1.2 + Math.random() * 0.5)

    let nextFollowup: Date | null = null
    if (['NEW', 'CONTACTED', 'FOLLOW_UP', 'SITE_VISIT_DONE', 'NEGOTIATION'].includes(status)) {
      // Some today, some overdue, some future
      if (i % 10 < 3) {
        // Today
        const today = new Date()
        today.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0)
        nextFollowup = today
      } else if (i % 10 < 5) {
        // Overdue (past)
        nextFollowup = randomDate(15, -1)
      } else {
        // Future
        nextFollowup = randomDate(-1, 30)
      }
    }

    const lead = await prisma.lead.create({
      data: {
        fullName: `${firstName} ${lastName}`,
        phone: `98${String(70000000 + i).padStart(8, '0')}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
        budgetMin: Math.round(budgetMin),
        budgetMax: Math.round(budgetMax),
        propertyType,
        status,
        source,
        notes: i % 3 === 0 ? `Interested in ${propertyType.toLowerCase()} options. Budget flexible.` : null,
        projectId: project.id,
        assignedAgentId: agent.id,
        nextFollowup,
        createdAt: randomDate(90, 0),
      }
    })

    leads.push(lead)

    // Create activity for each lead
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        userId: agent.id,
        type: 'LEAD_CREATED',
        description: `Lead "${lead.fullName}" created from ${source.replace('_', ' ')}`,
        createdAt: lead.createdAt,
      }
    })

    // Add extra activities for leads further in pipeline
    if (['CONTACTED', 'FOLLOW_UP', 'SITE_VISIT_DONE', 'NEGOTIATION', 'CLOSED_WON'].includes(status)) {
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          userId: agent.id,
          type: 'STATUS_CHANGE',
          description: 'Agent contacted the client via phone',
          createdAt: new Date(lead.createdAt.getTime() + 3600000),
        }
      })
    }

    if (['FOLLOW_UP', 'SITE_VISIT_DONE', 'NEGOTIATION', 'CLOSED_WON'].includes(status)) {
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          userId: agent.id,
          type: 'NOTE_ADDED',
          description: 'Follow-up scheduled. Client showed interest in the project.',
          createdAt: new Date(lead.createdAt.getTime() + 7200000),
        }
      })
    }
  }

  console.log('✓ Created 100 leads with activities')

  // ===========================
  // DEALS (20) — from CLOSED_WON leads
  // ===========================
  const closedWonLeads = leads.filter(l => l.status === 'CLOSED_WON')

  const monthOffsets = [-5, -4, -4, -3, -3, -3, -2, -2, -2, -2, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0]

  for (let i = 0; i < Math.min(20, closedWonLeads.length); i++) {
    const lead = closedWonLeads[i]
    const saleValue = Math.round(lead.budgetMin + Math.random() * (lead.budgetMax - lead.budgetMin))
    const broker = i % 3 === 0 ? brokers[i % brokers.length] : null
    const commissionAmount = broker ? (saleValue * broker.commission) / 100 : 0

    const closedDate = new Date()
    closedDate.setMonth(closedDate.getMonth() + (monthOffsets[i] || 0))
    closedDate.setDate(Math.floor(Math.random() * 28) + 1)

    await prisma.deal.create({
      data: {
        leadId: lead.id,
        projectId: lead.projectId,
        saleValue,
        brokerId: broker?.id || null,
        commissionAmount: Math.round(commissionAmount),
        notes: i % 2 === 0 ? 'Smooth negotiation. Client satisfied.' : null,
        closedAt: closedDate,
      }
    })

    // Add deal activity
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        userId: agents[i % agents.length].id,
        type: 'DEAL_CREATED',
        description: `Deal closed for ₹${saleValue.toLocaleString()}`,
        createdAt: closedDate,
      }
    })
  }

  console.log('✓ Created deals from closed leads')

  // ===========================
  // SITE VISITS (30)
  // ===========================
  const visitableLeads = leads.filter(l =>
    ['SITE_VISIT_DONE', 'NEGOTIATION', 'CLOSED_WON', 'FOLLOW_UP'].includes(l.status)
  )

  const visitStatuses: ('SCHEDULED' | 'COMPLETED' | 'CANCELLED')[] = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'SCHEDULED', 'CANCELLED']

  for (let i = 0; i < Math.min(30, visitableLeads.length); i++) {
    const lead = visitableLeads[i]
    const visitStatus = visitStatuses[i % visitStatuses.length]

    await prisma.siteVisit.create({
      data: {
        leadId: lead.id,
        agentId: lead.assignedAgentId,
        visitDate: randomDate(30, visitStatus === 'SCHEDULED' ? 14 : -1),
        status: visitStatus,
        notes: visitStatus === 'COMPLETED'
          ? 'Client visited the site. Positive feedback.'
          : visitStatus === 'SCHEDULED'
            ? 'Visit confirmed with client.'
            : 'Client cancelled due to scheduling conflict.',
      }
    })

    if (visitStatus === 'COMPLETED') {
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          userId: lead.assignedAgentId,
          type: 'SITE_VISIT',
          description: 'Site visit completed successfully',
          createdAt: randomDate(20, 0),
        }
      })
    }
  }

  console.log('✓ Created 30 site visits')

  // ===========================
  // NOTIFICATIONS
  // ===========================
  const notificationTemplates = [
    { title: 'New Lead Assigned', message: 'A new lead has been assigned to you.' },
    { title: 'Follow-up Overdue', message: 'You have a follow-up that is overdue. Please contact the client.' },
    { title: 'Deal Closed', message: 'Congratulations! A deal has been closed successfully.' },
    { title: 'Site Visit Scheduled', message: 'A site visit has been scheduled for tomorrow.' },
    { title: 'Lead Status Updated', message: 'A lead status has been updated to Negotiation.' },
  ]

  for (const agent of agents) {
    for (let j = 0; j < 3; j++) {
      const template = notificationTemplates[(agents.indexOf(agent) + j) % notificationTemplates.length]
      await prisma.notification.create({
        data: {
          userId: agent.id,
          title: template.title,
          message: template.message,
          isRead: j > 0,
          createdAt: randomDate(7, 0),
        }
      })
    }
  }

  // Admin notifications
  for (let j = 0; j < 5; j++) {
    const template = notificationTemplates[j % notificationTemplates.length]
    await prisma.notification.create({
      data: {
        userId: admin.id,
        title: template.title,
        message: template.message,
        isRead: j > 2,
        createdAt: randomDate(7, 0),
      }
    })
  }

  console.log('✓ Created notifications')
  console.log('')
  console.log('🎉 Seed completed successfully!')
  console.log('')
  console.log('Login credentials:')
  console.log('  Admin:   admin@propertyflow.com  (pass: password123)')
  console.log('  Manager: priya@propertyflow.com  (pass: password123)')
  console.log('  Agent:   amit@propertyflow.com   (pass: password123)')
  console.log('  Broker:  sunil@brokers.com       (pass: password123)')
  console.log('  Demo Admin: demo@crm.com         (pass: demo123)')
  console.log('  Demo Agent: agent@crm.com        (pass: demo123)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })