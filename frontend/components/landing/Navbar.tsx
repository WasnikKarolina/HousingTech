import {Button} from "@/components/ui/button";

export default function Navbar() {

    return(

        <header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <nav className="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
                    <a className="mr-5 hover:text-gray-900">Info</a>
                    <a className="mr-5 hover:text-gray-900">Auctions</a>
                    <a className="mr-5 hover:text-gray-900">About Us</a>
                </nav>
                <a className="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0">

                    <span className="ml-3 text-xl">Astas</span>
                </a>
                <div className="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0">
                    <Button  className="inline-flex items-center  bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                        <a className="text-gray-600" href="/profile">Login</a>
                    </Button>
                </div>
            </div>
        </header>
    )
}
