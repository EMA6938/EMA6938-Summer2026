# EMA 6938 - Data Science for Materials
## Environment Setup Guide

This guide covers everything you need to get your environment running: fresh install, verification, API key setup, platform-specific notes, and troubleshooting. Read the section that applies to you. If you hit a problem not covered here, post in the **General Course Questions** discussion thread on Canvas.

---

## Before you start

**What you need:**
- A computer running macOS, Windows, or Linux
- ~5 GB of free disk space
- ~15–20 minutes for the initial setup

**What gets installed:**
A conda environment named `matds` containing Python 3.11, all data science and materials science packages for the full semester, and JupyterLab. You only do this once.

---

## Option A: Fresh install (recommended)

### 1. Install Anaconda

Download **Anaconda (Python 3.11+)** from [anaconda.com/download](https://www.anaconda.com/download) and run the installer.

> **Windows users:** After installation, use **Anaconda Prompt** (from the Start Menu) for all commands below — not PowerShell, not Git Bash, not Windows Terminal unless you have run `conda init` for it.

### 2. Clone the repository

```bash
git clone https://github.com/EMA6938/EMA6938-Summer2026.git
cd EMA6938-Summer2026
```

Or download the ZIP: GitHub → Code → Download ZIP, then extract it.

### 3. Create the conda environment

```bash
conda env create -f environment.yml
```

This installs Python 3.11 and all packages needed for the full semester. **First-time install takes 10–20 minutes.** Installation is complete when you see:

```
To activate this environment, use:
    conda activate matds
```

If the install hangs for more than 30 minutes, see [Troubleshooting → Install is slow](#install-is-slow-or-hangs).

### 4. Activate the environment

```bash
conda activate matds
```

You should see `(matds)` at the start of your terminal prompt. **Always activate this environment before opening any course notebook.**

### 5. Set up your Materials Project API key

1. Go to [next.materialsproject.org/api](https://next.materialsproject.org/api) and create a free account
2. Copy your API key
3. Create a `.env` file in the repository root — **do not hardcode the key in a notebook:**

```bash
echo "MP_API_KEY=your_actual_key_here" > .env
```

This file is already listed in `.gitignore` and will never be committed to GitHub.

Load it in any notebook with:

```python
from dotenv import load_dotenv
import os
load_dotenv()
API_KEY = os.getenv("MP_API_KEY")
```

> **Note:** API key activation can take up to 1 hour after registration. Use the Binder fallback link (in `resources/binder_fallback.md`) during Week 1 if your key is not yet active.

### 6. Launch JupyterLab

```bash
jupyter lab
```

JupyterLab opens in your browser. Navigate to `week01/` and open `week1_starter.ipynb`. You are ready to work.

---

## Option B: Update an existing environment

If you already have a `matds` environment and need to add new packages mid-semester:

```bash
conda activate matds
conda env update -f environment.yml --prune
```

The `--prune` flag removes packages no longer in the file. Do **not** run `conda update --all` — it can break pinned version constraints.

---

## Option C: Manual install

If you prefer to install packages individually:

```bash
conda activate matds

# Core data science
conda install -c conda-forge python=3.11 numpy pandas scipy matplotlib seaborn \
  jupyter jupyterlab typing_extensions

# Materials science
conda install -c conda-forge pymatgen

# pip packages
pip install mp-api jarvis-tools matminer python-dotenv umap-learn shap xgboost plotly
```

---

## Verify your installation

Run this cell in any Jupyter notebook to confirm everything is working:

```python
import sys, numpy, pandas, matplotlib, sklearn, pymatgen, matminer
from mp_api.client import MPRester
from dotenv import load_dotenv
import umap, shap, xgboost

packages = {
    "Python":       sys.version.split()[0],
    "NumPy":        numpy.__version__,
    "pandas":       pandas.__version__,
    "matplotlib":   matplotlib.__version__,
    "scikit-learn": sklearn.__version__,
    "pymatgen":     pymatgen.__version__,
    "matminer":     matminer.__version__,
    "umap-learn":   umap.__version__,
    "xgboost":      xgboost.__version__,
    "shap":         shap.__version__,
}

print("Package versions:")
for pkg, ver in packages.items():
    print(f"  {pkg:<15} {ver}")

load_dotenv()
import os
key = os.getenv("MP_API_KEY")
print(f"\nMP API key: {'✓ Loaded' if key else '✗ Not found — check your .env file'}")
```

If all packages print versions and the API key is found, your environment is ready for the full semester.

---

## Week 12 only: Install PyTorch Geometric

PyTorch Geometric (PyG) is only needed in Week 12 for graph neural networks. Install it **after** the base environment is working and **only when directed** by the Week 12 Canvas module. Installing it early can conflict with the base environment.

### Step 1 - Verify your PyTorch version

```python
import torch
print(torch.__version__)          # Should be 2.1.x
print(torch.cuda.is_available())  # False for CPU-only machines
```

### Step 2 - Install PyG (CPU version)

```bash
conda activate matds
pip install torch_geometric
pip install torch_scatter torch_sparse torch_cluster torch_spline_conv \
    -f https://data.pyg.org/whl/torch-2.1.0+cpu.html
```

### Step 3 - Verify

```python
import torch_geometric
print(torch_geometric.__version__)
```

### GPU users

Replace `+cpu` in the URL above with your CUDA version, e.g. `+cu118` for CUDA 11.8. Check your CUDA version with `nvidia-smi`.

---

## Git setup (required after cloning)

After cloning the repository, run these commands once to prevent accidentally committing files that should never be in version control:

```bash
# Prevent .DS_Store (macOS) from ever being committed
git config --global core.excludesfile ~/.gitignore_global
echo ".DS_Store" >> ~/.gitignore_global
echo "**/.DS_Store" >> ~/.gitignore_global
echo ".ipynb_checkpoints/" >> ~/.gitignore_global
echo "**/.ipynb_checkpoints/" >> ~/.gitignore_global
```

Your `.env` file is already covered by the repository's `.gitignore`. Verify it is not being tracked:

```bash
git status   # .env should NOT appear in the output
```

If `.env` does appear, run:

```bash
git rm --cached .env
git commit -m "stop tracking .env"
git push origin main
```

---

## Platform-specific notes

### Windows

- Always use **Anaconda Prompt** (from the Start Menu), not PowerShell or Windows Terminal
- If `conda activate` gives "CommandNotFoundError", run `conda init cmd.exe` then close and reopen Anaconda Prompt
- If your Windows username contains a space (e.g. `C:\Users\John Smith\`), Anaconda may install to an unexpected path — use the Anaconda Prompt shortcut from the Start Menu, not a manually opened terminal
- If you see UTF-8 encoding errors in notebooks, run `chcp 65001` in Anaconda Prompt before launching JupyterLab. For CSV files with encoding issues: `pd.read_csv('file.csv', encoding='utf-8-sig')`

### macOS

- On Apple Silicon (M1/M2/M3), all packages install correctly via conda-forge. Architecture warnings during install are safe to ignore.
- If JupyterLab opens but the kernel fails to start, run:

  ```bash
  conda activate matds
  python -m ipykernel install --user --name matds --display-name "Python (matds)"
  ```

  Then refresh JupyterLab and select the `Python (matds)` kernel.

### Linux

Standard install works without modification. On a university HPC cluster, use a user-level Anaconda install (`--prefix ~/anaconda3`) rather than a system-wide install — check with your sysadmin first.

---

## Binder fallback (no local install required)

If you cannot get the local environment working before a lab session, use the Binder link in the Week 1 Canvas module. Binder runs notebooks in a pre-configured cloud environment with all packages installed.

**Limitations:**
- Sessions time out after ~10 minutes of inactivity — save your work frequently
- Your MP API key is not stored in Binder — you will need to enter it manually each session
- Binder is a fallback only — resolve your local install before Week 2

---

## Troubleshooting

### Install is slow or hangs

If `conda env create` takes more than 30 minutes with no progress, install the faster libmamba solver:

```bash
conda install -n base conda-libmamba-solver
conda config --set solver libmamba
```

Then retry:

```bash
conda env create -f environment.yml
```

### `conda activate` fails on Windows

Use Anaconda Prompt from the Start Menu. If it still fails:

```bash
conda init cmd.exe
```

Close and reopen Anaconda Prompt, then try again.

### `ModuleNotFoundError: No module named 'jarvis'`

```bash
conda activate matds
pip install jarvis-tools
```

If that fails, recreate the environment:

```bash
conda env remove -n matds
conda env create -f environment.yml
```

### `ModuleNotFoundError: No module named 'mp_api'`

```bash
conda activate matds
pip install mp-api --upgrade
```

### API key not working (403 error or "API key not found")

- Key activation takes up to 1 hour after registration — wait and retry
- Check for typos — the key is case-sensitive
- Make sure your `.env` file is in the same directory as the notebook (the repository root)
- Use the Binder fallback in the meantime

### JupyterLab does not open in browser

Copy the URL from the terminal output (starts with `http://localhost:8888/lab?token=...`) and paste it manually into your browser.

### JupyterLab kernel shows "No kernel" or kernel selector is empty

```bash
conda activate matds
python -m ipykernel install --user --name matds --display-name "Python (matds)"
```

Refresh the browser.

### pymatgen install conflict during `conda env create`

```bash
conda env remove -n matds
conda install -n base conda-libmamba-solver
conda config --set solver libmamba
conda env create -f environment.yml
```

### matminer `MPDataRetrieval` error (`NotImplementedError`)

Do not use `matminer.data_retrieval.retrieve_MP.MPDataRetrieval`. Use `mp_api.client.MPRester` directly — all course notebooks already do this. See the README compatibility notes for the correct pattern.

### PyG install fails (Week 12)

Make sure you are using the correct PyTorch version in the install URL. Check `torch.__version__` and match the `+cpu` or `+cuXXX` suffix exactly.

### `umap-learn` import shows numba deprecation warnings

Safe to ignore. These are upstream warnings in numba, not errors.

### `crystal-toolkit` import error

```bash
pip install crystal-toolkit --upgrade
```

If still failing, skip it — `crystal-toolkit` is optional for visualization only and not required for any graded work.

---

## Package versions reference

| Package | Version | Purpose | When needed |
|---|---|---|---|
| Python | 3.11 | Core language | Always |
| NumPy | ≥1.21 | Numerical arrays | Always |
| pandas | ≥1.3 | DataFrames & data manipulation | Always |
| scipy | ≥1.7 | Statistics, distributions | Week 3+ |
| scikit-learn | ≥1.0 | ML models, validation | Week 5+ |
| matplotlib | ≥3.4 | Plotting | Always |
| seaborn | ≥0.11 | Statistical visualization | Week 3+ |
| pymatgen | ≥2022.12 | Crystal structures, file I/O | Week 1+ |
| mp-api | ≥0.33 | Materials Project queries | Week 1+ |
| jarvis-tools | ≥2022.12 | JARVIS-DFT database | Week 2+ |
| matminer | ≥2023.1 | Composition featurizers | Week 4+ |
| python-dotenv | ≥0.19 | API key management | Week 1+ |
| umap-learn | ≥0.5 | Dimensionality reduction | Week 9 |
| shap | ≥0.42 | Model interpretation | Week 10 |
| xgboost | ≥1.7 | Gradient boosting | Week 10 |
| torch-geometric | Latest | Graph neural networks | Week 12 only |

---

*Questions not covered here? Post in the Canvas General Course Questions Discussion Post.*
