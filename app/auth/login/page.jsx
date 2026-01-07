// app/auth/login/page.jsx
import Logo from '../../../components/ui/logo';
import LoginForm from '@/components/auth/LoginForm';
import Image from 'next/image';
import sample from '../../../public/login-register/Sample-Box.png';

export const metadata = {
  title: 'Sign In - arcmat',
  description: 'Sign in to your arcmat account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#F5E9E2]">

      {/* Left Section - Hero */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-between p-2 relative">
        {/* Logo - Positioned top left */}
        <div className="w-full pl-4 pt-2">
          <Logo href="/" className="self-start" />
        </div>

        <div className="flex flex-col items-center justify-start flex-1 mt-10 py-8 px-8">
          {/* Main Heading - Matched Font & Color (#4D4E58) */}
          <h1 className="text-[36px] font-semibold text-[#4D4E58] text-center leading-[50px] max-w-[500px] mb-6">
            The marketplace where architects and brands build the future together.
          </h1>

          {/* Sub Heading - Matched Font & Color (#86868B) */}
          <p className="text-[16px] text-[#86868B] text-center leading-[24px] mb-8">
            Hundreds of Brands. One Website. Order by Midnight.
          </p>

          {/* Illustration - Matched Dimensions (300px width) & Removed White Box */}
          <div className="mb-8">
            <Image
              src={sample}
              alt="Architects and brands illustration"
              width={300}              // Matched Figma width
              height={200}             // Matched Figma height
              className="object-contain"
              priority
            />
          </div>

          {/* Trusted Brands - Removed Text & White Backgrounds */}
          {/* <div className="w-full flex items-center justify-center gap-10 mt-auto pb-10">
            {[
              { name: 'Johnson Bathware', src: '/brands/johnson.svg' },
              { name: 'Somany', src: '/brands/somany.svg' },
              { name: 'Kajaria', src: '/brands/kajaria.svg' },
              { name: 'Cera', src: '/brands/cera.svg' },
            ].map((brand) => (
              <div key={brand.name} className="flex items-center justify-center">
                <Image 
                  src={brand.src} 
                  alt={brand.name}
                  width={100} 
                  height={45}
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity" 
                />
              </div>
            ))}
          </div> */}
        </div>
      </div>


      {/* RIGHT SIDE - Form Section (White Background) */}
      {/* <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 sm:px-12 py-12 bg-white min-h-screen"> */}
      <div className="min-h-screen flex w-full lg:w-1/2 bg-white px-8 sm:px-8 justify-center ">
        {/* Pass the form component here */}
        <LoginForm />
      </div>

    </div>
  );
}