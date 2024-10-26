'use client'
import {useAuthState} from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/app/(services)/firebase/config'

const Home = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  console.log(user);
  
    if(!user){
    }
  
  return (
   <div className="flex flex-col gap-6">
    <div>This is the Home Page</div>
    <button onClick={()=>{ signOut(auth);}} className="bg-blue-300 px-9 py-3 hover:bg-blue-200 rounded-lg">Logout</button>
   </div>
  )
}
export default Home