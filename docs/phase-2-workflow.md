# TRUTHLENS AI — Phase 2: Dataset Collection and AI Model Development

> **Objective:** Train a binary image classifier that can distinguish authentic images from AI-generated or manipulated images.  
> **Hardware:** NVIDIA RTX 3050 (4GB VRAM) for local testing; Google Colab Pro for full training.  
> **Target:** Image detection only. Video detection is Phase 5.

---

## Overview

Phase 2 is the most technically demanding phase. You will collect datasets, preprocess images, train a convolutional neural network, evaluate it, and export the trained model for deployment. This phase happens entirely outside the FastAPI web application.

---

## 1. Which Datasets to Use

### Recommended Datasets for Image Detection

| Dataset | Type | Images | Focus | Recommendation |
|---|---|---|---|---|
| **CIFAKE** | Real vs AI-generated | 120,000 | CIFAR-10 real vs Stable Diffusion | ✅ **Start here** — clean, balanced, easy to download |
| **FakeAVCeleb** | AI-generated faces | ~20,000 | GAN and diffusion face synthesis | ✅ Good for face-focused detection |
| **GenImage** | AI-generated scenes | 1.3M | 8 different generators (SD, MJ, DALLE, etc.) | ✅ Excellent diversity; use a subset |
| **FaceForensics++** | Face manipulation | ~1,000 videos → frames | Face swap, expression transfer | ⚠️ Requires academic registration; video format |
| **Celeb-DF** | Face swap | ~6,000 videos → frames | High-quality deepfakes | ⚠️ Academic registration required |
| **DFDC (DeepFake Detection Challenge)** | Deepfakes | 100,000+ videos | Multi-method manipulation | ⚠️ 470GB — too large for initial training |

### Recommended Starting Dataset Combination

For a second-year CS student with limited compute, start with:

1. **CIFAKE** — 60,000 real + 60,000 AI-generated images. Clean train/test split already provided.
2. **A subset of GenImage** — 50,000 real + 50,000 AI-generated from 2–3 generators.
3. **Augment** real images with JPEG compression and resizing to simulate social media.

This gives approximately **200,000 training images** — enough for meaningful learning.

---

## 2. Where to Obtain the Datasets

### CIFAKE
- **URL:** [https://www.kaggle.com/datasets/birdy654/cifake-real-and-ai-generated-synthetic-images](https://www.kaggle.com/datasets/birdy654/cifake-real-and-ai-generated-synthetic-images)
- **Size:** ~1.5 GB
- **Download:** `kaggle datasets download -d birdy654/cifake-real-and-ai-generated-synthetic-images`
- **Format:** Pre-organized `train/` and `test/` folders with `REAL/` and `FAKE/` subfolders

### GenImage (subset)
- **URL:** [https://github.com/GenImage-Dataset/GenImage](https://github.com/GenImage-Dataset/GenImage)
- **Download:** Via Hugging Face datasets — download only the generators you need
- **Recommended subset:** Stable Diffusion v1.4, Midjourney

### FaceForensics++
- **URL:** [https://github.com/ondyari/FaceForensics](https://github.com/ondyari/FaceForensics)
- **Access:** Fill form at the GitHub link. Approval takes 1–3 days.
- **Note:** Download only the compressed (c23) versions to save space.

---

## 3. Dataset Licensing and Usage Restrictions

| Dataset | License | Restrictions |
|---|---|---|
| CIFAKE | CC BY 4.0 | Free for research and commercial use |
| GenImage | Research only | Academic/non-commercial research only |
| FaceForensics++ | Research only | Cannot be redistributed; must sign request form |
| Celeb-DF | Research only | Non-commercial; fill request form |
| DFDC | Research only | Facebook AI terms; non-commercial |

**Important:** Do not redistribute any research dataset. Do not use research-only datasets in a commercial product without reviewing the licence terms. For a student project and research portfolio, all these datasets are acceptable.

---

## 4. How to Organize the Dataset

Create this folder structure outside the web application project:

```
datasets/
├── raw/                      ← Downloaded, untouched originals
│   ├── cifake/
│   │   ├── train/
│   │   │   ├── REAL/
│   │   │   └── FAKE/
│   │   └── test/
│   │       ├── REAL/
│   │       └── FAKE/
│   └── genimage_subset/
│       ├── real/
│       └── fake/
│
├── processed/                ← Cleaned, preprocessed, deduplicated
│   ├── train/
│   │   ├── real/
│   │   └── fake/
│   ├── val/
│   │   ├── real/
│   │   └── fake/
│   └── test/
│       ├── real/
│       └── fake/
│
└── metadata/                 ← CSV files tracking image hashes, splits
    ├── dataset_registry.csv
    ├── train_manifest.csv
    └── test_manifest.csv
```

**Add `datasets/` to `.gitignore`.** Never commit dataset files to git.

---

## 5. How to Clean and Preprocess Images

Write a Python preprocessing script (`scripts/prepare_dataset.py`):

```python
from PIL import Image, UnidentifiedImageError
import os, hashlib, csv, shutil

def is_valid_image(path: str) -> bool:
    """Check if file is a valid, loadable image."""
    try:
        with Image.open(path) as img:
            img.verify()  # checks file integrity
        return True
    except (UnidentifiedImageError, Exception):
        return False

def preprocess_image(src_path: str, dst_path: str, size: int = 224):
    """Resize to square, convert to RGB, save as JPEG."""
    with Image.open(src_path) as img:
        img = img.convert('RGB')
        img = img.resize((size, size), Image.LANCZOS)
        img.save(dst_path, 'JPEG', quality=95)
```

**Preprocessing steps:**
1. Verify every image opens without error (remove corrupt files)
2. Convert all images to RGB (remove RGBA, grayscale, palette modes)
3. Resize to 224×224 pixels (standard input size for EfficientNet, ResNet)
4. Save as JPEG at quality 95
5. Record the original path and processed path in a CSV manifest

---

## 6. How to Detect Duplicate Images and Prevent Data Leakage

Data leakage means the same image (or near-identical image) appears in both training and test sets. This will give falsely high accuracy.

**Method: Perceptual hashing**

```python
import hashlib
from PIL import Image

def file_hash(path: str) -> str:
    """MD5 hash of raw file bytes — catches exact duplicates."""
    with open(path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

# For near-duplicate detection, use imagehash library:
# pip install imagehash
import imagehash

def perceptual_hash(path: str) -> str:
    with Image.open(path) as img:
        return str(imagehash.phash(img))
```

**Process:**
1. Compute perceptual hash for every image in both real and fake collections
2. Build a set of all hashes
3. Remove any image whose hash already exists in the set
4. Only after deduplication, split into train/val/test

---

## 7. How to Split Training, Validation, and Test Datasets

**Recommended split:**
- **Training:** 70% — model learns from this
- **Validation:** 15% — used during training to tune hyperparameters and monitor overfitting
- **Test:** 15% — used ONCE at the end to report final performance

**Important rules:**
- Split by image identity, not randomly across all images. If you have 10 images of the same scene, they should all go into the same split.
- Never use test data to make training decisions (no "peeking").
- Record your split in a CSV file so it is reproducible.

```python
from sklearn.model_selection import train_test_split

all_real = [...]   # list of real image paths
all_fake = [...]   # list of fake image paths

real_train, real_temp = train_test_split(all_real, test_size=0.30, random_state=42)
real_val, real_test = train_test_split(real_temp, test_size=0.50, random_state=42)

fake_train, fake_temp = train_test_split(all_fake, test_size=0.30, random_state=42)
fake_val, fake_test = train_test_split(fake_temp, test_size=0.50, random_state=42)
```

---

## 8. Which Pretrained Architecture is Suitable

**Recommendation: EfficientNet-B0 or EfficientNet-B4**

### Comparison

| Architecture | Parameters | ImageNet Accuracy | VRAM (batch=16) | Speed | Recommendation |
|---|---|---|---|---|---|
| EfficientNet-B0 | 5.3M | 77.1% | ~2GB | Fast | ✅ Best for initial experiments on RTX 3050 |
| EfficientNet-B4 | 19M | 83.0% | ~3.5GB | Medium | ✅ Best accuracy within 4GB VRAM |
| ResNet-50 | 25M | 80.9% | ~3GB | Medium | Good baseline |
| ConvNeXt-Tiny | 28M | 82.1% | ~3.5GB | Medium | Excellent modern alternative |
| ViT-B/16 | 86M | 84.1% | >4GB | Slow | ❌ Too large for RTX 3050 |
| EfficientNet-B7 | 66M | 84.9% | >4GB | Slow | ❌ Too large for RTX 3050 |

**Final recommendation for Phase 2:**
- **Start with EfficientNet-B0** for quick iteration and debugging.
- **Graduate to EfficientNet-B4** for final training on Google Colab.
- Both are pretrained on ImageNet. Fine-tuning adds a custom binary classification head.

---

## 9. EfficientNet vs ResNet vs ConvNeXt

### EfficientNet-B4

**Pros:**
- Excellent accuracy-to-parameter ratio
- Well-tested in deepfake detection research
- Supported in `torchvision.models`
- 4GB VRAM compatible with batch size 8–16

**Cons:**
- Squeeze-and-excitation blocks add complexity
- Slower than ResNet at the same accuracy level

### ResNet-50

**Pros:**
- Very well understood; hundreds of tutorials
- Fast training
- Good baseline for comparison

**Cons:**
- Older architecture; lower accuracy than EfficientNet at same parameter count
- Good for establishing a baseline, not final production

### ConvNeXt-Tiny

**Pros:**
- Modern architecture (2022); strong performance
- Simple design; pure convolutional, no attention
- Strong generalization

**Cons:**
- Fewer deepfake-specific research papers using it (but it works well)
- Slightly larger than EfficientNet-B0

**Recommendation:** Use **EfficientNet-B4** as the primary model. Use **ResNet-50** as a baseline comparison. Record both results.

---

## 10. How to Train and Fine-Tune Using PyTorch

### Training Script Structure (`scripts/train.py`)

```python
import torch
import torch.nn as nn
from torchvision import models, transforms
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder

# ── 1. Device ──────────────────────────────────
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Training on: {device}")

# ── 2. Data transforms ─────────────────────────
# MUST match what you do in the inference pipeline
train_transforms = transforms.Compose([
    transforms.Resize(256),
    transforms.RandomCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),  # ImageNet stats
])

val_transforms = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# ── 3. Datasets ────────────────────────────────
train_dataset = ImageFolder('datasets/processed/train', transform=train_transforms)
val_dataset   = ImageFolder('datasets/processed/val',   transform=val_transforms)

train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True,  num_workers=4)
val_loader   = DataLoader(val_dataset,   batch_size=16, shuffle=False, num_workers=4)

# ── 4. Model ───────────────────────────────────
model = models.efficientnet_b4(weights=models.EfficientNet_B4_Weights.DEFAULT)

# Freeze all layers first (feature extraction phase)
for param in model.parameters():
    param.requires_grad = False

# Replace the classification head
in_features = model.classifier[1].in_features
model.classifier = nn.Sequential(
    nn.Dropout(0.4),
    nn.Linear(in_features, 256),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(256, 2),  # 2 classes: real, fake
)
model = model.to(device)

# ── 5. Loss + Optimizer ────────────────────────
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.classifier.parameters(), lr=1e-3, weight_decay=1e-4)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)

# ── 6. Training loop ───────────────────────────
NUM_EPOCHS = 10

for epoch in range(NUM_EPOCHS):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for inputs, labels in train_loader:
        inputs, labels = inputs.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        _, predicted = outputs.max(1)
        correct += predicted.eq(labels).sum().item()
        total += labels.size(0)

    train_acc = 100.0 * correct / total
    print(f"Epoch {epoch+1}/{NUM_EPOCHS} | Loss: {running_loss/len(train_loader):.4f} | Acc: {train_acc:.2f}%")
    scheduler.step()

    # Validate after each epoch
    model.eval()
    val_correct = 0
    val_total = 0
    with torch.no_grad():
        for inputs, labels in val_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            _, predicted = outputs.max(1)
            val_correct += predicted.eq(labels).sum().item()
            val_total += labels.size(0)
    print(f"           Val Acc: {100.0*val_correct/val_total:.2f}%")

# ── 7. Unfreeze and fine-tune ──────────────────
# After 10 epochs of head-only training, unfreeze last 2 blocks
for name, param in model.named_parameters():
    if 'features.7' in name or 'features.8' in name or 'classifier' in name:
        param.requires_grad = True

optimizer = torch.optim.AdamW(
    filter(lambda p: p.requires_grad, model.parameters()),
    lr=1e-4,  # much lower lr for fine-tuning
    weight_decay=1e-4
)
# Continue training for another 10 epochs...
```

---

## 11. Google Colab vs Local Laptop

| Factor | Local RTX 3050 (4GB) | Google Colab Free (T4 16GB) | Google Colab Pro (A100 40GB) |
|---|---|---|---|
| VRAM | 4GB | 16GB | 40GB |
| Batch size | 8–16 | 64–128 | 256+ |
| Training speed (100K images) | ~8–12 hours | ~2–4 hours | ~30–60 mins |
| Session limit | Unlimited | 2–4 hours | 24 hours |
| Cost | Electricity | Free | ~\$10/month |
| Data access | Direct disk | Upload to Drive | Upload to Drive |
| Persistence | ✅ Files stay | ❌ Session lost | ✅ Saves to Drive |

**Recommendation:**
1. **Debug and iterate locally** on a small subset (5,000 images) using RTX 3050.
2. **Train the final model on Colab Pro** with the full dataset.
3. **Save model checkpoint to Google Drive** at the end of each Colab session.

**Critical Colab practice:**
```python
# At the start of every Colab session, mount Drive and save checkpoints there
from google.colab import drive
drive.mount('/content/drive')

# Save checkpoint every 5 epochs:
torch.save({
    'epoch': epoch,
    'model_state_dict': model.state_dict(),
    'optimizer_state_dict': optimizer.state_dict(),
    'val_acc': val_acc,
}, '/content/drive/MyDrive/truthlens/checkpoints/epoch_{epoch}.pth')
```

---

## 12. How to Evaluate the Model

Evaluation is covered in depth in Phase 3. Summary of metrics to compute:

```python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix
)
import numpy as np

# After running model on test set:
# y_true: list of true labels (0=real, 1=fake)
# y_pred: list of predicted labels
# y_prob: list of predicted probabilities for class "fake"

metrics = {
    'accuracy':  accuracy_score(y_true, y_pred),
    'precision': precision_score(y_true, y_pred),
    'recall':    recall_score(y_true, y_pred),
    'f1':        f1_score(y_true, y_pred),
    'roc_auc':   roc_auc_score(y_true, y_prob),
}

cm = confusion_matrix(y_true, y_pred)
print("Confusion Matrix:", cm)
# [[TN, FP], [FN, TP]]
```

---

## 13. How to Save and Export the Trained Model

```python
# ── Save full checkpoint (for resuming training) ──
torch.save({
    'model_state_dict': model.state_dict(),
    'class_names': train_dataset.classes,  # ['fake', 'real']
    'input_size': 224,
    'normalize_mean': [0.485, 0.456, 0.406],
    'normalize_std': [0.229, 0.224, 0.225],
    'val_accuracy': val_acc,
}, 'models/truthlens_v0.1_checkpoint.pth')

# ── Save model in TorchScript format (for production inference) ──
model.eval()
scripted = torch.jit.script(model)
scripted.save('models/truthlens_v0.1_scripted.pt')

# ── Export to ONNX (optional — for future deployment flexibility) ──
dummy_input = torch.randn(1, 3, 224, 224).to(device)
torch.onnx.export(
    model, dummy_input,
    'models/truthlens_v0.1.onnx',
    opset_version=17,
    input_names=['image'],
    output_names=['logits'],
    dynamic_axes={'image': {0: 'batch_size'}, 'logits': {0: 'batch_size'}}
)
```

**Add to `.gitignore`:**
```
models/*.pth
models/*.pt
models/*.onnx
```

**Store trained models in:** `models/` folder in the project root (not in `frontend/` or `backend/`).

---

## Phase 2 Acceptance Criteria

Before moving to Phase 3, verify:

- [ ] At least one dataset fully downloaded, cleaned, and split
- [ ] Preprocessing script produces consistent 224×224 RGB JPEG images
- [ ] No duplicate images in training and test sets
- [ ] Training script runs without errors on a small subset locally
- [ ] Model trains on Colab and saves a checkpoint to Google Drive
- [ ] Validation accuracy > 70% on initial training run (EfficientNet-B0, 10 epochs)
- [ ] Model checkpoint file saved in `models/` folder
- [ ] No training data or model files committed to git

