// McLaren Team Page Logic
document.addEventListener("DOMContentLoaded", () => {
    // === DRIVER BIO DATABASE ===
    const DRIVER_DATA = {
        lando: {
            name: "Lando Norris",
            number: "#04",
            nationality: "British",
            points: "1124",
            wins: "12",
            podiums: "34",
            poles: "10",
            fastLaps: "8",
            image: "img/driver/Lando%20Norris%20%2726-desktop.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1536259020464-9a8ffb26e031?q=80&w=1000",
            bio: "Born in Bristol, Lando entered Formula 1 with McLaren in 2019 as a rising prodigy. Over the years, his razor-sharp reflexes, engineering feedback, and immense pace have established him as a premier title contender. Leading the Papaya Army from the front, Lando is a cornerstone of McLaren's championship aspirations."
        },
        oscar: {
            name: "Oscar Piastri",
            number: "#81",
            nationality: "Australian",
            points: "540",
            wins: "4",
            podiums: "18",
            poles: "3",
            fastLaps: "5",
            image: "img/driver/Oscar%20Piastri%20%2726-desktop.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1000",
            bio: "Hailing from Melbourne, Oscar arrived in F1 with one of the most decorated junior career records in motorsport history. Since joining McLaren in 2023, his calm demeanor, analytical brilliance, and relentless speed under pressure have earned him multiple victories and established him as one of the grid's most formidable talents."
        }
    };

    // === DOM SELECTORS ===
    const driverModal = document.getElementById("driver-modal");
    const driverOverlay = document.getElementById("driver-overlay");
    const driverContent = document.getElementById("driver-content");

    // === MODAL FUNCTIONS ===
    window.openDriverModal = function(driverId) {
        const driver = DRIVER_DATA[driverId];
        if (!driver) return;

        // Render modal content
        driverContent.innerHTML = `
            <div class="flex flex-col md:flex-row gap-8 items-stretch">
                <!-- Image Section -->
                <div class="w-full md:w-1/2 aspect-[4/5] bg-neutral-900 rounded-sm overflow-hidden relative border border-white/10">
                    <img src="${driver.image}" onerror="this.src='${driver.fallbackImage}'" alt="${driver.name}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60"></div>
                    <div class="absolute bottom-6 left-6">
                        <span class="text-papaya font-black text-3xl leading-none">${driver.number}</span>
                        <h4 class="text-white font-black text-2xl uppercase mt-1 leading-none">${driver.name}</h4>
                    </div>
                </div>

                <!-- Stats & Bio Section -->
                <div class="w-full md:w-1/2 flex flex-col justify-between py-2">
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Driver Profile</span>
                            <span class="text-[10px] font-black text-papaya uppercase tracking-widest px-3 py-1 bg-papaya/10 border border-papaya/30 rounded-full">${driver.nationality}</span>
                        </div>
                        <h3 class="text-3xl font-black uppercase tracking-tight text-white mb-6">${driver.name} Biography</h3>
                        <p class="text-gray-300 text-sm leading-relaxed mb-8 font-medium">${driver.bio}</p>
                    </div>

                    <!-- Animated Stats Bars -->
                    <div class="space-y-4">
                        <h4 class="text-xs font-black uppercase text-papaya tracking-widest mb-3">Career Statistics</h4>
                        
                        <!-- Career Points -->
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-gray-400 uppercase">Career Points</span>
                                <span class="text-white">${driver.points} pts</span>
                            </div>
                            <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div class="bg-papaya h-full w-0 transition-all duration-1000 ease-out" id="stat-points"></div>
                            </div>
                        </div>

                        <!-- Wins -->
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-gray-400 uppercase">Grand Prix Wins</span>
                                <span class="text-white">${driver.wins}</span>
                            </div>
                            <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div class="bg-white h-full w-0 transition-all duration-1000 ease-out" id="stat-wins"></div>
                            </div>
                        </div>

                        <!-- Podiums -->
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-gray-400 uppercase">Podium Finishes</span>
                                <span class="text-white">${driver.podiums}</span>
                            </div>
                            <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div class="bg-white h-full w-0 transition-all duration-1000 ease-out" id="stat-podiums"></div>
                            </div>
                        </div>

                        <!-- Pole Positions -->
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-gray-400 uppercase">Pole Positions</span>
                                <span class="text-white">${driver.poles}</span>
                            </div>
                            <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div class="bg-white h-full w-0 transition-all duration-1000 ease-out" id="stat-poles"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        driverModal.classList.remove("hidden");
        void driverModal.offsetWidth;
        driverOverlay.classList.remove("opacity-0");
        driverOverlay.classList.add("opacity-80");
        driverContent.parentElement.classList.remove("translate-y-4", "opacity-0");
        driverContent.parentElement.classList.add("translate-y-0", "opacity-100");

        // Trigger animations for progress bars
        setTimeout(() => {
            // Points (scaling relative to maximum point ceiling 1500)
            const ptsBar = document.getElementById("stat-points");
            if (ptsBar) ptsBar.style.width = `${Math.min((parseInt(driver.points) / 1500) * 100, 100)}%`;

            // Wins (scaling relative to ceiling 25)
            const winsBar = document.getElementById("stat-wins");
            if (winsBar) winsBar.style.width = `${Math.min((parseInt(driver.wins) / 25) * 100, 100)}%`;

            // Podiums (scaling relative to ceiling 50)
            const podiumsBar = document.getElementById("stat-podiums");
            if (podiumsBar) podiumsBar.style.width = `${Math.min((parseInt(driver.podiums) / 50) * 100, 100)}%`;

            // Poles (scaling relative to ceiling 20)
            const polesBar = document.getElementById("stat-poles");
            if (polesBar) polesBar.style.width = `${Math.min((parseInt(driver.poles) / 20) * 100, 100)}%`;
        }, 100);
    };

    window.closeDriverModal = function() {
        driverOverlay.classList.add("opacity-0");
        driverContent.parentElement.classList.add("translate-y-4", "opacity-0");
        setTimeout(() => {
            driverModal.classList.add("hidden");
        }, 300);
    };

    if (driverOverlay) driverOverlay.addEventListener("click", closeDriverModal);
    const closeBtn = document.getElementById("driver-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeDriverModal);

    // === TIMELINE ACCORDION ACCORDIONS ===
    window.toggleTimeline = function(idx) {
        const items = document.querySelectorAll(".timeline-item");
        if (idx < 0 || idx >= items.length) return;

        const targetItem = items[idx];
        const content = targetItem.querySelector(".timeline-content");
        const chevron = targetItem.querySelector(".timeline-chevron");
        const dot = targetItem.querySelector(".absolute.rounded-full");

        const isOpen = content.style.maxHeight;

        // Close all timelines
        document.querySelectorAll(".timeline-content").forEach(c => {
            c.style.maxHeight = null;
        });
        document.querySelectorAll(".timeline-chevron").forEach(ch => {
            ch.classList.remove("rotate-180");
        });
        document.querySelectorAll(".timeline-item .absolute.rounded-full").forEach(d => {
            d.className = "absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-4 border-light bg-gray-300 group-hover:bg-papaya group-hover:border-papaya/30 transition-all duration-300 flex items-center justify-center";
        });

        // Open target timeline
        if (!isOpen) {
            content.style.maxHeight = content.scrollHeight + "px";
            chevron.classList.add("rotate-180");
            dot.className = "absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-4 border-papaya/30 bg-papaya transition-all duration-300 flex items-center justify-center";
        }
    };

    // === HEAD-TO-HEAD AUTO HIGHLIGHTING ===
    function highlightSuperiorMetrics() {
        // The grid has 3 columns: Lando, Metric Name, Oscar
        // We'll select all rows starting from index 3 (after the headers)
        const gridContainer = document.querySelector('.grid-cols-3.items-center');
        if (!gridContainer) return;

        const cells = Array.from(gridContainer.children);
        
        // Loop through rows (each row is 3 cells: left, center, right)
        // Skip first 3 cells (headers)
        for (let i = 3; i < cells.length; i += 3) {
            const leftCell = cells[i];
            const rightCell = cells[i + 2];
            
            if (!leftCell || !rightCell) continue;

            const leftText = leftCell.textContent.trim();
            const rightText = rightCell.textContent.trim();

            // Ignore non-numeric comparisons like "1st" vs "1st" for now, or parse them carefully
            let leftVal = parseFloat(leftText.replace(/[^0-9.]/g, ''));
            let rightVal = parseFloat(rightText.replace(/[^0-9.]/g, ''));

            // Handle "1st" where lower is better, or if both are same
            if (leftText.includes('1st') || rightText.includes('1st')) {
                // Special case for grid position, if both are 1st, highlight both or neither
                if (leftVal === rightVal) {
                    leftCell.className = leftCell.className.replace('text-gray-300', 'text-papaya');
                    rightCell.className = rightCell.className.replace('text-gray-300', 'text-papaya');
                }
                continue;
            }

            if (!isNaN(leftVal) && !isNaN(rightVal)) {
                if (leftVal > rightVal) {
                    leftCell.className = leftCell.className.replace('text-gray-300', 'text-papaya');
                    rightCell.className = rightCell.className.replace('text-papaya', 'text-gray-300');
                } else if (rightVal > leftVal) {
                    rightCell.className = rightCell.className.replace('text-gray-300', 'text-papaya');
                    leftCell.className = leftCell.className.replace('text-papaya', 'text-gray-300');
                } else {
                    // Tie
                    leftCell.className = leftCell.className.replace('text-gray-300', 'text-papaya');
                    rightCell.className = rightCell.className.replace('text-gray-300', 'text-papaya');
                }
            }
        }
    }
    
    // Run highlighting on load
    highlightSuperiorMetrics();
});
