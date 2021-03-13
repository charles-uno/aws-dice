FROM ubuntu
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y python3-pip
RUN pip3 install --upgrade pip
RUN pip3 install flask flask-cors uwsgi
WORKDIR /
COPY app.py /app.py
EXPOSE 5001
CMD ["/app.py"]

# CMD ["uwsgi", "--http", "0.0.0.0:5001", "--module", "app:app" ]
