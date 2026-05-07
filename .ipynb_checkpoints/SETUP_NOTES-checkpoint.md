# Setup Notes & Troubleshooting

## EMA 6938 — Data Science for Materials

This document covers the detailed setup steps, known issues, and their fixes. Read through the relevant section if you hit a problem before posting to Canvas.

---

## Detailed setup walkthrough

### Windows-specific notes

1. After installing Anaconda, **always use Anaconda Prompt** — not PowerShell, not Git Bash, not Windows Terminal (unless you've run `conda init` for it).
2. If `conda activate matds` gives a "CommandNotFoundError", run:
   ```
   conda init cmd.exe
   ```
   Then close and reopen Anaconda Prompt.
3. If your username contains a space (e.g. `C:\Users\John Smith\`), Anaconda may install to an unexpected path. Use the Anaconda Prompt shortcut from the Start Menu, not a manually opened terminal.

### macOS-specific notes

1. On Apple Silicon (M1/M2/M3), all packages in `environment.yml` install correctly via conda-forge. If you see architecture warnings during install, they are usually safe to ignore.
2. If `jupyter lab` opens but the kernel fails to start, run:
   ```bash
   conda activate matds
   python -m ipykernel install --user --name matds --display-name "Python (matds)"
   ```
   Then refresh JupyterLab and select the `Python (matds)` kernel.

### Linux-specific notes

Standard install works without modification. If you are on a university HPC cluster, check with your sysadmin before installing Anaconda system-wide — user-level install (`--prefix ~/anaconda3`) is usually preferred.

---

## Storing your MP API key safely

**Never hardcode your API key in a notebook cell.** If you commit a notebook with your key visible, it is exposed in the git history permanently.

### Recommended approach: .env file

Create a file named `.env` in the root of the repository:

```
MP_API_KEY=your_actual_key_here
```

This file is already listed in `.gitignore` — it will never be committed.

Load it in any notebook with:

```python
from dotenv import load_dotenv
import os
load_dotenv()  # Reads .env from the current directory or any parent directory
API_KEY = os.getenv("MP_API_KEY")
```

### Alternative: conda environment variable

```bash
conda activate matds
conda env config vars set MP_API_KEY=your_actual_key_here
conda activate matds  # Re-activate to apply
```

Then in any notebook:

```python
import os
API_KEY = os.getenv("MP_API_KEY")
```

---

## PyTorch Geometric install (Week 12 only)

PyTorch Geometric (PyG) is only needed in Week 12. Install it **after** the base environment is working, and only when directed by the Week 12 Canvas module.

### Step 1 — Verify your PyTorch version

```python
import torch
print(torch.__version__)   # Should be 2.1.x
print(torch.cuda.is_available())  # False for CPU-only
```

### Step 2 — Install PyG (CPU version)

With the `matds` environment activated:

```bash
pip install torch_geometric
pip install torch_scatter torch_sparse torch_cluster torch_spline_conv \
    -f https://data.pyg.org/whl/torch-2.1.0+cpu.html
```

### Step 3 — Verify PyG install

```python
import torch_geometric
print(torch_geometric.__version__)
```

### GPU users

If you have an NVIDIA GPU and CUDA installed, replace `+cpu` in the URL above with your CUDA version, e.g. `+cu118` for CUDA 11.8. Check your CUDA version with `nvidia-smi`.

---

## Common issues and fixes

| Issue | Symptom | Fix |
|---|---|---|
| `conda activate` fails on Windows | "conda: command not found" or activation ignored | Use Anaconda Prompt (Start Menu). Run `conda init cmd.exe` then restart. |
| `conda env create` is very slow or hangs | Takes >30 min with no progress | Try adding `--solver=libmamba`: `conda install -n base conda-libmamba-solver` then `conda config --set solver libmamba` |
| `mp-api` ImportError | `ModuleNotFoundError: No module named 'mp_api'` | Run `pip install mp-api --upgrade` with `matds` activated |
| API key not working | `MPRestError: API key not found` or 403 error | Key activation takes up to 1 hour. Use Binder fallback in the meantime. Check for typos — key is case-sensitive. |
| `matminer MPDataRetrieval` error | `NotImplementedError: The MPRester().query method has been replaced` | Do not use `MPDataRetrieval`. Use `mp_api.client.MPRester` directly. See README compatibility notes. |
| JupyterLab not opening | `jupyter lab` runs but browser does not open | Copy the URL from the terminal output (starts with `http://localhost:8888/lab?token=...`) and paste it manually into your browser. |
| JupyterLab kernel shows "No kernel" | Notebook opens but kernel selector is empty | Run: `python -m ipykernel install --user --name matds`. Refresh browser. |
| pymatgen install conflict | Dependency resolution errors during `conda env create` | Delete the failed env (`conda env remove -n matds`) and retry with `--solver=libmamba` |
| `crystal-toolkit` import error | `ImportError` on `import crystal_toolkit` | Run `pip install crystal-toolkit --upgrade`. If still failing, skip crystal_toolkit — it is optional for visualization only. |
| PyG install fails (Week 11) | torch_scatter build errors | Ensure you are using the correct PyTorch version URL. Check `torch.__version__` and match the `+cpu` or `+cuXXX` suffix exactly. |
| `umap-learn` import warning | Numba deprecation warnings on import | Safe to ignore. These are upstream warnings in numba, not errors. |

---

## Binder fallback (no local install required)

If you cannot get the local environment working before a lab session, use the Binder link posted in the Week 1 Canvas module. Binder runs the notebooks in a pre-configured cloud environment with all packages installed — no setup required.

**Limitations of Binder:**
- Sessions time out after ~10 minutes of inactivity — save your work frequently
- Your MP API key is not stored in Binder — you will need to enter it manually each session
- Binder is a fallback, not a permanent solution — please resolve your local install before Week 2

---

## Updating the environment mid-semester

If a new package is needed for a specific week, the `environment.yml` will be updated and an announcement posted to Canvas. To update your existing environment:

```bash
conda activate matds
conda env update -f environment.yml --prune
```

Do not run `conda update --all` — this can break pinned version constraints.

---

## Verifying your full install

Run this cell in any Jupyter notebook to confirm all core packages are working:

```python
import sys, numpy, pandas, matplotlib, sklearn, pymatgen, matminer
from mp_api.client import MPRester
from dotenv import load_dotenv
import umap, shap, xgboost

packages = {
    "Python": sys.version.split()[0],
    "NumPy": numpy.__version__,
    "pandas": pandas.__version__,
    "matplotlib": matplotlib.__version__,
    "scikit-learn": sklearn.__version__,
    "pymatgen": pymatgen.__version__,
    "matminer": matminer.__version__,
    "umap-learn": umap.__version__,
    "xgboost": xgboost.__version__,
    "shap": shap.__version__,
}

print("Package versions:")
for pkg, ver in packages.items():
    print(f"  {pkg:<15} {ver}")

load_dotenv()
import os
key = os.getenv("MP_API_KEY")
print(f"\nMP API key loaded: {'✅ Yes' if key else '❌ Not found — check your .env file'}")
```

If all packages print versions and the API key is found, your environment is ready for the full semester.

---

*Questions not covered here? Post in the Canvas General Course Questions Discussion Post*
