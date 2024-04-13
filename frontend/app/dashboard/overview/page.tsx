import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import GeneralCard from "@/components/auctions/generalCard";


export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>
            <main className="flex-grow p-8">
                <div className="text-center">
                  <GeneralCard/>
                </div>
            </main>
            <Footer/>
        </div>
    )
}