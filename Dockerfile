FROM golang:1.24-bookworm AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=1 GOOS=linux go build -o listinator

FROM debian:bookworm-slim
COPY --from=build /app/listinator /
ENTRYPOINT ["/listinator"]
