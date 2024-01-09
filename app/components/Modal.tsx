'use client'
import React, { useState,useRef } from 'react'
import Image from 'next/image';
import toast,{Toaster} from 'react-hot-toast';

interface ModalProps {
  onSelectImage: (num: number | null) => void;
}

const Modal:React.FC<ModalProps> = ({onSelectImage}) => {
  const imgarray = [1,2,3,4,5,6,7,8,9,10];
 // const [nu,setNu] = useState<number>();
  const [selectedImage,setSelectedImage] = useState<number | null>(null);
   
  const handleSelect =(num:any)=>{
      if(!num){
        toast.error('No Image selected');
      }else{
        //setSelectedImage(num);
        //console.log("Selected Image is "+ selectedImage);
        onSelectImage(num);
        
      }
      
  }
  return (
    <div className='bg-white shadow-xl w-[800px] rounded-md px-5 flex-col  flex overflow-hidden justify-center items-center'>
      <Toaster position="top-center"   toastOptions={{ className: '',duration: 3000,style: { background: '#363636',color: '#fff',}}} />
     <h2 className='text-xl mt-8 font-poppins'>Choose a profile picture</h2>
     <div className='pfp-images h-72 w-[650px] flex flex-wrap justify-around px-4 gap-y-3 gap-x-3 items-center '>
    {
     imgarray.map((num,index)=>{
    

      return (
      <div className='w-[100px] h-[100px] overflow-hidden cursor-pointer rounded-sm focus:border-blue-500 focus:border-4'
       tabIndex={0}
       key={index}
       onClick={()=>handleSelect(num)}>
          <Image
      
       
        className="object-cover bg-[#d5d5d5] transition-all "
        src={`https://firebasestorage.googleapis.com/v0/b/flashdrive-6e8c3.appspot.com/o/pfp%2Fpfp%20(${num}).png?alt=media&token=6f312ab2-f540-4379-9b9c-fba7f0848d60`}
        alt={'Image from firebase'}
        width={100}
        height={100}
        loading="lazy"
        placeholder="blur"
        blurDataURL={`https://firebasestorage.googleapis.com/v0/b/flashdrive-6e8c3.appspot.com/o/pfp%2Fpfp%20(${num}).png?alt=media&token=6f312ab2-f540-4379-9b9c-fba7f0848d60`}
      />
      </div>
      )
     })
    }
     </div>
      <div className='text-right'>
        <button className='bg-black px-5 p-2 text-white rounded-md text-[2rem] font-poppins text-sm hover:bg-[#e0e0e0] border-[1px] hover:border-black hover:text-black transition-all disabled:bg-gray-600 delay-75 duration-150' onClick={()=>{handleSelect(selectedImage)}}>Select Profile Picture</button>
      </div>
    
     <p className='font-normal italic font-mono opacity-80 text-xs text-center mt-6 mb-3 '> *Image Options change everytime</p>
      </div>
  )
}


export default Modal