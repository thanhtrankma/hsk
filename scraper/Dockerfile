FROM python:3.12-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends libxml2 libxslt1.1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY scraper.py .

ENTRYPOINT ["python", "scraper.py"]
CMD ["--base-url", "https://hanbeego.com", \
     "--content-dir", "/data/content", \
     "--assets-dir", "/data/assets", \
     "--asset-url-prefix", "/scraped-assets", \
     "--workers", "8", "--delay", "0.25"]
