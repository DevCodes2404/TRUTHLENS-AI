# TRUTHLENS AI — Complete Development Roadmap

> **Document Purpose:** End-to-end technical guide for developing TRUTHLENS AI from Phase 1 foundation into a fully working AI-powered media authenticity detection platform.  
> **Target Reader:** Second-year CS student using Antigravity IDE and AI assistance.  
> **Principle:** Every recommendation is based on the actual existing project. No fabricated benchmarks.

---

## Table of Contents

1. [Phase 1 — UI and Project Foundation](#phase-1--ui-and-project-foundation-status-complete)
2. [Phase 2 — Dataset Collection and Model Development](#phase-2--dataset-collection-and-ai-model-development)
3. [Phase 3 — Model Evaluation and Improvement](#phase-3--model-evaluation-and-improvement)
4. [Phase 4 — Model and Backend Integration](#phase-4--model-and-backend-integration)
5. [Phase 5 — Advanced Forensic Features](#phase-5--advanced-forensic-features)
6. [Phase 6 — Testing and Security](#phase-6--testing-and-security)
7. [Phase 7 — Deployment](#phase-7--deployment)
8. [Implementation Task Roadmap](#implementation-task-roadmap)
9. [Final Product Capabilities](#final-product-capabilities)

---

## PHASE 1 — UI and Project Foundation (Status: COMPLETE)

### Completed Features ✅

| Feature | Verification |
|---|---|
| React 19 + TypeScript + Vite build pipeline | `tsc --noEmit`: 0 errors |
| Tailwind CSS v4 design system with tokens | Builds in 827ms |
| 8 application pages with routing | All routes functional |
| Collapsible top navigation + mobile drawer | Tested in browser |
| Media Scanner with drag-drop + validation | File type + size validation working |
| Toast notification system | 4 variants implemented |
| Modal component | Animated entry/exit |
| FastAPI backend with CORS + error handling | Serving at port 8000 |
| Health check endpoint `/api/v1/health` | Returns 200 OK |
| Pydantic v2 schemas | Health + scan schemas defined |
| SQLAlchemy async PostgreSQL scaffold | Engine defined, not connected |
| Pytest async test suite | 2/2 tests passing |
| `DevNotice` component on all unfinished features | Zero fake predictions displayed |
| `.env.example` + `.gitignore` | Present |

### Incomplete Features / Remaining Tasks

| Task | Priority | Effort |
|---|---|---|
| Initialize git repository | 🔴 Critical | 5 minutes |
| Update `.gitignore` (add `datasets/`, `models/`, `uploads/`, `*.pth`) | 🔴 Critical | 2 minutes |
| Remove scaffold leftovers (`App.css`, `react.svg`, `vite.svg`) | 🟡 Medium | 2 minutes |
| Fix hardcoded `POSTGRES_PASSWORD` default in `config.py` | 🟡 Medium | 5 minutes |
| Add `SECRET_KEY` to `config.py` and `.env.example` | 🟡 Medium | 5 minutes |
| Fix `error: any` in `api/client.ts` → type as `AxiosError` | 🟢 Low | 10 minutes |
| Add `React.lazy()` code splitting for pages | 🟢 Low | 30 minutes |
| Register custom 404 exception handler in FastAPI | 🟢 Low | 10 minutes |

### Phase 1 Final Acceptance Criteria

- [ ] Git repository initialized with initial commit
- [ ] `tsc --noEmit` returns 0 errors
- [ ] `npm run build` completes without errors
- [ ] `pytest backend/tests` returns 100% pass
- [ ] No fake AI predictions presented anywhere in the UI
- [ ] Both servers start and health check succeeds

---

## PHASE 2 — Dataset Collection and AI Model Development

> See `docs/phase-2-workflow.md` for the detailed technical guide.

### Summary

**Goal:** Train a binary image classifier (real vs AI-generated/manipulated).

**Primary Dataset:** CIFAKE (120,000 images, clean split, easy download via Kaggle).  
**Secondary Dataset:** A 50,000-image subset of GenImage.  
**Architecture:** EfficientNet-B4 pretrained on ImageNet, fine-tuned with custom classification head.  
**Training Infrastructure:** Debug locally (RTX 3050), full training on Google Colab Pro.

### Phase 2 Milestones

| Milestone | Deliverable | Completion Criteria |
|---|---|---|
| M2.1 | Dataset downloaded and verified | CIFAKE in `datasets/raw/`, all images open |
| M2.2 | Preprocessing pipeline | 224×224 RGB JPEG images in `datasets/processed/` |
| M2.3 | Deduplication | Hash manifest in `datasets/metadata/`, no cross-split duplicates |
| M2.4 | Local debug run | Model trains on 1,000 images for 2 epochs without error |
| M2.5 | Colab full training | 50+ epochs on full dataset; val accuracy > 85% |
| M2.6 | Model checkpoint saved | `.pth` file in `models/`, not in git |

### Common Mistakes to Avoid in Phase 2

- **Do not** normalize with wrong mean/std. Always use ImageNet values `[0.485, 0.456, 0.406]` / `[0.229, 0.224, 0.225]` if using pretrained ImageNet weights.
- **Do not** deduplicate after splitting. Deduplicate first, then split.
- **Do not** test on the validation set repeatedly. Validation = tuning decisions only. Keep test set untouched until final evaluation.
- **Do not** use `batch_size=32` on RTX 3050 with EfficientNet-B4. Use 8 or 16 max.
- **Do not** forget to set `model.eval()` before inference and `torch.no_grad()` during evaluation.

---

## PHASE 3 — Model Evaluation and Improvement

### Understanding the Metrics

#### Accuracy
Percentage of all predictions that are correct.

```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
```

**Limitation:** If your dataset is 95% real images, a model that always says "real" gets 95% accuracy but is useless for detection. Never report accuracy alone.

#### Precision
Of all images the model calls "AI-generated", what fraction are actually AI-generated?

```
Precision = TP / (TP + FP)
```

Low precision → many false alarms (genuine images flagged as fake).

#### Recall
Of all actual AI-generated images, what fraction did the model catch?

```
Recall = TP / (TP + FN)
```

Low recall → many real fakes slip through undetected.

#### F1-Score
Harmonic mean of Precision and Recall. Use this as the primary single metric.

```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

**Target for Phase 2:** F1 > 0.85 on the held-out test set.

#### ROC-AUC
Area Under the Receiver Operating Characteristic Curve. Measures the model's ability to distinguish real from fake across all classification thresholds.

- 0.5 = random guessing (useless)
- 0.90+ = excellent
- 1.0 = perfect (probably overfitting)

**Target:** AUC > 0.90.

#### Confusion Matrix
Shows the four types of outcomes in a 2×2 table:

```
                 Predicted REAL  |  Predicted FAKE
Actually REAL  |      TN        |       FP
Actually FAKE  |      FN        |       TP
```

- **True Positive (TP):** Correctly identified as AI-generated ✅
- **True Negative (TN):** Correctly identified as real ✅
- **False Positive (FP):** Real image flagged as fake ❌ (damages user trust)
- **False Negative (FN):** Fake image marked as real ❌ (dangerous miss)

For TRUTHLENS AI, **False Negatives are more dangerous than False Positives.** Tune the classification threshold accordingly.

### Evaluation Script

```python
import torch
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix, classification_report
)

model.eval()
all_preds, all_labels, all_probs = [], [], []

with torch.no_grad():
    for inputs, labels in test_loader:
        inputs = inputs.to(device)
        outputs = model(inputs)
        probs = torch.softmax(outputs, dim=1)[:, 1]  # prob of "fake" class
        preds = (probs > 0.5).long().cpu().numpy()

        all_preds.extend(preds)
        all_labels.extend(labels.numpy())
        all_probs.extend(probs.cpu().numpy())

print("=" * 50)
print("TRUTHLENS AI — Model Evaluation Report")
print("=" * 50)
print(f"Accuracy:  {accuracy_score(all_labels, all_preds):.4f}")
print(f"Precision: {precision_score(all_labels, all_preds):.4f}")
print(f"Recall:    {recall_score(all_labels, all_preds):.4f}")
print(f"F1-Score:  {f1_score(all_labels, all_preds):.4f}")
print(f"ROC-AUC:   {roc_auc_score(all_labels, all_probs):.4f}")
print()
print("Confusion Matrix:")
print(confusion_matrix(all_labels, all_preds))
print()
print(classification_report(all_labels, all_preds, target_names=['Real', 'Fake']))
```

### Generalization to Unseen Generators

**Critical challenge:** A model trained primarily on Stable Diffusion images may fail on DALL-E or Midjourney images.

**How to test generalization:**
1. Hold out all images from one generator completely from training.
2. After training, evaluate on that held-out generator.
3. Compare accuracy on seen vs unseen generators.
4. A gap of more than 15% indicates poor generalization.

**How to improve generalization:**
- Train on more diverse generators (at least 4–5 different sources).
- Use data augmentation (JPEG compression, resizing, cropping) during training.
- Use frequency-domain augmentation to prevent fitting to generator-specific artifacts.

### Robustness Against Compression and Resizing

Real-world images are often JPEG-compressed when shared on social media. This destroys the high-frequency artifacts that many detectors rely on.

**Test for compression robustness:**
```python
from PIL import Image
import io

def compress_image(image: Image.Image, quality: int) -> Image.Image:
    buffer = io.BytesIO()
    image.save(buffer, format='JPEG', quality=quality)
    buffer.seek(0)
    return Image.open(buffer)

# Test at JPEG quality: 95, 80, 65, 50, 30
# Report accuracy at each quality level
```

**Target:** Accuracy should not drop more than 10% at JPEG quality 65.

**How to improve compression robustness:**
- Include JPEG-compressed copies of training images at random quality levels.
- Add `RandomJPEGCompression` as a training augmentation.

### How to Improve the Model Based on Evaluation Results

| Problem | Likely Cause | Solution |
|---|---|---|
| Val accuracy much lower than train accuracy | Overfitting | Add dropout, reduce model complexity, more data augmentation |
| Low recall (missing fakes) | Decision threshold too high | Lower threshold from 0.5 to 0.35 |
| Low precision (too many false alarms) | Decision threshold too low | Raise threshold from 0.5 to 0.65 |
| Fails on JPEG-compressed images | No compression in training | Add JPEG augmentation to transforms |
| Fails on other generators | Insufficient diversity | Add more generators to training set |
| AUC < 0.80 | Model not learning useful features | Try different architecture, check preprocessing pipeline |
| Accuracy stuck near 50% | Class imbalance | Use `WeightedRandomSampler` to balance batches |

### Model Limitations (Honest Assessment)

Document these openly in the application:

1. **Not 100% reliable.** No deepfake detector achieves perfect accuracy. Treat results as estimates, not verdicts.
2. **Generator-specific.** Performance degrades significantly on AI generators not represented in training data.
3. **Compression-sensitive.** Heavy JPEG compression can remove detectable artifacts.
4. **Adversarial attacks.** A motivated attacker who knows our model architecture can craft images that evade detection.
5. **Face-only training limitation.** If trained on face datasets, may underperform on non-face AI-generated images.
6. **No temporal reasoning.** The image model cannot understand context or narrative — it only analyzes pixel-level features.

---

## PHASE 4 — Model and Backend Integration

### Overview

This phase connects the trained PyTorch model to the FastAPI backend and the React frontend. At the end of this phase, users can upload a real image and receive a real AI-generated prediction.

### Step 1: Prepare the Backend for File Uploads

Add to `backend/requirements.txt`:
```
python-multipart>=0.0.9
Pillow>=10.4.0
torch>=2.4.0        # or whichever version you trained with
torchvision>=0.19.0
```

### Step 2: Create the Model Loader Service

Create `backend/app/services/model_service.py`:

```python
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
from pathlib import Path
from backend.app.core.config import settings

class ModelService:
    _instance = None
    _model = None
    _device = None
    _transforms = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        """Load model checkpoint once at startup."""
        self._device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        model_path = Path(settings.MODEL_PATH)

        if not model_path.exists():
            print(f"[WARNING] Model not found at {model_path}. Inference unavailable.")
            return

        # Reconstruct the same architecture used during training
        model = models.efficientnet_b4(weights=None)
        in_features = model.classifier[1].in_features
        model.classifier = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 2),
        )

        checkpoint = torch.load(model_path, map_location=self._device)
        model.load_state_dict(checkpoint['model_state_dict'])
        model.eval()
        model.to(self._device)

        self._model = model
        self._transforms = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            ),
        ])
        print(f"[INFO] Model loaded on {self._device}")

    def is_available(self) -> bool:
        return self._model is not None

    def predict(self, image_bytes: bytes) -> dict:
        """Run inference on uploaded image bytes."""
        if not self.is_available():
            raise RuntimeError("Detection model is not available.")

        # Open and validate image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        tensor = self._transforms(image).unsqueeze(0).to(self._device)

        with torch.no_grad():
            outputs = self._model(tensor)
            probs = torch.softmax(outputs, dim=1)[0]

        # Class 0 = real, Class 1 = fake (matches ImageFolder alphabetical order)
        fake_prob = probs[1].item()
        real_prob = probs[0].item()

        if fake_prob > 0.65:
            label = 'ai_generated'
        elif fake_prob > 0.45:
            label = 'inconclusive'
        else:
            label = 'authentic'

        return {
            'label': label,
            'confidence': round(max(fake_prob, real_prob), 4),
            'probabilities': {
                'authentic': round(real_prob, 4),
                'ai_generated': round(fake_prob, 4),
            }
        }
```

### Step 3: Create the Scan Endpoint

Create `backend/app/api/v1/scan.py`:

```python
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
import uuid
from datetime import datetime, timezone
from backend.app.services.model_service import ModelService

router = APIRouter()

ALLOWED_CONTENT_TYPES = {'image/jpeg', 'image/png', 'image/webp'}
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB


@router.post('/scan', summary='Submit image for authenticity analysis')
async def scan_image(file: UploadFile = File(...)):
    # 1. Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type: {file.content_type}. Use JPEG, PNG, or WEBP."
        )

    # 2. Read and validate file size
    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large: {len(image_bytes)/1024/1024:.1f} MB. Maximum is 20 MB."
        )

    # 3. Verify it's actually an image (not a spoofed MIME type)
    try:
        from PIL import Image
        import io
        with Image.open(io.BytesIO(image_bytes)) as img:
            img.verify()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="File could not be opened as an image. It may be corrupt."
        )

    # 4. Run inference
    service = ModelService.get_instance()
    if not service.is_available():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Detection engine is not currently available."
        )

    try:
        result = service.predict(image_bytes)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference failed: {str(exc)}"
        )

    # 5. Build response
    scan_id = str(uuid.uuid4())
    return {
        'success': True,
        'data': {
            'id': scan_id,
            'filename': file.filename,
            'file_size': len(image_bytes),
            'media_type': 'image',
            'status': 'complete',
            'label': result['label'],
            'confidence': result['confidence'],
            'probabilities': result['probabilities'],
            'signals': [],  # Phase 5: add explainability signals here
            'created_at': datetime.now(timezone.utc).isoformat(),
            'duration_ms': None,  # Phase 4 improvement: measure actual duration
        }
    }
```

### Step 4: Connect Scan API to the Frontend

Add to `frontend/src/api/client.ts`:

```typescript
export async function submitScan(file: File): Promise<ApiResponse<ScanResult>> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<ScanResult>('/api/v1/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60_000,  // 60s for inference
      onUploadProgress: (event) => {
        // Update progress bar
      },
    });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Scan failed',
    };
  }
}
```

### Step 5: Update the Scanner Page

Modify `ScannerPage` to call `submitScan()` and redirect to `/results` on success. Store the result in `AppContext` or pass via router state.

### Step 6: Update the Results Page

Replace the current empty state with:
- Authenticity verdict (large prominent label)
- Confidence visualization (progress bar or gauge)
- Probability breakdown (real vs fake percentages)
- Scan metadata (filename, size, timestamp, duration)
- Dev notice if model accuracy is below threshold

### Expected API Flow

```
User uploads image in Scanner page
→ Frontend: submitScan(file) → POST /api/v1/scan
→ Backend: validate file type → validate size → verify image → run inference
→ PyTorch model: forward pass → softmax probabilities → label
→ Backend: return { label, confidence, probabilities, scan_id }
→ Frontend: redirect to /results with scan data
→ Results page: display verdict + confidence bars
```

### Database Integration (Phase 4B)

After the core inference works, add database persistence:

1. Create `backend/app/models/scan.py` SQLAlchemy model
2. Run `alembic init` and create first migration
3. Add `get_db()` dependency to scan endpoint
4. Write scan record after successful inference
5. Create `GET /api/v1/scans` endpoint for history
6. Update History page to fetch from API instead of `demoData`

---

## PHASE 5 — Advanced Forensic Features

### Feature Overview

| Feature | Implementation Source | Complexity | Priority |
|---|---|---|---|
| EXIF metadata extraction | Pillow built-in | Low | 🔴 High |
| Frequency domain analysis | NumPy FFT | Medium | 🟡 Medium |
| Grad-CAM heatmaps | `pytorch-grad-cam` library | Medium | 🟡 Medium |
| Image manipulation indicators | Custom signal analysis | Medium | 🟡 Medium |
| Model version tracking | Database + config | Low | 🟢 Low |
| PDF report generation | `reportlab` or `weasyprint` | Medium | 🟢 Low |
| C2PA provenance verification | `c2pa-python` library | High | 🟢 Optional |
| Video frame extraction | OpenCV + FFmpeg | High | 🟢 Later |

### EXIF Metadata Analysis

```python
from PIL import Image
from PIL.ExifTags import TAGS

def extract_metadata(image_bytes: bytes) -> dict:
    with Image.open(io.BytesIO(image_bytes)) as img:
        exif_data = img._getexif()
        metadata = {
            'format': img.format,
            'mode': img.mode,
            'size': img.size,
            'has_exif': exif_data is not None,
        }
        if exif_data:
            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)
                # Include camera make, model, software, datetime
                if tag in ('Make', 'Model', 'Software', 'DateTime', 'GPS'):
                    metadata[tag] = str(value)

        # Key signal: AI-generated images often have no EXIF
        metadata['authenticity_signal'] = (
            'No camera EXIF data found — may indicate AI generation'
            if not exif_data else 'Camera EXIF data present'
        )
        return metadata
```

**Important caveat:** EXIF data can be added or removed manually. It is a supporting signal, not definitive proof.

### Grad-CAM Explainability Heatmaps

Grad-CAM (Gradient-weighted Class Activation Mapping) highlights which regions of the image most influenced the model's decision.

```bash
pip install grad-cam
```

```python
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image
import numpy as np

def generate_heatmap(model, tensor, target_class: int) -> np.ndarray:
    # target_layers: the last convolutional layer of EfficientNet-B4
    target_layers = [model.features[-1]]

    with GradCAM(model=model, target_layers=target_layers) as cam:
        targets = [ClassifierOutputTarget(target_class)]
        grayscale_cam = cam(input_tensor=tensor, targets=targets)
        return grayscale_cam[0]  # H×W heatmap array [0,1]
```

The heatmap is returned as a base64-encoded PNG overlay and displayed on the Results page.

### Frequency Domain Analysis

AI-generated images often have unusual frequency distributions in the DCT or Fourier domain.

```python
import numpy as np
from PIL import Image

def frequency_analysis(image_bytes: bytes) -> dict:
    with Image.open(io.BytesIO(image_bytes)) as img:
        gray = np.array(img.convert('L'), dtype=np.float32)

    # 2D Fourier Transform
    f_transform = np.fft.fft2(gray)
    f_shift = np.fft.fftshift(f_transform)
    magnitude_spectrum = 20 * np.log(np.abs(f_shift) + 1)

    # Statistical features of the spectrum
    return {
        'mean_frequency_magnitude': float(magnitude_spectrum.mean()),
        'std_frequency_magnitude': float(magnitude_spectrum.std()),
        'high_frequency_ratio': float(
            magnitude_spectrum[magnitude_spectrum > magnitude_spectrum.mean() + magnitude_spectrum.std()].mean()
        ),
    }
```

### Video Frame Analysis (Phase 5+)

```python
import cv2

def extract_frames(video_path: str, fps: int = 1) -> list:
    """Extract 1 frame per second from a video file."""
    cap = cv2.VideoCapture(video_path)
    video_fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(video_fps / fps)
    
    frames = []
    frame_count = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_interval == 0:
            # Convert BGR to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(frame_rgb)
        frame_count += 1
    
    cap.release()
    return frames
```

Each extracted frame is then processed through the same image detection pipeline. The final video verdict aggregates per-frame scores.

### C2PA Provenance Verification

C2PA (Coalition for Content Provenance and Authenticity) is an open standard for attaching cryptographically signed provenance data to images.

```bash
# Requires c2pa-python (Rust-based, complex installation)
pip install c2pa-python
```

```python
import c2pa

def check_c2pa(image_bytes: bytes) -> dict:
    try:
        manifest = c2pa.read_file_from_bytes(image_bytes)
        return {
            'has_c2pa': True,
            'producer': manifest.active_manifest.claim_generator,
            'verified': True,  # cryptographic signature valid
        }
    except c2pa.ManifestNotFound:
        return {
            'has_c2pa': False,
            'note': 'No C2PA provenance data found in this file.'
        }
    except Exception as e:
        return {'has_c2pa': False, 'error': str(e)}
```

**Reality check:** Very few images currently contain C2PA data. This feature will become more useful as adoption grows (Adobe, Microsoft, and major camera brands are adding support).

---

## PHASE 6 — Testing and Security

### Frontend Testing

Add Vitest + React Testing Library:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

**Tests to write:**
- `useFileUpload.test.ts` — file validation logic (accepted types, size limits)
- `Scanner.test.tsx` — drop zone renders, error state shown for invalid files
- `History.test.tsx` — empty state renders when no scans
- `AppContext.test.tsx` — toast add/remove, apiOnline toggle
- `api/client.test.ts` — health check request/response

### Backend API Testing

**Tests to add** (`backend/tests/`):

```
test_health.py          ✅ Already complete (2 tests)
test_scan.py            ← Add in Phase 4
test_file_validation.py ← Add in Phase 4
test_model_service.py   ← Add in Phase 4
```

**Key test cases for scan endpoint:**
- Valid JPEG returns 200 with verdict
- PNG file returns 200
- Non-image file (PDF disguised as JPEG) returns 422
- File over 20MB returns 413
- Missing file returns 422
- Model unavailable returns 503

### Invalid File Handling

| Attack / Edge Case | Backend Protection |
|---|---|
| `.exe` renamed to `.jpg` | `Image.open().verify()` raises exception → 422 |
| 100MB image | `len(image_bytes) > MAX_FILE_SIZE_BYTES` → 413 |
| Empty file | `Image.open()` raises → 422 |
| Corrupt image | `img.verify()` raises → 422 |
| SVG (not a raster image) | Content-type check → 415 |
| ZIP archive with wrong extension | MIME check + verify() → 415 or 422 |

### Privacy and Temporary File Handling

```python
import tempfile
import os
from contextlib import contextmanager

@contextmanager
def temporary_image(image_bytes: bytes):
    """Write image to temp file, yield path, delete on exit."""
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
        tmp.write(image_bytes)
        tmp_path = tmp.name
    try:
        yield tmp_path
    finally:
        os.unlink(tmp_path)  # Always deleted, even if exception occurs
```

**Privacy policy commitments (already defined in Settings UI):**
- Uploaded images are processed in memory when possible, never stored permanently by default
- If `retainFiles: false` (user setting), delete immediately after scan
- If `retainFiles: true`, respect `retentionDays` setting with a cleanup job

### Rate Limiting

```bash
pip install slowapi
```

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@router.post('/scan')
@limiter.limit('10/minute')
async def scan_image(request: Request, file: UploadFile = File(...)):
    ...
```

### Secure Configuration Checklist

- [ ] `SECRET_KEY` is a long random string (not committed to git)
- [ ] `POSTGRES_PASSWORD` is not the default value in production
- [ ] `CORS_ORIGINS` does not include `*` in production
- [ ] `ENVIRONMENT=production` → error details not exposed in responses
- [ ] File upload size limit enforced at both frontend AND backend
- [ ] All uploaded files verified before processing
- [ ] Temporary files deleted after processing
- [ ] Rate limiting applied to scan endpoint
- [ ] No API keys in source code

---

## PHASE 7 — Deployment

### Frontend Deployment

**Recommended: Vercel (Free tier)**

```bash
# Build the production bundle
cd frontend
npm run build

# Deploy with Vercel CLI
npm i -g vercel
vercel --prod
```

**Configuration:** Set `VITE_API_URL` to the production backend URL in Vercel environment variables.

**Alternative:** Cloudflare Pages (free, CDN-backed, excellent performance).

### Backend Deployment

**Recommended: Railway (Free tier → Hobby \$5/month)**

```dockerfile
# Dockerfile (create in project root)
FROM python:3.12-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY .env.example .env

EXPOSE 8000
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Alternative:** Render.com (free tier available; cold starts on free plan).

### Model Hosting

The PyTorch model checkpoint (`.pt` / `.pth` file) cannot be committed to git (too large) and cannot be stored on Railway's ephemeral filesystem.

**Options:**

| Option | Cost | Setup |
|---|---|---|
| Docker image with model baked in | \$0 extra | Build Docker image with model, push to Docker Hub |
| Download from Google Drive on startup | \$0 | Use `gdown` to fetch model at container startup |
| Hugging Face Hub (model hosting) | \$0 | `huggingface_hub` download at startup |
| AWS S3 / Cloudflare R2 | \$0 (R2 free tier) | Download model from object storage |

**Recommended for student project:** Store model on Hugging Face Hub (private repo) and download at startup:

```python
from huggingface_hub import hf_hub_download

model_path = hf_hub_download(
    repo_id="your-username/truthlens-model",
    filename="truthlens_v0.1_checkpoint.pth",
    token=os.environ.get("HF_TOKEN")
)
```

### Database Hosting

**Recommended: Railway PostgreSQL (Free tier)**

Railway provides a managed PostgreSQL database. The connection string is provided as an environment variable.

**Alternative:** Supabase (free tier, 500MB, good performance).

### Environment Variables for Production

Create these in your hosting platform (never in source code):

```bash
# Backend (Railway)
ENVIRONMENT=production
SECRET_KEY=<64-char random string>
POSTGRES_SERVER=<railway-db-host>
POSTGRES_PORT=5432
POSTGRES_USER=<railway-db-user>
POSTGRES_PASSWORD=<railway-db-password>
POSTGRES_DB=<railway-db-name>
CORS_ORIGINS=["https://your-app.vercel.app"]
MODEL_PATH=/app/models/truthlens_v0.1_checkpoint.pth
HF_TOKEN=<huggingface-token>

# Frontend (Vercel)
VITE_API_URL=https://your-api.railway.app
```

### Production Checklist

- [ ] `ENVIRONMENT=production` set
- [ ] CORS origins restricted to production frontend domain only
- [ ] HTTPS enforced (automatic with Vercel/Railway)
- [ ] Model file accessible at startup
- [ ] Database migrations run successfully
- [ ] Health check endpoint returns healthy
- [ ] Rate limiting active on scan endpoint
- [ ] Error responses don't expose stack traces
- [ ] Logging configured (Python `logging` module)

---

## Implementation Task Roadmap

### Remaining Phase 1 Tasks (This Week)

| # | Task | Tools | Input | Output | Test |
|---|---|---|---|---|---|
| 1.1 | Initialize git repository | `git init` | Project directory | `.git/` folder | `git status` shows tracked files |
| 1.2 | Make initial commit | `git add .` + `git commit` | All project files | First commit | `git log` shows 1 commit |
| 1.3 | Create GitHub repository | GitHub.com | Repo name | Remote URL | `git push origin main` succeeds |
| 1.4 | Update `.gitignore` | Text editor | Existing file | Added `datasets/`, `models/`, `uploads/`, `*.pth` | `git status` does not show those paths |
| 1.5 | Delete scaffold files | File system | `App.css`, `react.svg`, `vite.svg` | Removed files | Build still passes |
| 1.6 | Fix password default | `config.py` | `POSTGRES_PASSWORD: str = "truthlens_password"` | `POSTGRES_PASSWORD: str = ""` | `tsc --noEmit` still 0 errors |
| 1.7 | Add SECRET_KEY to config | `config.py` + `.env.example` | Current config | New `SECRET_KEY` field | Python syntax valid |

### Phase 2 Tasks (Dataset + Training)

| # | Task | Tools | Input | Output | Test |
|---|---|---|---|---|---|
| 2.1 | Download CIFAKE dataset | Kaggle CLI | `kaggle datasets download ...` | `datasets/raw/cifake/` | Folder contains `train/REAL/` and `train/FAKE/` |
| 2.2 | Write preprocessing script | Python + Pillow | Raw images | 224×224 JPEG images in `datasets/processed/` | Script runs without errors; sample image opens correctly |
| 2.3 | Deduplication | Python + imagehash | Processed images | Hash manifest CSV; duplicates removed | No duplicate hashes in manifest |
| 2.4 | Train/val/test split | sklearn | Cleaned image paths | Manifest CSVs for each split | 70/15/15 distribution verified |
| 2.5 | Write training script | PyTorch | Processed dataset | `scripts/train.py` | Runs 1 epoch on 1000 images locally |
| 2.6 | Local debug run | RTX 3050 | 1,000 images | Training loss decreases | Loss at epoch 2 < loss at epoch 1 |
| 2.7 | Upload dataset to Colab | Google Drive | Processed dataset zip | Drive folder accessible from Colab | Colab cell reads images successfully |
| 2.8 | Full training on Colab | Colab Pro + A100 | Full dataset | `truthlens_v0.1_checkpoint.pth` | Val accuracy > 70% at epoch 10 |
| 2.9 | Save and download model | Google Drive | Checkpoint file | `models/` folder | `torch.load()` runs without error |

### Phase 3 Tasks (Evaluation)

| # | Task | Tools | Input | Output | Test |
|---|---|---|---|---|---|
| 3.1 | Write evaluation script | sklearn + PyTorch | Test set + model | Metrics report | Script runs; outputs Accuracy, F1, AUC |
| 3.2 | Generate confusion matrix | sklearn + matplotlib | Predictions | `confusion_matrix.png` | 2×2 matrix shows TP/TN/FP/FN |
| 3.3 | Compression robustness test | Pillow + evaluation script | JPEG quality variants | Accuracy at q=95,80,65,50 | Report saved to `docs/model-evaluation.md` |
| 3.4 | Generator holdout test | Filtered dataset | One generator excluded | Generalization gap metric | Gap < 15% is acceptable |
| 3.5 | Document model limitations | Markdown | Evaluation results | `docs/model-evaluation.md` | Honest, specific limitations listed |

### Phase 4 Tasks (Backend Integration)

| # | Task | Tools | Input | Output | Test |
|---|---|---|---|---|---|
| 4.1 | Add Phase 4 dependencies | pip + requirements.txt | Current requirements | Updated requirements.txt | `pip install -r requirements.txt` succeeds |
| 4.2 | Create `ModelService` | PyTorch + FastAPI | Checkpoint path | `services/model_service.py` | `service.predict(image_bytes)` returns dict |
| 4.3 | Load model at startup | FastAPI lifespan | Checkpoint file | Model loaded in memory | Health endpoint shows `inference: "available"` |
| 4.4 | Create scan endpoint | FastAPI | File upload | `api/v1/scan.py` | `POST /api/v1/scan` with valid JPEG returns 200 |
| 4.5 | Write scan tests | Pytest + HTTPX | Scan endpoint | `tests/test_scan.py` | All 6 test cases pass |
| 4.6 | Add `submitScan()` to frontend API client | TypeScript | `api/client.ts` | New function | TypeScript compiles |
| 4.7 | Update Scanner page submit | React | Scanner.tsx | Calls `submitScan()` on button press | Console shows API response |
| 4.8 | Update Results page | React | ScanResult type | Real data displayed | Real prediction shown after scan |
| 4.9 | Setup PostgreSQL locally | Docker | `docker-compose.yml` | Local DB at port 5432 | `psql` connects successfully |
| 4.10 | Create SQLAlchemy scan model | SQLAlchemy | Schema types | `models/scan.py` | Python import works |
| 4.11 | Setup Alembic migrations | Alembic | SQLAlchemy models | First migration file | `alembic upgrade head` creates tables |
| 4.12 | Persist scans to database | SQLAlchemy session | Scan result dict | DB record created | `GET /api/v1/scans` returns saved record |
| 4.13 | Update History page | React + API client | Scan records from DB | Real history table | Scans appear after performing a scan |

### Phase 5 Tasks (Forensic Features)

| # | Task | Tools | Input | Output | Test |
|---|---|---|---|---|---|
| 5.1 | EXIF extraction | Pillow | Uploaded image | Metadata dict in scan response | JPEG with camera EXIF shows Make/Model |
| 5.2 | Grad-CAM heatmap | pytorch-grad-cam | Model + image tensor | Base64 PNG heatmap | Heatmap image visible on Results page |
| 5.3 | Frequency analysis | NumPy FFT | Image array | Frequency statistics dict | Dict returned in scan response signals |
| 5.4 | PDF report generation | reportlab | Scan result dict | PDF file | PDF opens in browser/viewer |
| 5.5 | Report download endpoint | FastAPI FileResponse | Scan ID | PDF download | Browser downloads file |
| 5.6 | Video upload support | OpenCV | Video file | Frame list | 10 frames extracted from 10s video |
| 5.7 | Frame-by-frame analysis | Model + frames | Frame list | Per-frame scores | Scores returned as list in response |

---

## Final Product Capabilities

When all phases are complete, TRUTHLENS AI will provide:

### User-Facing Features

| Feature | Implementation | Phase |
|---|---|---|
| Upload image for analysis | Drag-drop + click, JPG/PNG/WEBP, 20MB max | ✅ Phase 1 |
| AI-generated detection verdict | EfficientNet-B4 binary classifier | Phase 4 |
| Confidence score visualization | Probability bar (authentic vs AI-generated) | Phase 4 |
| Scan history | PostgreSQL-backed table, filterable | Phase 4 |
| EXIF metadata display | Pillow extraction, displayed on Results page | Phase 5 |
| Grad-CAM heatmap overlay | Visual explanation of model decision | Phase 5 |
| Frequency domain signals | Supporting forensic evidence | Phase 5 |
| Downloadable PDF reports | Per-scan forensic report | Phase 5 |
| Intelligence knowledge base | Educational articles (static) | ✅ Phase 1 |
| Research lab model roadmap | Architecture + dataset documentation | ✅ Phase 1 |
| Video frame analysis | OpenCV extraction + per-frame classification | Phase 5+ |

### Technical Characteristics

| Property | Value |
|---|---|
| Supported file types | JPEG, PNG, WEBP (images); MP4, MOV (video — Phase 5) |
| Max file size | 20MB |
| Inference time (CPU) | ~2–4 seconds |
| Inference time (GPU) | ~200–400ms |
| Detection classes | Authentic, AI-Generated, Inconclusive |
| Model | EfficientNet-B4, ~19M parameters |
| Primary metric | F1-Score + ROC-AUC |
| Data persistence | PostgreSQL scan history |
| API | RESTful JSON, versioned at `/api/v1` |

### Honest Limitations (Must Be Disclosed)

1. Detection confidence is a probabilistic estimate, not a legal determination.
2. Performance degrades on AI generators not in training data.
3. JPEG compression at quality < 50 may reduce detection accuracy significantly.
4. The model cannot explain the narrative context of an image.
5. Video analysis is frame-level only; no temporal deepfake reasoning.
6. No authentication — anyone with the URL can submit scans.

---

## Critical Tasks Summary

| Task | Why Critical | Phase |
|---|---|---|
| Initialize git | Cannot safely develop without version control | 1 (now) |
| Use `imagehash` before splitting data | Leakage causes falsely high accuracy | 2 |
| Match training transforms in inference | Mismatch causes catastrophic accuracy drop | 4 |
| Delete temp files after processing | Privacy and disk space | 4 |
| Run pytest before every backend change | Prevents regressions | All |
| Document model limitations honestly | Prevents user over-reliance | 3 |

## Potential Technical Challenges

| Challenge | Mitigation |
|---|---|
| Running out of Colab GPU memory | Reduce batch size to 8; use gradient checkpointing |
| Model accuracy good in training, bad on real-world uploads | Add augmentation (compression, blur); gather more diverse data |
| PyTorch and Python 3.14 compatibility issues | Use Python 3.12 for training; test on 3.14 for serving |
| Slow inference in production without GPU | Export to ONNX and use `onnxruntime` for 2–3× CPU speedup |
| Large model file (not deployable) | Store on Hugging Face Hub; download at startup |
| Database migrations causing downtime | Use Alembic with `--autogenerate`; test migrations locally first |

