# WhatsApp bridge (Go + whatsmeow) for the Cloudflare container. Build context: connectors/whatsapp/.
# Static binary (modernc.org/sqlite is pure Go, CGO off) in a distroless image with no shell, non-root.

FROM mirror.gcr.io/library/golang:1.27 AS build
WORKDIR /src
ENV CGO_ENABLED=0 GOOS=linux GOFLAGS=-mod=readonly
COPY bridge/go.mod bridge/go.sum ./
RUN go mod download
COPY bridge/ ./
RUN go build -trimpath -ldflags="-s -w" -o /out/bridge . && mkdir -p /out/data

# distroless/static: CA certificates, tzdata and the nonroot user (65532); no shell or package manager.
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/bridge /bridge
COPY --from=build --chown=65532:65532 /out/data /data
COPY NOTICE.md /NOTICE.md
ENV DATA_DIR=/data PORT=8080
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/bridge"]
