// Starter products, seeded into the database once on first boot (see seed.js).
// They began as the static sample listings on the website and are ordinary products
// now: edit or delete them in the admin. Deleted ones are not re-created.
// Images are paths under omegason-energy/public/products.

export const sampleProducts = [
  {
    "slug": "monocrystalline-solar-panel",
    "name": "Monocrystalline solar panel",
    "categoryId": "panels",
    "summary": "Black-cell module for rooftops where space is tight.",
    "descriptionHtml": "<p>A sample monocrystalline module with a dark cell surface and a silver frame. Use it to show how a single panel looks in the catalogue. Replace the rating and warranty with the module you actually stock.</p><h3>Key features</h3><ul><li>High output from a compact footprint</li><li>Suitable for rooftop mounting</li><li>Works with standard string inverters</li></ul>",
    "specificationsHtml": "<ul><li><strong>Rated power:</strong> 450 W (sample)</li><li><strong>Cell type:</strong> Monocrystalline</li><li><strong>Frame:</strong> Anodised aluminium</li></ul>",
    "price": 185000,
    "image": "/products/px-9875441.jpg",
    "featured": true
  },
  {
    "slug": "polycrystalline-solar-panel",
    "name": "Polycrystalline solar panel",
    "categoryId": "panels",
    "summary": "Blue-cell module for larger roofs and ground arrays.",
    "descriptionHtml": "<p>A sample polycrystalline module, shown as a blue cell field. It is the everyday panel for sites where roof area is not the limit. Swap in your real wattage and datasheet before publishing.</p><h3>Key features</h3><ul><li>Lower cost per watt on large roofs</li><li>Proven cell technology</li><li>Pairs with the same mounting rails as mono modules</li></ul>",
    "specificationsHtml": "<ul><li><strong>Rated power:</strong> 330 W (sample)</li><li><strong>Cell type:</strong> Polycrystalline</li><li><strong>Use:</strong> Roof and ground mount</li></ul>",
    "price": 98000,
    "image": "/products/px-356049.jpg",
    "featured": false
  },
  {
    "slug": "rooftop-solar-module",
    "name": "Rooftop solar module",
    "categoryId": "panels",
    "summary": "A single framed panel sized for tile and sheet roofs.",
    "descriptionHtml": "<p>A sample rooftop module photographed on clay tiles. It stands in for the panel you would specify for a house or small shop. Confirm flashings and roof structure on site.</p><h3>Key features</h3><ul><li>Framed for standard roof hooks</li><li>Works on tile and long-span sheet</li><li>Sized for a typical household string</li></ul>",
    "specificationsHtml": "<ul><li><strong>Rated power:</strong> 400 W (sample)</li><li><strong>Mounting:</strong> Pitched roof</li><li><strong>Cells:</strong> Monocrystalline</li></ul>",
    "price": 165000,
    "image": "/products/px-9875440.jpg",
    "featured": false
  },
  {
    "slug": "rooftop-array-panel",
    "name": "Rooftop array panel",
    "categoryId": "panels",
    "summary": "Modules laid out as a residential roof array.",
    "descriptionHtml": "<p>A sample of how several modules sit together on a pitched roof. The listing is for the panel itself; installation is quoted separately.</p><h3>Key features</h3><ul><li>Designed to tile across a roof face</li><li>Rail-mounted</li><li>Room for a walkway at the ridge</li></ul>",
    "specificationsHtml": "<ul><li><strong>Rated power:</strong> 410 W (sample)</li><li><strong>Layout:</strong> Portrait on rails</li><li><strong>Roof type:</strong> Pitched</li></ul>",
    "price": 172000,
    "image": "/products/panel-array.jpg",
    "featured": false
  },
  {
    "slug": "flat-roof-solar-array",
    "name": "Flat-roof solar array",
    "categoryId": "panels",
    "summary": "Tilted modules for a flat concrete roof.",
    "descriptionHtml": "<p>A sample four-module array on a flat roof, tilted toward the sun on simple stands. Use it to show a small commercial or home roof where the surface itself is level.</p><h3>Key features</h3><ul><li>No roof penetration in the sample layout</li><li>Tilt set for better yield</li><li>Easy to expand by another row</li></ul>",
    "specificationsHtml": "<ul><li><strong>Array:</strong> 4 modules (sample)</li><li><strong>Mounting:</strong> Tilted stands</li><li><strong>Roof:</strong> Flat concrete</li></ul>",
    "price": 720000,
    "image": "/products/panel-syria.jpg",
    "featured": false
  },
  {
    "slug": "ground-mount-solar-array",
    "name": "Ground-mount solar array",
    "categoryId": "panels",
    "summary": "Rows of modules on posts, for open land.",
    "descriptionHtml": "<p>A sample ground-mounted array. It is the layout used when the roof is too small or too shaded and there is open ground beside the building.</p><h3>Key features</h3><ul><li>Keeps the roof clear</li><li>Easier to clean from the ground</li><li>Can grow row by row</li></ul>",
    "specificationsHtml": "<ul><li><strong>Mounting:</strong> Ground posts</li><li><strong>Layout:</strong> Single-axis rows</li><li><strong>Use:</strong> Farms, estates, yards</li></ul>",
    "price": 2400000,
    "image": "/products/panel-farm.jpg",
    "featured": false
  },
  {
    "slug": "hybrid-inverter",
    "name": "Hybrid solar inverter",
    "categoryId": "inverters",
    "summary": "Runs from solar, battery and grid in one unit.",
    "descriptionHtml": "<p>A sample hybrid inverter shown with a matching panel string. It is the kind of unit that switches between solar, battery and mains. Replace it with the model, kVA and warranty you sell.</p><h3>Key features</h3><ul><li>Automatic source switching</li><li>Battery and solar monitoring</li><li>Wall mounted</li></ul>",
    "specificationsHtml": "<ul><li><strong>Capacity:</strong> 5 kVA (sample)</li><li><strong>Inputs:</strong> Solar, battery, grid</li><li><strong>Output:</strong> Pure sine wave</li></ul>",
    "price": 890000,
    "image": "/products/inverter-edge.jpg",
    "featured": true
  },
  {
    "slug": "string-inverter",
    "name": "Wall-mounted string inverter",
    "categoryId": "inverters",
    "summary": "A string inverter fixed to the wall beside the cable run.",
    "descriptionHtml": "<p>A sample string inverter as it looks once installed, with DC and AC cables leaving the bottom of the case. It converts a rooftop string into mains power.</p><h3>Key features</h3><ul><li>Compact wall cabinet</li><li>Status readable at a glance</li><li>Cables exit through the base</li></ul>",
    "specificationsHtml": "<ul><li><strong>Capacity:</strong> 3 kW (sample)</li><li><strong>Mounting:</strong> Indoor wall</li><li><strong>Display:</strong> Front status screen</li></ul>",
    "price": 410000,
    "image": "/products/inverter-string.jpg",
    "featured": false
  },
  {
    "slug": "central-inverter",
    "name": "Commercial central inverter",
    "categoryId": "inverters",
    "summary": "A floor-standing inverter for a large array.",
    "descriptionHtml": "<p>A sample central inverter cabinet for a commercial or estate array. It sits beside the array rather than on a house wall, and it is sized for many strings at once.</p><h3>Key features</h3><ul><li>Serves a whole array from one cabinet</li><li>Lockable enclosure</li><li>Sited next to the mounting structure</li></ul>",
    "specificationsHtml": "<ul><li><strong>Form:</strong> Floor-standing cabinet</li><li><strong>Use:</strong> Commercial arrays</li><li><strong>Phases:</strong> Three-phase (sample)</li></ul>",
    "price": 4500000,
    "image": "/products/inverter-central.jpg",
    "featured": false
  },
  {
    "slug": "hybrid-inverter-assembly",
    "name": "Hybrid inverter assembly",
    "categoryId": "inverters",
    "summary": "The power stage inside a hybrid inverter.",
    "descriptionHtml": "<p>A sample hybrid inverter with the cover off, so the fans, magnetics and terminal block are visible. It is here to show the hardware behind the cabinet, not as a unit sold open.</p><h3>Key features</h3><ul><li>Shows the real power electronics</li><li>Terminals for solar, battery and AC</li><li>Fan-cooled</li></ul>",
    "specificationsHtml": "<ul><li><strong>Cooling:</strong> Internal fans</li><li><strong>Connections:</strong> Solar, battery, AC</li><li><strong>Service:</strong> Cover removed for the photo</li></ul>",
    "price": 950000,
    "image": "/products/inverter-hybrid.jpg",
    "featured": false
  },
  {
    "slug": "lithium-battery-bank",
    "name": "Wall lithium battery",
    "categoryId": "batteries",
    "summary": "Wall-mounted lithium storage for a home or shop.",
    "descriptionHtml": "<p>A sample wall battery, shown as stackable white cabinets. Daytime solar charges it; the house draws on it after sunset or during an outage. Capacity below is illustrative.</p><h3>Key features</h3><ul><li>Lives on the wall, not on the floor</li><li>Add cabinets as the load grows</li><li>Built-in status light</li></ul>",
    "specificationsHtml": "<ul><li><strong>Capacity:</strong> 5 kWh per cabinet (sample)</li><li><strong>Chemistry:</strong> Lithium</li><li><strong>Mounting:</strong> Wall, stackable</li></ul>",
    "price": 1450000,
    "image": "/products/battery-wall.jpg",
    "featured": true
  },
  {
    "slug": "lithium-battery-module",
    "name": "Lithium battery module",
    "categoryId": "batteries",
    "summary": "A boxed lithium module with a charge port.",
    "descriptionHtml": "<p>A sample lithium module in a steel case, with a charge connector on the face. It stands in for the block you would rack inside a larger bank.</p><h3>Key features</h3><ul><li>Closed steel case</li><li>Charge port on the front</li><li>Built to sit inside a cabinet</li></ul>",
    "specificationsHtml": "<ul><li><strong>Form:</strong> Cased module</li><li><strong>Chemistry:</strong> Lithium-ion</li><li><strong>Connection:</strong> Charge lead on the top</li></ul>",
    "price": 320000,
    "image": "/products/battery-pack.jpg",
    "featured": false
  },
  {
    "slug": "rack-battery-cabinet",
    "name": "Rack battery cabinet",
    "categoryId": "batteries",
    "summary": "Batteries and switchgear in one floor cabinet.",
    "descriptionHtml": "<p>A sample storage cabinet with battery blocks stacked under the inverter and breakers. It is the layout used when a shop or clinic needs more than a single wall unit.</p><h3>Key features</h3><ul><li>Everything in one locked cabinet</li><li>Room to add another battery block</li><li>Breakers accessible at the top</li></ul>",
    "specificationsHtml": "<ul><li><strong>Form:</strong> Floor cabinet</li><li><strong>Contents:</strong> Batteries, inverter, breakers</li><li><strong>Capacity:</strong> 10 kWh class (sample)</li></ul>",
    "price": 3200000,
    "image": "/products/battery-rack.jpg",
    "featured": false
  },
  {
    "slug": "gel-solar-battery",
    "name": "12 V gel battery",
    "categoryId": "batteries",
    "summary": "A sealed gel battery for lights and small systems.",
    "descriptionHtml": "<p>A sample 12-volt gel battery. It is the sealed block used in solar street lights, gate motors and other small loads, not a whole-home bank.</p><h3>Key features</h3><ul><li>Sealed, so it can sit indoors</li><li>Suited to lighting and small loads</li><li>Maintenance free</li></ul>",
    "specificationsHtml": "<ul><li><strong>Voltage:</strong> 12 V</li><li><strong>Type:</strong> Sealed gel</li><li><strong>Capacity:</strong> 15 Ah class (sample)</li></ul>",
    "price": 48000,
    "image": "/products/battery-gel.jpg",
    "featured": false
  },
  {
    "slug": "portable-power-station",
    "name": "Portable power station",
    "categoryId": "batteries",
    "summary": "A carry-out battery with USB and DC outlets.",
    "descriptionHtml": "<p>A sample portable power station. It charges from a panel or the wall, then runs phones, lights and small appliances from the ports on the back.</p><h3>Key features</h3><ul><li>No installation</li><li>USB for phones and routers</li><li>DC outlet for small appliances</li></ul>",
    "specificationsHtml": "<ul><li><strong>Outputs:</strong> USB and DC</li><li><strong>Form:</strong> Portable</li><li><strong>Charging:</strong> Solar or mains</li></ul>",
    "price": 195000,
    "image": "/products/battery-portable.jpg",
    "featured": false
  },
  {
    "slug": "solar-street-light",
    "name": "Solar street light",
    "categoryId": "lighting",
    "summary": "Pole light with its own panel and battery box.",
    "descriptionHtml": "<p>A sample solar street light: panel on top of the pole, battery box on the shaft, and a lamp head over the road. It charges by day and switches on at dusk without a grid connection.</p><h3>Key features</h3><ul><li>No grid connection</li><li>Dusk-to-dawn operation</li><li>Panel, battery and lamp in one assembly</li></ul>",
    "specificationsHtml": "<ul><li><strong>Mounting:</strong> Pole</li><li><strong>Panel:</strong> On the pole head</li><li><strong>Battery:</strong> Box on the pole</li></ul>",
    "price": 185000,
    "image": "/products/light-mammoth.jpg",
    "featured": true
  },
  {
    "slug": "solar-security-light",
    "name": "Solar security light",
    "categoryId": "lighting",
    "summary": "A pole light with a camera, for yards and car parks.",
    "descriptionHtml": "<p>A sample solar security light for a car park or compound entrance. The panel and lamp sit on the pole, with a camera on the same shaft.</p><h3>Key features</h3><ul><li>Lights the area without a trench to the grid</li><li>Camera can share the pole</li><li>Suited to entrances and parking rows</li></ul>",
    "specificationsHtml": "<ul><li><strong>Mounting:</strong> Pole</li><li><strong>Extras:</strong> Camera bracket</li><li><strong>Use:</strong> Yards and car parks</li></ul>",
    "price": 240000,
    "image": "/products/light-parking.jpg",
    "featured": false
  },
  {
    "slug": "solar-garden-light",
    "name": "Solar garden light",
    "categoryId": "lighting",
    "summary": "A small path light with the panel in the cap.",
    "descriptionHtml": "<p>A sample garden light. The solar cell is in the cap, so each stake charges itself and lights a path or flower bed after dark.</p><h3>Key features</h3><ul><li>No wiring between lights</li><li>Each unit charges itself</li><li>Low enough for paths and beds</li></ul>",
    "specificationsHtml": "<ul><li><strong>Mounting:</strong> Stake or short post</li><li><strong>Panel:</strong> Built into the cap</li><li><strong>Use:</strong> Paths and gardens</li></ul>",
    "price": 15000,
    "image": "/products/light-garden.jpg",
    "featured": false
  },
  {
    "slug": "solar-site-light",
    "name": "Solar site light tower",
    "categoryId": "lighting",
    "summary": "A mobile tower with panels and flood lamps.",
    "descriptionHtml": "<p>A sample trailer-mounted light tower. Panels on the deck charge the unit, and the lamp head rises over a road works or a yard that has no supply yet.</p><h3>Key features</h3><ul><li>Tow it to the job</li><li>No generator fuel for the lamps</li><li>Panels travel with the tower</li></ul>",
    "specificationsHtml": "<ul><li><strong>Form:</strong> Mobile tower</li><li><strong>Lamps:</strong> Flood heads</li><li><strong>Power:</strong> On-board solar</li></ul>",
    "price": 3800000,
    "image": "/products/px-9799708.jpg",
    "featured": false
  },
  {
    "slug": "home-solar-kit",
    "name": "Home solar kit",
    "categoryId": "kits",
    "summary": "Panels, inverter and battery sized for a household.",
    "descriptionHtml": "<p>A sample home kit, illustrated by rooftop arrays on houses. It bundles panels, a hybrid inverter and a battery so a household does not have to piece the system together.</p><h3>Key features</h3><ul><li>Sized to the appliances you list</li><li>One quote for the whole system</li><li>Roof layout agreed before work starts</li></ul>",
    "specificationsHtml": "<ul><li><strong>Includes:</strong> Panels, inverter, battery, cabling</li><li><strong>Suited to:</strong> A household</li><li><strong>Installation:</strong> Available</li></ul>",
    "price": 4500000,
    "image": "/products/px-9875682.jpg",
    "featured": false
  },
  {
    "slug": "business-solar-kit",
    "name": "Business solar kit",
    "categoryId": "kits",
    "summary": "A roof array for a workshop, warehouse or factory.",
    "descriptionHtml": "<p>A sample business kit, shown as modules across a large industrial roof. It is aimed at daytime loads such as freezers, pumps and workshop tools.</p><h3>Key features</h3><ul><li>Cuts generator hours in the day</li><li>Laid out around roof lights and plant</li><li>Can be extended later</li></ul>",
    "specificationsHtml": "<ul><li><strong>Includes:</strong> Panels, hybrid inverter, battery bank</li><li><strong>Suited to:</strong> Shops, workshops, warehouses</li><li><strong>Installation:</strong> Available</li></ul>",
    "price": 12500000,
    "image": "/products/panel-install.jpg",
    "featured": false
  },
  {
    "slug": "clinic-backup-kit",
    "name": "Clinic backup kit",
    "categoryId": "kits",
    "summary": "A roof system installed for a building that cannot go dark.",
    "descriptionHtml": "<p>A sample kit for a clinic, school or office that needs power when the grid drops. The photograph shows a crew fixing modules on a roof, which is how this kit is delivered.</p><h3>Key features</h3><ul><li>Keeps lights and a fridge running</li><li>Changeover without a scramble for fuel</li><li>Crew installs and hands over</li></ul>",
    "specificationsHtml": "<ul><li><strong>Includes:</strong> Panels, inverter, battery, changeover</li><li><strong>Suited to:</strong> Clinics and essential rooms</li><li><strong>Installation:</strong> By our crew</li></ul>",
    "price": 6800000,
    "image": "/products/px-8853536.jpg",
    "featured": false
  },
  {
    "slug": "estate-lighting-kit",
    "name": "Estate lighting kit",
    "categoryId": "kits",
    "summary": "Solar pole lights for a yard, estate or works site.",
    "descriptionHtml": "<p>A sample lighting kit for a compound or yard. Several solar pole lights cover the open ground, each with its own panel, so there is no cable back to a meter.</p><h3>Key features</h3><ul><li>Each pole stands alone</li><li>Lights the yard after dusk</li><li>No trench back to the building</li></ul>",
    "specificationsHtml": "<ul><li><strong>Includes:</strong> Pole lights with panels</li><li><strong>Suited to:</strong> Estates, yards, perimeters</li><li><strong>Grid:</strong> Not required</li></ul>",
    "price": 1600000,
    "image": "/products/light-perimeter.jpg",
    "featured": false
  },
  {
    "slug": "commercial-solar-kit",
    "name": "Commercial solar kit",
    "categoryId": "kits",
    "summary": "A ground array sized and checked for a larger site.",
    "descriptionHtml": "<p>A sample commercial kit: a ground array large enough for a business park or a farm, surveyed before it is built. The photograph shows that check on a finished array.</p><h3>Key features</h3><ul><li>Sized from your daytime load</li><li>Ground or roof, depending on the site</li><li>Handed over with a walkthrough</li></ul>",
    "specificationsHtml": "<ul><li><strong>Includes:</strong> Array, inverter, mounting, survey</li><li><strong>Suited to:</strong> Farms and commercial yards</li><li><strong>Installation:</strong> Surveyed and installed</li></ul>",
    "price": 18000000,
    "image": "/products/px-4254167.jpg",
    "featured": false
  }
]
