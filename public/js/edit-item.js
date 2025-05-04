document.addEventListener('DOMContentLoaded', function() {
    const statusSelect = document.getElementById('status');
    const penemuFields = document.getElementById('penemuFields');
    const namaPenemuInput = document.getElementById('namaPenemu');
    const teleponPenemuInput = document.getElementById('teleponPenemu');

    function togglePenemuFields() {
        const isFound = statusSelect.value === 'ditemukan';
        penemuFields.classList.toggle('d-none', !isFound);
        namaPenemuInput.required = isFound;
        teleponPenemuInput.required = isFound;
    }

    statusSelect.addEventListener('change', togglePenemuFields);
})