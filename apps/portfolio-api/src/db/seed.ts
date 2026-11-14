import { db, client } from './connection'
import { projects } from './schema'

async function runSeed() {
  console.log('🌱 Seeding initial portfolio projects...')

  await db.delete(projects)

  await db.insert(projects).values([
    {
      title: 'PUNoted',
      description: 'Active university & community note-taking and management platform with real-world adoption.',
      longDescription: 'PUNoted is an actively maintained software system with over 140 registered users and ~60 active users. Built for students to collaborate, organize study resources, and manage academic workflows seamlessly.',
      category: 'SOFTWARE',
      status: 'ACTIVE',
      featured: true,
      techStack: ['Python', 'PostgreSQL', 'Docker', 'REST API', 'AI Agents'],
      userCount: 60,
      registeredCount: 140,
      sortOrder: 1,
    },
    {
      title: 'Smart Gate Automation Upgrade',
      description: 'Custom ESP32-based hardware controller and wireless trigger upgrade for residential driveway gate.',
      longDescription: 'Engineered an IoT upgrade for an automated entry gate using an ESP32 microcontroller, custom relays, and network integration to enable secure remote access and status monitoring.',
      category: 'HARDWARE',
      status: 'ACTIVE',
      featured: true,
      techStack: ['ESP32', 'C++', 'Electronics', 'MQTT', 'IoT'],
      sortOrder: 2,
    },
    {
      title: 'Garden Automation & Environmental Telemetry',
      description: 'Automated irrigation control with multi-sensor telemetry collection across garden zones.',
      longDescription: 'ESP32 microcontrollers deployed with soil moisture, temperature, and atmospheric sensors. Gathers metrics, automates watering schedules, and streams telemetry for historical analysis.',
      category: 'HARDWARE',
      status: 'ACTIVE',
      featured: true,
      techStack: ['ESP32', 'Sensors', 'MQTT', 'Python', 'PostgreSQL'],
      sortOrder: 3,
    },
    {
      title: 'AI Agentic Experiments & Local LLM Systems',
      description: 'Explorations in agentic coding, local 14B model inference, and automation workflows.',
      longDescription: 'Experimental implementations of AI agents for developer automation and self-hosted local model benchmarking on an Ubuntu Linux home server.',
      category: 'SOFTWARE',
      status: 'COMPLETED',
      featured: false,
      techStack: ['Python', 'Local LLMs', 'Docker', 'Linux'],
      sortOrder: 4,
    },
  ])

  console.log('✅ Seeding completed!')
  await client.end()
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})

