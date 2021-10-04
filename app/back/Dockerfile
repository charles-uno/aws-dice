FROM golang
ARG DIR=/go/src/github.com/charles-uno/aws-practice/back
RUN mkdir -p $DIR/lib
COPY carddata.yaml decklist.txt go.mod main.go $DIR/
COPY lib $DIR/lib/
RUN cd $DIR && go mod tidy && go build main.go
RUN mkdir -p /app
RUN cd $DIR && cp -p carddata.yaml decklist.txt main /app
WORKDIR /app
EXPOSE 5001
CMD ["./main"]
