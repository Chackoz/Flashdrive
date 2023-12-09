import Image from 'next/image'

export default function Home() {
  
  return (
    <div className='h-screen w-screen flex justify-center items-center relative'>
     <h2 className='text-white text-[6rem] font-bold font-[Familjen_Grotesk] uppercase'> Gaming Hub</h2>
      <div className='w-[400px] h-[400px] bg-purple-800 rounded-full absolute z-[-10] blur-[300px]'></div>
    </div>
  )
}
