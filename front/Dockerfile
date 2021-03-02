FROM ubuntu
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y python3-pip
RUN pip3 install --upgrade pip
RUN pip3 install flask requests uwsgi
WORKDIR /
COPY app.py /app.py
EXPOSE 5000
CMD ["uwsgi", "--http", "0.0.0.0:5000", "--module", "app:app" ]
