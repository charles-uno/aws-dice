FROM golang

ARG VERSION=1.0.4

RUN go get github.com/charles-uno/mtgserver
RUN cd pkg/mod/github.com/charles-uno/mtgserver${VERSION} && go build main.go
RUN mkdir -p /app
RUN cp -p \
    pkg/mod/github.com/charles-uno/mtgserver${VERSION}/main \
    pkg/mod/github.com/charles-uno/mtgserver${VERSION}/carddata.yaml \
    pkg/mod/github.com/charles-uno/mtgserver${VERSION}/decklist.txt \
    /app
WORKDIR /app
CMD ["./main"]
