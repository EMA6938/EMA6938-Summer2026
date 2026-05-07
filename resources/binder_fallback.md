# Binder Fallback — How to Use Binder If Local Setup Fails

**Course:** EMA 6938 — Data Science for Materials  
**Binder:** https://mybinder.org  
**Use this if:** Your local Anaconda installation is not working and you need to run a notebook before the deadline.

---

## What is Binder?

Binder is a free online service that runs Jupyter notebooks in your browser — no installation required. It reads the `environment.yml` file from the course GitHub repository and builds a cloud environment with all required packages pre-installed.

**You do not need to install anything.** You only need a web browser.

---

## How to launch the course Binder

### Option 1 — Click the Binder link (fastest)

A Binder launch link for this course is posted in the Canvas Week 1 module under **Setup Support**. Click it and wait 2–5 minutes for the environment to build on the first launch.

### Option 2 — Launch manually

1. Go to **mybinder.org**
2. Fill in the fields:

| Field | Value |
|---|---|
| GitHub repository URL | `https://github.com/mtse6850/mtse6850-fall2026` |
| Git ref (branch/tag/commit) | `main` |
| Path to a notebook (optional) | `week01/week1_starter.ipynb` |

3. Click the **launch** button
4. Wait for the build to complete (2–5 minutes on first launch, faster on repeat)

---

## What Binder includes

The Binder environment is built from the course `environment.yml` and includes:

- Python 3.10
- NumPy, pandas, matplotlib, seaborn
- Pymatgen and mp-api
- Matminer
- scikit-learn, XGBoost
- All other course packages

---

## Important limitations — read before using

### ⚠️ Sessions time out after ~10 minutes of inactivity

If you leave the browser tab idle, Binder shuts down the session and **you lose any unsaved work**. Download your notebook frequently:

**File → Download** (in JupyterLab) every 15–20 minutes.

### ⚠️ Your MP API key is not stored in Binder

The `.env` file with your API key is not in the GitHub repository (it is gitignored for security). You must enter your key manually each session.

In any cell that loads the API key, replace the `load_dotenv()` approach with a direct assignment:

```python
# Replace this:
from dotenv import load_dotenv
import os
load_dotenv()
API_KEY = os.getenv("MP_API_KEY")

# With this (Binder only — never commit this to GitHub):
API_KEY = "paste_your_actual_key_here"
```

**After your session ends, this key is gone — Binder does not save it.**  
Your key is visible in the notebook while the session is active, but since Binder sessions are private to you, this is safe.

### ⚠️ Files do not persist between sessions

When your Binder session ends, everything you created or modified is deleted. Always download your completed notebook before closing the tab.

### ⚠️ Binder is a fallback, not a permanent solution

Binder servers are shared and can be slow during peak hours. The goal is to use Binder just long enough to resolve your local installation issue. Work with the instructor and the Setup Help thread on Canvas to fix your local environment — do not rely on Binder for the entire semester.

---

## Saving your work

### Download your notebook

In JupyterLab: **File → Save Notebook** first, then **File → Download**. The `.ipynb` file downloads to your local Downloads folder. Upload this to Canvas to submit.

### Download all files at once

In JupyterLab: right-click a folder in the file browser on the left → **Download**. This downloads a ZIP of the folder.

---

## Submitting from Binder

1. Complete your work in Binder
2. Download the notebook: File → Download
3. Rename the file: `[LastName]_week1.ipynb`
4. Upload to Canvas as normal

---

## If Binder fails to build

Binder builds can occasionally fail if mybinder.org is overloaded. Try:

1. Wait 5 minutes and click the launch link again
2. Try a different browser
3. Try **Google Colab** as an alternative (see below)

---

## Alternative: Google Colab

If Binder is unavailable, Google Colab is a reliable alternative. It requires a Google account.

### How to open the course notebook in Colab

1. Go to **colab.research.google.com**
2. Click **File → Open notebook → GitHub**
3. Enter the repository URL: `https://github.com/mtse6850/mtse6850-fall2026`
4. Select the notebook you need (e.g. `week01/week1_starter.ipynb`)

### Install course packages in Colab

Colab does not have all course packages pre-installed. Run this cell at the top of any notebook before anything else:

```python
# Run this cell first in Google Colab
!pip install pymatgen mp-api matminer python-dotenv xgboost umap-learn --quiet
```

This takes about 2–3 minutes. After installation, proceed normally.

### Set your API key in Colab

```python
# In Colab — enter your API key directly (session is private)
API_KEY = "paste_your_actual_key_here"
```

### Save your work in Colab

Colab saves automatically to your Google Drive. To download: **File → Download → Download .ipynb**.

---

## Getting help with setup

If you are using Binder or Colab more than once, your local setup needs fixing. Post in the **Week N Setup Help** discussion thread on Canvas with:

1. Your operating system (Windows / Mac / Linux) and version
2. The exact error message from your terminal
3. Which step of the setup guide failed

The instructor checks this thread daily during the first two weeks. Do not wait until the deadline to ask for help.

---

*Last updated: 05/07/2026*
