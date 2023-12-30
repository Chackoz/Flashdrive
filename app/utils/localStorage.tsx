
  
  export const setUsername = (username :string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('username', username );
      console.log(username)
    }
  };

  export const getUsername = (): string=> {
    if (typeof window !== 'undefined') {
        console.log("value:",localStorage.getItem('highScore') )
      return localStorage.getItem('username') || `Anon`;
      
    }
    return "Anon";
  };