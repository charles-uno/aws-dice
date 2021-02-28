FROM python:3.7-slim
RUN pip install flask gunicorn
ADD app.py /app.py
