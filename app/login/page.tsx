import { spaceGrotesk } from "../fonts"

const page = () => {
  return (
    <div className={`${spaceGrotesk.className} min-h-screen relative overflow-hidden flex justify-center items-center min-w-full`}>
      <div className="w-1/2 h-screen flex items-center justify-center transition-all ease-out duration-500 ">
        <div className="h-[90%] w-[70%] rounded-lg group bg-[#f4fd6b]  flex justify-center items-center">
        <div className="text-5xl  text-black group-hover:text-7xl transition-all ease-in-out duration-300 font-bold">NAMMADA LOGO</div>
    
        </div>
      </div>
      <div className="w-[1px] absolute bg-gray-950 opacity-30 h-[90%]"></div>
      <div className="w-1/2 h-screen flex flex-col items-center">
        
        <div className="text-gray-950 text-xl ">
          Good to see you again.
        </div>
        <div className="flex-col flex w-2/5 text-2xl bg-red-400 px-10">
          <label htmlFor="email" >Login</label>
          <input type="text" id="email" placeholder="Email"   className="outline-none border-black border border-opacity-50 px-3"/>
          <label htmlFor="password">Password</label>
          <input type="text" id="password" placeholder="Password" className="outline-none border-black border border-opacity-50 px-3"/>
        </div>
        <div className="flex flex-col w-[40%]">
          <a href="" className="text-right">Forgot Password?</a>
        <button className="bg-[#f4fd6b] text-xxl py-4 px-6  rounded-lg">Log In</button>
        </div>
        <div>

        </div>
        <div className=" flex justify-around w-[40%]">
          <div className="bg-blue-600 px-8 py-3  rounded-lg">Google</div>
          <div className="bg-blue-600 px-8 py-3  rounded-lg">GitHub</div>
        </div>
      </div>
    </div>
  )
}
export default page