# Materials Project API — Quickstart Cheat Sheet

**Course:** EMA 6938 — Data Science for Materials  
**API documentation:** https://docs.materialsproject.org  
**Register for a free API key:** https://next.materialsproject.org/api

---

## Setup

### Install and load your API key

```python
# Install (already in the course environment)
# pip install mp-api python-dotenv

# Load your key from the .env file (never hardcode it in a notebook)
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("MP_API_KEY")
```

### Your .env file (repository root — never commit this)

```
MP_API_KEY=your_actual_key_here
```

---

## The MPRester context manager

Always use MPRester as a context manager (`with` statement). It handles opening and closing the connection safely.

```python
from mp_api.client import MPRester

with MPRester(API_KEY) as mpr:
    # all your queries go here
    pass
```

---

## Fetching structures

### By material ID

```python
with MPRester(API_KEY) as mpr:
    struct = mpr.get_structure_by_material_id("mp-5020")  # BaTiO3

print(struct)
print(struct.formula)
print(struct.get_space_group_info())
```

### Search by elements

```python
with MPRester(API_KEY) as mpr:
    docs = mpr.summary.search(
        elements=["Fe", "O"],
        fields=["material_id", "formula_pretty", "band_gap", "formation_energy_per_atom"]
    )

for d in docs[:5]:
    print(d.material_id, d.formula_pretty, d.band_gap)
```

### Search by formula

```python
with MPRester(API_KEY) as mpr:
    docs = mpr.summary.search(
        formula="Fe2O3",
        fields=["material_id", "formula_pretty", "energy_above_hull", "is_stable"]
    )
```

### Search by chemsys (chemical system)

```python
with MPRester(API_KEY) as mpr:
    docs = mpr.summary.search(
        chemsys="Fe-O",          # all Fe-O compounds
        fields=["material_id", "formula_pretty", "band_gap"]
    )
```

### Search by material IDs (batch)

```python
ids = ["mp-5020", "mp-1234", "mp-2133"]

with MPRester(API_KEY) as mpr:
    docs = mpr.summary.search(
        material_ids=ids,
        fields=["formula_pretty", "band_gap", "formation_energy_per_atom"]
    )
```

---

## Commonly used fields

| Field | Type | Description |
|---|---|---|
| `material_id` | str | Unique MP identifier (e.g. "mp-5020") |
| `formula_pretty` | str | Human-readable formula (e.g. "BaTiO3") |
| `band_gap` | float | DFT bandgap in eV (GGA-PBE, underestimated) |
| `formation_energy_per_atom` | float | Formation energy in eV/atom |
| `energy_above_hull` | float | Thermodynamic stability in eV/atom (0 = stable) |
| `is_stable` | bool | True if on the convex hull |
| `volume` | float | Unit cell volume in Å³ |
| `density` | float | Density in g/cm³ |
| `nsites` | int | Number of atoms in the unit cell |
| `symmetry` | object | Space group info |
| `structure` | Structure | Pymatgen Structure object |
| `elements` | list | List of element symbols |
| `nelements` | int | Number of distinct elements |
| `theoretical` | bool | True if not experimentally observed |

---

## Filtering results

### By number of elements

```python
with MPRester(API_KEY) as mpr:
    docs = mpr.summary.search(
        elements=["Ti", "O"],
        num_elements=(2, 2),       # exactly binary compounds
        fields=["material_id", "formula_pretty", "band_gap"]
    )
```

### By bandgap range

```python
with MPRester(API_KEY) as mpr:
    docs = mpr.summary.search(
        elements=["Si"],
        band_gap=(0.5, 3.0),       # bandgap between 0.5 and 3.0 eV
        fields=["material_id", "formula_pretty", "band_gap"]
    )
```

### By stability

```python
with MPRester(API_KEY) as mpr:
    docs = mpr.summary.search(
        elements=["Li", "Fe", "P", "O"],
        is_stable=True,
        fields=["material_id", "formula_pretty", "formation_energy_per_atom"]
    )
```

---

## Building a DataFrame from query results

```python
import pandas as pd

with MPRester(API_KEY) as mpr:
    docs = mpr.summary.search(
        chemsys="Li-Fe-O",
        fields=["material_id", "formula_pretty", "band_gap",
                "formation_energy_per_atom", "energy_above_hull", "is_stable"]
    )

# Convert to DataFrame
df = pd.DataFrame([{
    "material_id":               d.material_id,
    "formula":                   d.formula_pretty,
    "band_gap_eV":               d.band_gap,
    "formation_energy_eV_atom":  d.formation_energy_per_atom,
    "e_above_hull_eV_atom":      d.energy_above_hull,
    "stable":                    d.is_stable,
} for d in docs])

print(df.shape)
df.head()
```

---

## Fetching oxidation state decorated structures

```python
with MPRester(API_KEY) as mpr:
    struct = mpr.get_structure_by_material_id(
        "mp-5020",
        conventional_unit_cell=True    # returns conventional rather than primitive cell
    )
```

---

## Writing structures to files

```python
# Write to CIF
struct.to(filename="BaTiO3.cif")

# Write to POSCAR (VASP format)
struct.to(filename="POSCAR")

# Write to XYZ
struct.to(filename="BaTiO3.xyz")
```

---

## Common errors and fixes

| Error | Cause | Fix |
|---|---|---|
| `MPRestError: API key not found` | Key not loaded or not yet active | Check `.env` file; new keys take up to 1 hour to activate |
| `ValidationError: field required` | Requested a field that doesn't exist | Check the field name against the table above |
| `AttributeError: 'NoneType'` | A property is null for this material | Check for `None` before using: `if d.band_gap is not None` |
| `KeyError: 'MP_API_KEY'` | `.env` file missing or in wrong location | Place `.env` in the repository root, not in the week folder |
| `RateLimitError` | Too many requests per minute | Add `time.sleep(1)` between requests in loops |

---

## Rate limits and large queries

The MP API is rate-limited. For large queries (>1000 entries):

```python
import time

# For loops over many material IDs — add a small delay
for mat_id in large_id_list:
    with MPRester(API_KEY) as mpr:
        doc = mpr.summary.search(material_ids=[mat_id], fields=["band_gap"])
    time.sleep(0.1)   # 100 ms pause between requests
```

For very large dataset pulls, use the `chunk_size` parameter or query by chemsys to break the request into smaller pieces.

---

## Citing the Materials Project

If you use MP data in your final project report, cite:

> Jain, A. et al. (2013). Commentary: The Materials Project: A materials genome approach to accelerating materials innovation. *APL Materials*, 1(1), 011002. https://doi.org/10.1063/1.4812323

Also cite the specific database version in your methods section:
> Data retrieved from the Materials Project (materialsproject.org) on [date], database version [version].

The current database version is shown on the MP website under "About."

---

*Last updated: 05/07/2026 | Questions? Post in Canvas Week N Setup Help thread*
