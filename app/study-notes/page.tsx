import realAnalysis from '@public/real-analysis.png';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto mt-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Mathematics </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Link href="/topology/chapters/0">
          <div className="box bg-white shadow-md rounded-lg p-4 cursor-pointer text-center">
            <h2 className="text-lg font-bold">Topology</h2>
          </div>
        </Link>

        <Link href="/real-analysis/chapters/0">
          <div className="box bg-white shadow-md rounded-lg p-4 cursor-pointer text-center">
            <Image src={realAnalysis} alt="Real Analysis" className="rounded-lg" />
            <h2 className="text-lg font-bold mt-2">Real Analysis</h2>
          </div>
        </Link>

        <Link href="/abstract-algebra/chapters/0">
          <div className="box bg-white shadow-md rounded-lg p-4 cursor-pointer text-center">
            <h2 className="text-lg font-bold">Abstract Algebra</h2>
          </div>
        </Link>

        <Link href="/linear-algebra/chapters/0">
          <div className="box bg-white shadow-md rounded-lg p-4 cursor-pointer text-center">
            <h2 className="text-lg font-bold">Linear Algebra</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}
