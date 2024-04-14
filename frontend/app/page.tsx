import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";


export default function Home() {
  return (
      <div className="min-h-screen flex flex-col">
        <Navbar/>
        <main className="flex-grow p-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">Welcome to HousingTech</h2>
            <p className="text-gray-600">
                The best place to find your dream home in a decentralized ways
            </p>
          </div>
        </main>
        <Footer/>
      </div>
  )
}