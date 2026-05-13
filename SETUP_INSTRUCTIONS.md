# EMA 6938 — Data Science for Materials
## Environment Setup Guide

This guide walks you through setting up the `matds` conda environment for the course.

---

## Option A: Fresh Install (Recommended)

If you haven't created the `matds` environment yet, do this:

### 1. Download the environment file

Get `environment.yml` from the course GitHub or Canvas.

### 2. Create the environment

Open Terminal (macOS/Linux) or Anaconda Prompt (Windows) and run:

```bash
conda env create -f environment.yml
```

This will:
- Create a new conda environment named `matds`
- Install Python 3.10 and all required packages
- Set up Jupyter, pandas, NumPy, pymatgen, Materials Project API, and JARVIS tools

**First-time install takes 5–10 minutes.** Installation is complete when you see:

```
To activate this environment, use:
    conda activate matds
```

### 3. Activate the environment

```bash
conda activate matds
```

You should see `(matds)` appear in your terminal prompt.

### 4. Launch Jupyter Lab

```bash
jupyter lab
```

This opens Jupyter in your browser. You're ready to work!

---

## Option B: Update Existing Environment

If you already have a `matds` environment from Week 1, update it:

```bash
conda activate matds
conda env update -f environment.yml --prune
```

The `--prune` flag removes packages no longer listed in the file.

---

## Option C: Manual Installation

If you prefer to install packages individually:

```bash
conda activate matds

# Core data science
conda install numpy pandas scipy matplotlib seaborn jupyter jupyterlab

# Materials science
conda install -c conda-forge pymatgen

# pip packages
pip install mp-api jarvis-tools python-dotenv
```

---

## Verify Your Installation

After setup, confirm everything works by running this in a Python/Jupyter cell:

```python
import sys
import numpy as np
import pandas as pd
import matplotlib
import pymatgen
from jarvis.db.figshare import data as jdata
from mp_api.client import MPRester
from dotenv import load_dotenv

print(f"Python:        {sys.version.split()[0]}")
print(f"NumPy:         {np.__version__}")
print(f"pandas:        {pd.__version__}")
print(f"matplotlib:    {matplotlib.__version__}")
print(f"pymatgen:      {pymatgen.__version__}")
print("✓ jarvis-tools available")
print("✓ mp-api available")
print("✓ python-dotenv available")
print("\n✓ Environment ready for MTSE 6850")
```

If all imports succeed, you're set up correctly.

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'jarvis'"

**Solution 1: Install jarvis-tools via pip**
```bash
conda activate matds
pip install jarvis-tools --break-system-packages
```

**Solution 2: Recreate the environment**
```bash
conda env remove -n matds
conda env create -f environment.yml
```

### "ModuleNotFoundError: No module named 'mp_api'"

```bash
conda activate matds
pip install mp-api
```

### Jupyter won't start

Make sure you've activated the environment first:
```bash
conda activate matds
jupyter lab
```

If that doesn't work, reinstall jupyter:
```bash
conda install -c conda-forge jupyter jupyterlab
```

### Still having issues?

1. Post in the **General Course Discussion** discussion thread on Canvas
2. Include the full error message (copy-paste everything from the error)
3. Mention your operating system (Windows/Mac/Linux)

---

## Package Versions

This environment uses:

| Package | Version | Purpose |
|---------|---------|---------|
| Python | 3.10 | Core language |
| NumPy | ≥1.21 | Numerical arrays |
| pandas | ≥1.3 | DataFrames & data manipulation |
| pymatgen | ≥2022.12 | Crystal structures, file I/O |
| mp-api | ≥0.33 | Materials Project API |
| jarvis-tools | ≥2022.12 | JARVIS-DFT database access |
| matplotlib | ≥3.4 | Plotting |
| Jupyter | ≥1.0 | Interactive notebooks |

---

## Notes for Windows Users

If you encounter UTF-8 encoding errors in Jupyter:

1. Before opening a notebook, run in the terminal:
   ```bash
   chcp 65001
   ```

2. If a notebook shows encoding errors, open it with:
   ```python
   pd.read_csv('file.csv', encoding='utf-8-sig')
   ```

---

**You're all set!** Proceed to Week 1 and Week 2 notebooks.
