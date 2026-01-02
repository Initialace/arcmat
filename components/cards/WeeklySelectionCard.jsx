import Link from "next/link";
import Image from "next/image";

const WeeklySelectionCard = ({ brand, image, title, description, link, onViewMore }) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col hover:translate-y-[-4px] transition-transform duration-500">
            <div className="p-4 flex justify-between items-center border-b border-gray-100/50">
                <span className="font-bold text-[#003366] text-lg italic tracking-wide">{brand}</span>
                <div className="flex gap-3 text-gray-500">
                    <button className="hover:scale-110 transition-transform duration-300">
                        <Image src="/Icons/Heart.svg" alt="Like" width={20} height={20} className="w-5 h-5" />
                    </button>
                    <button className="hover:scale-110 transition-transform duration-300">
                        <Image src="/Icons/Search.svg" alt="Search" width={20} height={20} className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="relative w-full h-48 sm:h-56 bg-gray-100 group overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-gray-900 font-semibold mb-1 text-base">{title}</h3>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">{description}</p>

                <div className="mt-auto">
                    <button
                        onClick={onViewMore}
                        className="inline-block px-5 py-1.5 border border-[#d2b48c] text-[#a08050] text-xs font-medium rounded-full hover:bg-[#d2b48c] hover:text-white transition-colors duration-300 uppercase tracking-wide"
                    >
                        View More
                    </button>
                </div>
            </div>
        </div>
    );
};



export default WeeklySelectionCard;
