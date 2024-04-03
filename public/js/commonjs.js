const logout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'GET',
      });
      if (response.ok) { 
        window.location.href = '/';
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
};

  