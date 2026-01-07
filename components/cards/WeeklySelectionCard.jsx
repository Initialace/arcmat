import Link from "next/link";
import Image from "next/image";

const WeeklySelectionCard = ({ brand, image, title, description, link, onViewMore }) => {
    return (
        <div
            onClick={onViewMore}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col hover:translate-y-[-4px] cursor-pointer"
        >
            <div className="relative w-full h-80 sm:h-80 bg-gradient-to-br from-slate-600 to-slate-800 group overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Brand overlay on image */}
                <div className="absolute top-4 left-4 z-20">
                    <span className=" text-gray-900 text-sm font-bold">
                        {brand}
                    </span>
                </div>

                {/* Optional: Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
        </div>
    );
};

export default WeeklySelectionCard;