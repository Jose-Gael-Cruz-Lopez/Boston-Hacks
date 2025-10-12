export default function CTA() {
  return (
    <section className="section bg-secondary-50">
      <div className="container">
        <div className="text-center">
          <h2 className="heading-2 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-body mb-8 max-w-2xl mx-auto">
            Start building your next amazing web application with this powerful stack.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Start Building
            </button>
            <button className="btn-secondary">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

