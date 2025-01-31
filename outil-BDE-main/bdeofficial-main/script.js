// Tableau pour stocker les aliments, boissons et déchets
let foods = [];
let drinks = [];
let wastes = [];

// Fonction pour ajouter un aliment
function addFood() {
    const foodItem = document.getElementById("food-item").value;
    const foodQuantity = parseFloat(document.getElementById("food-quantity").value);
    
    if (foodItem && foodQuantity) {
        foods.push({ item: foodItem, quantity: foodQuantity });
        updateFoodList();
    }
}

// Fonction pour ajouter une boisson
function addDrink() {
    const drinkItem = document.getElementById("drink-item").value;
    const drinkQuantity = parseFloat(document.getElementById("drink-quantity").value);

    if (drinkItem && drinkQuantity) {
        drinks.push({ item: drinkItem, quantity: drinkQuantity });
        updateDrinkList();
    }
}

// Fonction pour ajouter un déchet
function addWaste() {
    const wasteType = document.getElementById("waste-type").value;
    const wasteQuantity = parseFloat(document.getElementById("waste-quantity").value);

    if (wasteType && wasteQuantity) {
        wastes.push({ type: wasteType, quantity: wasteQuantity });
        updateWasteList();
    }
}

// Fonction pour mettre à jour la liste des aliments
function updateFoodList() {
    const foodList = document.getElementById("food-list");
    foodList.innerHTML = '';
    foods.forEach(food => {
        const li = document.createElement('li');
        li.textContent = `${food.item} - ${food.quantity} `;
        foodList.appendChild(li);
    });
}

// Fonction pour mettre à jour la liste des boissons
function updateDrinkList() {
    const drinkList = document.getElementById("drink-list");
    drinkList.innerHTML = '';
    drinks.forEach(drink => {
        const li = document.createElement('li');
        li.textContent = `${drink.item} - ${drink.quantity} L`;
        drinkList.appendChild(li);
    });
}

// Fonction pour mettre à jour la liste des déchets
function updateWasteList() {
    const wasteList = document.getElementById("waste-list");
    wasteList.innerHTML = '';
    wastes.forEach(waste => {
        const li = document.createElement('li');
        li.textContent = `${waste.type} - ${waste.quantity} `;
        wasteList.appendChild(li);
    });
}

// Fonction pour calculer les émissions de CO2 dues aux déplacements
function calculateTransportCO2(distance, transportMode) {
    const CO2Emissions = {
        voiture: 0.178, // kg CO2 par km en voiture
        velo: 0,     // Le vélo n'émet pas de CO2
        marche: 0,   // La marche n'émet pas de CO2
        tramway: 0.0296, // kg CO2 par km pour les transports publics
        bus:0.146
    };

    const emissionsPerKm = CO2Emissions[transportMode] || 0;
    return emissionsPerKm * distance;
}

// Fonction pour calculer les émissions de CO2 dues à l'alimentation
function calculateFoodCO2() {
    const foodEmissionsPerKg = {
        'viennoiserie': 0.21,
        'sandwichpoulet': 0.705,
        'sandwichvege': 0.378,
        'repasviandeblanchepoisson':1.35,
        'pizza4fromages':1.404,
        'oeufs':0.1435,
        'madeleines':0.09378,
        'lasagnes':2.19,
        'knackis':0.5145,
        'lait':1.5347,
        'glaces':0.31,
        'concombre':1.944,
        'baguette':0.134,
        // Ajouter d'autres aliments ici
    };

    let totalFoodCO2 = 0;
    foods.forEach(food => {
        const foodEmission = foodEmissionsPerKg[food.item.toLowerCase()] || 0;
        totalFoodCO2 += foodEmission * food.quantity;
    });
    return totalFoodCO2;
}

// Fonction pour calculer les émissions de CO2 dues aux boissons
function calculateDrinkCO2() {
    const drinkEmissionsPerLiter = {
        'jus': 0.801,
        'soda': 0.572,
        'vin': 1.14,
        'biere': 1.09,
        'cafe': 0.557,
        'eau':0.453,
        'alcool':1.15,
        // Ajouter d'autres boissons ici
    };

    let totalDrinkCO2 = 0;
    drinks.forEach(drink => {
        const drinkEmission = drinkEmissionsPerLiter[drink.item.toLowerCase()] || 0;
        totalDrinkCO2 += drinkEmission * drink.quantity;
    });
    return totalDrinkCO2;
}

// Fonction pour calculer les émissions de CO2 dues aux déchets
function calculateWasteCO2() {
    const wasteEmissionsPerKg = {
        'canette': 0.15,
        'dechet-menager': 0.386,
        'dechet-tries':0.986,
        // Ajouter d'autres types de déchets ici
    };

    let totalWasteCO2 = 0;
    wastes.forEach(waste => {
        const wasteEmission = wasteEmissionsPerKg[waste.type.toLowerCase()] || 0;
        totalWasteCO2 += wasteEmission * waste.quantity;
    });
    return totalWasteCO2;
}

// Fonction pour calculer le total des émissions de CO2
function calculateCO2() {
    const eventDate = document.getElementById("event-date").value;
    const eventDescription = document.getElementById("event-description").value;
    const participants = parseInt(document.getElementById("participants").value);
    const distance = parseFloat(document.getElementById("distance").value);
    const transportMode = document.getElementById("transport-mode").value;

    // Calcul des émissions pour chaque catégorie
    const co2Transport = calculateTransportCO2(distance, transportMode);
    const co2Food = calculateFoodCO2();
    const co2Drinks = calculateDrinkCO2();
    const co2Waste = calculateWasteCO2();

    // Calcul des émissions totales
    const totalCO2 = co2Transport + co2Food + co2Drinks + co2Waste;

    // Afficher les résultats sur la page
    showResults(eventDate, eventDescription, participants, totalCO2, co2Food, co2Drinks, co2Waste, co2Transport);
}

// Fonction pour afficher les résultats sur la page
function showResults(eventDate, eventDescription, participants, totalCO2, co2Food, co2Drinks, co2Waste, co2Transport) {
    // Mettre à jour les informations du résultat
    document.getElementById("result-date").textContent = eventDate;
    document.getElementById("result-description").textContent = eventDescription;
    document.getElementById("result-participants").textContent = participants;
    document.getElementById("total-co2").textContent = totalCO2.toFixed(2);

    // Afficher la section des résultats
    document.getElementById("result").style.display = "block";

    // Créer le camembert (graphique)
    const ctx = document.getElementById('co2-pie-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Alimentation', 'Boissons', 'Déchets', 'Transport'],
            datasets: [{
                label: 'Répartition des émissions de CO2',
                data: [co2Food, co2Drinks, co2Waste, co2Transport],
                backgroundColor: ['#FFB6C1', '#87CEEB', '#32CD32', '#FFD700'],
                borderColor: ['#FF6347', '#4682B4', '#228B22', '#FFD700'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)} kg CO2`;
                        }
                    }
                }
            }
        }
    });

    // Afficher le bouton de téléchargement Excel
    document.getElementById("download-excel").style.display = "inline-block";
}

// Fonction pour télécharger le fichier Excel
function downloadExcel() {
    const eventDate = document.getElementById("event-date").value;
    const eventDescription = document.getElementById("event-description").value;
    const participants = parseInt(document.getElementById("participants").value);
    const totalCO2 = parseFloat(document.getElementById("total-co2").textContent);
    const co2Food = calculateFoodCO2();
    const co2Drinks = calculateDrinkCO2();
    const co2Waste = calculateWasteCO2();
    const co2Transport = calculateTransportCO2(parseFloat(document.getElementById("distance").value), document.getElementById("transport-mode").value);

    // Créer un objet représentant les données pour Excel
    const data = [
        ["Nom de l'événement", eventDescription],
        ["Date de l'événement", eventDate],
        ["Nombre de participants", participants],
        ["Total CO2 émis (kg)", totalCO2.toFixed(2)],
        ["CO2 émis par l'alimentation (kg)", co2Food.toFixed(2)],
        ["CO2 émis par les boissons (kg)", co2Drinks.toFixed(2)],
        ["CO2 émis par les déchets (kg)", co2Waste.toFixed(2)],
        ["CO2 émis par le transport (kg)", co2Transport.toFixed(2)],
        ["Aliments", ...foods.map(f => `${f.item} - ${f.quantity} kg`)],
        ["Boissons", ...drinks.map(d => `${d.item} - ${d.quantity} L`)],
        ["Déchets", ...wastes.map(w => `${w.type} - ${w.quantity} kg`)]
    ];

    // Création d'un fichier Excel avec SheetJS (XLSX)
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Emissions CO2");

    // Téléchargement du fichier Excel
    XLSX.writeFile(wb, `Emissions_CO2_${eventDescription.replace(/\s+/g, '_')}.xlsx`);
}

// Fonction pour initialiser les événements (écouteurs d'événements)
function initEventListeners() {
    document.getElementById("add-food").addEventListener("click", addFood);
    document.getElementById("add-drink").addEventListener("click", addDrink);
    document.getElementById("add-waste").addEventListener("click", addWaste);
    document.getElementById("calculate-co2").addEventListener("click", calculateCO2);
    document.getElementById("download-excel").addEventListener("click", downloadExcel);
}

// Initialisation des écouteurs d'événements lors du chargement de la page
window.onload = initEventListeners;