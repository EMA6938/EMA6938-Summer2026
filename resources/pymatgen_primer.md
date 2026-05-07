# Pymatgen Structure Object — Primer Guide

**Course:** EMA 6938 — Data Science for Materials  
**Pymatgen documentation:** https://pymatgen.org  
**GitHub:** https://github.com/materialsproject/pymatgen

---

## What is a Structure object?

A Pymatgen `Structure` is a Python object that represents a **periodic crystal structure**. It encodes everything a crystallographer would write in a CIF file:

- The **lattice** — the repeating unit cell (lengths *a*, *b*, *c* and angles α, β, γ)
- The **atomic sites** — species and their positions inside the unit cell
- The **periodic boundary conditions** — the crystal repeats infinitely in all directions

This is fundamentally richer than a chemical formula. Fe₂O₃ tells you the ratio of atoms. A Structure tells you *where* every atom is, *how* they are bonded, and *what* the geometry looks like — the information that determines physical properties.

---

## Creating a Structure

### From the Materials Project API

```python
from mp_api.client import MPRester
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("MP_API_KEY")

with MPRester(API_KEY) as mpr:
    struct = mpr.get_structure_by_material_id("mp-5020")  # BaTiO3
```

### From a CIF file

```python
from pymatgen.core import Structure

struct = Structure.from_file("BaTiO3.cif")
```

### From a POSCAR file (VASP format)

```python
struct = Structure.from_file("POSCAR")
```

### From scratch (advanced)

```python
from pymatgen.core import Structure, Lattice

lattice = Lattice.cubic(4.00)           # cubic lattice, a = 4.00 Å
struct = Structure(
    lattice,
    species=["Ba", "Ti", "O", "O", "O"],
    coords=[
        [0.0, 0.0, 0.0],               # Ba at corner
        [0.5, 0.5, 0.5],               # Ti at body center
        [0.5, 0.5, 0.0],               # O on face
        [0.5, 0.0, 0.5],               # O on face
        [0.0, 0.5, 0.5],               # O on face
    ],
    coords_are_cartesian=False          # fractional coordinates
)
```

---

## Inspecting a Structure

### Basic properties

```python
print(struct)                           # full summary
print(struct.formula)                   # "Ba1 Ti1 O3"
print(struct.reduced_formula)           # "BaTiO3"
print(struct.composition)              # Composition object
print(len(struct))                      # number of sites (atoms in unit cell)
print(struct.volume)                    # unit cell volume in Å³
print(struct.density)                   # density in g/cm³
print(struct.get_space_group_info())    # ('P4mm', 99) — (symbol, number)
```

### The lattice

```python
print(struct.lattice)
print(struct.lattice.a)                 # a length in Å
print(struct.lattice.b)                 # b length in Å
print(struct.lattice.c)                 # c length in Å
print(struct.lattice.alpha)             # angle α in degrees
print(struct.lattice.beta)              # angle β in degrees
print(struct.lattice.gamma)             # angle γ in degrees
print(struct.lattice.matrix)            # 3×3 matrix of lattice vectors
```

### Atomic sites

```python
# Iterate over all sites
for i, site in enumerate(struct):
    print(f"Site {i}: {site.species_string:<4}  "
          f"frac={site.frac_coords.round(4)}  "
          f"cart={site.coords.round(4)} Å")

# Access a specific site
site = struct[0]
print(site.species_string)              # element symbol e.g. "Ba"
print(site.frac_coords)                 # fractional coordinates [x, y, z]
print(site.coords)                      # Cartesian coordinates in Å
```

### Composition information

```python
comp = struct.composition
print(comp)                             # "Ba1 Ti1 O3"
print(comp["Ba"])                       # number of Ba atoms = 1.0
print(comp.elements)                    # list of Element objects
print([str(el) for el in comp.elements])# ['Ba', 'Ti', 'O']
print(comp.fractional_composition)     # fraction of each element
print(comp.total_electrons)             # total electron count
```

---

## Nearest neighbors

### Get neighbors within a radius

```python
# All neighbors of site 0 within 3.5 Å
neighbors = struct.get_neighbors(struct[0], r=3.5)

for nbr in sorted(neighbors, key=lambda x: x.nn_distance):
    print(f"{nbr.species_string:<4}  {nbr.nn_distance:.4f} Å")
```

### Get all neighbors for all sites

```python
all_neighbors = struct.get_all_neighbors(r=4.0)
# Returns a list of lists: all_neighbors[i] = neighbors of site i

for i, nbrs in enumerate(all_neighbors):
    species = struct[i].species_string
    print(f"Site {i} ({species}): {len(nbrs)} neighbors within 4.0 Å")
```

### Using CrystalNN (smarter, bond-aware)

```python
from pymatgen.analysis.local_env import CrystalNN

cnn = CrystalNN()
neighbors = cnn.get_nn_info(struct, n=0)   # neighbors of site 0

for nbr in neighbors:
    print(f"  {nbr['site'].species_string}  weight={nbr['weight']:.3f}")
```

---

## Converting between coordinate systems

```python
# Fractional → Cartesian
frac = [0.5, 0.5, 0.5]
cart = struct.lattice.get_cartesian_coords(frac)

# Cartesian → Fractional
frac_back = struct.lattice.get_fractional_coords(cart)
```

---

## Writing structures to files

```python
# CIF — universal, human-readable
struct.to(filename="output.cif")

# POSCAR — VASP input format
struct.to(filename="POSCAR")

# XYZ — molecular dynamics, no lattice info
struct.to(filename="output.xyz")

# JSON — machine-readable, lossless
import json
struct_dict = struct.as_dict()
with open("struct.json", "w") as f:
    json.dump(struct_dict, f)

# Reload from JSON
struct_reloaded = Structure.from_dict(struct_dict)
```

---

## Modifying structures

### Make a supercell

```python
# 2×2×2 supercell
supercell = struct.make_supercell([2, 2, 2])
print(f"Original sites: {len(struct)}, Supercell sites: {len(supercell)}")
```

### Scale the lattice (apply pressure)

```python
import copy
compressed = copy.deepcopy(struct)
compressed.scale_lattice(struct.volume * 0.95)   # compress by 5%
```

### Add or remove a site

```python
# Add a site (fractional coordinates)
struct.append("H", [0.1, 0.1, 0.1])

# Remove site by index
struct.remove_sites([len(struct) - 1])
```

---

## Symmetry analysis

```python
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer

sga = SpacegroupAnalyzer(struct)

print(sga.get_space_group_symbol())         # "P4mm"
print(sga.get_space_group_number())         # 99
print(sga.get_crystal_system())             # "tetragonal"
print(sga.get_point_group_symbol())         # "4mm"

# Get the primitive cell (smaller, symmetry-equivalent)
primitive = sga.get_primitive_standard_structure()

# Get the conventional cell (human-readable standard setting)
conventional = sga.get_conventional_standard_structure()
```

---

## Using Matminer to featurize a Structure

```python
from matminer.featurizers.composition import ElementProperty
from matminer.featurizers.structure import DensityFeatures
import pandas as pd

# Composition-based features (fast, no structure needed)
ep = ElementProperty.from_preset("magpie")
features = ep.featurize(struct.composition)
labels = ep.feature_labels()

df = pd.DataFrame([features], columns=labels)
print(f"{len(labels)} Magpie features generated")

# Structure-based features (richer, requires Structure)
df_struct = pd.DataFrame({"structure": [struct]})
densf = DensityFeatures()
df_struct = densf.featurize_dataframe(df_struct, "structure")
print(df_struct[densf.feature_labels()])
```

---

## Common errors and fixes

| Error | Cause | Fix |
|---|---|---|
| `FileNotFoundError` on `from_file()` | Wrong path or file not in working directory | Check `os.getcwd()` and confirm the file is there |
| `Structure has no attribute 'get_space_group_info'` | Old pymatgen version | `pip install pymatgen --upgrade` |
| `ValueError: Invalid site` | Site coordinates outside [0, 1] for fractional | Ensure `coords_are_cartesian=False` when passing fractional coords |
| `StructureError: Not enough neighbors` | Cutoff radius too small for CrystalNN | Increase `r` in `get_neighbors(r=...)` or use a larger cutoff |
| Supercell very slow | Structure too large or supercell too big | Use `make_supercell` only on primitive cells |

---

## Quick reference card

```python
from pymatgen.core import Structure

s = Structure.from_file("file.cif")

# What is it?
s.formula           # "Fe2 O3"
s.reduced_formula   # "Fe2O3"
s.volume            # Å³
s.density           # g/cm³
s.get_space_group_info()  # ('R-3c', 167)

# How big is the cell?
s.lattice.a / .b / .c      # Å
s.lattice.alpha / .beta / .gamma  # degrees
len(s)              # number of atoms

# What's at each site?
s[0].species_string     # "Fe"
s[0].frac_coords        # [x, y, z] fractional
s[0].coords             # [x, y, z] Cartesian Å

# Who are the neighbors?
s.get_neighbors(s[0], r=3.0)   # within 3.0 Å

# Save it
s.to(filename="out.cif")
s.to(filename="POSCAR")
```

---

*Last updated: 05/07/2026 | Full docs: https://pymatgen.org/pymatgen.core.html*
