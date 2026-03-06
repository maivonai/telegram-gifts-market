// File: market/filters.js
let currentFilters = { collection: null, sort: 'newest' };

export function applyFilters(gifts) {
    let result = [...gifts];

    if (currentFilters.collection) {
        result = result.filter(g => g.collection === currentFilters.collection);
    }

    if (currentFilters.sort === 'price-low') {
        result.sort((a,b) => a.price - b.price);
    } else if (currentFilters.sort === 'newest') {
        // mock sort
    }

    return result;
}

export function initFilters() {
    const container = document.getElementById('filters');
    container.innerHTML = `
        <div class="filter-chip active" data-filter="all">All</div>
        <div class="filter-chip" data-collection="Fresh Socks">Fresh Socks</div>
        <div class="filter-chip" data-collection="Free Elf">Free Elf</div>
        <div class="filter-chip" data-collection="Plush Pepe">Plush Pepe</div>
        <div class="filter-chip" data-collection="Heart Locket">Heart Locket</div>
        <div class="filter-chip" data-sort="price-low">Lowest Price</div>
    `;

    container.addEventListener('click', e => {
        if (e.target.classList.contains('filter-chip')) {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            
            if (e.target.dataset.collection) {
                currentFilters.collection = e.target.dataset.collection;
            } else if (e.target.dataset.filter === 'all') {
                currentFilters.collection = null;
            }
            if (e.target.dataset.sort) currentFilters.sort = e.target.dataset.sort;
            
            // Re-render from app.js scope
            window.renderAll && window.renderAll();
        }
    });
}