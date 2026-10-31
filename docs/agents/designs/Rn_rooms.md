# Radon's picture rooms: a design for each of the seven pictures

Branch: the radon boards branch (stories in `src/content/boards/Rn.js`, pictures in `public/boards/Rn/`,
drawn by `tools/boards/Rn/`; look at them with `py -3.11 tools/boards/lib/render.py Rn`). Every room is the
picture made into a place: the same things, the same colours. The rules for every station (adding-a-wing.md,
"Look and feel"): each step is a tap on the thing it is about, a smooth quantity is a slider in the panel,
the prompt names the next tap, the panel's buttons do the same steps. `room.js` gives every room its frame
back to the hall, the easel with the story, and radon's Atomling.

What none of the seven may repeat:
- The noble gases' neon sign workshop (`/e/Rn/signs`): radon's lead box with the Geiger counter that clicks,
  the spectroscope with radon's lines, the atom's energy ladder, the balloons that float or sink (so no
  "radon sinks" balloon), the history board (1898, 1910, today), the filling bench.
- The Atom Forge (`/forge`): it already decays U-238 nucleus by nucleus to lead. No room steps through the
  chain nucleus by nucleus.
- The 26 built rooms (picture-rooms.md, "Built"), in particular: carbon's `clock` (an hourglass of decaying
  atoms with a time slider, a trench with finds), oxygen's `magnet` (a cold lab making liquid air), hydrogen's
  `airship` (gases weighed per cubic metre on spring scales), sodium's `davy`, hydrogen's `cavendish` and
  oxygen's `fire` (old laboratories: keep the two radon labs looking unlike them), silicon's `earth` (the
  Moon at true size, its rocks), sodium's `kitchen` and silicon's `silicone` (kitchens).
- The tone: calm. Radon is something people measure and keep low; say what they do. Never a scary alarm.

The teal motes: radon atoms everywhere are the pictures' teal balls with a soft halo (`#3cc3d6`, halo
`#6ff0ff`), so the seven rooms read as one family.

---

## glow

**Title:** "Can a frozen gas glow by itself?" · **Picture:** `public/boards/Rn/glow.svg` (drawn by
`tools/boards/Rn/glow.py`) · **Wing link:** the board points to `signs`.

**The place: inside Gray and Ramsay's capillary, 1909 (a new stage, `capillary.js`).** You are shrunk to the
size of the radon drop and stand on a walkway inside the glass capillary of the picture's close-up: a glass
tunnel about 3 m across, its walls thick and faintly green-blue at the edges, ending at one side in the
rounded tip and at the other in the silver wall of the mercury thread (a giant shining piston). Outside the
glass: the liquid air of the vacuum flask, a cold blue with slow bubbles rising, and above, through the
flask's mouth, the brass objective of the microscope like a round skylight with the lab's lamplight in it.
Cold mist creeps along the glass. The frame back to the hall stands at the mercury end. A new stage file, so
a later room (krypton or xenon frozen, say) can reuse it.

**Station 1, the cold (the heart of the room).** At the tip lies the radon, at first a haze of teal motes.
- Tap the tap of the cold bath (a brass valve on the flask outside the glass) or use the **temperature
  slider** (+20 °C down to −190 °C). The motes slow; at −62 °C they gather into a drop at the tip, clear like
  water; the glass round it starts to glow (station 2's colour). At −71 °C it turns opaque and solid and
  shines "like a small, steel-blue arc-light"; colder it turns yellow; in liquid air (about −190 °C) it is
  brilliant orange-red. Warming back runs the colours in reverse, and the red goes out sharply at −118 °C.
- A thermometer column beside the tip shows the temperature; marks at −62 and −71 light as they are passed.
- Scientist: the drop is about 0.00025 mm³ in a capillary about 1/20 mm across; the vapour pressure on a
  small dial as it cools (from the paper's table; below 500 mm of mercury it is solid).
- Facts (Gray and Ramsay, J. Chem. Soc. 95, 1073, 1909, read in the original): liquid colourless and
  transparent "like water"; it makes the glass phosphoresce; solid: steel-blue, then yellow, then orange-red
  in liquid air; reverse on warming; the red disappears "pretty sharply at −118°"; melts at −71 °C; boils at
  −62 °C (today −61.7 °C, −71 °C; `elements.json`: melt 202 K, boil 211.45 K). The light comes from radon's
  own radioactivity (its alpha particles and its short-lived daughters).

**Station 2, three glasses.** Behind the tip the tunnel passes three bands of different glass, each with a
small plaque of its colour (no words needed): silica, lead-potash glass, soda glass.
- Tap a band and the mercury piston pushes the liquid drop into it (the slider must be between −62 and
  −71 °C, or the Atomling says the drop must be liquid first): the glass round it glows blue (silica), bluish
  green (lead-potash), lilac (soda glass). In soda glass under strong pressure (a second tap on the piston) it
  becomes "at once blue and pink", like a cyanogen flame.
- The point, at both depths: the clear liquid itself is not coloured; its radiation makes the glass glow.
- Facts: the same paper ("in silica, it is blue; in lead-potash glass, bluish-green; and in soda-glass,
  lilac; when compressed strongly in soda-glass, the colour reminds one of the cyanogen flame, at once blue
  and pink").

**Station 3, the weighing (1910 and 1911).** At the far end, outside the glass, the beam of their
microbalance: a giant quartz beam on a knife edge with a tiny bulb at one end and a counterweight at the other.
- Tap the bulb to fill it with the radon (or with air, a second button): the beam tips. A **rider slider**
  moves a small weight along the beam until it balances; the scale reads the mass in millionths of a milligram.
- Five tries (their samples I to V: about 564 to 722 millionths of a milligram) each give an atomic weight a
  little different; a board averages them: about 220 in 1910, 223 in 1911, today 222. Explorer: "the
  heaviest gas: a bubble of radon weighs more than seven times a bubble of air" (9.73 g/L against 1.29 at
  0 °C, from `elements.json`'s density).
- Not hydrogen's spring scales of whole cubic metres: here the thing is how tiny the sample was.
- Facts to check: the sample masses and volumes (Giunta's teaching notes reproduce their table,
  web.lemoyne.edu/giunta/classicalcs/ramsay.html); the balance's sensitivity (sources differ: "half a
  millionth of a milligram", "two-millionths of a milligram"; say "a few millionths of a milligram" or check
  Whytlaw-Gray and Ramsay, Proc. R. Soc. A 84, 1911).

**The Atomling's line on leaving:** radon never goes into a neon sign (and why): a pointer to the workshop,
not its contents.

---

## cellar

**Title:** "Why do people air their cellars?" · **Picture:** `public/boards/Rn/cellar.svg` (`cellar.py`)

**The place: a granite house in the Beira at night, in winter (a new stage, `stonehouse.js`).** Thick granite
walls, a wooden floor, a lit lamp over a table, a sideboard, a window with green shutters, stairs down to a
cellar with barrels and a shelf of jars. One wall of the house is cut away like a doll's house so you see
the cellar under the floor and, below it, the soil and the pink-grey granite with its grains. Outside: a dark
hillside, a crescent moon, frost. The frame back to the hall at the top of the stairs or by the front door.
Warm, cosy, never spooky: this is a home where people are doing the right thing.

**Station 1, the house breathes.** Teal motes rise slowly out of the granite in the cut-away, through the soil.
- An **outside temperature slider** (a frosty night to a mild day) or tap the stove: the warmer inside is than
  outside, the more warm air rises and leaks out at the roof (soft orange arrows at the eaves), and the house
  draws soil air in at the floor's cracks (motes slip in at three cracks in the cellar slab, as in the
  picture). A small electronic monitor on the sideboard shows the level in Bq/m³ (a number climbing slowly).
- Tap the window: it opens, outside air comes in, the number falls. Tap the kitchen's extractor fan: the
  house is sucked a little more, more soil air comes in at the floor, the number rises (true, and a surprise
  worth having). Tap the cellar door: shut, less of the cellar's air comes up.
- Say in the panel what the story says: it is not radon's weight but the house pulling soil air in through
  the floor (a few pascals) that fills cellars and ground floors.
- Facts: outdoors about 10 Bq/m³ (`src/content/Rn.js`, `found`); stack effect, wind and extractor fans as the
  drivers (LBL "Models of Radon Entry", Gadgil; US EPA mitigation papers). Numbers on the monitor are
  illustrative: say so in the Scientist panel.

**Station 2, the detector kit.** The little round detector on the sideboard from the picture.
- Tap it: it opens like a box and shows the chip of clear plastic inside; a lens shows alpha particles from
  radon in the air striking it, each leaving an invisible damage trail. A **months slider** (0 to 3 months,
  ideally across the heating season) collects tracks.
- Tap the envelope beside it to send it to the lab: the scene's lens becomes the lab's microscope view: the
  chip in hot sodium hydroxide, the trails etched into pits; tap to count them; the count becomes the house's
  average in Bq/m³, set on a scale with the 300 line (Portugal's reference level for homes and workplaces)
  and the 100 line (the WHO's advice where possible).
- Facts: alpha-track detectors (CR-39), about three months; etching in hot NaOH; Decreto-Lei 108/2018 (from
  Directive 2013/59/Euratom): 300 Bq/m³ annual average; WHO Handbook on Indoor Radon (2009): 100, and no more
  than 300 where 100 cannot be reached.

**Station 3, the fix.** In the cellar.
- Tap each crack in the slab to seal it (a trowel line of sealant): the inflow drops somewhat.
- Tap the fan on the pipe outside (as in the picture): a small fan lowers the pressure under the slab, the
  motes now go down into the sump, up the pipe and out above the roof; the monitor's number falls far down.
  Tap the window again: airing alone also works, and costs nothing.
- The Atomling ends calmly: measured, fixed, the family sleeps easy.
- Facts: sub-slab depressurisation can reduce radon by up to 99% (US EPA); sealing alone helps less.

Not the workshop's Geiger counter (here: a passive detector and a home monitor), not the kitchens of
silicon and sodium.

---

## rock

**Title:** "How does a rock breathe out a gas?" · **Picture:** `public/boards/Rn/rock.svg` (`rock.py`)

**The place: a granite hillside of the Serra da Estrela at dusk, and inside its grains.** Rounded granite
boulders and tors on heather and short grass, a pink sky, the picture's big boulder cut open showing its
grains. Reuse `night.js` (a hilltop with a valley below) dressed with boulders, or a new `tors.js`. The
stations are giant models standing among the boulders, as silicon's `earth` set a giant Earth on its deck.

**Station 1, the grain (the picture's close-up, room-sized).** Two crystal grains as tall as a person, pink
feldspar below, grey quartz above, a narrow pore between them, the atoms of each crystal as faint rows of
dots; a blue film of water clings to the lower grain's surface.
- A radium atom sits in the feldspar near its surface. Tap it: it breaks apart; the alpha particle flies
  deep into the grain (a long dotted track), and the new radon atom recoils the other way.
- A **depth slider** (how deep under the surface the radium was, 0 to about 100 nm): born shallow, the
  radon leaves the grain; born deep, it stops inside its own crystal.
- A **water slider** (dry pore to wet pore): in a dry pore the recoiling radon often crosses the gap and
  buries itself in the quartz opposite; with a water film, the water stops it in the pore, free to wander.
- A tally board counts escapes out of 20 tries: the emanation coefficient, "a few percent to over half"
  depending on grains and dampness.
- Facts: recoil range of Rn-222 a few tens of nanometres in minerals ("a few hundreds of ångström"); pore
  water absorbs the recoil (MDPI Soil Systems 2018 review "Deciphering and Predicting Microscale Controls on
  Radon Production"; Sun and Furbish). Keep numbers round and say "about".

**Station 2, the soil column.** A glass column two storeys high, full of soil, standing beside the cut
boulder; the boulder's crack feeds it from below.
- Tap a level of the column (or a **depth slider**, 0 to 3 m) to release radon born there: motes wander up
  at random; each one has its own random wait before it decays (3.8 days, sped up), turning into a small
  amber dot where it stops.
- Tap the rain cloud above: the soil turns wet, the motes wander far more slowly and fewer reach the top.
- The board shows how many of each release reach the air: from the top metre most, from 3 m few: "most of
  the radon in the air comes from the top metre or two of soil".
- Facts: diffusion length of radon in soil about 1 to 2 m (L = √(D/λ), D about 2e-6 to 1e-5 m²/s,
  λ = 2.1e-6 /s); in water a few centimetres. Mark the figures as approximate.

**Station 3 (optional), the family photo.** On the boulder, the picture's staircase of the uranium family
carved as 15 small niches, each with its atom; radon's niche empty and its atom floating above it. No
stepping through the decays (the Atom Forge does that): a tap on any niche says who it is and whether it is
a solid or the one gas ("every other member is a solid"), and a sign points to the Atom Forge for watching
the whole chain.

Not the Forge's decays, not carbon's clock (no hourglass, no time slider of a decay curve).

---

## draught

**Title:** "Why did a door spoil the experiment?" · **Picture:** `public/boards/Rn/draught.svg`
(`draught.py`)

**The place: Rutherford's laboratory at McGill, Montreal, a winter night in 1899 (a new stage,
`mcgill.js`).** The Macdonald Physics Building: tall arched windows onto snowy roofs and a church spire, dark
wood panelling, a hanging electric lamp with a green shade, a pendulum clock, long benches of brass
instruments, and at the far end a tall door to a cold corridor. It must not look like the Royal Institution's
candlelit basement (`davy`), Cavendish's Georgian room or Lavoisier's daylit laboratory: this one is
electric, wintry and blue outside.

**Station 1, Owens's puzzle.** The picture's apparatus: two brass plates on black posts, a dish of white
thorium oxide on the lower one, a wire to an electrometer whose needle swings on a dial.
- Tap the door at the far end: it swings open, a cold draught swirls across the room (snowflakes in it),
  the teal gas between the plates is blown out sideways and the needle drops and wobbles. Tap again to close
  it: the needle steadies. A **draught slider** (the window's gap) gives the same in between.
- Tap the lid (a closed box over the plates): with the box shut the reading stays steady whatever the door
  does.
- Facts: Owens, Phil. Mag. October 1899; Rutherford, Phil. Mag. 49, 1 (January 1900): "The movement of the
  air caused by the opening or closing of a door at the end of the room..."; "in a closed vessel ... the
  intensity is found to be practically constant".

**Station 2, Rutherford's tube.** A long brass tube with insulated electrodes along it; a bellows at one
end blows air over a box of thorium oxide, through a plug of cotton wool, into the tube.
- Tap the bellows: the teal emanation passes the cotton wool (so it is not dust) and the electrodes light
  their small meters down the tube. Tap the bellows' stop (or the clock): a stopwatch starts and the meters
  fall: half in about a minute, a quarter in two, an eighth in three. Each minute a point appears on a
  chalkboard; the points draw the decay curve.
- Scientist: the real half-life of thoron (Rn-220) is 55.6 s; Rutherford's "about one minute"; the idea of a
  half-life starts here.
- Unlike carbon's `clock` (an hourglass of atoms in a time slider): here the curve is measured by hand, in
  real time, a point a minute (or sped up with a button).
- Facts: "The emanation passes through a plug of cotton-wool without any loss of its radioactive powers";
  "The current reaches half its value about one minute after the current of air has stopped" (Rutherford
  1900; the text is on chemteam.info).

**Station 3, cold catches it (1903), and a parcel from Halle (1900).**
- A U-shaped glass tube dips into a flask of liquid air. Tap the bellows again: the emanation enters the cold
  U-tube and stays there (the tube beyond reads nothing); tap the flask away (the tube warms) and the gas
  comes out again. Rutherford and Soddy, 1903: the emanation condenses like a gas.
- Beside it, a parcel from Halle with a tiny tube of radium (Dorn, 1900): tap it to do station 2 with radium's
  emanation: its meters fall so slowly that a **days slider** (0 to 20 days) is needed: half in 3.8 days.
  This is the radon of the hall.
- Facts: Rutherford and Soddy, "Condensation of the radioactive emanations", Phil. Mag. 1903; Dorn 1900
  (Abh. Naturforsch. Ges. Halle); Rn-222 3.8215 days (`elements.json`).

---

## moon

**Title:** "Does the Moon breathe out a gas?" · **Picture:** `public/boards/Rn/moon.svg` (`moon.py`)

**The place: the rim of the crater Aristarchus on the Moon (a new stage, `lunar.js`).** Grey regolith with
footprints and small craters, the bright crater bowl below with its central peak, long black shadows from a
low Sun, the Earth hanging in a black sky full of stars, no air (nothing moves unless something hops). Not
silicon's `earth` deck (a model Moon in space) and not sodium's mountaintop: you are standing on the Moon.

**Station 1, the vent.** A crack in the crater floor near the rim path.
- Tap it: radon atoms come out and hop away in long ballistic arcs (no air to carry or stop them), landing,
  hopping again, until each, after its own random wait (3.8 days, sped up), decays where it lies, leaving a
  small amber dot that stays.
- An **air slider** ("Moon" to "Earth"): with air the same atoms drift and mix in a breeze and spread thin;
  without, they hop. Explorer: why the Moon's radon stays near where it came out.
- Facts: ballistic migration on an airless body; daughters stick where they land (Gorenstein et al.; the
  arXiv reviews by Crotts, "Lunar outgassing, transient phenomena", 2007 to 2009).

**Station 2, the orbiter.** Apollo 15's command and service module on a tall pedestal (or passing slowly
overhead on a track), its instrument bay open, the alpha-particle spectrometer's gold box in it.
- Tap the spectrometer: a cone of light sweeps the crater; a map screen beside it fills in, pixel by pixel,
  where alpha particles come from: bright over Aristarchus (radon now) and along the edges of the dark seas
  (polonium-210, radon from the last decades).
- A **years slider** (0 to 100 years after a puff of gas): the radon fades within days, the polonium-210
  (fed by lead-210, 22 years) glows for decades: why one tells "now" and the other "recently".
- Facts: Gorenstein and Bjorkholm, Science 179 (1973): Rn-222 over Aristarchus; Po-210 excess along maria
  edges (Gorenstein et al., The Moon, 1974); Pb-210 half-life 22.2 years; Rn-222 3.82 days.

**Station 3, Lunar Prospector (1998 to 1999).** A small drum-shaped probe with three booms, spinning on a
pedestal of its own.
- Tap it: it maps radon again near Aristarchus and Kepler (the map gains a second bright spot at Kepler).
  Scientist: Lawson et al., J. Geophys. Res. 110 (2005); the instrument was partly damaged at launch and the
  signals are faint: say "found signs".
- Optional: a glance at the Earth: the same gas seeps from granite at home (one line, pointing to the cellar
  room's picture, no repetition).

---

## quake

**Title:** "Can a gas warn of earthquakes?" · **Picture:** `public/boards/Rn/quake.svg` (`quake.py`)

**The place: a hillside village in Japan at dusk, beside a fault (reuse `dig.js`: open country at golden
hour with real pits).** A long trench cut across the fault, its walls showing the layers offset, as in the
picture; houses with tiled roofs on the slope; the mountains behind; a monitoring well with a small white hut
and an antenna. It shares the stage with carbon's `clock` but nothing else: no finds, no dating.

Said as research throughout: what scientists test, never a way to predict. The Atomling's lines stay calm:
earthquakes cannot be predicted yet; buildings, drills and maps are how people stay safe.

**Station 1, the fault model.** Beside the trench, a giant cut-away block model of two blocks of layered rock
along a sloping fault.
- A **push slider** (or tap the big red arrows): the blocks press harder; small cracks open near the fault
  (glints), more teal motes leak up the fault and into the soil; past the limit the blocks slip with a jolt
  (a short shake of the view), the cracks close, the leak falls back.
- The panel says it is the idea being tested: rising stress may open microcracks and change how gas and
  water move.
- Facts: Igarashi et al. 1995 and the literature on radon precursors (keep to the mechanism as a hypothesis).

**Station 2, the well's record.** Tap the hut: a screen with the radon in the well's water, month by month.
- A **month slider** from October 1994 to February 1995 draws the Kobe record: about four times higher by
  late December, a peak of more than ten times on 8 January 1995, falling again, then the earthquake on
  17 January (a jagged trace).
- Then three more records, each a tap on a folder: a radon rise after heavy rain (no quake), a quake with no
  radon change, a rise that came and went with air pressure. The Atomling: "So one well cannot tell you; that
  is why scientists keep measuring and comparing."
- Facts: Igarashi et al., Science 269, 60 (1995): a well at Nishinomiya, about 30 km from the epicentre;
  Mw 6.9. The three other records are illustrative: say so in the Scientist panel.

**Station 3, finding the fault.** A soil-gas probe (a steel spike with a small meter) by the trench.
- Tap a marked spot along a line across the field (or a **position slider**): the probe goes into the
  ground and reads the soil gas; over the fault zone the reading is higher. After five spots a little map
  shows the fault's hidden line: a real use, mapping faults by their radon.
- Facts: soil-gas radon surveys for mapping faults and in uranium exploration (`src/content/Rn.js`, `uses`).

---

## cave

**Title:** "Do caves breathe in and out?" · **Picture:** `public/boards/Rn/cave.svg` (`cave.py`)

**The place: a limestone show cave on a winter night (a new stage, `showcave.js`).** A big chamber with
stalactites and stalagmites, a still pool, a path with low lamps leading in from a lower entrance (snow and
spruces outside it), and a narrow passage climbing to an opening high on the slope. A guide with a helmet lamp
and a small radon monitor with a green light on the wall, as in the picture. Not oxygen's bathhouse or the
arctic camp: inside the rock, lamplit, dripping.

**Station 1, the breath.** By the monitor.
- An **outside temperature slider** (−10 °C to +30 °C; the cave stays about 10 °C) or tap the season sign at
  the entrance (winter, summer): in winter, cave air rises up the passage and out of the top opening (steam
  in the frost), cold air pours in at the bottom, and the monitor reads low; in summer the flow turns: the
  cave's cold, heavy air slides out of the lower entrance, the cave hardly airs, and the reading climbs.
- Tap the guide's smoke puffer to see the draught (a ribbon of smoke bends one way or the other).
- The monitor's two marks: about 200 Bq/m³ in winter, about 3000 in summer (Postojna).
- Facts: Gregorič et al., Nat. Hazards Earth Syst. Sci. 11, 1523 (2011): Postojna, continuous 2005 to 2009,
  about 200 winter, about 3000 summer, highest in early autumn; some caves show the reverse pattern or none.

**Station 2, the doors.** Show caves fit doors to their entrances.
- Tap the door at the top of the passage and the gate at the lower entrance (each opens or closes): with the
  summer slider set, closing the top cuts the warm outside air drawn in through the rock; the monitor's
  number follows. Explorer: people can steer how a cave breathes.
- Facts: passive control of summer ventilation as a way to lower cave radon (the Postojna paper's discussion;
  Baker, Cave radon exposure, dose, dynamics and mitigation, J. Cave Karst Stud.). Keep the effect
  qualitative.

**Station 3, the guide's day.** Tap the guide: his badge (a small dosimeter), and a planning board.
- An **hours slider** (hours underground in a week): the board shows his yearly dose against the limit, the
  planner keeps it well within it; a visitor's hour-and-a-half tour is a sliver of a bar. Calm: guides work
  here safely because it is measured and planned.
- Facts to check before numbers appear: the dose conversion used (UNSCEAR or ICRP 137 dose coefficients for
  radon in workplaces), the EU worker limit (20 mSv per year, Directive 2013/59/Euratom) and the 300 Bq/m³
  workplace reference level. If in doubt, show the bars without mSv.
- One Scientist line, carefully: some spas (the Gastein healing gallery, an old mine tunnel) still offer radon
  treatments; for everyday air the advice is to keep radon as low as reasonably possible.
