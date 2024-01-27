import realAnalysis from '@public/real-analysis.png';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto mt-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Mathematics </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-green-500 text-white p-6 rounded-lg">
          <h2 className="text-lg font-bold">Topology</h2>
        </div>

        <Link href="/real-analysis/chapters/0">
          <div className="bg-white shadow-md rounded-lg p-4 cursor-pointer text-center">
            <Image src={realAnalysis} alt="Real Analysis" className="rounded-lg" />
            <h2 className="text-lg font-bold mt-2">Real Analysis</h2>
          </div>
        </Link>

        <div className="bg-yellow-500 text-white p-6 rounded-lg">
          <h2 className="text-lg font-bold">Abstract Algebra</h2>
        </div>

        <div className="bg-pink-500 text-white p-6 rounded-lg">
          <h2 className="text-lg font-bold">Linear Algebra</h2>
        </div>
      </div>
    </div>
  );
}
