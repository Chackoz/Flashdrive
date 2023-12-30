export const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLElement, e) {
        e.preventDefault();
  
        const targetId = this.getAttribute('href');
        
        if (targetId) { // Check if targetId is not null
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      });
    });
  };
  