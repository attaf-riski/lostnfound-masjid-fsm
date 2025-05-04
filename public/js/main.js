document.addEventListener('DOMContentLoaded', function() {
    // Filter items
    const filterButtons = document.querySelectorAll('.filter-btn');
    const itemCards = document.querySelectorAll('.item-card');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        itemCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-status') === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    function searchItems() {
      const searchTerm = searchInput.value.toLowerCase();
      
      itemCards.forEach(card => {
        const itemName = card.querySelector('.card-title').textContent.toLowerCase();
        const itemDesc = card.querySelector('.description').textContent.toLowerCase();
        
        if (itemName.includes(searchTerm) || itemDesc.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
    
    searchButton.addEventListener('click', searchItems);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchItems();
      }
    });
  });