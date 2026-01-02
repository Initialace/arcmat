import Image from "next/image";
import Container from "../ui/Container";

const LeadingBrands = () => {
    const brands = [
        "Image_20.png", "Image_21.png", "Image_22.png", "Image_23.png",
        "Image_24.png", "Image_25.png", "Image_26.png", "Image_27.png",
        "Image_28.png", "Image_29.png", "Image_30.png", "Image_31.png",
        "Image_32.png", "Image_33.png", "Image_34.png", "Image_35.png"
    ];

    return (
        <section className="bg-white pt-16 pb-20">
            <div className="w-full mx-auto">

                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#4D4E58] mb-6 leading-tight">
                        Leading brands collected in <br className="hidden md:block" /> a single place.
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl font-light">
                        Quickly searches hundreds of brands and thousands of materials in seconds.
                    </p>
                </div>

                <div className="bg-[#E09A74] w-full py-16 rounded-sm">
                    <Container>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 max-w-[1600px] mx-auto">
                            {brands.map((brand, index) => (
                                <div
                                    key={index}
                                    className="bg-white aspect-square flex items-center justify-center p-4 rounded-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                >
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={`/Brands/${brand}`}
                                            alt={`Brand ${index + 1}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Container>
                </div>

            </div>
        </section>
    );
};

export default LeadingBrands;
