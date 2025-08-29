
FROM python:3.10-slim-bookworm

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

WORKDIR /app

USER root

COPY ./backend /app

RUN apt-get update && apt-get upgrade -y && apt-get install --no-install-recommends -y ca-certificates && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x start.sh

EXPOSE 5000

ENTRYPOINT ["./start.sh"]