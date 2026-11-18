import { Navbar } from '@/components/Navbar'
import { SideNav } from '@/components/SideNav'
import { Hero } from '@/components/Hero'
import { AboutAndContact } from '@/components/AboutAndContact'
import { getProjects } from '@/lib/api'
import { ProjectsShowcase } from '@/components/ProjectsShowcase'

export default async function HomePage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SideNav />

      <main className="flex-1">
        <Hero />
        <ProjectsShowcase projects={projects} />
        <AboutAndContact />
      </main>
    </div>
  )
}

