// Mock data for demonstration
const mockFlights = [
    {
        from: 'LHR',
        to: 'JED',
        airline: 'Saudi Airlines',
        price: 850,
        departureTime: '10:00',
        arrivalTime: '20:30',
        duration: '6h 30m'
    },
    {
        from: 'MAN',
        to: 'JED',
        airline: 'Emirates',
        price: 950,
        departureTime: '14:00',
        arrivalTime: '00:30',
        duration: '7h 30m'
    }
];

const mockHotels = [
    {
        name: 'Anjum Hotel',
        location: 'Makkah',
        rating: 5,
        pricePerNight: 200,
        distanceToHaram: '0.5 km'
    },
    {
        name: 'Le Meridien',
        location: 'Madinah',
        rating: 5,
        pricePerNight: 180,
        distanceToMasjid: '0.3 km'
    }
];

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Remove any existing error messages
            const existingErrors = searchForm.querySelector('.error-messages');
            if (existingErrors) {
                existingErrors.remove();
            }

            // Get form values
            const from = searchForm.querySelector('select[name="from"]').value;
            const to = searchForm.querySelector('select[name="to"]').value;
            const departureDate = searchForm.querySelector('input[name="departureDate"]').value;
            const returnDate = searchForm.querySelector('input[name="returnDate"]').value;
            const travelers = searchForm.querySelector('input[name="travelers"]').value;
            const packageType = searchForm.querySelector('select[name="packageType"]').value || 'complete';

            const searchData = {
                from,
                to,
                departureDate,
                returnDate,
                travelers,
                packageType
            };

            // Validate form
            const errors = validateForm(searchData);
            
            if (errors.length > 0) {
                showErrors(errors, searchForm);
                return;
            }

            // Show loading state
            showLoadingState();

            // Simulate API call with mock data
            setTimeout(() => {
                displaySearchResults(searchData);
            }, 1500);
        });
    }
});

function validateForm(data) {
    const errors = [];

    // Validate departure city
    if (!data.from) {
        errors.push('Please select departure city');
    }

    // Validate destination
    if (!data.to) {
        errors.push('Please select destination');
    }

    // Validate dates
    if (!data.departureDate) {
        errors.push('Please select departure date');
    } else {
        const departure = new Date(data.departureDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (departure < today) {
            errors.push('Departure date cannot be in the past');
        }
    }

    if (!data.returnDate) {
        errors.push('Please select return date');
    } else if (data.departureDate) {
        const departure = new Date(data.departureDate);
        const returnDate = new Date(data.returnDate);

        if (returnDate <= departure) {
            errors.push('Return date must be after departure date');
        }
    }

    // Validate travelers
    const travelersNum = parseInt(data.travelers);
    if (isNaN(travelersNum) || travelersNum < 1) {
        errors.push('Number of travelers must be at least 1');
    }

    return errors;
}

function showErrors(errors, searchForm) {
    // Remove any existing error messages
    const existingErrors = searchForm.querySelector('.error-messages');
    if (existingErrors) {
        existingErrors.remove();
    }

    // Create error messages container
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-messages bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
    
    const errorList = document.createElement('ul');
    errorList.className = 'list-disc pl-4';
    
    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        errorList.appendChild(li);
    });

    errorDiv.appendChild(errorList);
    searchForm.appendChild(errorDiv);
}


function showLoadingState() {
    const submitButton = searchForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Searching...';
}

function displaySearchResults(searchData) {
    // Create results container if it doesn't exist
    let resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResults';
        resultsContainer.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8';
        document.querySelector('.bg-emerald-700').insertAdjacentElement('afterend', resultsContainer);
    }

    // Filter mock data based on search criteria
    const filteredFlights = mockFlights.filter(flight => 
        flight.from === searchData.from && flight.to === searchData.to
    );

    // Generate results HTML
    let resultsHTML = `
        <h2 class="text-2xl font-bold mb-6">Search Results</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    `;

    // Add flights
    filteredFlights.forEach(flight => {
        resultsHTML += `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">${flight.airline}</h3>
                    <span class="text-2xl font-bold text-emerald-600">£${flight.price}</span>
                </div>
                <div class="flex justify-between items-center text-gray-600">
                    <div>
                        <p class="font-semibold">${flight.departureTime}</p>
                        <p>${flight.from}</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm">${flight.duration}</p>
                        <div class="w-24 h-px bg-gray-300 my-2"></div>
                        <p class="text-sm">Direct</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold">${flight.arrivalTime}</p>
                        <p>${flight.to}</p>
                    </div>
                </div>
                <button class="mt-4 w-full bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
                    Select Flight
                </button>
            </div>
        `;
    });

    // Add hotels if package type includes accommodation
    if (searchData.packageType !== 'flight') {
        mockHotels.forEach(hotel => {
            resultsHTML += `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">${hotel.name}</h3>
                        <span class="text-2xl font-bold text-emerald-600">£${hotel.pricePerNight}</span>
                    </div>
                    <div class="text-gray-600">
                        <p><i class="fas fa-map-marker-alt mr-2"></i>${hotel.location}</p>
                        <p><i class="fas fa-walking mr-2"></i>Distance: ${hotel.distanceToHaram || hotel.distanceToMasjid}</p>
                        <p><i class="fas fa-star mr-2 text-yellow-400"></i>${hotel.rating} Star Rating</p>
                    </div>
                    <button class="mt-4 w-full bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
                        Select Hotel
                    </button>
                </div>
            `;
        });
    }

    resultsHTML += '</div>';
    
    // Update results container
    resultsContainer.innerHTML = resultsHTML;

    // Reset search button
    const submitButton = searchForm.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.innerHTML = 'Search Packages';

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}