// components/ui/Logo.jsx
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/Icons/Logo.svg';

export default function Logo({ href = '/', className = '' }) {
  return (
    <Link href={href} className={className}>
      <Image
        src={logo}
        alt="arcmat"
        width={30}
        height={30}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}