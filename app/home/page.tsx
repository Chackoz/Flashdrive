'use client'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'

const Home = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  console.log(user);
  
    if(!user){
<<<<<<< HEAD
=======
      
>>>>>>> dc00fe2ccebc43c76840f456df0d7c4c1f927ca6
    }
  
  return (
   <div className="flex flex-col gap-6">
    <div>This is the Home Page</div>
    <button onClick={()=>{ signOut(auth);}} className="bg-blue-300 px-9 py-3 hover:bg-blue-200 rounded-lg">Logout</button>
   </div>
  )
}
export default Home