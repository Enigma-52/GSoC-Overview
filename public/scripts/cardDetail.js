async function fetchOrganizationDetails(orgName) {
    var orgDetails;
    try {
        const response = await fetch(`/organizations?name=${encodeURIComponent(orgName)}`);
        res = await response.json();
        orgDetails = res;
        makeItHappen(orgDetails);
    } catch (error) {
        console.error('Error fetching organization details:', error);
        throw error;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var orgName = decodeURIComponent(new URLSearchParams(window.location.search).get("name"));
    fetchOrganizationDetails(orgName);
});

function makeItHappen(orgData) {

    //Generate Chart
    chartGeneration(orgData);
    // Update organization information
    document.getElementById("orgName").innerText = orgData.name;
    document.getElementById("orgUrl").setAttribute("href", orgData.url);
    document.getElementById("org_image").setAttribute("src", orgData.image_url);
    document.getElementById("orgDescription").innerText = orgData.description;
    document.getElementById("orgName").innerText = orgData.name;
    document.title = `${orgData.name} Details`;

    // Display organization categories
    const orgCategoriesContainer = document.getElementById("orgCategories");
    const maxTopicsToShow = 5;

    for (let i = 0; i < Math.min(maxTopicsToShow, orgData.topics.length); i++) {
        const topic = orgData.topics[i];
        const categorySpan = document.createElement("span");
        categorySpan.className = "bg-blue-200 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2";
        categorySpan.innerText = topic;
        orgCategoriesContainer.appendChild(categorySpan);
    }

    // Display organization technologies
    const orgTechnologiesContainer = document.getElementById("orgTechnologies");
    const maxTechnologies = 7;

    for (let i = 0; i < Math.min(orgData.technologies.length, maxTechnologies); i++) {
        const techSpan = document.createElement("span");
        techSpan.className = "bg-gray-200 text-gray-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2";
        techSpan.innerText = orgData.technologies[i];
        orgTechnologiesContainer.appendChild(techSpan);
    }

    // Display year buttons
    const yearButtonsContainer = document.getElementById("yearButtons");
    Object.keys(orgData.years).forEach(year => {
        const yearButton = document.createElement("button");
        yearButton.className = "bg-blue-500 text-white font-semibold py-2 px-4 rounded-full mr-2 mb-2";
        yearButton.innerText = year;
        yearButton.addEventListener("click", () => displayProjectsForYear(year));
        yearButtonsContainer.appendChild(yearButton);
    });

    // Find the last year
    const years = Object.keys(orgData.years);
    const lastYear = years[years.length - 1];

    // Display projects for the last year by default
    displayProjectsForYear(lastYear);


    function displayProjectsForYear(year) {
        const projectsContainer = document.getElementById("projectContainer");
        projectsContainer.innerHTML = ""; // Clear previous projects

        const yearData = orgData.years[year];

        const yearHeader = document.createElement("h3");
        yearHeader.className = "text-lg font-semibold text-gray-700";
        yearHeader.innerText = year;
        projectsContainer.appendChild(yearHeader);

        yearData.projects.forEach(project => {
            const projectDiv = document.createElement("div");
            projectDiv.className = "mt-2 border-gray-300 border bg-gray-100 rounded p-4";
            projectDiv.style.borderRadius = "8px";

            const projectTitle = document.createElement("h4");
            projectTitle.className = "text-md font-semibold text-blue-700";
            projectTitle.innerText = project.title;

            const studentName = document.createElement("p");
            studentName.className = "text-black-800";
            studentName.innerHTML = `<strong>Student:</strong> ${project.student_name}`;

            const projectDesc = document.createElement("p");
            projectDesc.className = "text-gray-600";
            projectDesc.innerHTML = project.short_description;

            const projectLinks = document.createElement("div");
            projectLinks.className = "mt-2";

            const projectCodeLink = document.createElement("a");
            projectCodeLink.href = project.code_url;
            projectCodeLink.target = "_blank";
            projectCodeLink.className = "text-blue-500 hover:text-blue-700 mr-2";
            projectCodeLink.innerHTML = '<i class="fas fa-code"></i> Code';

            const projectUrlLink = document.createElement("a");
            projectUrlLink.href = project.project_url;
            projectUrlLink.target = "_blank";
            projectUrlLink.className = "text-blue-500 hover:text-blue-700";
            projectUrlLink.innerHTML = '<i class="fas fa-link"></i> Project';

            projectLinks.appendChild(projectCodeLink);
            projectLinks.appendChild(projectUrlLink);

            projectDiv.appendChild(projectTitle);
            projectDiv.appendChild(studentName);
            projectDiv.appendChild(projectDesc);
            projectDiv.appendChild(projectLinks);
            projectsContainer.appendChild(projectDiv);
        });
    }
}

function chartGeneration(orgData) {
    const startYear = 2016;
    const endYear = 2023;

    const years = Array.from({
        length: endYear - startYear + 1
    }, (_, index) => (startYear + index).toString());
    const projectsData = years.map(year => orgData.years[year]?.num_projects || 0);

    const maxDataValue = Math.max(...projectsData);
    const maxYAxisValue = maxDataValue + 1;

    const ctx = document.getElementById('projectsChart').getContext('2d');
    const projectsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Number of Projects',
                data: projectsData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                lineTension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Projects'
                    },
                    max: maxYAxisValue,
                    min: 0
                }
            }
        }
    });
}