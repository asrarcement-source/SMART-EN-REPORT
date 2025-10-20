// --- Configuration for external report analysis ---
// Set these variables when you want to call an external analysis API.  Leave empty to use the built‑in local analysis.
// When demonstrating with an OpenAI endpoint, set REPORT_API_URL to "https://api.openai.com/v1/chat/completions"
// and place your API key in REPORT_API_KEY.  The analysis will then call the external service to generate
// professional recommendations based on the report data.
const REPORT_API_URL = '';
const REPORT_API_KEY = '';

// Optional: specify a logo to appear at the top of printed reports.  Place the file in your project root (e.g., "logo.png")
// and set this constant to its relative URL.  If left blank, no logo will be shown.
const COMPANY_LOGO_URL = '';

// Data and Constants
const cementData = {
    molecularWeights: { SO3: 80.06, CaSO4: 136.14, H2O: 18.015, get dihydrate() { return this.CaSO4 + (2 * this.H2O); }, get hemihydrate() { return this.CaSO4 + (0.5 * this.H2O); }, get anhydrite() { return this.CaSO4; } },
    strengthClasses: { "32.5": { variants: { L: { name: "Low early strength", early_days: 7, early_min: 12.0, standard_min: 32.5, standard_max: 52.5, setting_time: 75, applications: ["Mass concrete", "Dams"] }, N: { name: "Normal early strength", early_days: 7, early_min: 16.0, standard_min: 32.5, standard_max: 52.5, setting_time: 75, applications: ["General construction", "Masonry"] }, R: { name: "Rapid early strength", early_days: 2, early_min: 10.0, standard_min: 32.5, standard_max: 52.5, setting_time: 75, applications: ["Fast construction", "Early demolding"] } } }, "42.5": { variants: { L: { name: "Low early strength", early_days: 7, early_min: 16.0, standard_min: 42.5, standard_max: 62.5, setting_time: 60, applications: ["Mass concrete structures", "Low heat"] }, N: { name: "Normal early strength", early_days: 2, early_min: 10.0, standard_min: 42.5, standard_max: 62.5, setting_time: 60, applications: ["Structural concrete", "Precast"] }, R: { name: "Rapid early strength", early_days: 2, early_min: 20.0, standard_min: 42.5, standard_max: 62.5, setting_time: 60, applications: ["Fast construction", "Precast industry"] } } }, "52.5": { variants: { L: { name: "Low early strength", early_days: 2, early_min: 10.0, standard_min: 52.5, standard_max: null, setting_time: 45, applications: ["High-performance mass concrete"] }, N: { name: "Normal early strength", early_days: 2, early_min: 20.0, standard_min: 52.5, standard_max: null, setting_time: 45, applications: ["High-strength concrete", "Infrastructure"] }, R: { name: "Rapid early strength", early_days: 2, early_min: 30.0, standard_min: 52.5, standard_max: null, setting_time: 45, applications: ["Rapid construction", "Prestressed concrete", "Fast-track projects"] } } } },
    types: [ { id: 'cem1', name: 'CEM I', family: 'CEM I', category: 'common', clinker: '95-100%', description: 'Pure Portland cement', applications: ['Structural concrete', 'High early strength'], composition: { clinker: 95, minor: 5 }, max_so3: 4.0, chemical_requirements: { loss_on_ignition: "≤ 5.0%", insoluble_residue: "≤ 5.0%", sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-a-s', name: 'CEM II/A-S', family: 'CEM II', category: 'common', clinker: '80-94%', additive: '6-20% Slag', description: 'Portland-slag cement (6-20%)', applications: ['General construction', 'Mass concrete'], composition: { clinker: 87, slag: 13 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-b-s', name: 'CEM II/B-S', family: 'CEM II', category: 'common', clinker: '65-79%', additive: '21-35% Slag', description: 'Portland-slag cement (21-35%)', applications: ['Durable construction', 'Sulfate environments'], composition: { clinker: 72, slag: 28 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-a-d', name: 'CEM II/A-D', family: 'CEM II', category: 'common', clinker: '90-94%', additive: '6-10% Silica fume', description: 'Portland-silica fume', applications: ['High-performance concrete', 'Ultra-high strength'], composition: { clinker: 92, silicaFume: 8 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-a-p', name: 'CEM II/A-P', family: 'CEM II', category: 'common', clinker: '80-94%', additive: '6-20% Natural pozzolana', description: 'Portland-natural pozzolana (6-20%)', applications: ['Aggressive environments', 'Mass concrete'], composition: { clinker: 87, pozzolan: 13 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-b-p', name: 'CEM II/B-P', family: 'CEM II', category: 'common', clinker: '65-79%', additive: '21-35% Natural pozzolana', description: 'Portland-natural pozzolana (21-35%)', applications: ['Harsh environments', 'Durability focus'], composition: { clinker: 72, pozzolan: 28 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-a-q', name: 'CEM II/A-Q', family: 'CEM II', category: 'common', clinker: '80-94%', additive: '6-20% Calcined pozzolana', description: 'Portland-calcined pozzolana (6-20%)', applications: ['Chemical resistance', 'Hot climates'], composition: { clinker: 87, pozzolan: 13 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-b-q', name: 'CEM II/B-Q', family: 'CEM II', category: 'common', clinker: '65-79%', additive: '21-35% Calcined pozzolana', description: 'Portland-calcined pozzolana (21-35%)', applications: ['Severe exposure', 'Infrastructure'], composition: { clinker: 72, pozzolan: 28 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-a-v', name: 'CEM II/A-V', family: 'CEM II', category: 'common', clinker: '80-94%', additive: '6-20% Siliceous fly ash', description: 'Portland-siliceous fly ash (6-20%)', applications: ['Sustainable building', 'Long-term projects'], composition: { clinker: 87, flyAsh: 13 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-b-v', name: 'CEM II/B-V', family: 'CEM II', category: 'common', clinker: '65-79%', additive: '21-35% Siliceous fly ash', description: 'Portland-siliceous fly ash (21-35%)', applications: ['Mass concrete', 'Eco-friendly construction'], composition: { clinker: 72, flyAsh: 28 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-a-w', name: 'CEM II/A-W', family: 'CEM II', category: 'common', clinker: '80-94%', additive: '6-20% Calcareous fly ash', description: 'Portland-calcareous fly ash (6-20%)', applications: ['Infrastructure', 'Sustainable construction'], composition: { clinker: 87, flyAsh: 13 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-b-w', name: 'CEM II/B-W', family: 'CEM II', category: 'common', clinker: '65-79%', additive: '21-35% Calcareous fly ash', description: 'Portland-calcareous fly ash (21-35%)', applications: ['Long-term applications', 'Sustainable projects'], composition: { clinker: 72, flyAsh: 28 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-a-t', name: 'CEM II/A-T', family: 'CEM II', category: 'common', clinker: '80-94%', additive: '6-20% Burnt shale', description: 'Portland-burnt shale (6-20%)', applications: ['General construction', 'Regional availability'], composition: { clinker: 87, burntShale: 13 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-b-t', name: 'CEM II/B-T', family: 'CEM II', category: 'common', clinker: '65-79%', additive: '21-35% Burnt shale', description: 'Portland-burnt shale (21-35%)', applications: ['Local construction', 'Economic construction'], composition: { clinker: 72, burntShale: 28 }, max_so3: 4.5, chemical_requirements: { sulfate_content: "≤ 4.5%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-a-l', name: 'CEM II/A-L', family: 'CEM II', category: 'common', clinker: '80-94%', additive: '6-20% Limestone L', description: 'Portland-limestone L (6-20%)', applications: ['Architectural concrete', 'Precast elements'], composition: { clinker: 87, limestone: 13 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-b-l', name: 'CEM II/B-L', family: 'CEM II', category: 'common', clinker: '65-79%', additive: '21-35% Limestone L', description: 'Portland-limestone L (21-35%)', applications: ['Mass concrete', 'Non-structural elements'], composition: { clinker: 70, limestone: 30 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-a-ll', name: 'CEM II/A-LL', family: 'CEM II', category: 'common', clinker: '80-94%', additive: '6-20% Limestone LL', description: 'Portland-limestone LL (6-20%)', applications: ['General construction', 'Cost-effective solutions'], composition: { clinker: 85, limestone: 15 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-b-ll', name: 'CEM II/B-LL', family: 'CEM II', category: 'common', clinker: '65-79%', additive: '21-35% Limestone LL', description: 'Portland-limestone LL (21-35%)', applications: ['Mass concrete applications', 'Large projects'], composition: { clinker: 70, limestone: 30 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-a-m', name: 'CEM II/A-M', family: 'CEM II', category: 'common', clinker: '80-88%', additive: '12-20% Mixed', description: 'Portland-composite (12-20%)', applications: ['Versatile applications', 'General purpose'], composition: { clinker: 84, slag: 8, limestone: 8 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem2-b-m', name: 'CEM II/B-M', family: 'CEM II', category: 'common', clinker: '65-79%', additive: '21-35% Mixed', description: 'Portland-composite (21-35%)', applications: ['Multi-purpose use', 'Sustainable construction'], composition: { clinker: 72, slag: 14, flyAsh: 14 }, max_so3: 4.5, chemical_requirements: { sulfate_content: "≤ 4.5%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem3-a', name: 'CEM III/A', family: 'CEM III', category: 'common', clinker: '35-64%', additive: '36-65% Slag', description: 'Blast furnace cement (36-65% slag)', applications: ['Marine structures', 'Chemical resistance'], composition: { clinker: 50, slag: 50 }, max_so3: 4.5, chemical_requirements: { loss_on_ignition: "≤ 5.0%", insoluble_residue: "≤ 5.0%", sulfate_content: "≤ 4.5%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem3-b', name: 'CEM III/B', family: 'CEM III', category: 'common', clinker: '20-34%', additive: '66-80% Slag', description: 'High slag blast furnace cement (66-80%)', applications: ['Aggressive environments', 'Long-term strength'], composition: { clinker: 27, slag: 73 }, max_so3: 4.5, chemical_requirements: { loss_on_ignition: "≤ 5.0%", insoluble_residue: "≤ 5.0%", sulfate_content: "≤ 4.5%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem3-c', name: 'CEM III/C', family: 'CEM III', category: 'common', clinker: '5-19%', additive: '81-95% Slag', description: 'Very high slag blast furnace cement (81-95%)', applications: ['Highly aggressive environments', 'Waste containment'], composition: { clinker: 12, slag: 88 }, max_so3: 4.5, chemical_requirements: { loss_on_ignition: "≤ 5.0%", insoluble_residue: "≤ 5.0%", sulfate_content: "≤ 4.5%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem4-a', name: 'CEM IV/A', family: 'CEM IV', category: 'common', clinker: '65-89%', additive: '11-35% Pozzolan', description: 'Pozzolanic cement (11-35%)', applications: ['Hot climates', 'Alkali-silica mitigation'], composition: { clinker: 77, pozzolan: 23 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%", pozzolanicity_test: "must satisfy" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem4-b', name: 'CEM IV/B', family: 'CEM IV', category: 'common', clinker: '45-64%', additive: '36-55% Pozzolan', description: 'High pozzolanic cement (36-55%)', applications: ['Severe exposure', 'Thermal mass'], composition: { clinker: 55, pozzolan: 45 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%", pozzolanicity_test: "must satisfy" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem5-a', name: 'CEM V/A', family: 'CEM V', category: 'common', clinker: '40-64%', additive: '18-30% Slag + 18-30% Pozzolan', description: 'Composite cement (Slag + Pozzolan)', applications: ['Multi-exposure environments', 'Sustainable construction'], composition: { clinker: 52, slag: 24, pozzolan: 24 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem5-b', name: 'CEM V/B', family: 'CEM V', category: 'common', clinker: '20-38%', additive: '31-50% Slag + 31-50% Pozzolan', description: 'High replacement composite cement', applications: ['Highly aggressive environments', 'Infrastructure'], composition: { clinker: 29, slag: 35.5, pozzolan: 35.5 }, max_so3: 4.0, chemical_requirements: { sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem1-sr0', name: 'CEM I-SR 0', family: 'CEM I-SR', category: 'sulfate', clinker: '95-100%', description: 'Sulfate resisting Portland cement (C₃A = 0%)', applications: ['Severe sulfate environments', 'Seawater exposure'], composition: { clinker: 95, minor: 5 }, max_so3: 3.5, c3a_limit_value: 0, chemical_requirements: { c3a_limit: "C₃A = 0%", sulfate_content: "≤ 3.5%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem1-sr3', name: 'CEM I-SR 3', family: 'CEM I-SR', category: 'sulfate', clinker: '95-100%', description: 'Sulfate resisting Portland cement (C₃A ≤ 3%)', applications: ['Moderate sulfate environments', 'Marine foundations'], composition: { clinker: 95, minor: 5 }, max_so3: 3.5, c3a_limit_value: 3, chemical_requirements: { c3a_limit: "C₃A ≤ 3%", sulfate_content: "≤ 3.5%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem1-sr5', name: 'CEM I-SR 5', family: 'CEM I-SR', category: 'sulfate', clinker: '95-100%', description: 'Sulfate resisting Portland cement (C₃A ≤ 5%)', applications: ['Mild sulfate environments', 'Infrastructure projects'], composition: { clinker: 95, minor: 5 }, max_so3: 3.5, c3a_limit_value: 5, chemical_requirements: { c3a_limit: "C₃A ≤ 5%", sulfate_content: "≤ 3.5%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem4-a-sr', name: 'CEM IV/A-SR', family: 'CEM IV-SR', category: 'sulfate', clinker: '65-89%', additive: '11-35% Pozzolan', description: 'Sulfate resisting pozzolanic cement A', applications: ['Marine concrete', 'Sewage treatment plants'], composition: { clinker: 77, pozzolan: 23 }, max_so3: 4.0, c3a_limit_value: 9, chemical_requirements: { c3a_limit: "C₃A ≤ 9%", sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%", pozzolanicity_test: "Must satisfy at 8 days" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem4-b-sr', name: 'CEM IV/B-SR', family: 'CEM IV-SR', category: 'sulfate', clinker: '45-64%', additive: '36-55% Pozzolan', description: 'Sulfate resisting pozzolanic cement B', applications: ['Industrial structures', 'Long-term durability'], composition: { clinker: 55, pozzolan: 45 }, max_so3: 4.0, c3a_limit_value: 9, chemical_requirements: { c3a_limit: "C₃A ≤ 9%", sulfate_content: "≤ 4.0%", chloride: "≤ 0.10%", pozzolanicity_test: "Must satisfy at 8 days" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem3-b-sr', name: 'CEM III/B-SR', family: 'CEM III-SR', category: 'sulfate', clinker: '20-34%', additive: '66-80% Slag', description: 'Sulfate resisting blast furnace cement B', applications: ['Aggressive chemical conditions', 'Infrastructure'], composition: { clinker: 27, slag: 73 }, max_so3: 4.5, chemical_requirements: { c3a_limit: "No C₃A requirement", sulfate_content: "≤ 4.5%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] }, { id: 'cem3-c-sr', name: 'CEM III/C-SR', family: 'CEM III-SR', category: 'sulfate', clinker: '5-19%', additive: '81-95% Slag', description: 'Sulfate resisting blast furnace cement C', applications: ['Extreme sulfate environments', 'Seawater structures'], composition: { clinker: 12, slag: 88 }, max_so3: 4.5, chemical_requirements: { c3a_limit: "No C₃A requirement", sulfate_content: "≤ 4.5%", chloride: "≤ 0.10%" }, available_strength_classes: ["32.5", "42.5", "52.5"] } ],
    credits: { prepared_by: "Mr. Fadi M. Darwesh", email: "asrar.cement@gmail.com", title: "QC & R&D Specialist" },
    constituents: [
        {
            symbol: 'K',
            name: 'Portland Cement Clinker',
            category: 'Hydraulic Material',
            description: 'Sintered mixture of limestone and clay producing the primary hydraulic phases.',
            compounds: ['C₃S', 'C₂S', 'C₃A', 'C₄AF'],
            requirements: [
                'At least 66% calcium silicates (C₃S + C₂S) by mass',
                'CaO/SiO₂ ratio ≥ 2.0',
                'MgO content ≤ 5.0%'
            ]
        },
        {
            symbol: 'S',
            name: 'Granulated Blast Furnace Slag',
            category: 'Latent Hydraulic',
            description: 'Glass-rich by-product of iron smelting rapidly cooled to form a latent hydraulic material.',
            compounds: ['CaO', 'MgO', 'SiO₂'],
            requirements: [
                'Glassy phase ≥ 66.7% by mass',
                '(CaO + MgO)/SiO₂ ratio > 1.0'
            ]
        },
        {
            symbol: 'P',
            name: 'Natural Pozzolan',
            category: 'Pozzolanic Material',
            description: 'Natural siliceous or silico‑aluminous rock that reacts with lime to form cementitious compounds.',
            compounds: ['Reactive SiO₂'],
            requirements: [
                'Reactive SiO₂ ≥ 25.0% by mass'
            ]
        },
        {
            symbol: 'Q',
            name: 'Calcined Pozzolan',
            category: 'Pozzolanic Material',
            description: 'Heat‑activated natural pozzolan with enhanced reactivity.',
            compounds: ['Reactive SiO₂'],
            requirements: [
                'Reactive SiO₂ ≥ 25.0% by mass'
            ]
        },
        {
            symbol: 'V',
            name: 'Siliceous Fly Ash',
            category: 'Pozzolanic Material',
            description: 'Fine powder from coal combustion with high reactive silica.',
            compounds: ['Reactive SiO₂'],
            requirements: [
                'Reactive SiO₂ ≥ 25.0% by mass'
            ]
        },
        {
            symbol: 'W',
            name: 'Calcareous Fly Ash',
            category: 'Pozzolanic Material',
            description: 'Fly ash rich in reactive CaO with both hydraulic and pozzolanic properties.',
            compounds: ['Reactive CaO', 'Reactive SiO₂'],
            requirements: [
                'Reactive CaO > 15.0% by mass',
                'Compressive strength ≥ 10 MPa at 28 days',
                'Residue on 40 µm sieve 10–30% by mass',
                'Expansion (soundness) ≤ 10 mm'
            ]
        },
        {
            symbol: 'T',
            name: 'Burnt Shale',
            category: 'Hydraulic & Pozzolanic',
            description: 'Oil shale burnt at ~800 °C containing C₂S and C₃A phases with pozzolanic oxides.',
            compounds: ['C₂S', 'C₃A', 'Reactive SiO₂'],
            requirements: [
                'Compressive strength ≥ 25.0 MPa at 28 days',
                'Expansion (soundness) ≤ 10 mm'
            ]
        },
        {
            symbol: 'L',
            name: 'Limestone (L)',
            category: 'Filler',
            description: 'High purity limestone powder used as a filler in cement.',
            compounds: ['CaCO₃'],
            requirements: [
                'CaCO₃ ≥ 75% by mass',
                'Clay content (MB value) ≤ 1.20 g/100 g',
                'Total organic carbon (TOC) ≤ 0.50% by mass'
            ]
        },
        {
            symbol: 'LL',
            name: 'Limestone (LL)',
            category: 'Filler',
            description: 'Very high purity limestone with extremely low organic content.',
            compounds: ['CaCO₃'],
            requirements: [
                'CaCO₃ ≥ 75% by mass',
                'Clay content (MB value) ≤ 1.20 g/100 g',
                'Total organic carbon (TOC) ≤ 0.20% by mass'
            ]
        },
        {
            symbol: 'D',
            name: 'Silica Fume',
            category: 'High Reactivity Pozzolan',
            description: 'Ultrafine powder from silicon metal production rich in amorphous silica.',
            compounds: ['Amorphous SiO₂'],
            requirements: [
                'SiO₂ ≥ 85% by mass',
                'Loss on ignition ≤ 4.0% by mass',
                'Specific surface (BET) ≥ 15 m²/g'
            ]
        },
        {
            symbol: 'M',
            name: 'Minor Additional Constituents',
            category: 'Additions',
            description: 'Specially selected inorganic materials added in small quantities to improve workability or other physical properties.',
            compounds: ['Variable'],
            requirements: [
                'Total content ≤ 5% by mass',
                'Shall not impair durability or corrosion resistance'
            ]
        }
    ]
};

// Additional calculator definitions not tied to a specific constituent
const extraCalculators = [
    {
        symbol: 'SA',
        name: 'Sulfur‑to‑Alkali Ratio',
        category: 'Kiln Chemistry',
        description: 'Evaluate the balance between sulfur trioxide and alkalis (K₂O, Na₂O) in clinker/kiln feed to mitigate deposit formation and ring build‑up.',
        compounds: ['SO₃', 'K₂O', 'Na₂O'],
        requirements: [
            'Typical S/A ratio ≈ 1.0 indicates balanced sulfation',
            'Low ratio (<0.9) implies alkali excess – potential kiln ring formation',
            'High ratio (>1.3) implies sulfur excess – risk of sulfur deposits'
        ]
    }
];

let currentTheme = 'light'; let currentFilter = 'all'; let searchTerm = '';

// Initialize app after DOM is ready
document.addEventListener('DOMContentLoaded', () => initializeApp());

function setTheme(theme) { currentTheme = theme; document.documentElement.setAttribute('data-theme', theme); }
function toggleTheme() { setTheme(currentTheme === 'light' ? 'dark' : 'light'); }

function initializeNavigation() {
    const navLinksContainer = document.querySelector('.nav-links');
    const mobileMenu = document.getElementById('mobileMenu');
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('navLaunchSimulator').addEventListener('click', (e) => { e.preventDefault(); launchMixSimulator(); navLinksContainer.classList.remove('active'); mobileMenu.classList.remove('active'); });
    document.getElementById('launchReportGeneratorBtn').addEventListener('click', launchReportGenerator);
    navLinksContainer.querySelectorAll('a:not(.nav-simulator-btn)').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetElement = document.getElementById(link.getAttribute('href').substring(1));
            if (targetElement) { window.scrollTo({ top: targetElement.offsetTop - 70, behavior: 'smooth' }); }
            navLinksContainer.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
    mobileMenu.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

function initializeSearch() { document.getElementById('searchInput').addEventListener('input', (e) => { searchTerm = e.target.value; renderCementTypes(); renderConstituents(); }); }

function initializeFilters() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const newFilter = button.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            if (newFilter === 'lowEarly-link') {
                document.getElementById('cement-types').scrollIntoView({ behavior: 'smooth' });
                currentFilter = 'lowEarly';
                document.querySelector('[data-filter="lowEarly-link"]').classList.add('active'); 
            } else {
                currentFilter = newFilter;
                button.classList.add('active');
            }
            renderCementTypes();
        });
    });
}

function initializeModal() {
    const detailModal = document.getElementById('detailModal');
    const calculatorModal = document.getElementById('calculatorModal');

    // دالة موحدة لإغلاق النوافذ
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open'); /* <--- هذا هو السطر المهم */
    }

    document.getElementById('modalClose').addEventListener('click', () => closeModal(detailModal));
    document.getElementById('calculatorModalClose').addEventListener('click', () => closeModal(calculatorModal));

    window.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            closeModal(detailModal);
        }
        if (e.target === calculatorModal) {
            closeModal(calculatorModal);
        }
    });
}


function openModal(modalId, content) {
    const modal = document.getElementById(modalId);
    const contentContainer = modal.querySelector('.modal-content > div');
    contentContainer.innerHTML = content;
    modal.style.display = 'block';
    document.body.classList.add('modal-open'); 
}


function renderCementTypes() {
    const grid = document.getElementById('cementTypesGrid');
    if (!grid) return;

    let typesToRender = [];

    // 1. Apply the primary filter first (e.g., 'all', 'common', 'sulfate')
    if (currentFilter === 'lowEarly') {
        typesToRender = cementData.types.filter(type => type.family.startsWith('CEM III'));
    } else if (currentFilter !== 'all') {
        typesToRender = cementData.types.filter(type => type.category === currentFilter);
    } else {
        typesToRender = [...cementData.types]; // Start with all types if filter is 'all'
    }

    // 2. Apply the search term to the already filtered list
    const searchLower = searchTerm.trim().toLowerCase();
    if (searchLower.length > 0) {
        typesToRender = typesToRender.filter(type =>
            [type.name, type.family, type.description, ...type.applications].join(' ').toLowerCase().includes(searchLower)
        );
    }

    // 3. Render the final, filtered list
    grid.innerHTML = typesToRender.map(type => `<div class="card" onclick="showCementTypeDetails('${type.id}')"><div class="card-header"><div><div class="card-title">${type.name}</div><div class="card-subtitle">${type.family} Family</div></div><div class="card-icon"><i class="fas fa-cube"></i></div></div><div class="card-content"><p><strong>Clinker:</strong> ${type.clinker}</p>${type.additive ? `<p><strong>Additive:</strong> ${type.additive}</p>` : ''}<p>${type.description}</p><div class="composition-bar">${renderCompositionBar(type.composition)}</div><p style="color: var(--primary-blue); font-weight: 500; margin-top: 15px;"><i class="fas fa-mouse-pointer"></i> Click for details & calculator</p></div><div class="card-tags">${type.applications.slice(0, 2).map(app => `<span class="tag">${app}</span>`).join('')}${type.applications.length > 2 ? `<span class="tag">+${type.applications.length - 2} more</span>` : ''}</div></div>`).join('');
    
    observeElements();
}

function renderCompositionBar(composition) {
    if (!composition) return '';
    const colors = { clinker: '#1e40af', slag: '#64748b', pozzolan: '#f97316', silicaFume: '#10b981', limestone: '#94a3b8', flyAsh: '#8b5cf6', burntShale: '#ef4444', mixed: '#6366f1', minor: '#a1a1aa' };
    return Object.entries(composition).map(([component, percentage]) => `<div class="composition-segment" style="width: ${percentage}%; background-color: ${colors[component] || '#6b7280'};" title="${component.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${percentage}%"></div>`).join('');
}

function renderConstituents() { const grid = document.getElementById('constituentsGrid'); if (!grid) return; grid.innerHTML = cementData.constituents.map(c => `<div class="card" onclick="showConstituentDetails('${c.symbol}')"><div class="card-header"><div><div class="card-title">${c.name}</div><div class="card-subtitle">Symbol: ${c.symbol} | ${c.category}</div></div><div class="card-icon"><i class="fas fa-atom"></i></div></div><div class="card-content"><p>${c.description}</p></div></div>`).join(''); }

function renderStrengthClasses() { const grid = document.getElementById('strengthClassesGrid'); if (!grid) return; grid.innerHTML = Object.entries(cementData.strengthClasses).map(([name, data]) => `<div class="card" onclick="showStrengthClassDetails('${name}')"><div class="card-header"><div><div class="card-title">Class ${name}</div><div class="card-subtitle">${data.variants.N.standard_min}${data.variants.N.standard_max ? '-' + data.variants.N.standard_max : '+'} MPa</div></div><div class="card-icon"><i class="fas fa-weight-hanging"></i></div></div><div class="card-content"><p>Includes N, R, and L variants.</p></div></div>`).join(''); }

function renderRequirements() { const grid = document.getElementById('requirementsGrid'); if (!grid) return; const requirements = [{ title: 'Chemical Requirements', icon: 'fas fa-flask', items: ['Loss on ignition', 'Insoluble residue', 'Sulfate content (SO₃)', 'Chloride content'] }, { title: 'Physical Requirements', icon: 'fas fa-ruler', items: ['Setting time', 'Soundness (Expansion)', 'Compressive strength', 'Fineness'] }]; grid.innerHTML = requirements.map(r => `<div class="card"><div class="card-header"><div><div class="card-title">${r.title}</div><div class="card-subtitle">BS EN 197-1:2011</div></div><div class="card-icon"><i class="${r.icon}"></i></div></div><div class="card-content"><ul style="margin: 0; padding-left: 20px;">${r.items.map(item => `<li>${item}</li>`).join('')}</ul></div></div>`).join(''); }

// --- Render the calculators dashboard ---
function renderDashboard() {
    const grid = document.getElementById('dashboardGrid');
    if (!grid) return;
    // Combine main constituents with any additional calculators
    const allCalcs = cementData.constituents.concat(extraCalculators);
    grid.innerHTML = allCalcs.map(c => {
        // Build a card summarising the constituent and offering a calculator
        const reqSummary = c.requirements.slice(0, 2).join('<br>');
        return `
            <div class="card" onclick="showConstituentDetails('${c.symbol}')">
                <div class="card-header">
                    <div>
                        <div class="card-title">${c.name}</div>
                        <div class="card-subtitle">Symbol: ${c.symbol}</div>
                    </div>
                    <div class="card-icon"><i class="fas fa-calculator"></i></div>
                </div>
                <div class="card-content">
                    <p>${c.description}</p>
                    <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:10px;"><strong>Key Criteria:</strong><br>${reqSummary}${c.requirements.length > 2 ? ' ...' : ''}</p>
                    <p style="color: var(--primary-blue); font-weight: 500; margin-top: 15px;"><i class="fas fa-mouse-pointer"></i> Tap to open calculator</p>
                </div>
            </div>
        `;
    }).join('');
}

function renderCharts() {
    // 1. CHART: Cement Family Distribution (NEW Bar Chart)
    const compCanvas = document.getElementById('compositionChart');
    const compCtx = compCanvas ? compCanvas.getContext('2d') : null;
    if (compCtx) {
        new Chart(compCtx, {
            type: 'bar', // Changed from 'doughnut' to 'bar'
            data: {
                labels: ['CEM II', 'Sulfate Resistant', 'CEM III', 'CEM IV', 'CEM V', 'CEM I'],
                datasets: [{
                    label: 'Number of Cement Types',
                    data: [20, 7, 3, 2, 2, 1], // Data sorted from largest to smallest
                    backgroundColor: [
                        '#2563eb', // CEM II
                        '#ef4444', // Sulfate Resistant
                        '#60a5fa', // CEM III
                        '#93c5fd', // CEM IV
                        '#bfdbfe', // CEM V
                        '#1e40af'  // CEM I
                    ],
                    borderColor: 'var(--border)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', // This makes the bar chart horizontal for easy reading
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cement Family Distribution',
                        font: { size: 16 },
                        color: 'var(--text-primary)'
                    },
                    legend: {
                        display: false // Legend is not needed for a single-dataset bar chart
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Number of Types', color: 'var(--text-secondary)' },
                        ticks: { color: 'var(--text-secondary)' },
                        grid: { color: 'var(--border)' }
                    },
                    y: {
                        ticks: { color: 'var(--text-secondary)' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // 2. CHART: Strength Requirements (No change needed here)
    const strengthCanvas = document.getElementById('strengthChart');
    const strCtx = strengthCanvas ? strengthCanvas.getContext('2d') : null;
    if (strCtx) {
        const labels = ['32.5 L', '32.5 N', '32.5 R', '42.5 L', '42.5 N', '42.5 R', '52.5 L', '52.5 N', '52.5 R'];
        const sc = cementData.strengthClasses;
        new Chart(strCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Early Strength Min (MPa)', data: [sc['32.5'].variants.L.early_min, sc['32.5'].variants.N.early_min, sc['32.5'].variants.R.early_min, sc['42.5'].variants.L.early_min, sc['42.5'].variants.N.early_min, sc['42.5'].variants.R.early_min, sc['52.5'].variants.L.early_min, sc['52.5'].variants.N.early_min, sc['52.5'].variants.R.early_min], backgroundColor: '#f97316' },
                    { label: 'Standard Strength Min (MPa)', data: [32.5, 32.5, 32.5, 42.5, 42.5, 42.5, 52.5, 52.5, 52.5], backgroundColor: '#1e40af' },
                    { label: 'Standard Strength Max (MPa)', data: [52.5, 52.5, 52.5, 62.5, 62.5, 62.5, 75, 75, 75], backgroundColor: '#60a5fa' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: true, text: 'Strength Requirements for All 9 Variants', font: { size: 16 }, color: 'var(--text-primary)' },
                    legend: { position: 'top', labels: { color: 'var(--text-secondary)' } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) { label += ': '; }
                                if (context.datasetIndex === 2 && context.raw >= 75) { label += 'No Upper Limit'; } else { label += `${context.formattedValue} MPa`; }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Compressive Strength (MPa)', color: 'var(--text-secondary)' }, ticks: { color: 'var(--text-secondary)' }, grid: { color: 'var(--border)' } },
                    x: { ticks: { color: 'var(--text-secondary)' }, grid: { display: false } }
                }
            }
        });
    }
}


function showCementTypeDetails(typeId) {
    const type = cementData.types.find(t => t.id === typeId); if (!type) return;
    const strengthDetailsHTML = type.available_strength_classes.map(sc => {
        const classData = cementData.strengthClasses[sc];
        return `<div class="info-box"><h5 class="info-box-title">Class ${sc} MPa</h5><div class="strength-variant-grid">
            ${Object.entries(classData.variants).map(([variant, data]) => {
                const isCemThree = type.family.startsWith('CEM III');
                const isAvailable = isCemThree ? true : (variant !== 'L');
                return `<div class="strength-variant-card ${isAvailable ? '' : 'disabled'}">
                    <h6>${sc} ${variant} ${isAvailable ? '✓' : '✗'}</h6>
                    <p>${data.name}</p>
                    <ul>
                        <li><strong>${data.early_days}-day:</strong> ≥${data.early_min} MPa</li>
                        <li><strong>28-day:</strong> ${data.standard_min}${data.standard_max ? ` - ${data.standard_max}` : '+'} MPa</li>
                        <li><strong>Setting:</strong> ≥${data.setting_time} min</li>
                    </ul>
                </div>`;
            }).join('')}</div></div>`;
    }).join('');
    let engineHTML = '';
    if(type.family.includes('SR') && type.c3a_limit_value !== undefined) {
        engineHTML = `<div class="info-box"><h4 class="engine-title">C₃A Analysis Engine</h4><div class="engine-grid"><div><div class="input-group"><label for="c3a_al2o3">Clinker Al₂O₃ (%)</label><input type="number" id="c3a_al2o3" value="5.0" step="0.1"></div><div class="input-group"><label for="c3a_fe2o3">Clinker Fe₂O₃ (%)</label><input type="number" id="c3a_fe2o3" value="3.0" step="0.1"></div><button class="calculate-btn" onclick="calculateC3AEngine('${typeId}')">Analyze C₃A</button></div><div id="engineResults"><h4>Result</h4><p>Enter clinker analysis and click Analyze.</p></div></div></div>`;
    }
    const content = `
        <h2 style="color: var(--primary-blue);">${type.name}</h2>
        <div class="grid-2" style="margin-bottom: 20px;">
            <div><h4>Info</h4><p><strong>Family:</strong> ${type.family}</p><p><strong>Clinker:</strong> ${type.clinker}</p>${type.additive ? `<p><strong>Additive:</strong> ${type.additive}</p>` : ''}<p><strong>Category:</strong> ${type.category}</p></div>
            <div><h4>Composition (Nucleus)</h4><div class="composition-bar">${renderCompositionBar(type.composition)}</div>${Object.entries(type.composition).map(([c, p]) => `<p><strong>${c.charAt(0).toUpperCase() + c.slice(1)}:</strong> ${p}%</p>`).join('')}</div>
        </div>
        <div class="info-box"><h4>Chemical Requirements</h4>${Object.entries(type.chemical_requirements || {}).map(([r, v]) => `<p><strong>${r.replace(/_/g, ' ').toUpperCase()}:</strong> ${v}</p>`).join('')}</div>
        ${engineHTML}
        <div class="info-box"><h4>Available Strength Classes & Variants</h4><div style="font-size: 0.9rem; text-align: center; margin-bottom:15px;"><strong>Key:</strong> <span style="color: var(--primary-blue); font-weight: bold;">✓</span> = Available &nbsp;|&nbsp; <span style="color: var(--text-secondary); font-weight: bold;">✗</span> = Not Available</div>${strengthDetailsHTML}</div>
        <div class="launch-calculator-btn" onclick="launchCalculator('${typeId}')"><i class="fas fa-calculator"></i> Launch Precision Calculator</div>
    `;
    openModal('detailModal', content);
}

// --- CORE FIX STARTS HERE ---

function launchCalculator(typeId) {
    const type = cementData.types.find(t => t.id === typeId);
    if (!type) return;

    // Create input fields for SO3 in each component of the nucleus
    const inputsHTML = Object.keys(type.composition).map(key => `
        <div class="input-group">
            <label for="${key}_so3">SO₃ in ${key.charAt(0).toUpperCase() + key.slice(1)} (%)</label>
            <input type="number" id="${key}_so3" value="${key === 'clinker' ? '1.0' : '0.1'}" step="0.01" min="0">
        </div>`).join('');

    // Create the modal content with the new Target SO3 input field
    const content = `
        <h3>Calculator: ${type.name}</h3>
        <p style="text-align:center; font-size: 0.9rem; margin-bottom: 1rem;">Max SO₃ Allowed: <strong>${type.max_so3}%</strong></p>
        <div class="calculator-grid">
            <div>
                <h4>Raw Material Inputs</h4>
                ${inputsHTML}
                <div class="input-group">
                    <label for="gypsum_purity">Gypsum Purity (%)</label>
                    <input type="number" id="gypsum_purity" value="90" step="0.1" min="0">
                </div>
                <div class="input-group">
                    <label for="gypsum_type">Gypsum Type</label>
                    <select id="gypsum_type">
                        <option value="dihydrate">Dihydrate</option>
                        <option value="hemihydrate">Hemihydrate</option>
                        <option value="anhydrite">Anhydrite</option>
                    </select>
                </div>
            </div>
            <div>
                 <h4>Calculation Target</h4>
                 <div class="input-group">
                    <label for="targetFinalSo3">Target Final SO₃ (%)</label>
                    <input type="number" id="targetFinalSo3" value="${type.max_so3}" step="0.01" min="0">
                </div>
                <button class="calculate-btn" onclick="calculatePreciseComposition('${typeId}')">Calculate</button>
                <div id="calculatorResults" style="margin-top: 20px;">
                    <h4>Final Composition</h4>
                    <p>Complete inputs and click Calculate.</p>
                </div>
            </div>
        </div>`;
    openModal('calculatorModal', content);
}

function calculatePreciseComposition(typeId) {
    const type = cementData.types.find(t => t.id === typeId);
    const resultsDiv = document.getElementById('calculatorResults');
    if (!type) {
        resultsDiv.innerHTML = `<p style="color:red;">Error: Cement type not found.</p>`;
        return;
    }

    // 1. Dynamically determine the cost-optimized nucleus.
    const nucleusComposition = {};
    const clinkerRange = type.clinker.replace('%', '').split('-').map(Number);
    const minClinkerNucleus = clinkerRange[0];
    const maxClinkerNucleus = clinkerRange[1];

    nucleusComposition['clinker'] = minClinkerNucleus;
    
    // Correctly identify the second component, prioritizing main additives over 'minor'
    let otherComponentKey = Object.keys(type.composition).find(k => k !== 'clinker' && k !== 'minor');
    if (!otherComponentKey) {
        otherComponentKey = 'minor'; // Fallback for CEM I
    }
    
    nucleusComposition[otherComponentKey] = 100 - minClinkerNucleus;


    // 2. Read all user inputs
    const targetSo3 = parseFloat(document.getElementById('targetFinalSo3').value);
    const gypsumPurity = parseFloat(document.getElementById('gypsum_purity').value) / 100;
    const gypsumType = document.getElementById('gypsum_type').value;

    // 3. Calculate the weighted average SO3 percentage in the nucleus
    let so3FromNucleusTotal = 0;
    for (const key in nucleusComposition) {
        const so3Input = document.getElementById(`${key}_so3`);
        if (so3Input) {
            const so3Value = parseFloat(so3Input.value) || 0;
            so3FromNucleusTotal += (so3Value / 100) * nucleusComposition[key];
        }
    }
    const avgSo3InNucleusPercent = so3FromNucleusTotal;

    // 4. Calculate the effective SO3 percentage in the actual gypsum
    const mw = cementData.molecularWeights;
    const so3InPureGypsumPercent = (mw.SO3 / mw[gypsumType]) * 100;
    const so3InActualGypsumPercent = so3InPureGypsumPercent * gypsumPurity;

    // 5. Check for impossible scenarios
    if (so3InActualGypsumPercent <= avgSo3InNucleusPercent) {
        resultsDiv.innerHTML = `<h4>Calculation Error</h4><p style="color:red;">Gypsum SO₃ (${so3InActualGypsumPercent.toFixed(2)}%) is not higher than Nucleus SO₃ (${avgSo3InNucleusPercent.toFixed(2)}%). Cannot achieve target.</p>`;
        return;
    }
    if (avgSo3InNucleusPercent > targetSo3) {
         resultsDiv.innerHTML = `<h4>Warning</h4><p style="color:orange;">Nucleus SO₃ (${avgSo3InNucleusPercent.toFixed(2)}%) is already higher than your target of ${targetSo3}%. No gypsum is needed.</p>`;
        return;
    }

    // 6. Apply the master formula to find the required Gypsum percentage
    const requiredGypsumPercent = ((targetSo3 - avgSo3InNucleusPercent) / (so3InActualGypsumPercent - avgSo3InNucleusPercent)) * 100;

    if (requiredGypsumPercent < 0 || requiredGypsumPercent > 15) {
        resultsDiv.innerHTML = `<h4>Warning</h4><p style="color:orange;">Calculated gypsum is ${requiredGypsumPercent.toFixed(2)}%, which is outside a reasonable range. Please check inputs.</p>`;
        return;
    }

    // 7. Calculate the final nucleus percentage and re-scale its components
    const nucleusFinalPercent = 100 - requiredGypsumPercent;
    const finalComposition = {};
    for (const key in nucleusComposition) {
        finalComposition[key] = nucleusComposition[key] * (nucleusFinalPercent / 100);
    }
    
    // 8. Forge the Sigil of Compliance and the Annotation of Origin
    const nucleusClinkerPercent = nucleusComposition['clinker'];
    const isCompliant = (nucleusClinkerPercent >= minClinkerNucleus && nucleusClinkerPercent <= maxClinkerNucleus);
    
    let complianceHTML = '';
    if (isCompliant) {
        const tooltipText = `Nucleus optimized to ${nucleusClinkerPercent.toFixed(1)}% clinker (Standard: ${minClinkerNucleus}-${maxClinkerNucleus}%). This is then scaled by the gypsum addition.`;
        // --- THIS IS THE LINE THAT WAS CORRECTED ---
        complianceHTML = `
            <span class="compliance-sigil" title="${tooltipText}">✓ Approved</span>
            <span class="compliance-details">↳ Standard Compliant (Nucleus: ${minClinkerNucleus}% Clinker)</span>`;
    } else {
        complianceHTML = `<span class="compliance-sigil-fail">✗ Out of Spec</span>`;
    }

    // 9. Display results with the forged sigil and annotation
    let resultsHTML = `<h4>Final Composition (Optimized)</h4><p><strong>Required Gypsum: ${requiredGypsumPercent.toFixed(2)}%</strong></p><hr>`;
    let finalTotal = requiredGypsumPercent;

    for (const key in finalComposition) {
        resultsHTML += `<div class="result-line"><p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${finalComposition[key].toFixed(2)}%</p>`;
        if (key === 'clinker') {
            resultsHTML += complianceHTML;
        }
        resultsHTML += `</div>`;
        finalTotal += finalComposition[key];
    }
    resultsHTML += `<hr><p><strong>Total: ${finalTotal.toFixed(2)}%</strong></p>`;
    
    resultsDiv.innerHTML = resultsHTML;
}





// Show details and calculator for each constituent symbol
function showConstituentDetails(symbol) {
    const c = cementData.constituents.find(i => i.symbol === symbol);
    if (!c) return;
    let engineHTML = '';
    switch (symbol) {
        case 'K': {
            // Clinker analysis: includes MgO and CaO/SiO2 ratio
            engineHTML = `
                <div class="info-box">
                    <h4 class="engine-title">Clinker Analysis Engine</h4>
                    <div class="engine-grid">
                        <div>
                            <div class="input-group"><label for="clinker_CaO">CaO (%)</label><input type="number" id="clinker_CaO" value="65.0" step="0.1"></div>
                            <div class="input-group"><label for="clinker_SiO2">SiO₂ (%)</label><input type="number" id="clinker_SiO2" value="21.0" step="0.1"></div>
                            <div class="input-group"><label for="clinker_Al2O3">Al₂O₃ (%)</label><input type="number" id="clinker_Al2O3" value="5.0" step="0.1"></div>
                            <div class="input-group"><label for="clinker_Fe2O3">Fe₂O₃ (%)</label><input type="number" id="clinker_Fe2O3" value="3.0" step="0.1"></div>
                            <div class="input-group"><label for="clinker_MgO">MgO (%)</label><input type="number" id="clinker_MgO" value="1.5" step="0.1"></div>
                            <div class="input-group"><label for="clinker_FreeLime">Free Lime (%)</label><input type="number" id="clinker_FreeLime" value="1.0" step="0.1"></div>
                            <button class="calculate-btn" onclick="calculateClinkerEngine()">Analyze Clinker</button>
                        </div>
                        <div id="engineResults">
                            <h4>Results</h4>
                            <p>Enter oxide analysis and click Analyze.</p>
                        </div>
                    </div>
                </div>`;
            break;
        }
        case 'S': {
            // Slag analysis
            engineHTML = `
                <div class="info-box">
                    <h4 class="engine-title">Slag Quality Check</h4>
                    <div class="engine-grid">
                        <div>
                            <div class="input-group"><label for="slag_CaO">CaO (%)</label><input type="number" id="slag_CaO" value="40.0" step="0.1"></div>
                            <div class="input-group"><label for="slag_MgO">MgO (%)</label><input type="number" id="slag_MgO" value="8.0" step="0.1"></div>
                            <div class="input-group"><label for="slag_SiO2">SiO₂ (%)</label><input type="number" id="slag_SiO2" value="35.0" step="0.1"></div>
                            <button class="calculate-btn" onclick="calculateSlagEngine()">Check Slag</button>
                        </div>
                        <div id="engineResults">
                            <h4>Results</h4>
                            <p>Enter oxide analysis and click Check.</p>
                        </div>
                    </div>
                </div>`;
            break;
        }
        case 'P':
        case 'Q':
        case 'V': {
            // Pozzolanic reactivity
            engineHTML = `
                <div class="info-box">
                    <h4 class="engine-title">Pozzolan Reactivity Check</h4>
                    <div class="engine-grid">
                        <div>
                            <div class="input-group"><label for="poz_RSiO2">Reactive SiO₂ (%)</label><input type="number" id="poz_RSiO2" value="28.0" step="0.1"></div>
                            <button class="calculate-btn" onclick="calculatePozzolanEngine('${symbol}')">Check Pozzolan</button>
                        </div>
                        <div id="engineResults">
                            <h4>Results</h4>
                            <p>Enter reactive SiO₂ and click Check.</p>
                        </div>
                    </div>
                </div>`;
            break;
        }
        case 'W': {
            // Calcareous fly ash
            engineHTML = `
                <div class="info-box">
                    <h4 class="engine-title">Calcareous Fly Ash Check</h4>
                    <div class="engine-grid">
                        <div>
                            <div class="input-group"><label for="fly_CaO">Reactive CaO (%)</label><input type="number" id="fly_CaO" value="20.0" step="0.1"></div>
                            <div class="input-group"><label for="fly_strength">Compressive Strength (MPa)</label><input type="number" id="fly_strength" value="12.0" step="0.1"></div>
                            <div class="input-group"><label for="fly_residue">Residue on 40µ (%)</label><input type="number" id="fly_residue" value="20.0" step="0.1"></div>
                            <div class="input-group"><label for="fly_expansion">Expansion (mm)</label><input type="number" id="fly_expansion" value="5.0" step="0.1"></div>
                            <button class="calculate-btn" onclick="calculateFlyAshEngine()">Check Fly Ash</button>
                        </div>
                        <div id="engineResults">
                            <h4>Results</h4>
                            <p>Enter values and click Check.</p>
                        </div>
                    </div>
                </div>`;
            break;
        }
        case 'T': {
            engineHTML = `
                <div class="info-box">
                    <h4 class="engine-title">Burnt Shale Quality Check</h4>
                    <div class="engine-grid">
                        <div>
                            <div class="input-group"><label for="burnt_strength">Compressive Strength (MPa)</label><input type="number" id="burnt_strength" value="30.0" step="0.1"></div>
                            <div class="input-group"><label for="burnt_expansion">Expansion (mm)</label><input type="number" id="burnt_expansion" value="5.0" step="0.1"></div>
                            <button class="calculate-btn" onclick="calculateBurntShaleEngine()">Check Burnt Shale</button>
                        </div>
                        <div id="engineResults">
                            <h4>Results</h4>
                            <p>Enter values and click Check.</p>
                        </div>
                    </div>
                </div>`;
            break;
        }
        case 'L':
        case 'LL': {
            engineHTML = `
                <div class="info-box">
                    <h4 class="engine-title">Limestone Quality Check</h4>
                    <div class="engine-grid">
                        <div>
                            <div class="input-group"><label for="limestone_CaCO3">CaCO₃ (%)</label><input type="number" id="limestone_CaCO3" value="90.0" step="0.1"></div>
                            <div class="input-group"><label for="limestone_clay">Clay Content (MB test g/100g)</label><input type="number" id="limestone_clay" value="0.5" step="0.01"></div>
                            <div class="input-group"><label for="limestone_TOC">Total Organic Carbon (%)</label><input type="number" id="limestone_TOC" value="0.20" step="0.01"></div>
                            <button class="calculate-btn" onclick="calculateLimestoneEngine('${symbol}')">Check Limestone</button>
                        </div>
                        <div id="engineResults">
                            <h4>Results</h4>
                            <p>Enter values and click Check.</p>
                        </div>
                    </div>
                </div>`;
            break;
        }
        case 'D': {
            engineHTML = `
                <div class="info-box">
                    <h4 class="engine-title">Silica Fume Quality Check</h4>
                    <div class="engine-grid">
                        <div>
                            <div class="input-group"><label for="sf_SiO2">SiO₂ (%)</label><input type="number" id="sf_SiO2" value="92.0" step="0.1"></div>
                            <div class="input-group"><label for="sf_LOI">Loss on Ignition (%)</label><input type="number" id="sf_LOI" value="2.0" step="0.1"></div>
                            <div class="input-group"><label for="sf_BET">Specific Surface (m²/g)</label><input type="number" id="sf_BET" value="18.0" step="0.1"></div>
                            <button class="calculate-btn" onclick="calculateSilicaFumeEngine()">Check Silica Fume</button>
                        </div>
                        <div id="engineResults">
                            <h4>Results</h4>
                            <p>Enter values and click Check.</p>
                        </div>
                    </div>
                </div>`;
            break;
        }
        case 'SA': {
            // Sulfur to Alkali ratio calculator
            engineHTML = `
                <div class="info-box">
                    <h4 class="engine-title">Sulfur‑Alkali Ratio Calculator</h4>
                    <div class="engine-grid">
                        <div>
                            <div class="input-group"><label for="sa_SO3">SO₃ (%)</label><input type="number" id="sa_SO3" value="1.5" step="0.01"></div>
                            <div class="input-group"><label for="sa_K2O">K₂O (%)</label><input type="number" id="sa_K2O" value="0.7" step="0.01"></div>
                            <div class="input-group"><label for="sa_Na2O">Na₂O (%)</label><input type="number" id="sa_Na2O" value="0.2" step="0.01"></div>
                            <button class="calculate-btn" onclick="calculateSARatioEngine()">Calculate S/A Ratio</button>
                        </div>
                        <div id="engineResults">
                            <h4>Results</h4>
                            <p>Enter SO₃, K₂O and Na₂O and click Calculate.</p>
                        </div>
                    </div>
                </div>`;
            break;
        }
        default: {
            engineHTML = '';
        }
    }
    const content = `
        <h2 style="color: var(--primary-blue);">${c.name}</h2>
        <p><strong>Symbol:</strong> ${c.symbol} | <strong>Category:</strong> ${c.category}</p>
        <p>${c.description}</p>
        <h4>Main Compounds:</h4>
        <ul>${c.compounds.map(i => `<li>${i}</li>`).join('')}</ul>
        <h4>Requirements:</h4>
        <ul>${c.requirements.map(i => `<li>${i}</li>`).join('')}</ul>
        ${engineHTML}
    `;
    openModal('calculatorModal', content);
}

function showStrengthClassDetails(className) { const sc = cementData.strengthClasses[className]; if (!sc) return; const content = `<h2 style="color: var(--primary-blue);">Strength Class ${className} MPa</h2>${Object.entries(sc.variants).map(([v, d]) => `<div class="info-box"><h4>${className} ${v} - ${d.name}</h4><p><strong>Early Strength (${d.early_days}d):</strong> ≥${d.early_min} MPa</p><p><strong>Standard Strength (28d):</strong> ${d.standard_min}${d.standard_max ? ` - ${d.standard_max}` : '+'} MPa</p><p><strong>Setting Time:</strong> ≥${d.setting_time} min</p><h5>Applications:</h5><p>${d.applications.join(', ')}</p></div>`).join('')}`; openModal('detailModal', content); }

function updateFilterCounts() { const counts = { all: cementData.types.length, common: cementData.types.filter(t => t.category === 'common').length, sulfate: cementData.types.filter(t => t.category === 'sulfate').length, lowEarly: cementData.types.filter(t=>t.family.startsWith('CEM III')).length }; document.getElementById('filterAll').textContent = `All Types (${counts.all})`; document.getElementById('filterCommon').textContent = `Common (${counts.common})`; document.getElementById('filterSulfate').textContent = `Sulfate Resistant (${counts.sulfate})`; document.getElementById('filterLowEarly').textContent = `Low Early Strength (${counts.lowEarly})`; }

function updateHeroStats() { document.getElementById('totalTypesCount').textContent = cementData.types.length; }



function updateScrollProgress() { const progressBar = document.getElementById('progressBar'); if (!progressBar) return; const scrollTop = window.pageYOffset || document.documentElement.scrollTop; const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight; progressBar.style.width = `${(scrollTop / docHeight) * 100}%`; }

function observeElements() { const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('animate-in'); } }); }, { threshold: 0.1 }); document.querySelectorAll('.card, .section-header, .stat, .chart-container').forEach(el => observer.observe(el)); }

// --- Clinker engine: calculates LSF, SM, AM, CaO/SiO2 ratio, MgO check, and provides pass/fail messages ---
function calculateClinkerEngine() {
    const CaO = parseFloat(document.getElementById('clinker_CaO').value);
    const SiO2 = parseFloat(document.getElementById('clinker_SiO2').value);
    const Al2O3 = parseFloat(document.getElementById('clinker_Al2O3').value);
    const Fe2O3 = parseFloat(document.getElementById('clinker_Fe2O3').value);
    const MgO = parseFloat(document.getElementById('clinker_MgO').value);
    const FreeLime = parseFloat(document.getElementById('clinker_FreeLime').value);
    const resultsDiv = document.getElementById('engineResults');
    // Calculations
    const LSF = (CaO - 0.7 * FreeLime) / (2.8 * SiO2 + 1.2 * Al2O3 + 0.65 * Fe2O3);
    const SM = SiO2 / (Al2O3 + Fe2O3);
    const AM = Al2O3 / Fe2O3;
    const CaO_SiO2 = CaO / SiO2;
    // Bogue phases
    const C3A = Math.max(0, 2.65 * Al2O3 - 1.69 * Fe2O3);
    const C4AF = 3.043 * Fe2O3;
    const C3S = 4.071 * (CaO - FreeLime) - 7.60 * SiO2 - 6.718 * Al2O3 - 1.43 * Fe2O3;
    const C2S = 2.867 * SiO2 - 0.7544 * C3S;
    // Evaluation helper
    function evaluate(value, low, high) {
        if (value < low) return { status: 'low', color: 'var(--fail-color)', msg: 'Below typical range' };
        if (high !== null && value > high) return { status: 'high', color: 'var(--fail-color)', msg: 'Above typical range' };
        return { status: 'pass', color: 'var(--pass-color)', msg: 'Within typical range' };
    }
    const lsfEval = evaluate(LSF, 0.92, 0.98);
    const smEval = evaluate(SM, 2.0, 3.0);
    const amEval = evaluate(AM, 1.0, 4.0);
    const ratioEval = CaO_SiO2 >= 2.0 ? { status: 'pass', color: 'var(--pass-color)', msg: 'Meets ≥2.0 requirement' } : { status: 'fail', color: 'var(--fail-color)', msg: 'Below required ratio' };
    const mgoEval = MgO <= 5.0 ? { status: 'pass', color: 'var(--pass-color)', msg: 'Within ≤5.0% limit' } : { status: 'fail', color: 'var(--fail-color)', msg: 'Exceeds 5.0% limit' };
    // Render results
    resultsDiv.innerHTML = `
        <h4>Analysis Results</h4>
        <div class="result-line"><p><strong>LSF:</strong> ${LSF.toFixed(2)}</p> <span style="color:${lsfEval.color}; font-weight:bold;">${lsfEval.status === 'pass' ? '✓' : '✗'}</span> <span class="warning-detail-inline">${lsfEval.msg}</span></div>
        <div class="result-line"><p><strong>SM:</strong> ${SM.toFixed(2)}</p> <span style="color:${smEval.color}; font-weight:bold;">${smEval.status === 'pass' ? '✓' : '✗'}</span> <span class="warning-detail-inline">${smEval.msg}</span></div>
        <div class="result-line"><p><strong>AM:</strong> ${AM.toFixed(2)}</p> <span style="color:${amEval.color}; font-weight:bold;">${amEval.status === 'pass' ? '✓' : '✗'}</span> <span class="warning-detail-inline">${amEval.msg}</span></div>
        <div class="result-line"><p><strong>CaO/SiO₂ Ratio:</strong> ${CaO_SiO2.toFixed(2)}</p> <span style="color:${ratioEval.color}; font-weight:bold;">${ratioEval.status === 'pass' ? '✓' : '✗'}</span> <span class="warning-detail-inline">${ratioEval.msg}</span></div>
        <div class="result-line"><p><strong>MgO:</strong> ${MgO.toFixed(2)}%</p> <span style="color:${mgoEval.color}; font-weight:bold;">${mgoEval.status === 'pass' ? '✓' : '✗'}</span> <span class="warning-detail-inline">${mgoEval.msg}</span></div>
        <hr>
        <h4>Bogue Phase Estimate</h4>
        <p><strong>C₃S:</strong> ${C3S.toFixed(2)}%</p>
        <p><strong>C₂S:</strong> ${C2S.toFixed(2)}%</p>
        <p><strong>C₃A:</strong> ${C3A.toFixed(2)}%</p>
        <p><strong>C₄AF:</strong> ${C4AF.toFixed(2)}%</p>
    `;
}

// --- Slag quality calculator ---
function calculateSlagEngine() {
    const CaO = parseFloat(document.getElementById('slag_CaO').value);
    const MgO = parseFloat(document.getElementById('slag_MgO').value);
    const SiO2 = parseFloat(document.getElementById('slag_SiO2').value);
    const resultsDiv = document.getElementById('engineResults');
    const ratio = (CaO + MgO) / SiO2;
    const sum = CaO + MgO + SiO2;
    const ratioPass = ratio > 1.0;
    const sumPass = sum >= 66.7;
    resultsDiv.innerHTML = `
        <h4>Slag Analysis</h4>
        <div class="result-line"><p><strong>(CaO + MgO)/SiO₂:</strong> ${ratio.toFixed(2)}</p> <span style="color:${ratioPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${ratioPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${ratioPass ? 'Above 1.0 requirement' : 'Below 1.0 requirement'}</span></div>
        <div class="result-line"><p><strong>Total CaO+MgO+SiO₂:</strong> ${sum.toFixed(1)}%</p> <span style="color:${sumPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${sumPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${sumPass ? '≥66.7% (2/3) of slag' : '<66.7% of slag'}</span></div>
    `;
}

// --- Pozzolanic reactivity calculator (natural/calcined/fly ash V) ---
function calculatePozzolanEngine(symbol) {
    const reactive = parseFloat(document.getElementById('poz_RSiO2').value);
    const resultsDiv = document.getElementById('engineResults');
    const pass = reactive >= 25.0;
    resultsDiv.innerHTML = `
        <h4>Pozzolan Reactivity</h4>
        <div class="result-line"><p><strong>Reactive SiO₂:</strong> ${reactive.toFixed(2)}%</p> <span style="color:${pass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${pass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${pass ? 'Meets ≥25%' : 'Below 25% threshold'}</span></div>
    `;
}

// --- Calcareous fly ash (W) calculator ---
function calculateFlyAshEngine() {
    const CaO = parseFloat(document.getElementById('fly_CaO').value);
    const strength = parseFloat(document.getElementById('fly_strength').value);
    const residue = parseFloat(document.getElementById('fly_residue').value);
    const expansion = parseFloat(document.getElementById('fly_expansion').value);
    const resultsDiv = document.getElementById('engineResults');
    const CaOPass = CaO > 15.0;
    const strengthPass = strength >= 10.0;
    const residuePass = residue >= 10.0 && residue <= 30.0;
    const expansionPass = expansion <= 10.0;
    resultsDiv.innerHTML = `
        <h4>Fly Ash Analysis</h4>
        <div class="result-line"><p><strong>Reactive CaO:</strong> ${CaO.toFixed(2)}%</p> <span style="color:${CaOPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${CaOPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${CaOPass ? '>15% OK' : '≤15% too low'}</span></div>
        <div class="result-line"><p><strong>Compressive Strength (28d):</strong> ${strength.toFixed(2)} MPa</p> <span style="color:${strengthPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${strengthPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${strengthPass ? '≥10 MPa OK' : '<10 MPa'}</span></div>
        <div class="result-line"><p><strong>Residue on 40µ:</strong> ${residue.toFixed(2)}%</p> <span style="color:${residuePass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${residuePass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${residuePass ? '10–30% OK' : 'Outside 10–30% range'}</span></div>
        <div class="result-line"><p><strong>Expansion:</strong> ${expansion.toFixed(2)} mm</p> <span style="color:${expansionPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${expansionPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${expansionPass ? '≤10 mm OK' : '>10 mm too high'}</span></div>
    `;
}

// --- Burnt shale (T) calculator ---
function calculateBurntShaleEngine() {
    const strength = parseFloat(document.getElementById('burnt_strength').value);
    const expansion = parseFloat(document.getElementById('burnt_expansion').value);
    const strengthPass = strength >= 25.0;
    const expansionPass = expansion <= 10.0;
    const resultsDiv = document.getElementById('engineResults');
    resultsDiv.innerHTML = `
        <h4>Burnt Shale Analysis</h4>
        <div class="result-line"><p><strong>Compressive Strength (28d):</strong> ${strength.toFixed(2)} MPa</p> <span style="color:${strengthPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${strengthPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${strengthPass ? '≥25 MPa OK' : '<25 MPa'}</span></div>
        <div class="result-line"><p><strong>Expansion:</strong> ${expansion.toFixed(2)} mm</p> <span style="color:${expansionPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${expansionPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${expansionPass ? '≤10 mm OK' : '>10 mm too high'}</span></div>
    `;
}

// --- Limestone quality calculator (L and LL) ---
function calculateLimestoneEngine(symbol) {
    const CaCO3 = parseFloat(document.getElementById('limestone_CaCO3').value);
    const clay = parseFloat(document.getElementById('limestone_clay').value);
    const TOC = parseFloat(document.getElementById('limestone_TOC').value);
    const CaPass = CaCO3 >= 75.0;
    const clayPass = clay <= 1.20;
    const tocLimit = symbol === 'LL' ? 0.20 : 0.50;
    const tocPass = TOC <= tocLimit;
    const resultsDiv = document.getElementById('engineResults');
    resultsDiv.innerHTML = `
        <h4>Limestone Analysis</h4>
        <div class="result-line"><p><strong>CaCO₃:</strong> ${CaCO3.toFixed(2)}%</p> <span style="color:${CaPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${CaPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${CaPass ? '≥75% OK' : '<75% low'}</span></div>
        <div class="result-line"><p><strong>Clay Content (MB):</strong> ${clay.toFixed(2)} g/100 g</p> <span style="color:${clayPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${clayPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${clayPass ? '≤1.20 OK' : '>1.20 high'}</span></div>
        <div class="result-line"><p><strong>Total Organic Carbon:</strong> ${TOC.toFixed(2)}%</p> <span style="color:${tocPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${tocPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${tocPass ? `≤${tocLimit}% OK` : `>${tocLimit}% high`}</span></div>
    `;
}

// --- Silica fume quality calculator ---
function calculateSilicaFumeEngine() {
    const SiO2 = parseFloat(document.getElementById('sf_SiO2').value);
    const LOI = parseFloat(document.getElementById('sf_LOI').value);
    const BET = parseFloat(document.getElementById('sf_BET').value);
    const SiPass = SiO2 >= 85.0;
    const LOIPass = LOI <= 4.0;
    const BETPass = BET >= 15.0;
    const resultsDiv = document.getElementById('engineResults');
    resultsDiv.innerHTML = `
        <h4>Silica Fume Analysis</h4>
        <div class="result-line"><p><strong>SiO₂:</strong> ${SiO2.toFixed(2)}%</p> <span style="color:${SiPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${SiPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${SiPass ? '≥85% OK' : '<85% low'}</span></div>
        <div class="result-line"><p><strong>Loss on Ignition:</strong> ${LOI.toFixed(2)}%</p> <span style="color:${LOIPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${LOIPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${LOIPass ? '≤4% OK' : '>4% high'}</span></div>
        <div class="result-line"><p><strong>Specific Surface (BET):</strong> ${BET.toFixed(2)} m²/g</p> <span style="color:${BETPass ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${BETPass ? '✓' : '✗'}</span> <span class="warning-detail-inline">${BETPass ? '≥15 OK' : '<15 low'}</span></div>
    `;
}

// --- Sulfur to Alkali ratio calculator ---
function calculateSARatioEngine() {
    const so3 = parseFloat(document.getElementById('sa_SO3').value);
    const k2o = parseFloat(document.getElementById('sa_K2O').value);
    const na2o = parseFloat(document.getElementById('sa_Na2O').value);
    const resultsDiv = document.getElementById('engineResults');
    // Use molecular weights: SO3=80.06, K2O=94.2, Na2O=61.98 (approx)
    const numerator = so3 / 80.06;
    const denominator = (k2o / 94.2) + (0.5 * na2o / 61.98);
    const ratio = numerator / (denominator || 1e-6);
    let status, msg;
    if (ratio < 0.9) {
        status = 'fail';
        msg = 'Low ratio indicates alkali excess – potential ring formation.';
    } else if (ratio > 1.3) {
        status = 'fail';
        msg = 'High ratio indicates sulfur excess – risk of deposits.';
    } else {
        status = 'pass';
        msg = 'Balanced sulfur‑alkali ratio.';
    }
    resultsDiv.innerHTML = `
        <h4>S/A Ratio Analysis</h4>
        <div class="result-line"><p><strong>Calculated Ratio:</strong> ${ratio.toFixed(2)}</p> <span style="color:${status === 'pass' ? 'var(--pass-color)' : 'var(--fail-color)'}; font-weight:bold;">${status === 'pass' ? '✓' : '✗'}</span> <span class="warning-detail-inline">${msg}</span></div>
    `;
}

function calculateC3AEngine(typeId) {
    const type = cementData.types.find(t => t.id === typeId); if (!type || type.c3a_limit_value === undefined) return;
    const Al2O3 = parseFloat(document.getElementById('c3a_al2o3').value);
    const Fe2O3 = parseFloat(document.getElementById('c3a_fe2o3').value);
    const C3A = Math.max(0, 2.65 * Al2O3 - 1.69 * Fe2O3);
    const limit = type.c3a_limit_value;
    const isPass = C3A <= limit;
    const resultsDiv = document.getElementById('engineResults');
    resultsDiv.innerHTML = `<h4>Analysis Results</h4><p><strong>Calculated C₃A:</strong> ${C3A.toFixed(2)}%</p><p><strong>Standard Limit:</strong> ≤ ${limit}%</p><hr><p style="font-size: 1.5rem; font-weight: bold; color: ${isPass ? 'green' : 'red'};">${isPass ? 'PASS' : 'FAIL'}</p>`;
}

function initializeApp() {
    setTimeout(() => { document.getElementById('loadingScreen').style.display = 'none'; }, 500);
    try {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }
    } catch(e) {}
    initializeNavigation(); initializeSearch(); initializeFilters(); initializeModal();
    updateFilterCounts(); updateHeroStats(); 
    renderCementTypes(); renderConstituents(); renderStrengthClasses(); renderRequirements(); renderDashboard(); renderCharts();
    window.addEventListener('scroll', updateScrollProgress);
    observeElements();
    // Bind report generator once
    const reportBtn = document.getElementById('launchReportGeneratorBtn');
    if (reportBtn) reportBtn.addEventListener('click', launchReportGenerator);
}

function launchReportGenerator() {
    // Build dropdowns for cement types and additive types
    const cementOptions = cementData.types.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    const additiveTypes = [
        { value: 'none', label: 'None' },
        { value: 'chryso', label: 'Chryso' },
        { value: 'don', label: 'Don Construction' },
        { value: 'mapei', label: 'Mapei' },
        { value: 'al-fayha', label: 'Al-Fayha' },
        { value: 'other', label: 'Other' }
    ];
    const additiveOptions = additiveTypes.map(a => `<option value="${a.value}">${a.label}</option>`).join('');

    const content = `
        <h3>Daily Quality Report</h3>
        <div class="report-grid">
            <div id="reportInputSection">
                <!-- General Information -->
                <div class="report-section">
                    <h4>General Information</h4>
                    <div class="input-group"><label for="reportDate">Report Date</label><input type="date" id="reportDate" value="${new Date().toISOString().slice(0,10)}"></div>
                    <div class="input-group"><label for="productionDate">Production Date</label><input type="date" id="productionDate" value="${new Date().toISOString().slice(0,10)}"></div>
                    <div class="input-group"><label for="reportCompany">Company</label><input type="text" id="reportCompany" placeholder="Company name"></div>
                    <div class="input-group"><label for="reportPreparedBy">Prepared By</label><input type="text" id="reportPreparedBy" placeholder="Your name"></div>
                    <div class="input-group"><label for="reportCementType">Cement Type</label><select id="reportCementType" onchange="updateReportStrengthOptions()">${cementOptions}</select></div>
                    <div class="input-group"><label for="reportStrengthVariant">Strength Variant</label><select id="reportStrengthVariant"></select></div>
                    <div class="input-group"><label for="reportStrengthClass">Strength Class</label><select id="reportStrengthClass"><option value="32.5">32.5</option><option value="42.5">42.5</option><option value="52.5">52.5</option></select></div>
                    <div class="input-group"><label for="reportLanguage">Report Language</label><select id="reportLanguage"><option value="en">English</option><option value="ar">العربية</option></select></div>
                    <div class="input-group"><label for="reportExtraAnalysis">Additional Analysis Topics</label><input type="text" id="reportExtraAnalysis" placeholder="Optional: e.g., carbonation, durability"></div>
                </div>

                <!-- Composition (%) -->
                <div class="report-section">
                    <h4>Product Composition (%)</h4>
                    <div class="input-group"><label for="reportClinker">Clinker (%)</label><input type="number" id="reportClinker" value="85" min="0" max="100"></div>
                    <div class="input-group"><label for="reportPozzolan">Pozzolan (%)</label><input type="number" id="reportPozzolan" value="10" min="0" max="100"></div>
                    <div class="input-group"><label for="reportMinor">Minor Additions (%)</label><input type="number" id="reportMinor" value="3" min="0" max="100"></div>
                    <div class="input-group"><label for="reportGypsum">Gypsum (%)</label><input type="number" id="reportGypsum" value="2" min="0" max="100"></div>
                </div>

                <!-- Production Statistics -->
                <div class="report-section">
                    <h4>Production Statistics</h4>
                    <div class="input-group"><label for="reportHours">Production Hours</label><input type="number" id="reportHours" value="6"></div>
                    <div class="input-group"><label for="reportThroughputMin">Throughput Min (t/h)</label><input type="number" id="reportThroughputMin" value="140"></div>
                    <div class="input-group"><label for="reportThroughputMax">Throughput Max (t/h)</label><input type="number" id="reportThroughputMax" value="160"></div>
                </div>

                <!-- Fineness & Particle Size -->
                <div class="report-section">
                    <h4>Fineness & Particle Size</h4>
                    <div class="input-group"><label for="reportBlaineMin">Blaine Min (cm²/g)</label><input type="number" id="reportBlaineMin" value="3400"></div>
                    <div class="input-group"><label for="reportBlaineMax">Blaine Max (cm²/g)</label><input type="number" id="reportBlaineMax" value="3600"></div>
                    <div class="input-group"><label for="reportD10">D₁₀ (µm)</label><input type="number" id="reportD10" value="4"></div>
                    <div class="input-group"><label for="reportD50">D₅₀ (µm)</label><input type="number" id="reportD50" value="12"></div>
                    <div class="input-group"><label for="reportD90">D₉₀ (µm)</label><input type="number" id="reportD90" value="35"></div>
                    <div class="input-group"><label for="reportD95">D₉₅ (µm)</label><input type="number" id="reportD95" value="45"></div>
                    <div class="input-group"><label for="reportRes90">Residue 90µm (%)</label><input type="number" id="reportRes90" value="0.0" step="0.1"></div>
                    <div class="input-group"><label for="reportRes45">Residue 45µm (%)</label><input type="number" id="reportRes45" value="10" step="0.1"></div>
                    <div class="input-group"><label for="reportRes32">Residue 32µm (%)</label><input type="number" id="reportRes32" value="15" step="0.1"></div>
                    <div class="input-group"><label for="reportRes16">Residue 16µm (%)</label><input type="number" id="reportRes16" value="20" step="0.1"></div>
                </div>

                <!-- Chemical & Setting -->
                <div class="report-section">
                    <h4>Chemical Composition & Setting</h4>
                    <div class="input-group"><label for="reportClMin">Cl Min (%)</label><input type="number" id="reportClMin" value="0.02" step="0.001"></div>
                    <div class="input-group"><label for="reportClMax">Cl Max (%)</label><input type="number" id="reportClMax" value="0.08" step="0.001"></div>
                    <div class="input-group"><label for="reportMgoMin">MgO Min (%)</label><input type="number" id="reportMgoMin" value="1.2" step="0.1"></div>
                    <div class="input-group"><label for="reportMgoMax">MgO Max (%)</label><input type="number" id="reportMgoMax" value="2.8" step="0.1"></div>
                    <div class="input-group"><label for="reportSo3Min">SO₃ Min (%)</label><input type="number" id="reportSo3Min" value="2.5" step="0.1"></div>
                    <div class="input-group"><label for="reportSo3Max">SO₃ Max (%)</label><input type="number" id="reportSo3Max" value="3.5" step="0.1"></div>
                    <div class="input-group"><label for="reportWC">W/C Ratio</label><input type="number" id="reportWC" value="0.28" step="0.01"></div>
                    <div class="input-group"><label for="reportInitialSet">Initial Setting (min)</label><input type="number" id="reportInitialSet" value="120"></div>
                    <div class="input-group"><label for="reportFinalSet">Final Setting (min)</label><input type="number" id="reportFinalSet" value="240"></div>
                </div>

                <!-- Strength & Other Parameters -->
                <div class="report-section">
                    <h4>Strength & Other Parameters</h4>
                    <div class="input-group"><label for="reportStrength2">2 Day Strength (MPa)</label><input type="number" id="reportStrength2" value="22"></div>
                    <div class="input-group"><label for="reportStrength7">7 Day Strength (MPa)</label><input type="number" id="reportStrength7" value="35"></div>
                    <div class="input-group"><label for="reportStrength28">28 Day Strength (MPa)</label><input type="number" id="reportStrength28" value="48"></div>
                    <div class="input-group"><label for="reportSoundness">Soundness (mm)</label><input type="number" id="reportSoundness" value="1" step="0.1"></div>
                    <div class="input-group"><label for="reportLOI">Loss on Ignition (%)</label><input type="number" id="reportLOI" value="3.0" step="0.1"></div>
                    <div class="input-group"><label for="reportIR">Insoluble Residue (%)</label><input type="number" id="reportIR" value="1.5" step="0.1"></div>
                </div>

                <!-- Additives -->
                <div class="report-section">
                    <h4>Admixture</h4>
                    <div class="input-group"><label for="reportAdditiveType">Type</label><select id="reportAdditiveType" onchange="updateAdditiveFields()">${additiveOptions}</select></div>
                    <div class="input-group"><label for="reportAdditiveDose">Dose</label><input type="number" id="reportAdditiveDose" value="0" step="0.1"></div>
                    <div class="input-group"><label for="reportAdditiveUnit">Unit</label><select id="reportAdditiveUnit"><option value="ml">ml/t</option><option value="g">g/t</option><option value="%">%</option></select></div>
                    <div class="input-group" id="additiveOtherGroup" style="display:none;"><label for="reportAdditiveOther">Other Additive</label><input type="text" id="reportAdditiveOther"></div>
                </div>

                <button class="calculate-btn" onclick="submitQualityReport()">Generate Report</button>
            </div>
            <div id="reportAnalysisSection">
                <h4>Analysis & Visualization</h4>
                <p>Fill in the form and click "Generate Report".</p>
            </div>
        </div>
    `;
    openModal('calculatorModal', content);
    // Populate initial strength variant options
    updateReportStrengthOptions();
}

// Update strength variant options based on selected cement type for the report
function updateReportStrengthOptions() {
    const typeId = document.getElementById('reportCementType').value;
    const type = cementData.types.find(t => t.id === typeId);
    const variantSelect = document.getElementById('reportStrengthVariant');
    if (!type || !variantSelect) return;
    // Determine allowed variants. Allow 'L' only for CEM III family; otherwise N and R.
    const family = type.family;
    let allowedVariants;
    if (family && family.startsWith('CEM III')) {
        allowedVariants = ['L', 'N']; // L and N for CEM III
    } else {
        allowedVariants = ['N', 'R']; // N and R for others
    }
    // Populate variant select
    variantSelect.innerHTML = '';
    allowedVariants.forEach(v => {
        variantSelect.innerHTML += `<option value="${v}">${v}</option>`;
    });
}

// Show/hide additive fields depending on type
function updateAdditiveFields() {
    const type = document.getElementById('reportAdditiveType').value;
    const otherGroup = document.getElementById('additiveOtherGroup');
    const doseInput = document.getElementById('reportAdditiveDose');
    const unitSelect = document.getElementById('reportAdditiveUnit');
    if (type === 'none') {
        doseInput.value = '';
        doseInput.disabled = true;
        unitSelect.disabled = true;
        otherGroup.style.display = 'none';
    } else {
        doseInput.disabled = false;
        unitSelect.disabled = false;
        if (type === 'other') {
            otherGroup.style.display = '';
        } else {
            otherGroup.style.display = 'none';
        }
    }
}

async function submitQualityReport() {
    const section = document.getElementById('reportAnalysisSection');
    const typeId = document.getElementById('reportCementType').value;
    const variant = document.getElementById('reportStrengthVariant').value;
    const strengthClass = document.getElementById('reportStrengthClass').value;
    const language = document.getElementById('reportLanguage').value;
    const extraTopics = document.getElementById('reportExtraAnalysis').value.trim();

    const cementType = cementData.types.find(t => t.id === typeId);
    if (!cementType) return;

    // Helper to compute avg & std dev from min/max
    function computeStats(minVal, maxVal) {
        const min = parseFloat(minVal);
        const max = parseFloat(maxVal);
        const avg = (min + max) / 2;
        const std = (max - min) / 4; // Rough estimate
        return { avg, std, min, max };
    }

    // Collect data
    const throughput = computeStats(document.getElementById('reportThroughputMin').value, document.getElementById('reportThroughputMax').value);
    const blaine = computeStats(document.getElementById('reportBlaineMin').value, document.getElementById('reportBlaineMax').value);
    const cl = computeStats(document.getElementById('reportClMin').value, document.getElementById('reportClMax').value);
    const mgo = computeStats(document.getElementById('reportMgoMin').value, document.getElementById('reportMgoMax').value);
    const so3 = computeStats(document.getElementById('reportSo3Min').value, document.getElementById('reportSo3Max').value);
    // Strength actual values
    const strength = {
        d2: parseFloat(document.getElementById('reportStrength2').value),
        d7: parseFloat(document.getElementById('reportStrength7').value),
        d28: parseFloat(document.getElementById('reportStrength28').value)
    };
    // Residue 45 µm (we will compute avg & std dev to check early strength correlation)
    const residue45 = computeStats(document.getElementById('reportRes45').value, document.getElementById('reportRes45').value);

    // Determine strength requirements for selected class and variant
    const sc = cementData.strengthClasses[strengthClass];
    let varData;
    if (sc && sc.variants && sc.variants[variant]) {
        varData = sc.variants[variant];
    } else if (sc && sc.variants && sc.variants.N) {
        varData = sc.variants.N;
    } else {
        // fallback: use first available variant of class
        varData = sc ? sc.variants[Object.keys(sc.variants)[0]] : null;
    }
    if (!varData) return;

    // Build analysis notes (local)
    const notes = [];
    // Evaluate early strength vs. residue 45
    const earlyActual = varData.early_days === 2 ? strength.d2 : strength.d7;
    if (earlyActual < varData.early_min && residue45.avg > 12) {
        notes.push(language === 'ar' ? 'قوة الشك المبكرة منخفضة مع بقاء مرتفع على منخل 45 ميكرون – يُنصح بتحسين الطحن.' : 'Low early strength correlates with high 45µ residue – consider improving grinding efficiency.');
    }
    // Evaluate blaine variability
    if (blaine.std > 100) {
        notes.push(language === 'ar' ? 'انحراف معياري مرتفع للبلاين يشير إلى عدم استقرار عملية الطحن.' : 'High Blaine standard deviation indicates unstable grinding process.');
    }
    // Evaluate throughput variability
    if (throughput.std > 15) {
        notes.push(language === 'ar' ? 'تغير كبير في معدل التغذية قد يشير إلى مشاكل ميكانيكية أو عدم انتظام التغذية.' : 'Large throughput variation may signal inconsistent feed or mechanical issues.');
    }
    // Evaluate MgO limit (should be ≤ 5%)
    if (mgo.avg > 5) {
        notes.push(language === 'ar' ? 'متوسط نسبة MgO يتجاوز %5 – خطر عدم ثبات الإسمنت.' : 'Average MgO exceeds 5% limit – risk of unsoundness.');
    }
    // Evaluate SO3 limit (based on cement type max_so3)
    if (cementType.max_so3 && so3.avg > cementType.max_so3) {
        notes.push(language === 'ar'
            ? `متوسط SO₃ (${so3.avg.toFixed(2)}%) يتجاوز الحد الأقصى ${cementType.max_so3}%.`
            : `Average SO₃ (${so3.avg.toFixed(2)}%) exceeds standard limit of ${cementType.max_so3}%.`);
    }
    if (notes.length === 0) {
        notes.push(language === 'ar' ? 'جميع المؤشرات ضمن الحدود الطبيعية.' : 'All parameters are within expected ranges.');
    }

    // Build base HTML for summary and charts
    let html = `<div id="printableReport">`;
    // Insert company logo if provided
    if (COMPANY_LOGO_URL) {
        html += `<div style="text-align:left;margin-bottom:10px;"><img src="${COMPANY_LOGO_URL}" alt="Company Logo" style="max-height:50px;"></div>`;
    }
    html += `<h4 style="color: var(--primary-blue);">${language === 'ar' ? 'تقرير الجودة اليومي' : 'Daily Quality Report'} – ${cementType.name} (${strengthClass} ${variant})</h4>`;
    html += `<p><strong>${language === 'ar' ? 'تاريخ التقرير' : 'Report Date'}:</strong> ${document.getElementById('reportDate').value}</p>`;
    html += `<p><strong>${language === 'ar' ? 'تاريخ الإنتاج' : 'Production Date'}:</strong> ${document.getElementById('productionDate').value}</p>`;
    html += `<p><strong>${language === 'ar' ? 'المعد' : 'Prepared By'}:</strong> ${document.getElementById('reportPreparedBy').value || '-'}</p>`;
    html += `<p><strong>${language === 'ar' ? 'الشركة' : 'Company'}:</strong> ${document.getElementById('reportCompany').value || '-'}</p>`;
    html += `<hr>`;
    html += `<h5>${language === 'ar' ? 'إحصاءات الإنتاج والنعومة' : 'Production & Fineness Statistics'}</h5>`;
    html += `<p>${language === 'ar' ? 'متوسط معدل التغذية' : 'Throughput Avg'}: <span class="result-value">${throughput.avg.toFixed(1)} t/h</span> (${language === 'ar' ? 'الانحراف المعياري' : 'Std. Dev'}: ${throughput.std.toFixed(2)})</p>`;
    html += `<p>${language === 'ar' ? 'متوسط بلاين' : 'Blaine Avg'}: <span class="result-value">${blaine.avg.toFixed(0)} cm²/g</span> (${language === 'ar' ? 'الانحراف المعياري' : 'Std. Dev'}: ${blaine.std.toFixed(1)})</p>`;
    html += `<p>Cl Avg: <span class="result-value">${cl.avg.toFixed(3)}%</span> (${language === 'ar' ? 'الانحراف المعياري' : 'Std. Dev'}: ${cl.std.toFixed(3)})</p>`;
    html += `<p>MgO Avg: <span class="result-value">${mgo.avg.toFixed(2)}%</span> (${language === 'ar' ? 'الانحراف المعياري' : 'Std. Dev'}: ${mgo.std.toFixed(2)})</p>`;
    html += `<p>SO₃ Avg: <span class="result-value">${so3.avg.toFixed(2)}%</span> (${language === 'ar' ? 'الانحراف المعياري' : 'Std. Dev'}: ${so3.std.toFixed(2)})</p>`;
    html += `<hr>`;
    html += `<h5>${language === 'ar' ? 'أداء المقاومة' : 'Strength Performance'}</h5>`;
    html += `<div class="chart-container" style="height:300px;"><canvas id="reportStrengthChart"></canvas></div>`;
    html += `<hr>`;
    html += `<h5>${language === 'ar' ? 'ملاحظات المحلل' : 'Analyst Notes'}</h5>`;
    html += `<ul>${notes.map(n => `<li>${n}</li>`).join('')}</ul>`;

    // Placeholder for external analysis result
    html += `<div id="externalAnalysis" style="margin-top:15px;"></div>`;

    html += `</div>`;
    html += `<button class="calculate-btn" onclick="printReport()"><i class="fas fa-print"></i> ${language === 'ar' ? 'طباعة إلى PDF' : 'Print to PDF'}</button>`;
    section.innerHTML = html;

    // Render chart
    const ctx = document.getElementById('reportStrengthChart').getContext('2d');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [`${varData.early_days}-day`, '28-day'],
                datasets: [
                    { label: language === 'ar' ? 'المقاومة الفعلية (MPa)' : 'Actual Strength (MPa)', data: [earlyActual, strength.d28], backgroundColor: '#1e40af' },
                    { label: language === 'ar' ? 'الحد الأدنى المعياري (MPa)' : 'Standard Min (MPa)', data: [varData.early_min, varData.standard_min], backgroundColor: 'rgba(249,115,22,0.6)' }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: language === 'ar' ? 'مقارنة المقاومة بالمعيار' : 'Strength vs. Standard' } } }
        });
    }

    // If external analysis API is configured and available, call it and insert the analysis
    if (REPORT_API_URL && REPORT_API_KEY) {
        const externalDiv = document.getElementById('externalAnalysis');
        externalDiv.innerHTML = `<p>${language === 'ar' ? 'جاري تحليل البيانات...' : 'Analyzing data using external service...'}</p>`;
        // Build prompt for external API (OpenAI-like request)
        const promptBody = {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are an expert cement scientist. Provide concise, professional analysis and recommendations based on report data. Focus on correlations, deviations from standards, and actionable advice.' },
                { role: 'user', content: 
                    `Language: ${language === 'ar' ? 'Arabic' : 'English'}\n` +
                    `Cement type: ${cementType.name}, Strength class: ${strengthClass}, Variant: ${variant}.\n` +
                    `Throughput avg ${throughput.avg.toFixed(1)} t/h (std ${throughput.std.toFixed(2)}). Blaine avg ${blaine.avg.toFixed(0)} cm^2/g (std ${blaine.std.toFixed(1)}).\n` +
                    `MgO avg ${mgo.avg.toFixed(2)}%, SO3 avg ${so3.avg.toFixed(2)}%, Cl avg ${cl.avg.toFixed(3)}%.\n` +
                    `Early strength ${earlyActual.toFixed(2)} MPa vs. min ${varData.early_min} MPa. 28-day strength ${strength.d28.toFixed(2)} MPa vs. min ${varData.standard_min || 'N/A'} MPa.\n` +
                    `Residue 45µm ${residue45.avg.toFixed(1)}%. D10 ${document.getElementById('reportD10').value}, D50 ${document.getElementById('reportD50').value}, D90 ${document.getElementById('reportD90').value}, D95 ${document.getElementById('reportD95').value}.\n` +
                    (extraTopics ? `Additional topics: ${extraTopics}.\n` : '') +
                    'Please provide a structured analysis with observations and recommendations in the specified language.'
                }
            ],
            temperature: 0.5,
            max_tokens: 600
        };
        try {
            const analysisText = await callExternalAnalysis(promptBody);
            if (analysisText) {
                externalDiv.innerHTML = `<h5>${language === 'ar' ? 'التحليل الخارجي' : 'External Analysis'}</h5><p>${analysisText.replace(/\n/g, '<br>')}</p>`;
            } else {
                externalDiv.innerHTML = '';
            }
        } catch (err) {
            externalDiv.innerHTML = `<p style="color:red;">${language === 'ar' ? 'فشل الاتصال بالخدمة الخارجية.' : 'Failed to fetch external analysis.'}</p>`;
        }
    }
}

function printReport() {
    const { jsPDF } = window.jspdf;
    const reportElement = document.getElementById('printableReport');
    
    html2canvas(reportElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.setFont('helvetica', 'bold');
        pdf.text("Daily Quality Report", pdfWidth / 2, 20, { align: 'center' });
        pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, pdfHeight > 250 ? 250 : pdfHeight); 
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text(`Generated by Cement Standards Guide on ${new Date().toLocaleDateString()}`, 10, pdf.internal.pageSize.getHeight() - 10);

        pdf.save(`Daily_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    });
}

// Helper to call external analysis API.  Returns analysis text or null.
async function callExternalAnalysis(prompt) {
    if (!REPORT_API_URL || !REPORT_API_KEY) return null;
    try {
        const response = await fetch(REPORT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${REPORT_API_KEY}`
            },
            body: JSON.stringify(prompt)
        });
        const data = await response.json();
        // Attempt to extract analysis text from known formats (OpenAI-like)
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            return data.choices[0].message.content;
        }
        if (data.analysis) return data.analysis;
        return null;
    } catch (err) {
        console.error('External analysis error:', err);
        return null;
    }
}

function launchMixSimulator() {
    const families = ['CEM I', 'CEM II', 'CEM III', 'CEM IV', 'CEM V'];
    const familyOptions = families.map(f => `<option value="${f}">${f}</option>`).join('');

    const content = `
        <h3>Mix Design Simulator (Free Mode)</h3>
        <div class="engine-grid">
            <div>
                <h4>1. Select Cement Type</h4>
                <div class="input-group">
                    <label for="simFamily">Cement Family</label>
                    <select id="simFamily" onchange="updateSimulatorOptions()">${familyOptions}</select>
                </div>
                <div class="input-group">
                    <label for="simType">Cement Type</label>
                    <select id="simType" onchange="updateSimulatorComposition()"></select>
                </div>
                <div class="input-group">
                    <label for="simStrength">Strength Class</label>
                    <select id="simStrength"></select>
                </div>
                <hr>
                <h4>2. Define Nucleus Composition</h4>
                <div id="simCompositionInputs"></div>
                <div id="compositionTotal" style="text-align: right; font-weight: bold; margin-top: 10px;">Total: 100%</div>
            </div>

            <div>
                <h4>3. Define SO₃ & Gypsum</h4>
                <div id="simSo3Inputs"></div>
                <div class="input-group">
                    <label for="simTargetSo3">Target Final SO₃ (%)</label>
                    <input type="number" id="simTargetSo3" value="3.2" step="0.1">
                </div>
                <div class="input-group">
                    <label for="simGypsumPurity">Gypsum Purity (%)</label>
                    <input type="number" id="simGypsumPurity" value="90" step="0.1">
                </div>
                <div class="input-group">
                    <label for="simGypsumType">Gypsum Type</label>
                    <select id="simGypsumType">
                        <option value="dihydrate">Dihydrate (CaSO₄·2H₂O)</option>
                        <option value="hemihydrate">Hemihydrate (CaSO₄·½H₂O)</option>
                        <option value="anhydrite">Anhydrite (CaSO₄)</option>
                    </select>
                </div>
                 <div class="input-group">
                    <label for="simAdjustComponent">Component to Adjust for Gypsum</label>
                    <select id="simAdjustComponent"></select>
                </div>
                <button class="calculate-btn" onclick="calculateFreeMix()">Simulate Mix</button>
            </div>
        </div>
        <div id="simulatorResults" class="info-box" style="margin-top: 20px;">
             <h4>Simulation Results</h4>
             <p>Complete all steps and click "Simulate Mix".</p>
        </div>
    `;
    openModal('calculatorModal', content);
    updateSimulatorOptions();
}

function updateSimulatorOptions() {
    const family = document.getElementById('simFamily').value;
    const typeDropdown = document.getElementById('simType');
    
    const typesInFamily = cementData.types.filter(t => t.family.startsWith(family));
    typeDropdown.innerHTML = typesInFamily.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    
    updateSimulatorComposition();
}

function updateSimulatorComposition() {
    const selectedTypeId = document.getElementById('simType').value;
    const selectedType = cementData.types.find(t => t.id === selectedTypeId);
    const strengthDropdown = document.getElementById('simStrength');
    
    if (!selectedType) return;

    // --- NEW LOGIC: Strength Class Constraints ---
    strengthDropdown.innerHTML = selectedType.available_strength_classes.map(sc => {
        const classData = cementData.strengthClasses[sc];
        return Object.keys(classData.variants).map(v => {
            const isCemThree = selectedType.family.startsWith('CEM III');
            // Disable 'L' variants for all non-CEM III types
            const isDisabled = v === 'L' && !isCemThree;
            return `<option value="${sc}-${v}" ${isDisabled ? 'disabled' : ''}>${sc} ${v} ${isDisabled ? ' (CEM III Only)' : ''}</option>`;
        }).join('');
    }).join('');

    const compositionDiv = document.getElementById('simCompositionInputs');
    const so3Div = document.getElementById('simSo3Inputs');
    const adjustDropdown = document.getElementById('simAdjustComponent');

    let compositionHTML = '';
    let so3HTML = '';
    let adjustOptionsHTML = '';

    const allConstituents = ['clinker', 'slag', 'silicaFume', 'pozzolan', 'flyAsh', 'burntShale', 'limestone', 'minor'];
    
    allConstituents.forEach(key => {
        const componentName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        const defaultValue = selectedType.composition[key] || 0;
        
        // --- NEW LOGIC: Dynamic Input Locking ---
        const isAllowed = key in selectedType.composition;

        compositionHTML += `
            <div class="input-group">
                <label for="comp-${key}">${componentName} (%)</label>
                <input type="number" id="comp-${key}" value="${defaultValue}" oninput="validateCompositionTotal()" ${!isAllowed ? 'disabled' : ''}>
            </div>`;
        
        so3HTML += `
            <div class="input-group">
                <label for="so3-${key}">SO₃ in ${componentName} (%)</label>
                <input type="number" id="so3-${key}" value="0.5" step="0.01" ${!isAllowed ? 'disabled' : ''}>
            </div>`;
        
        if(isAllowed) {
            adjustOptionsHTML += `<option value="${key}">${componentName}</option>`;
        }
    });

    compositionDiv.innerHTML = compositionHTML;
    so3Div.innerHTML = so3HTML;
    adjustDropdown.innerHTML = adjustOptionsHTML;
    adjustDropdown.value = 'clinker'; 
    validateCompositionTotal();
}


function validateCompositionTotal() {
    const totalDiv = document.getElementById('compositionTotal');
    const inputs = document.querySelectorAll('#simCompositionInputs input');
    let total = 0;
    inputs.forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    totalDiv.textContent = `Total: ${total.toFixed(2)}%`;
    totalDiv.style.color = Math.abs(total - 100) > 0.01 ? 'red' : 'green';
}

function calculateFreeMix() {
    const resultsDiv = document.getElementById('simulatorResults');
    const selectedTypeId = document.getElementById('simType').value;
    const selectedType = cementData.types.find(t => t.id === selectedTypeId);

    // --- VALIDATION LOGIC ---
    const warnings = [];
    const nucleusComposition = {};
    let nucleusTotal = 0;
    document.querySelectorAll('#simCompositionInputs input').forEach(input => {
        if (!input.disabled) {
            const key = input.id.split('-')[1];
            const value = parseFloat(input.value) || 0;
            if (value >= 0) {
                nucleusComposition[key] = value;
                nucleusTotal += value;
            }
        }
    });

    if (Math.abs(nucleusTotal - 100) > 0.01) {
        resultsDiv.innerHTML = `<h4>Error</h4><p class="warning-text">Nucleus composition must total 100%.</p>`;
        return;
    }

    // --- Simplified Top-Level Warning ---
    const clinkerRange = selectedType.clinker.replace('%', '').split('-').map(Number);
    const minClinker = clinkerRange[0];
    const maxClinker = clinkerRange[1];
    const userClinker = nucleusComposition.clinker;

    if (userClinker < minClinker || userClinker > maxClinker) {
        warnings.push(`<strong>Clinker Nucleus:</strong> ${userClinker}% is outside the standard range of ${selectedType.clinker}.`);
    }

    // --- CORE CALCULATION ---
    const targetSo3 = parseFloat(document.getElementById('simTargetSo3').value);
    const gypsumPurity = parseFloat(document.getElementById('simGypsumPurity').value) / 100;
    const gypsumType = document.getElementById('simGypsumType').value;

    let so3FromNucleus = 0;
    for (const key in nucleusComposition) {
        const so3Input = document.getElementById(`so3-${key}`);
        if(so3Input && !so3Input.disabled){
            so3FromNucleus += (parseFloat(so3Input.value) / 100) * nucleusComposition[key];
        }
    }

    const mw = cementData.molecularWeights;
    const so3InPureGypsum = (mw.SO3 / mw[gypsumType]) * 100;
    const so3InActualGypsum = so3InPureGypsum * gypsumPurity;
    
    if (so3InActualGypsum <= so3FromNucleus) {
         resultsDiv.innerHTML = `<h4>Calculation Error</h4><p class="warning-text">Gypsum SO₃ (${so3InActualGypsum.toFixed(2)}%) is not higher than Nucleus SO₃ (${so3FromNucleus.toFixed(2)}%). Cannot achieve target.</p>`;
        return;
    }
    
    const requiredGypsumPercent = ((targetSo3 - so3FromNucleus) / (so3InActualGypsum - so3FromNucleus)) * 100;

    const nucleusPercentage = 100 - requiredGypsumPercent;
    const finalComposition = {};
    for (const key in nucleusComposition) {
        if(nucleusComposition[key] > 0) {
            finalComposition[key] = nucleusComposition[key] * (nucleusPercentage / 100);
        }
    }
    
    // --- DYNAMIC RESULTS HTML ---
    let warningsHTML = '';
    if (warnings.length > 0) {
        warningsHTML = `<div class="warning-box">
            <h4><i class="fas fa-exclamation-triangle"></i> Standard Deviation Warning</h4>
            <ul>${warnings.map(w => `<li>${w}</li>`).join('')}</ul>
        </div>`;
    }

    let resultsHTML = `
        ${warningsHTML}
        <h4>Simulation Results</h4>
        <p>To achieve a target of <strong>${targetSo3}% SO₃</strong>:</p>
        <p><strong>Required Gypsum: ${requiredGypsumPercent.toFixed(2)}%</strong></p>
        <hr>
        <h4>Final Cement Composition:</h4>
    `;
    let finalTotal = requiredGypsumPercent;
    for (const key in finalComposition) {
        resultsHTML += `<div class="result-line"><p><strong>${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> ${finalComposition[key].toFixed(2)}%</p>`;
        
        // --- NEW: Deviation Annotation Logic is now here ---
        if (key === 'clinker') {
            if (userClinker < minClinker || userClinker > maxClinker) {
                let deviation = 0;
                let deviationText = '';
                if (userClinker < minClinker) {
                    deviation = minClinker - userClinker;
                    deviationText = `(Below minimum by ${deviation.toFixed(2)}%)`;
                } else {
                    deviation = userClinker - maxClinker;
                    deviationText = `(Above maximum by ${deviation.toFixed(2)}%)`;
                }
                resultsHTML += `<span class="compliance-sigil-fail">✗ Warning</span> <span class="warning-detail-inline">${deviationText}</span>`;
            } else {
                 resultsHTML += `<span class="compliance-sigil">✓ Compliant</span>`;
            }
        }
        resultsHTML += `</div>`;
        finalTotal += finalComposition[key];
    }
    resultsHTML += `<hr><p><strong>Total: ${finalTotal.toFixed(2)}%</strong></p>`;
    
    resultsDiv.innerHTML = resultsHTML;
}
