
export const setHighScoreAnon = (score:number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('highScore', score.toString());
      console.log("done")
    }
  };
  
export const getHighScoreAnon = (): number => {
    if (typeof window !== 'undefined') {
        console.log("value:",localStorage.getItem('highScore') )
      return parseInt(localStorage.getItem('highScore') || '0',);
      
    }
    return 0;
  };
  