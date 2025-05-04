document.addEventListener('DOMContentLoaded', function() {
    // Filter items in admin dashboard
    const filterButtons = document.querySelectorAll('.admin-filter-btn');
    const itemRows = document.querySelectorAll('.item-row');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        itemRows.forEach(row => {
          if (filter === 'all' || row.getAttribute('data-status') === filter) {
            row.style.display = 'table-row';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
    
    // Search functionality in admin dashboard
    const searchInput = document.getElementById('adminSearchInput');
    const searchButton = document.getElementById('adminSearchButton');
    
    function searchItems() {
      const searchTerm = searchInput.value.toLowerCase();
      
      itemRows.forEach(row => {
        const itemName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const itemLocation = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        
        if (itemName.includes(searchTerm) || itemLocation.includes(searchTerm)) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
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