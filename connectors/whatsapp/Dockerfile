# Ponte WhatsApp (Go + whatsmeow) para o container do Cloudflare. Contexto do build: connectors/whatsapp/.
# Binário estático (modernc.org/sqlite é Go puro, CGO desligado) numa imagem distroless sem shell, não-root.

FROM mirror.gcr.io/library/golang:1.27 AS build
WORKDIR /src
ENV CGO_ENABLED=0 GOOS=linux GOFLAGS=-mod=readonly
COPY bridge/go.mod bridge/go.sum ./
RUN go mod download
COPY bridge/ ./
RUN go build -trimpath -ldflags="-s -w" -o /out/bridge . && mkdir -p /out/data

# distroless/static: certificados CA, tzdata e usuário nonroot (65532); sem shell nem gerenciador de pacotes.
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/bridge /bridge
COPY --from=build --chown=65532:65532 /out/data /data
COPY NOTICE.md /NOTICE.md
ENV DATA_DIR=/data PORT=8080
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/bridge"]
