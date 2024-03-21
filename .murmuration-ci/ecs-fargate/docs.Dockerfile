FROM python:3.9 as builder

WORKDIR /app

COPY requirements.txt ./

RUN \
    git config --global --add safe.directory '*' && \
    pip install --upgrade pip && \
    python -m pip install --progress-bar off pip setuptools && \
    python -m pip install --progress-bar off coverage && \
    pip install -v -r requirements.txt && \
    pip install -v Cython==0.29.36 && \
    pip install -v scikit-learn==0.23 --no-build-isolation

COPY . .

RUN \
    python setup.py develop && \
    python -c "import nltk; nltk.download('punkt')" && \
    python -c "import nltk; nltk.download('stopwords')" && \
    python -c "import nltk; nltk.download('omw-1.4')" && \
    python -m pip install --progress-bar off spacy && \
    python -m spacy download en_core_web_sm

RUN \
    python -m pip install --progress-bar off torch==2.0.0 torchvision==0.15.1 torchaudio==2.0.0 --index-url https://download.pytorch.org/whl/cpu && \
    python -m pip install --progress-bar off 'transformers~=4.29.0' && \
    python -m pip install --progress-bar off pytorch-pretrained-bert && \
    python -c 'import torch; print("Torch version:", torch.__version__)' && \
    python -m torch.utils.collect_env

WORKDIR /app/website

RUN make


FROM lipanski/docker-static-website:latest

COPY --from=builder /app/website/build .
