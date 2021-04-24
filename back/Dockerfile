FROM golang

ARG VERSION=v1.2.0

RUN go get github.com/charles-uno/mtgserver
RUN cd pkg/mod/github.com/charles-uno/mtgserver\@${VERSION} && go build main.go
RUN mkdir -p /app
RUN cp -p \
    pkg/mod/github.com/charles-uno/mtgserver\@${VERSION}/main \
    pkg/mod/github.com/charles-uno/mtgserver\@${VERSION}/carddata.yaml \
    pkg/mod/github.com/charles-uno/mtgserver\@${VERSION}/decklist.txt \
    /app
WORKDIR /app
EXPOSE 5001
CMD ["./main"]
