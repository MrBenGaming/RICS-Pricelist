// assets/js/rics-store.js
class RICSStore {
    constructor() {
        this.data = {
            items: [],
            events: [],
            traits: [], 
            races: []
        };
        this.filteredData = {
            items: [],
            events: [],
            traits: [],
            races: []
        };
        this.currentSort = {};
        this.init();
    }

    async init() {
        await this.loadAllData();
        this.renderAllTabs();
        this.setupEventListeners();
    }

    async loadAllData() {
        try {
            // Load items
            const itemsResponse = await fetch('data/StoreItems.json');
            const itemsData = await itemsResponse.json();
            this.data.items = this.processItemsData(itemsData);
            this.filteredData.items = [...this.data.items];

            // Load events
            const eventsResponse = await fetch('data/StoreEvents.json');
            const eventsData = await eventsResponse.json();
            this.data.events = this.processEventsData(eventsData);
            this.filteredData.events = [...this.data.events];

            // Load traits
            const traitsResponse = await fetch('data/StoreTraits.json');
            const traitsData = await traitsResponse.json();
            this.data.traits = this.processTraitsData(traitsData);
            this.filteredData.traits = [...this.data.traits];

            // Load races
            const racesResponse = await fetch('data/StoreRaces.json');
            const racesData = await racesResponse.json();
            this.data.races = this.processRacesData(racesData);
            this.filteredData.races = [...this.data.races];

            console.log('Data loaded:', {
                items: this.data.items.length,
                events: this.data.events.length,
                traits: this.data.traits.length,
                races: this.data.races.length
            });

        } catch (error) {
            console.error('Error loading data:', error);
            this.loadSampleData();
        }
    }

    processItemsData(data) {
        return Object.entries(data)
            .map(([defname, itemData]) => ({
                defname,
                name: itemData.CustomName || defname,
                price: itemData.BasePrice || 0,
                category: itemData.Category || 'Misc',
                weight: itemData.Weight || 0,
                quantityLimit: itemData.QuantityLimit || 0,
                limitMode: itemData.LimitMode,
                mod: itemData.Mod,
                enabled: itemData.Enabled !== false,
                karmaType: itemData.KarmaType
            }))
            .filter(item => item.enabled && item.price > 0);
    }

    processEventsData(data) {
        // Adjust this based on your actual Events JSON structure
        return Object.entries(data)
            .map(([defname, eventData]) => ({
                defname,
                name: eventData.CustomName || defname,
                price: eventData.BasePrice || 0,
                karmaType: eventData.KarmaType || 'None',
                enabled: eventData.Enabled !== false
            }))
            .filter(event => event.enabled && event.price > 0);
    }

    processTraitsData(data) {
        // Adjust this based on your actual Traits JSON structure
        return Object.entries(data)
            .map(([defname, traitData]) => ({
                defname,
                name: traitData.CustomName || defname,
                addPrice: traitData.AddPrice || 0,
                removePrice: traitData.RemovePrice || 0,
                description: traitData.Description || '',
                enabled: traitData.Enabled !== false
            }))
            .filter(trait => trait.enabled && (trait.addPrice > 0 || trait.removePrice > 0));
    }

    processRacesData(data) {
        // Adjust this based on your actual Races JSON structure
        return Object.entries(data)
            .map(([defname, raceData]) => ({
                defname,
                name: raceData.CustomName || defname,
                price: raceData.BasePrice || 0,
                karmaType: raceData.KarmaType || 'None',
                enabled: raceData.Enabled !== false
            }))
            .filter(race => race.enabled && race.price > 0);
    }

    renderAllTabs() {
        this.renderItems();
        this.renderEvents();
        this.renderTraits();
        this.renderRaces();
    }

    renderItems() {
        const tbody = document.getElementById('items-tbody');
        const items = this.filteredData.items;

        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No items found</td></tr>';
            return;
        }

        tbody.innerHTML = items.map(item => `
            <tr>
                <td>
                    ${this.escapeHtml(item.name)}
                    ${item.mod ? `<span class="metadata">From ${this.escapeHtml(item.mod)}</span>` : ''}
                </td>
                <td>
                    ${item.price}
                    ${item.karmaType ? `<span class="metadata">Karma: ${this.escapeHtml(item.karmaType)}</span>` : ''}
                </td>
                <td>${this.escapeHtml(item.category)}</td>
                <td>${item.weight}</td>
                <td>
                    ${item.quantityLimit > 0 ? item.quantityLimit : 'Unlimited'}
                    ${item.limitMode ? `<span class="metadata">${this.escapeHtml(item.limitMode)}</span>` : ''}
                </td>
            </tr>
        `).join('');
    }

    renderEvents() {
        const tbody = document.getElementById('events-tbody');
        const events = this.filteredData.events;

        if (events.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 40px;">No events found</td></tr>';
            return;
        }

        tbody.innerHTML = events.map(event => `
            <tr>
                <td>${this.escapeHtml(event.name)}</td>
                <td>${event.price}</td>
                <td>${this.escapeHtml(event.karmaType)}</td>
            </tr>
        `).join('');
    }

    renderTraits() {
        const tbody = document.getElementById('traits-tbody');
        const traits = this.filteredData.traits;

        if (traits.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">No traits found</td></tr>';
            return;
        }

        tbody.innerHTML = traits.map(trait => `
            <tr>
                <td>${this.escapeHtml(trait.name)}</td>
                <td>${trait.addPrice > 0 ? trait.addPrice : 'N/A'}</td>
                <td>${trait.removePrice > 0 ? trait.removePrice : 'N/A'}</td>
                <td>${this.escapeHtml(trait.description)}</td>
            </tr>
        `).join('');
    }

    renderRaces() {
        const tbody = document.getElementById('races-tbody');
        const races = this.filteredData.races;

        if (races.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 40px;">No races found</td></tr>';
            return;
        }

        tbody.innerHTML = races.map(race => `
            <tr>
                <td>${this.escapeHtml(race.name)}</td>
                <td>
                    ${race.price}
                    ${race.karmaType ? `<span class="metadata">Karma: ${this.escapeHtml(race.karmaType)}</span>` : ''}
                </td>
                <td>${this.escapeHtml(race.karmaType)}</td>
            </tr>
        `).join('');
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.tab);
            });
        });

        // Search functionality for each tab
        this.setupSearch('items');
        this.setupSearch('events');
        this.setupSearch('traits');
        this.setupSearch('races');

        // Sort functionality
        this.setupSorting();
    }

    setupSearch(tabName) {
        const searchInput = document.getElementById(`${tabName}-search`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTab(tabName, e.target.value);
            });
        }
    }

    filterTab(tabName, searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        const allData = this.data[tabName];

        if (term === '') {
            this.filteredData[tabName] = [...allData];
        } else {
            this.filteredData[tabName] = allData.filter(item =>
                Object.values(item).some(value =>
                    value && value.toString().toLowerCase().includes(term)
                )
            );
        }

        this[`render${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`]();
    }

    setupSorting() {
        // Add sorting to all sortable headers
        document.querySelectorAll('th[data-sort]').forEach(header => {
            header.addEventListener('click', () => {
                const tab = header.closest('.tab-pane').id;
                this.sortTab(tab, header.dataset.sort);
            });
        });
    }

    sortTab(tabName, field) {
        if (!this.currentSort[tabName]) {
            this.currentSort[tabName] = { field, direction: 'asc' };
        } else if (this.currentSort[tabName].field === field) {
            this.currentSort[tabName].direction = this.currentSort[tabName].direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort[tabName] = { field, direction: 'asc' };
        }

        this.filteredData[tabName].sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return this.currentSort[tabName].direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.currentSort[tabName].direction === 'asc' ? 1 : -1;
            return 0;
        });

        this[`render${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`]();
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    loadSampleData() {
        // Fallback sample data if JSON files can't be loaded
        console.log('Loading sample data...');
        // ... your sample data here
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new RICSStore();
});
