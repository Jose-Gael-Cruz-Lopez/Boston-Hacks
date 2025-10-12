interface Feature {
  id: string
  title: string
  description: string
  icon: string
}

const features: Feature[] = [
  {
    id: 'typescript',
    title: 'TypeScript Support',
    description: 'Full TypeScript support with strict type checking and excellent developer experience.',
    icon: '🔷'
  },
  {
    id: 'tailwind',
    title: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid UI development with custom design system.',
    icon: '🎨'
  },
  {
    id: 'nextjs',
    title: 'Next.js 15',
    description: 'Latest Next.js with App Router, Server Components, and optimized performance.',
    icon: '⚡'
  },
  {
    id: 'responsive',
    title: 'Responsive Design',
    description: 'Mobile-first responsive design that works perfectly on all devices.',
    icon: '📱'
  },
  {
    id: 'performance',
    title: 'High Performance',
    description: 'Optimized for speed with code splitting, lazy loading, and modern web standards.',
    icon: '🚀'
  },
  {
    id: 'developer',
    title: 'Developer Experience',
    description: 'Excellent developer experience with hot reload, TypeScript, and modern tooling.',
    icon: '🛠️'
  }
]

export default function Features() {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">
            Why Choose This Stack?
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            This combination of technologies provides the perfect foundation for modern web applications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="card hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="heading-3 mb-3">
                  {feature.title}
                </h3>
                <p className="text-small">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

