# EMA 6938 — Data Science for Materials

** University of Florida · Summer 2026 · Instructor: Prajakatta Mulay**

> An introduction to the principles of experimental design, statistical analysis, and data-driven techniques for materials science applications. Students learn Python-based data science and machine learning methods, then apply these skills to map structure–property relationships across metals, ceramics, polymers, and biomaterials using real-world datasets.

---

## 📋 Quick links

| Resource | Link |
|---|---|
| Course LMS (Canvas) | https://ufl.instructure.com/courses/564478(#) |
| Textbook (SpringerLink) | [Sandfeld — Materials Data Science](https://link.springer.com/book/10.1007/978-3-031-46565-9) |
| Materials Project API | [next.materialsproject.org/api](https://next.materialsproject.org/api) |
| Submit assignments | Via Canvas — not GitHub |

---

## 🗂️ Repository structure

```
mtse6850-[semester]-[year]/
│
├── README.md                  ← You are here
├── environment.yml            ← Conda environment (install first)
├── SETUP_NOTES.md             ← Detailed setup guide + troubleshooting
│
├── week01/
│   ├── week1_starter.ipynb    ← Lab notebook (Parts A–E)
│   └── week1_materials_sample.csv
│
├── week02/
│   ├── week2_notebook.ipynb
│   └── data/
│
├── week03/                    ← ⚠️ 3-lecture week (no live lab)
│   └── week3_notebook.ipynb
│
├── week04/
├── week05/
├── week06/
├── week07/
├── week08/
├── week09/
├── week10/
│   └── week10_mapping_lab.ipynb
│
├── week11/                    ← ⚠️ 3-lecture week — ML case studies
│   ├── week11_metals_ceramics.ipynb
│   ├── week11_polymers.ipynb
│   └── week11_biomaterials.ipynb
│
├── week12/
│   └── week12_gnn_lab.ipynb
│
├── week13/
│   └── week13_final_presentations.md
│
└── resources/
    ├── mp_api_quickstart.md   ← Materials Project API cheat sheet
    ├── pymatgen_primer.md     ← Pymatgen Structure object guide
    ├── binder_fallback.md     ← How to use Binder if setup fails
    └── citation_guide.md     ← How to cite datasets and tools
```

---

## ⚙️ Setup instructions

### Step 1 — Install Anaconda

Download and install **Anaconda (Python 3.10+)** from [anaconda.com/download](https://www.anaconda.com/download).

> **Windows users:** After installation, use **Anaconda Prompt** (not PowerShell or cmd) for all commands below.

### Step 2 — Clone this repository

```bash
git clone https://github.com/[your-org]/mtse6850-[semester]-[year].git
cd mtse6850-[semester]-[year]
```

Or download the ZIP from GitHub → Code → Download ZIP and extract it.

### Step 3 — Create the course conda environment

```bash
conda env create -f environment.yml
```

This will take 5–10 minutes. It installs all packages needed for the full semester.

### Step 4 — Activate the environment

```bash
conda activate matds
```

You should see `(matds)` at the start of your terminal prompt. **Always activate this environment before working on course notebooks.**

### Step 5 — Launch JupyterLab

```bash
jupyter lab
```

JupyterLab will open in your browser. Navigate to the `week01/` folder and open `week1_starter.ipynb`.

> **Note:** This course uses **JupyterLab** (not the classic Jupyter Notebook interface). Both are installed, but always use `jupyter lab` to launch.

### Step 6 — Register your Materials Project API key

1. Go to [next.materialsproject.org/api](https://next.materialsproject.org/api)
2. Create a free account and copy your API key
3. **Do not hardcode your API key in notebooks.** Instead, create a `.env` file in the repository root:

```bash
# Create a .env file (this file is gitignored — never commit it)
echo "MP_API_KEY=your_key_here" > .env
```

Then load it in any notebook with:

```python
from dotenv import load_dotenv
import os
load_dotenv()
API_KEY = os.getenv("MP_API_KEY")
```

> **API key takes up to 1 hour to activate after registration.** Use the Binder fallback link (see `resources/binder_fallback.md`) in the meantime during Week 1.

### Step 7 — Week 12 only: Install PyTorch Geometric

PyTorch Geometric (PyG) is used in Week 12 for graph neural networks. It requires a separate install step after the base environment is set up, because the correct version depends on your OS and whether you have a GPU.

Instructions will be posted in the Week 12 Canvas module. Do not install PyG early — it can conflict with the base environment if done incorrectly.

---

## ⚠️ Known compatibility notes

### matminer + mp-api

`matminer`'s built-in `MPDataRetrieval` class uses a legacy API that is incompatible with `mp-api >= 0.31`. **Do not use `matminer.data_retrieval.retrieve_MP.MPDataRetrieval` in this course.** All course notebooks use `mp_api.client.MPRester` directly for database queries.

```python
# ✅ Use this (mp-api, new interface)
from mp_api.client import MPRester
with MPRester(API_KEY) as mpr:
    results = mpr.summary.search(elements=["Fe", "O"], fields=["material_id", "band_gap"])

# ❌ Do not use this (matminer legacy, will raise NotImplementedError)
# from matminer.data_retrieval.retrieve_MP import MPDataRetrieval
```

`matminer` is still used in this course for its **featurizers** (e.g. `ElementProperty`, `StructureToOxidStateDecorator`), which work correctly with current pymatgen.

### Python version

This environment is pinned to **Python 3.10**. Do not upgrade to 3.11 or 3.12 without checking pymatgen and PyG compatibility first.

### GPU support

The `environment.yml` installs PyTorch in CPU-only mode (sufficient for all course notebooks). If you have an NVIDIA GPU and want to enable GPU training, replace the `pytorch::cpuonly` line in `environment.yml` with the appropriate CUDA version. See [pytorch.org/get-started](https://pytorch.org/get-started/locally/) for the correct command for your system.

---

## 📅 Course schedule at a glance

| Week | Topic | Chapters | Format | Lab |
|------|-------|----------|--------|-----|
| 1 | Introduction to materials data science | Ch. 1–2 | Lec 75 + Lab 75 + Day2 75 | Python primer, MP API |
| 2 | Data representation & experimental design | Ch. 3–4 | Lec 75 + Lab 75 + Day2 75 | MP API, CIF/POSCAR, exp. data |
| 3 ⚠️ | Probability, statistics & distributions | Ch. 5–8 | 3 × Lec 75 (no live lab) | Take-home: statistical analysis |
| 4 | Exploratory data analysis | Ch. 9–10 | Lec 75 + Lab 75 + Day2 75 | EDA on MP dataset |
| 5 | ML foundations + tree-based models | Ch. 11 + inst. | Lec 75 + Lab 75 + Day2 75 | Random forest pipeline |
| 6 | Regression & predictive modeling | Ch. 12–13 | Lec 75 + Lab 75 + Day2 75 | Formation energy regression |
| 7 | No Classes |
| 8 | Classification methods | Ch. 14 | Lec 75 + Lab 75 + Day2 75 | Phase stability classification |
| 9 | PCA, dimensionality reduction & clustering | Ch. 15 | Lec 75 + Lab 75 + Day2 75 | UMAP on MP oxides |
| 10 | Feature engineering, model tuning & structure-property mapping | Ch. 16 | Lec 75 + Lab 75 + Day2 75 | Full mapping lab |
| 11 ⚠️ | ML case studies — metals, ceramics, polymers, biomaterials | Ch. 17 + inst. | 3 × Lec 75 (no live lab) | Take-home: class-specific dataset |
| 12 | Deep learning & graph neural networks | Ch. 17–18 + inst. | Lec 75 + Lab 75 + Day2 75 | CGCNN with PyG |
| 13 | Advanced architectures + final presentations | Ch. 19 | Lec 75 + Lab 75 + Day2 75 | Final presentations |

> ⚠️ Weeks 3 and 10 run three 75-minute lecture sessions instead of the standard format. No live lab session those weeks — notebooks are fully take-home.

---

## 📝 Assignments & submission

**All assignments are submitted via Canvas — not GitHub.**

| Assignment | Weight | Due |
|---|---|---|
| Weekly lab notebooks (10) | 30% | Sunday 11:59 PM each week |
| Discussion posts | 10% | Post Wed, reply Sat |
| Model critique essay | 15% | End of Week 6 |
| Midterm: reproduce & extend | 20% | End of Week 10 |
| Final research project | 25% | Week 13 |

---

## 🛠️ Troubleshooting

**See `SETUP_NOTES.md`** for a full troubleshooting guide covering the most common issues:

- `conda activate` failing on Windows
- `mp-api` import errors
- API key not recognized
- JupyterLab not opening in browser
- pymatgen install conflicts
- PyG install errors (Week 12)

**Still stuck?** Post in the **"Week N Setup Help"** discussion thread on Canvas. The instructor checks daily during the first two weeks. Classmates are encouraged to help.

---

## 📚 Key tools & references

| Tool | Purpose | Docs |
|---|---|---|
| `pymatgen` | Crystal structure manipulation, file I/O | [pymatgen.org](https://pymatgen.org) |
| `mp-api` | Materials Project database queries | [docs.materialsproject.org](https://docs.materialsproject.org) |
| `matminer` | Materials featurization (descriptors) | [hackingmaterials.lbl.gov/matminer](https://hackingmaterials.lbl.gov/matminer) |
| `scikit-learn` | ML models, validation, preprocessing | [scikit-learn.org](https://scikit-learn.org) |
| `torch-geometric` | Graph neural networks (Week 11) | [pytorch-geometric.readthedocs.io](https://pytorch-geometric.readthedocs.io) |
| `umap-learn` | Dimensionality reduction | [umap-learn.readthedocs.io](https://umap-learn.readthedocs.io) |
| `shap` | Feature importance / model interpretation | [shap.readthedocs.io](https://shap.readthedocs.io) |

---

## 🔒 Academic integrity & data use

- **Do not commit your MP API key** to this repository. The `.env` file is listed in `.gitignore`. Never paste your key directly into a notebook cell that gets submitted.
- **Do not commit student data**, grades, or any FERPA-protected content to this repository.
- Lab notebooks contain starter code and scaffolding. The work you add — your analysis, your interpretations, your Part E reflections — must be your own.
- Materials Project data is available under a [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/). Cite it appropriately in your final project report (see `resources/citation_guide.md`).

---

## 📄 License

Course materials in this repository are provided for enrolled students in EMA 6938. Lecture content, notebook scaffolding, and data files are © Prajakatta Mulay, University of Florida, 2026. Do not redistribute without permission.

---

*Last updated: 05/07/2026 · Questions? Post on Canvas or email prajakatta@ufl.edu*
