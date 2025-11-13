import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-0">
      <Image
        src="/green.png"
        alt="Badjr Logo"
        width={300}
        height={300}
        className=""
      />
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-foreground">
          Welcome to Your Dashboard
        </h1>
        <p className="text-xl text-foreground mb-8">
          Manage your businesses, classes, and more.
        </p>

        <div className="mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">Welcome</h2>
          <p className="text-lg text-foreground">
            This is your personalized portal to manage all aspects of your Badjr journey.
            From here, you can access your business profiles, manage HTH classes, communicate with other users, and more.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="#" className="flex flex-col items-center justify-center p-6 bg-primary text-white rounded-lg shadow-md hover:bg-secondary transition-colors duration-200 aspect-square">
              <span className="text-xl font-semibold text-center">Business Checklist</span>
            </Link>
            <Link href="#" className="flex flex-col items-center justify-center p-6 bg-primary text-white rounded-lg shadow-md hover:bg-secondary transition-colors duration-200 aspect-square">
              <span className="text-xl font-semibold text-center">Invoice</span>
            </Link>
            <Link href="#" className="flex flex-col items-center justify-center p-6 bg-primary text-white rounded-lg shadow-md hover:bg-secondary transition-colors duration-200 aspect-square">
              <span className="text-xl font-semibold text-center">Pay Contractors</span>
            </Link>
            <Link href="#" className="flex flex-col items-center justify-center p-6 bg-primary text-white rounded-lg shadow-md hover:bg-secondary transition-colors duration-200 aspect-square">
              <span className="text-xl font-semibold text-center">Take a Payment</span>
            </Link>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">How We Help</h2>
          <p className="text-lg text-foreground">
            Badjr provides resources and tools to help entrepreneurs succeed.
            Our platform connects you with mentors, educational content, and a community of like-minded individuals.
          </p>
        </div>

        <div className="bg-background shadow-lg rounded-lg p-8 mb-12 text-left">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Resources</h2>
          <ul className="text-lg text-foreground space-y-4">
            <li>
              <strong>Business Development:</strong> Access guides and tools to grow your business.
            </li>
            <li>
              <strong>Mentorship Programs:</strong> Connect with experienced mentors.
            </li>
            <li>
              <strong>Networking Events:</strong> Find and attend events to expand your network.
            </li>
            <li>
              <strong>Educational Classes:</strong> Enroll in courses designed for entrepreneurs.
            </li>
          </ul>
        </div>

        <div className="bg-background shadow-lg rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Important Information</h2>
          <p className="text-lg text-foreground">
            Always keep your profile updated to ensure you receive the most relevant information and opportunities.
            If you have any questions, please reach out to support.
          </p>
        </div>
      </div>
    </div>
  );
}
