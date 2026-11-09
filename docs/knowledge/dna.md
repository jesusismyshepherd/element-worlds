# Building DNA (`/lab/dna`, 2026-11-09)

A bench of the Molecule Lab (`benches.md`): build a short strand of DNA letter by letter, watch each letter
bring its partner and the ladder twist into the double helix, then copy it. The studio's idea `rings-dna`
("Benzene, glucose and the four DNA bases; build a short strand of DNA"), marked Sooner by the user on
2026-11-09. Its other half lives in the lab itself: benzene, glucose and the four bases are molecules the
lab knows (below, "In the lab").

## What there is

- **The tray**: the four bases A, T, G, C, each its real molecule (ball and stick, its hydrogens, the
  double bonds of one Kekulé structure), turning gently on a disc of its letter's colour. The HUD keeps
  their places (`[data-dna-slot]`: a column on the left of a computer, a row at the bottom of an upright
  phone, a 2 x 2 grid on a phone on its side) and the world draws each molecule into its slot, its pairing
  edge turned towards the helix. The slot is a clear button over the molecule: a tap on the molecule adds it.
- **A tap adds a nucleotide** (base, deoxyribose, phosphate) to the 3' end of the strand: it flies from its
  slot, tumbling, to its place; its partner flies in from its own slot a moment later, and their hydrogen
  bonds click shut one by one (a rising pop each: two for A-T, three for G-C), drawn as glowing beads between
  the very atoms (donor hydrogen to acceptor: N6-H...O4 and N3-H...N1; N4-H...O6, N1-H...N3 and N2-H...O2).
- **The helix**: each new pair comes in level with the last (a rung) and twists into place, 34.3 degrees
  and 3.38 Å above it: the right-handed B-DNA helix, every atom where 3DNA's model puts it. The backbones
  glow as rails through the phosphorus atoms: the first strand gold, its partner blue. Each duplex turns
  slowly about its own axis. The two strands' letters stand in rows along the helix (5' and 3' ends for the
  Scientist), and the card at the top reads them too, with two or three dots between partners.
- **The twist slider** (ladder to helix): untwisted, the rungs spread out to a straight ladder; back at the
  helix they stack again (the twist is what lets the flat bases stack tightly).
- **The copy**: a tap on the helix (or the button) unzips it from the first pair: the fork runs along (a
  pair every 0.32 s), the old hydrogen bonds let go, each half moves to its own place, a new nucleotide flies
  from the tray to every exposed base and pairs with it. At the end two identical helices stand side by side,
  each one old strand (gold or blue) and one new (violet): semi-conservative replication. "Keep one" (or any
  new letter) sends the second copy floating away; the first carries on.
- **Finds** (`bench:dna:<id>`, `bases.js` FINDS): `at` (an A-T pair), `gc` (a G-C pair), `atg` (the start
  codon written), `turn` (11 pairs or more as a helix: a full turn is 10.5), `copy` (a copy finished). Each
  find: the passport's sound, the card's celebration, a burst of sparks in the letters' colours. As in the
  lab, everyone in a room who sees a find happen gets it.
- **The words** (`words.js`, four languages, two depths): the start, each pair (Explorer: "A and T click
  together with two hydrogen bonds"; Scientist: the bonds by atom and their length), undo, clear, the
  bench's limit (24 pairs, against 3.1 billion in one set of human chromosomes), the copy, the finds, seven
  "Did you know?" facts per depth, the Scientist's table of numbers and Chargaff's counts.
- **The verse** (Psalm 139:13-14, passage id `dna`, `scripture.md`): written in the sky's free corner, top
  left between the tray and the card on a computer, across the top under the card on an upright phone (a
  cover of its own then, so the helix keeps below it); not on a phone on its side (no room, as in the lab).
  A tap opens it.
- **In a room** (`net/shared.js`, part `bench`): `{ seq, twist, copy: { age } | null }`. One letter more or
  fewer, or none, plays as if done here (the flights, the pops); anything else is shown at once. A copy
  under way runs on by its age (a latecomer sees it as far as it has gone). Telemetry: `track('bench',
  { id: 'dna', op })` for add (with `b`), undo, clear, copy, keep and found.

## In the lab: rings (src/chem/build.js, layout.js, content/molecules.js)

- Benzene (C6H6), glucose (C6H12O6, its ring: a pyranose) and the four bases (adenine C5H5N5, thymine
  C5H6N2O2, guanine C5H5N5O, cytosine C4H5N3O) are known molecules (`KNOWN_LIST` with `ring: true`), with
  facts at both depths and six new missions (21 in all) each with its "show me" (`DEMOS` in `lab.js`, the
  same as `RING_BUILDS` in `build.js`; `build.test.js` checks they agree and that each builds its mission).
- A ring molecule is recognised by its **skeleton** once every hand is held (`skeleton`: the atoms'
  elements refined by their neighbours' round after round, sorted, bond orders ignored): either Kekulé ring
  of benzene is benzene, and the bases written with their double bonds elsewhere are still the bases. The
  bond pattern alone would not do: fulvene has benzene's formula and bond pattern (tested). The lab cannot
  see which way an OH points, so galactose or mannose built in the same ring would be called glucose.
- The layout (`layout.js`) learned rings: a molecule with rings starts from a flat drawing of itself
  (classical scaling of the graph's distances, then a stress layout), so its rings come out untangled; a
  ring closed by hand (one bond far too long) is laid out as a regular polygon first (on the edge it shares
  with a ring already in shape); a nitrogen whose lone pair joins a neighbouring double bond (amides, the
  bases' NH and NH2, urea) lends it (`extra[i]` lone pair with `pi: true`, standing across the plane,
  pushing nothing), so it is flat; across a bond between two flat atoms the neighbours keep one plane; a
  threefold twist term between tetrahedral atoms (one a carbon) keeps them staggered, which makes ethane
  staggered and glucose's ring a chair; a six-ring of tetrahedral atoms starts as a chair. `level` now
  also turns a flat molecule to face the default view (the shortest turn, so it does not spin).
- Tested (`layout.test.js`): benzene a flat hexagon, angles 120 degrees, hydrogens on the bisectors, facing
  the view, both from "show me" and built atom by atom with the ring closed by hand; glucose a chair; the
  four bases flat; ethane staggered.

## The science and its sources

- **Atoms**: 3DNA's standard B-DNA nucleotides, `config/atomic/BDNA_A|T|G|C.pdb` of x3dna-v2.4
  (github.com/x3dna-dssr/x3dna-v2.4; X.-J. Lu and W. K. Olson, Nucleic Acids Res. 31:5108, 2003), in the
  standard base reference frame of W. K. Olson et al., J. Mol. Biol. 313:229 (2001): base flat in z = 0,
  x towards the major groove, the partner by (x, y, z) -> (x, -y, -z). Hydrogens of the bases placed by us
  (in the plane, 1.08 Å from C, 1.01 Å from N); the backbone's left out, as in most drawings.
- **The helix**: 10.5 base pairs a turn in solution (J. C. Wang, PNAS 76:200, 1979), so 34.3 degrees a pair;
  rise 3.38 Å (Arnott's fibre B-DNA, the one 3DNA's nucleotides are made for). With these the O3'-P link
  between neighbours is 1.60 Å on both strands for all 16 neighbour pairs, heavy atoms of different pairs
  stay over 3 Å apart, the hydrogen bonds are 2.87 to 3.05 Å, C1'-C1' 10.6 Å, the phosphorus 9.4 Å from the
  axis (about 2 nm across), and the helix is right-handed (all in `bases.test.js`). Widths of the grooves
  (major about 2.2 nm, minor about 1.2 nm, phosphate to phosphate) and the 34.3 degrees, 10.5 and 2 nm from
  the table of B-DNA in Wikipedia's "Nucleic acid double helix" (its rise 3.32 Å: we say "about 0.34 nm").
- **Numbers in the words**: one set of human chromosomes about 3.1 billion bp (the complete sequence,
  T2T-CHM13: 3.055 billion; S. Nurk et al., Science 376:44, 2022), so about 1 m of DNA a set and 2 m a cell;
  G+C about 41% of human DNA (Lander et al., Nature 409:860, 2001), so A-T about 59%; people share about
  99.9% of their DNA letters (NHGRI); Chargaff's rule (E. Chargaff, Experientia 6:201, 1950); the double
  helix (Watson and Crick, Nature 171:737, 1953; Franklin and Gosling's Photo 51, Nature 171:740, 1953);
  semi-conservative replication (Meselson and Stahl, PNAS 44:671, 1958); about one error in a billion
  letters after proofreading and repair (T. A. Kunkel, J. Biol. Chem. 279:16895, 2004); ATG/AUG the start
  codon (methionine).
- **The lab's facts**: benzene C-C 139 pm, between 154 (single) and 134 pm (double), found by Faraday in
  1825, Kekulé's structure 1865; glucose over 99% a pyranose ring in water, a chair, 2803 kJ/mol on burning,
  about 4 g in an adult's blood (D. H. Wasserman, Am. J. Physiol. Endocrinol. Metab. 296:E11, 2009); adenine
  isolated by Kossel (1885), made from hydrogen cyanide and ammonia by Joan Oró (1960); thymine (1893) and
  cytosine (1894) by Kossel and Neumann; guanine found in guano by Julius Bodo Unger (1844), its crystals
  the shimmer of fish scales; 5-methylcytosine and epigenetics.

## How it is drawn (dna.js)

- 0.09 m per ångström; the helix floats over the lab's table at 2.35 m. A group `orient` lays its axis across
  a wide screen (turned 20 degrees, so the rungs show a little of their faces) and stands it up on an upright
  phone (reading top to bottom), chosen by the screen's way up. Two duplex groups in it; each turns about
  its own axis (a group rotation, nothing recomputed).
- Each nucleotide on show is a view: its base, strand, pair, duplex, role (old or new), a matrix. Atoms and
  bonds are two instanced meshes per duplex, each view a fixed slot of 26 atoms and 30 sticks; only moving
  views are rewritten (flights, the twist easing, a copy). The Explorer sees the bases' atoms smaller, the
  backbone as the rail and its phosphorus beads; the Scientist every atom and bond, thinner rails, fainter
  slabs. The bases' rings are filled slabs in the letters' colours (A amber, T pink, G green, C blue).
- Hydrogen bonds: three beads on each, drawn in the duplex of the first strand (during a copy the old bonds
  cross duplexes and are converted). Rails: a tube through each strand's phosphorus atoms, rebuilt when it
  moves. The letters: troika text billboards along both sides.
- The tray: per base two instanced meshes (atoms, sticks; drawn over everything, `depthTest` off) and a
  disc, placed every frame 2.2 m in front of the camera at its slot's centre and sized to it. The world reads
  the slots' rectangles a few times a second.
- Light mode (`ctx.light`): fewer segments, fewer stars and sparks, no clearcoat.

## Traps met

- `vite preview` serves the files it found when it started: after a new build into the same folder the page
  asks for assets that are not there (blank world). Stop the preview (match `vite`, `preview` and `--port
  5324` in one `node.exe` command line) and start it again after every build.
- `shared_probe.py --world` asks the world for `interactables`: an orbit world lists its taps there (the
  forge's particles, the bench's four letters and the helix).
- Choosing the helix's way by the free area's shape laid it down on an upright phone once the verse took
  its strip under the card: the screen's way up decides now.
- The skyVerse at a fixed place sat behind the card (the card is taller than the lab's): it is placed in
  screen space every frame, in the corner the HUD leaves.
- A rail through O3' as well as P hooked off the end in the ladder (untwisted, O3' and the next P are 5 Å
  apart sideways): through P only.
- Freebase coordinates flattened to z = 0 put thymine's methyl hydrogens on top of each other.
- The force layout had no reason to prefer the chair (no twist term): glucose came out a twisted boat. The
  staggering term at 0.01 x bond keeps the chair with ring angles 106 to 112 degrees (the ring oxygen opens to
  about 120; really about 113).
- The passport's "master" badge needs every mission: with 21 missions now, someone who had all 15 has it
  again only after the six new ones.

## Checking

- `npm test`: `bases.test.js` (the geometry above, the free bases are the lab's molecules, counting,
  the copy's timeline), `words.test.js` (four languages with the same shape, no em dashes, decimal commas,
  Polish counts), `build.test.js` and `layout.test.js` (rings).
- `py -3.11 tools/dna_probe.py --base http://localhost:5324` (a separate build: `npx vite build --outDir
  <scratch>`, `npx vite preview --outDir <scratch> --port 5324 --strictPort`).
- `hud_probe.py --scene dna` (two scenes, `dna` and `dna-copied`; all six screens pass, 2026-11-09);
  `shared_probe.py --world /lab/dna --steps tools/shared_steps/dna.json` (all ok, 2026-11-09).

## Next

- RNA: transcribe the strand (U for T), read it in codons, and build the protein's first amino acids from
  ATG on (the start find leads there).
- Tap a base pair to see it alone, face on, with its hydrogen bonds' lengths (Scientist) or as two puzzle
  pieces (Explorer); a mismatch (G with T) that does not fit, and a mutation.
- A-DNA and Z-DNA on the slider (3DNA has their nucleotides too: `config/atomic/ADNA_*`).
- Strands longer than 24 pairs in light mode would need fewer atoms (bases only).
