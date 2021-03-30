FROM golang
RUN go get github.com/charles-uno/mtgserver
RUN cd pkg/mod/github.com/charles-uno/mtgserver* && go build main.go
RUN mkdir -p /app
RUN cp -p \
    pkg/mod/github.com/charles-uno/mtgserver*/main \
    pkg/mod/github.com/charles-uno/mtgserver*/carddata.yaml \
    pkg/mod/github.com/charles-uno/mtgserver*/decklist.txt \
    /app
WORKDIR /app
CMD ["./main"]
